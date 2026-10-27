/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Persistent SQLite storage for consultation requests and independent
 * Email & Zalo notification tasks with lease-based crash recovery.
 */

import Database from 'better-sqlite3';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  NormalizedQuoteInput,
  ConsultationRecordSummary,
  formatVietnamTime,
  getVietnamDateCompact,
} from '../utils/validation.ts';

export type NotificationChannel = 'email' | 'zalo';

export type NotificationTaskStatus =
  | 'pending'
  | 'processing'
  | 'provider_accepted'
  | 'failed_retryable'
  | 'failed_permanent'
  | 'unconfigured';

export interface StoredConsultationRequest extends ConsultationRecordSummary {
  id: number;
  idempotencyKey: string;
  payloadHash: string;
  clientIp: string;
  createdAtUtc: string;
  createdAtMs: number;
}

export interface StoredNotificationTask {
  id: number;
  requestId: number;
  requestCode: string;
  channel: NotificationChannel;
  status: NotificationTaskStatus;
  attemptCount: number;
  maxAttempts: number;
  nextRetryAtMs: number | null;
  leaseExpiresAtMs: number | null;
  providerResponse: string | null;
  lastError: string | null;
  updatedAtUtc: string;
}

export interface CreateConsultationResult {
  request: StoredConsultationRequest;
  tasks: StoredNotificationTask[];
  isDuplicate: boolean;
}

const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes anti-duplicate window
export const DEFAULT_LEASE_DURATION_MS = 60_000; // 60 seconds lease for active workers

export class ConsultationStore {
  private db: Database.Database;

  constructor(dbPath?: string) {
    const resolvedPath =
      dbPath ||
      process.env.SQLITE_DB_PATH ||
      path.resolve(process.cwd(), 'data', 'nexis_consultations.sqlite');

    if (resolvedPath !== ':memory:') {
      const dir = path.dirname(resolvedPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    this.db = new Database(resolvedPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('foreign_keys = ON');
    this.initSchema();
  }

  private initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS consultation_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_code TEXT NOT NULL UNIQUE,
        idempotency_key TEXT NOT NULL UNIQUE,
        payload_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        service_type TEXT NOT NULL,
        message TEXT NOT NULL,
        source_page TEXT NOT NULL,
        client_ip TEXT NOT NULL,
        created_at_utc TEXT NOT NULL,
        created_at_vn TEXT NOT NULL,
        created_at_ms INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_consultation_payload_hash
        ON consultation_requests(payload_hash, created_at_ms);

      CREATE TABLE IF NOT EXISTS notification_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER NOT NULL,
        request_code TEXT NOT NULL,
        channel TEXT NOT NULL CHECK(channel IN ('email', 'zalo')),
        status TEXT NOT NULL CHECK(status IN (
          'pending',
          'processing',
          'provider_accepted',
          'failed_retryable',
          'failed_permanent',
          'unconfigured'
        )),
        attempt_count INTEGER NOT NULL DEFAULT 0,
        max_attempts INTEGER NOT NULL DEFAULT 3,
        next_retry_at_ms INTEGER,
        lease_expires_at_ms INTEGER,
        provider_response TEXT,
        last_error TEXT,
        updated_at_utc TEXT NOT NULL,
        UNIQUE(request_id, channel),
        FOREIGN KEY(request_id) REFERENCES consultation_requests(id) ON DELETE CASCADE
      );
    `);

    // Ensure lease_expires_at_ms column exists in case migrating existing SQLite database
    const columns = this.db.pragma('table_info(notification_tasks)') as Array<{ name: string }>;
    if (!columns.some((c) => c.name === 'lease_expires_at_ms')) {
      try {
        this.db.exec(`ALTER TABLE notification_tasks ADD COLUMN lease_expires_at_ms INTEGER;`);
      } catch {
        // Ignore if already added
      }
    }

    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_notification_tasks_retry
        ON notification_tasks(status, next_retry_at_ms);

      CREATE INDEX IF NOT EXISTS idx_notification_tasks_lease
        ON notification_tasks(status, lease_expires_at_ms);
    `);
  }

  public computePayloadHash(input: NormalizedQuoteInput): string {
    const canonical = [
      input.fullName.toLowerCase(),
      input.phone,
      input.serviceType.toLowerCase(),
      input.message.toLowerCase(),
    ].join('|');
    return crypto.createHash('sha256').update(canonical).digest('hex');
  }

  private generateUniqueRequestCode(now: Date): string {
    const dateCompact = getVietnamDateCompact(now);
    const checkStmt = this.db.prepare(
      'SELECT 1 FROM consultation_requests WHERE request_code = ?'
    );
    for (let i = 0; i < 20; i++) {
      const randomSuffix = crypto.randomInt(1000, 10000).toString();
      const candidate = `NXT-${dateCompact}-${randomSuffix}`;
      const exists = checkStmt.get(candidate);
      if (!exists) {
        return candidate;
      }
    }
    return `NXT-${dateCompact}-${Date.now().toString().slice(-6)}`;
  }

  /**
   * Checks if an idempotencyKey already exists (used by rate-limiter to allow safe retries).
   */
  public hasIdempotencyKey(idempotencyKey: string): boolean {
    if (!idempotencyKey) return false;
    const row = this.db
      .prepare('SELECT 1 FROM consultation_requests WHERE idempotency_key = ?')
      .get(idempotencyKey);
    return Boolean(row);
  }

  /**
   * Atomically creates a consultation request and its 2 notification tasks (email + zalo),
   * or returns the existing record if idempotencyKey or recent payloadHash matches.
   */
  public createOrGetConsultation(params: {
    input: NormalizedQuoteInput;
    idempotencyKey?: string;
    clientIp: string;
    now?: Date;
  }): CreateConsultationResult {
    const now = params.now || new Date();
    const nowMs = now.getTime();
    const payloadHash = this.computePayloadHash(params.input);
    const effectiveIdempotencyKey =
      params.idempotencyKey && params.idempotencyKey.trim().length >= 8
        ? params.idempotencyKey.trim().slice(0, 128)
        : `auto-${payloadHash.slice(0, 24)}-${Math.floor(nowMs / DEDUP_WINDOW_MS)}`;

    const tx = this.db.transaction((): CreateConsultationResult => {
      // 1. Check by exact idempotency_key
      const existingByKey = this.db
        .prepare('SELECT * FROM consultation_requests WHERE idempotency_key = ?')
        .get(effectiveIdempotencyKey) as Record<string, unknown> | undefined;

      if (existingByKey) {
        const mapped = this.mapRequestRow(existingByKey);
        const tasks = this.getTasksByRequestId(mapped.id);
        return { request: mapped, tasks, isDuplicate: true };
      }

      // 2. Check by identical payload_hash within deduplication window
      const cutoffMs = nowMs - DEDUP_WINDOW_MS;
      const existingByHash = this.db
        .prepare(
          `SELECT * FROM consultation_requests
           WHERE payload_hash = ? AND created_at_ms >= ?
           ORDER BY id DESC LIMIT 1`
        )
        .get(payloadHash, cutoffMs) as Record<string, unknown> | undefined;

      if (existingByHash) {
        const mapped = this.mapRequestRow(existingByHash);
        const tasks = this.getTasksByRequestId(mapped.id);
        return { request: mapped, tasks, isDuplicate: true };
      }

      // 3. Create new consultation request + 2 notification tasks
      const requestCode = this.generateUniqueRequestCode(now);
      const createdAtUtc = now.toISOString();
      const createdAtVn = formatVietnamTime(now);

      const insertReq = this.db.prepare(`
        INSERT INTO consultation_requests (
          request_code,
          idempotency_key,
          payload_hash,
          full_name,
          phone,
          service_type,
          message,
          source_page,
          client_ip,
          created_at_utc,
          created_at_vn,
          created_at_ms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const info = insertReq.run(
        requestCode,
        effectiveIdempotencyKey,
        payloadHash,
        params.input.fullName,
        params.input.phone,
        params.input.serviceType,
        params.input.message,
        params.input.sourcePage,
        params.clientIp || 'unknown',
        createdAtUtc,
        createdAtVn,
        nowMs
      );

      const requestId = Number(info.lastInsertRowid);

      const insertTask = this.db.prepare(`
        INSERT INTO notification_tasks (
          request_id,
          request_code,
          channel,
          status,
          attempt_count,
          max_attempts,
          next_retry_at_ms,
          lease_expires_at_ms,
          updated_at_utc
        ) VALUES (?, ?, ?, 'pending', 0, 3, ?, NULL, ?)
      `);

      insertTask.run(requestId, requestCode, 'email', nowMs, createdAtUtc);
      insertTask.run(requestId, requestCode, 'zalo', nowMs, createdAtUtc);

      const createdRow = this.db
        .prepare('SELECT * FROM consultation_requests WHERE id = ?')
        .get(requestId) as Record<string, unknown>;

      return {
        request: this.mapRequestRow(createdRow),
        tasks: this.getTasksByRequestId(requestId),
        isDuplicate: false,
      };
    });

    return tx();
  }

  public getRequestById(requestId: number): StoredConsultationRequest | null {
    const row = this.db
      .prepare('SELECT * FROM consultation_requests WHERE id = ?')
      .get(requestId) as Record<string, unknown> | undefined;
    return row ? this.mapRequestRow(row) : null;
  }

  public getTasksByRequestId(requestId: number): StoredNotificationTask[] {
    const rows = this.db
      .prepare(
        'SELECT * FROM notification_tasks WHERE request_id = ? ORDER BY channel ASC'
      )
      .all(requestId) as Record<string, unknown>[];
    return rows.map((r) => this.mapTaskRow(r));
  }

  /**
   * Claims a task for sending using a lease-based lock.
   *
   * Eligible states:
   * - 'pending'
   * - 'failed_retryable' (if nextRetryAtMs has passed)
   * - 'processing' ONLY IF leaseExpiresAtMs has expired (e.g. server crashed/restarted while task was in flight)
   *
   * Ineligible states:
   * - 'provider_accepted': NEVER re-sent (channel already succeeded)
   * - 'failed_permanent'
   * - 'unconfigured'
   * - 'processing' with active unexpired lease (actively running in another worker)
   * - Any task with attemptCount >= maxAttempts
   */
  public claimTaskForProcessing(
    requestId: number,
    channel: NotificationChannel,
    nowMs: number = Date.now(),
    leaseDurationMs: number = DEFAULT_LEASE_DURATION_MS
  ): StoredNotificationTask | null {
    const tx = this.db.transaction((): StoredNotificationTask | null => {
      const row = this.db
        .prepare(
          'SELECT * FROM notification_tasks WHERE request_id = ? AND channel = ?'
        )
        .get(requestId, channel) as Record<string, unknown> | undefined;

      if (!row) return null;
      const task = this.mapTaskRow(row);

      // Never re-send a channel that already succeeded or permanently terminated
      if (
        task.status === 'provider_accepted' ||
        task.status === 'failed_permanent' ||
        task.status === 'unconfigured'
      ) {
        return null;
      }

      // Check processing lease: if active worker holds a valid unexpired lease, do not disturb
      if (task.status === 'processing') {
        if (task.leaseExpiresAtMs !== null && task.leaseExpiresAtMs > nowMs) {
          return null; // Still actively processing by an alive worker
        }
        // If lease is expired or null, it was abandoned mid-flight (crash/restart). Eligible for recovery!
      }

      if (task.attemptCount >= task.maxAttempts) {
        return null;
      }

      if (
        task.status === 'failed_retryable' &&
        task.nextRetryAtMs !== null &&
        task.nextRetryAtMs > nowMs
      ) {
        return null;
      }

      const nextAttempt = task.attemptCount + 1;
      const leaseExpiresAtMs = nowMs + leaseDurationMs;
      const updatedAtUtc = new Date(nowMs).toISOString();

      this.db
        .prepare(
          `UPDATE notification_tasks
           SET status = 'processing',
               attempt_count = ?,
               lease_expires_at_ms = ?,
               updated_at_utc = ?
           WHERE id = ?`
        )
        .run(nextAttempt, leaseExpiresAtMs, updatedAtUtc, task.id);

      const updated = this.db
        .prepare('SELECT * FROM notification_tasks WHERE id = ?')
        .get(task.id) as Record<string, unknown>;

      return this.mapTaskRow(updated);
    });

    return tx();
  }

  /**
   * Marks a task as accepted by the provider API (SMTP/Resend or Zalo OpenAPI).
   * Clears any active lease and retry timers.
   */
  public markTaskProviderAccepted(
    taskId: number,
    providerResponse: string
  ): void {
    this.db
      .prepare(
        `UPDATE notification_tasks
         SET status = 'provider_accepted',
             provider_response = ?,
             last_error = NULL,
             next_retry_at_ms = NULL,
             lease_expires_at_ms = NULL,
             updated_at_utc = ?
         WHERE id = ?`
      )
      .run(providerResponse.slice(0, 1000), new Date().toISOString(), taskId);
  }

  /**
   * Marks a task as unconfigured when credentials for that channel are not set in Secrets.
   * Clears any active lease.
   */
  public markTaskUnconfigured(taskId: number, reason: string): void {
    this.db
      .prepare(
        `UPDATE notification_tasks
         SET status = 'unconfigured',
             last_error = ?,
             next_retry_at_ms = NULL,
             lease_expires_at_ms = NULL,
             updated_at_utc = ?
         WHERE id = ?`
      )
      .run(reason.slice(0, 500), new Date().toISOString(), taskId);
  }

  /**
   * Records a channel delivery failure, setting either 'failed_retryable' with backoff
   * or 'failed_permanent' if non-retryable or max_attempts reached.
   * Clears any active lease.
   */
  public markTaskFailed(params: {
    taskId: number;
    errorMessage: string;
    retryable: boolean;
    retryDelayMs?: number;
    nowMs?: number;
  }): StoredNotificationTask {
    const nowMs = params.nowMs ?? Date.now();
    const row = this.db
      .prepare('SELECT * FROM notification_tasks WHERE id = ?')
      .get(params.taskId) as Record<string, unknown>;

    const current = this.mapTaskRow(row);
    const canRetry = params.retryable && current.attemptCount < current.maxAttempts;
    const nextStatus: NotificationTaskStatus = canRetry
      ? 'failed_retryable'
      : 'failed_permanent';

    const backoffMs =
      params.retryDelayMs ?? Math.min(30_000, 1500 * Math.pow(2, current.attemptCount - 1));
    const nextRetryAtMs = canRetry ? nowMs + backoffMs : null;

    this.db
      .prepare(
        `UPDATE notification_tasks
         SET status = ?,
             last_error = ?,
             next_retry_at_ms = ?,
             lease_expires_at_ms = NULL,
             updated_at_utc = ?
         WHERE id = ?`
      )
      .run(
        nextStatus,
        params.errorMessage.slice(0, 500),
        nextRetryAtMs,
        new Date(nowMs).toISOString(),
        params.taskId
      );

    const updated = this.db
      .prepare('SELECT * FROM notification_tasks WHERE id = ?')
      .get(params.taskId) as Record<string, unknown>;

    return this.mapTaskRow(updated);
  }

  /**
   * Returns all tasks currently due for retry or recovered from an abandoned lease:
   * 1. 'pending' tasks whose retry time has arrived
   * 2. 'failed_retryable' tasks whose backoff timer has elapsed
   * 3. 'processing' tasks whose lease has expired (worker crashed/stopped mid-flight)
   *
   * Note: 'provider_accepted' tasks are NEVER returned.
   * Active 'processing' tasks with unexpired lease are NOT returned.
   */
  public getDueRetryTasks(nowMs: number = Date.now()): StoredNotificationTask[] {
    const rows = this.db
      .prepare(
        `SELECT * FROM notification_tasks
         WHERE attempt_count < max_attempts
           AND (
             (status = 'pending' AND (next_retry_at_ms IS NULL OR next_retry_at_ms <= :nowMs))
             OR
             (status = 'failed_retryable' AND (next_retry_at_ms IS NULL OR next_retry_at_ms <= :nowMs))
             OR
             (status = 'processing' AND (lease_expires_at_ms IS NULL OR lease_expires_at_ms <= :nowMs))
           )
         ORDER BY id ASC
         LIMIT 50`
      )
      .all({ nowMs }) as Record<string, unknown>[];

    return rows.map((r) => this.mapTaskRow(r));
  }

  public close(): void {
    this.db.close();
  }

  private mapRequestRow(row: Record<string, unknown>): StoredConsultationRequest {
    return {
      id: Number(row.id),
      requestCode: String(row.request_code),
      idempotencyKey: String(row.idempotency_key),
      payloadHash: String(row.payload_hash),
      fullName: String(row.full_name),
      phone: String(row.phone),
      serviceType: String(row.service_type),
      message: String(row.message),
      sourcePage: String(row.source_page),
      clientIp: String(row.client_ip),
      createdAtUtc: String(row.created_at_utc),
      createdAtVn: String(row.created_at_vn),
      createdAtMs: Number(row.created_at_ms),
    };
  }

  private mapTaskRow(row: Record<string, unknown>): StoredNotificationTask {
    return {
      id: Number(row.id),
      requestId: Number(row.request_id),
      requestCode: String(row.request_code),
      channel: String(row.channel) as NotificationChannel,
      status: String(row.status) as NotificationTaskStatus,
      attemptCount: Number(row.attempt_count),
      maxAttempts: Number(row.max_attempts),
      nextRetryAtMs:
        row.next_retry_at_ms === null || row.next_retry_at_ms === undefined
          ? null
          : Number(row.next_retry_at_ms),
      leaseExpiresAtMs:
        row.lease_expires_at_ms === null || row.lease_expires_at_ms === undefined
          ? null
          : Number(row.lease_expires_at_ms),
      providerResponse:
        row.provider_response === null || row.provider_response === undefined
          ? null
          : String(row.provider_response),
      lastError:
        row.last_error === null || row.last_error === undefined
          ? null
          : String(row.last_error),
      updatedAtUtc: String(row.updated_at_utc),
    };
  }
}

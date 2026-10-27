/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Unit & integration tests for Nexis Tech:
 * - Consultation form validation & Vietnamese phone formatting
 * - SQLite ACID persistence & idempotency deduplication
 * - Independent Email/Zalo channels & bounded exponential retry
 * - Lease-based crash recovery for interrupted/abandoned notification tasks
 * - Production static asset isolation: ensuring backend code (/server.js, etc.) is never exposed
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  validateQuoteForm,
  normalizeVietnamesePhone,
  escapeHtml,
  formatVietnamTime,
  buildEmailNotificationContent,
  buildZaloNotificationText,
  getWrappedIndex,
} from './validation.ts';
import { ConsultationStore } from '../server/consultationStore.ts';
import {
  NotificationDispatcher,
  ChannelProvider,
  ProviderSendResult,
} from '../server/notifiers.ts';

test('1. Validation: accepts valid Vietnamese phone formats and normalizes input', () => {
  const res = validateQuoteForm({
    fullName: '  Nguyễn   Văn  An  ',
    phone: '+84 909 858 428',
    serviceType: 'Thiết kế website doanh nghiệp',
    message: 'Cần làm website giới thiệu công ty tại TP.HCM',
  });

  assert.equal(res.isValid, true);
  assert.equal(res.normalized.fullName, 'Nguyễn Văn An');
  assert.equal(res.normalized.phone, '0909858428');
  assert.equal(normalizeVietnamesePhone('0909.858.428'), '0909858428');
});

test('2. Validation: rejects empty/short name, invalid phone, or oversized message', () => {
  const invalid = validateQuoteForm({
    fullName: 'A',
    phone: '012345',
    message: 'x'.repeat(2005),
  });

  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.message);
});

test('3. Notification formatting: escapes HTML in email and formats Zalo & Vietnam time', () => {
  const createdAtVn = formatVietnamTime(new Date('2026-10-27T13:30:00.000Z'));
  assert.match(createdAtVn, /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} \(GMT\+7\)/);

  const sampleRecord = {
    requestCode: 'NXT-20261027-1234',
    fullName: 'Trần <script>alert(1)</script> Bình',
    phone: '0909858428',
    serviceType: 'Website bán hàng',
    message: 'Cần tích hợp giỏ hàng & thanh toán',
    sourcePage: 'Khu vực đăng ký tư vấn (#bao-gia)',
    createdAtVn,
  };

  const emailContent = buildEmailNotificationContent(sampleRecord);
  assert.equal(
    emailContent.subject,
    '[Nexis Tech] Yêu cầu tư vấn mới – Trần <script>alert(1)</script> Bình'
  );
  assert.ok(!emailContent.html.includes('<script>alert(1)</script>'));
  assert.ok(
    emailContent.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;')
  );
  assert.ok(emailContent.text.includes('Mã yêu cầu: NXT-20261027-1234'));

  const zaloText = buildZaloNotificationText(sampleRecord);
  assert.ok(zaloText.startsWith('NEXIS TECH – YÊU CẦU TƯ VẤN MỚI\n'));
  assert.ok(zaloText.includes('Mã: NXT-20261027-1234'));
  assert.ok(zaloText.includes('Điện thoại: 0909858428'));
});

test('4. Persistence & Deduplication: saves consultation and prevents duplicate requests', () => {
  const store = new ConsultationStore(':memory:');
  const now = new Date('2026-10-27T08:00:00.000Z');

  const first = store.createOrGetConsultation({
    input: {
      fullName: 'Lê Minh Khôi',
      phone: '0909858428',
      serviceType: 'Thiết kế landing page',
      message: 'Tư vấn gói landing page sự kiện',
      sourcePage: 'Trang chủ Nexis Tech',
    },
    idempotencyKey: 'nxt-test-key-001',
    clientIp: '127.0.0.1',
    now,
  });

  assert.equal(first.isDuplicate, false);
  assert.match(first.request.requestCode, /^NXT-20261027-\d{4}$/);
  assert.equal(first.tasks.length, 2);

  // Repeat submission with same idempotencyKey
  const retrySameKey = store.createOrGetConsultation({
    input: {
      fullName: 'Lê Minh Khôi',
      phone: '0909858428',
      serviceType: 'Thiết kế landing page',
      message: 'Tư vấn gói landing page sự kiện',
      sourcePage: 'Trang chủ Nexis Tech',
    },
    idempotencyKey: 'nxt-test-key-001',
    clientIp: '127.0.0.1',
    now: new Date(now.getTime() + 5000),
  });

  assert.equal(retrySameKey.isDuplicate, true);
  assert.equal(retrySameKey.request.id, first.request.id);
  assert.equal(retrySameKey.request.requestCode, first.request.requestCode);

  // Repeat submission with different key but identical payload within 5 minutes
  const retrySamePayload = store.createOrGetConsultation({
    input: {
      fullName: 'Lê Minh Khôi',
      phone: '0909858428',
      serviceType: 'Thiết kế landing page',
      message: 'Tư vấn gói landing page sự kiện',
      sourcePage: 'Trang chủ Nexis Tech',
    },
    idempotencyKey: 'nxt-test-key-002',
    clientIp: '127.0.0.1',
    now: new Date(now.getTime() + 30_000),
  });

  assert.equal(retrySamePayload.isDuplicate, true);
  assert.equal(retrySamePayload.request.id, first.request.id);

  store.close();
});

test('5. Independent Channels & Bounded Retry: one succeeds, one fails then retries without re-sending succeeded channel', async () => {
  const store = new ConsultationStore(':memory:');
  const baseTime = 1_760_000_000_000;

  let emailCallCount = 0;
  let zaloCallCount = 0;

  const mockEmailProvider: ChannelProvider = {
    async send(): Promise<ProviderSendResult> {
      emailCallCount++;
      return {
        outcome: 'provider_accepted',
        providerResponse: 'smtp:msg-001',
      };
    },
  };

  const mockZaloProvider: ChannelProvider = {
    async send(): Promise<ProviderSendResult> {
      zaloCallCount++;
      if (zaloCallCount === 1) {
        return {
          outcome: 'failed',
          errorMessage: 'Zalo OpenAPI temporary timeout',
          retryable: true,
        };
      }
      return {
        outcome: 'provider_accepted',
        providerResponse: 'zalo_oa:msg-999',
      };
    },
  };

  const dispatcher = new NotificationDispatcher({
    store,
    emailProvider: mockEmailProvider,
    zaloProvider: mockZaloProvider,
    retryDelayMs: 1000,
  });

  const created = store.createOrGetConsultation({
    input: {
      fullName: 'Phạm Hoàng Nam',
      phone: '0912345678',
      serviceType: 'Website bán hàng',
      message: 'Cần báo giá gấp',
      sourcePage: 'Trang chủ Nexis Tech',
    },
    idempotencyKey: 'nxt-independent-test',
    clientIp: '127.0.0.1',
    now: new Date(baseTime),
  });

  // First dispatch: Email succeeds, Zalo fails transiently
  const tasksAfterFirst = await dispatcher.dispatchForRequest(
    created.request.id,
    baseTime
  );
  const emailTask1 = tasksAfterFirst.find((t) => t.channel === 'email')!;
  const zaloTask1 = tasksAfterFirst.find((t) => t.channel === 'zalo')!;

  assert.equal(emailTask1.status, 'provider_accepted');
  assert.equal(emailTask1.attemptCount, 1);
  assert.equal(zaloTask1.status, 'failed_retryable');
  assert.equal(zaloTask1.attemptCount, 1);
  assert.equal(emailCallCount, 1);
  assert.equal(zaloCallCount, 1);

  // Run retry after backoff elapsed: Email must NOT be called again; Zalo succeeds on attempt 2
  const processedCount = await dispatcher.processDueRetries(baseTime + 2000);
  assert.equal(processedCount, 1);
  assert.equal(emailCallCount, 1); // Succeeded channel never re-sent
  assert.equal(zaloCallCount, 2);

  const tasksAfterRetry = store.getTasksByRequestId(created.request.id);
  const emailTask2 = tasksAfterRetry.find((t) => t.channel === 'email')!;
  const zaloTask2 = tasksAfterRetry.find((t) => t.channel === 'zalo')!;

  assert.equal(emailTask2.status, 'provider_accepted');
  assert.equal(zaloTask2.status, 'provider_accepted');
  assert.equal(zaloTask2.attemptCount, 2);

  store.close();
});

test('6. Bounded Retry Limit: stops retrying after maxAttempts (3) and marks failed_permanent', async () => {
  const store = new ConsultationStore(':memory:');
  const baseTime = 1_760_000_000_000;
  let attempts = 0;

  const alwaysFailingProvider: ChannelProvider = {
    async send(): Promise<ProviderSendResult> {
      attempts++;
      return {
        outcome: 'failed',
        errorMessage: 'Network timeout',
        retryable: true,
      };
    },
  };

  const unconfiguredProvider: ChannelProvider = {
    async send(): Promise<ProviderSendResult> {
      return {
        outcome: 'unconfigured',
        reason: 'Missing credentials',
      };
    },
  };

  const dispatcher = new NotificationDispatcher({
    store,
    emailProvider: alwaysFailingProvider,
    zaloProvider: unconfiguredProvider,
    retryDelayMs: 500,
  });

  const created = store.createOrGetConsultation({
    input: {
      fullName: 'Đỗ Thanh Tùng',
      phone: '0987654321',
      serviceType: 'Thiết kế UI/UX',
      message: 'Kiểm thử giới hạn retry',
      sourcePage: 'Trang chủ',
    },
    idempotencyKey: 'nxt-max-retry-test',
    clientIp: '127.0.0.1',
    now: new Date(baseTime),
  });

  // Attempt 1
  await dispatcher.dispatchForRequest(created.request.id, baseTime);
  // Attempt 2
  await dispatcher.processDueRetries(baseTime + 1000);
  // Attempt 3 (reaches maxAttempts = 3 -> failed_permanent)
  await dispatcher.processDueRetries(baseTime + 2000);
  // Attempt 4 (should not run)
  const extraProcessed = await dispatcher.processDueRetries(baseTime + 5000);

  assert.equal(attempts, 3);
  assert.equal(extraProcessed, 0);

  const finalTasks = store.getTasksByRequestId(created.request.id);
  const emailFinal = finalTasks.find((t) => t.channel === 'email')!;
  const zaloFinal = finalTasks.find((t) => t.channel === 'zalo')!;

  assert.equal(emailFinal.status, 'failed_permanent');
  assert.equal(emailFinal.attemptCount, 3);
  assert.equal(zaloFinal.status, 'unconfigured');

  store.close();
});

test('7. Carousel index helper wraps accurately', () => {
  assert.equal(getWrappedIndex(0, -1, 4), 3);
  assert.equal(getWrappedIndex(3, 1, 4), 0);
});

test('8. ConsultationRouter & HTTP Integration: handles submission, honeypot and deduplication', async () => {
  const express = (await import('express')).default;
  const { createConsultationRouter } = await import('../server/consultationRouter.ts');
  const store = new ConsultationStore(':memory:');
  const dispatcher = new NotificationDispatcher({ store });

  const app = express();
  app.use(express.json());
  app.use('/api', createConsultationRouter({ store, dispatcher }));

  const server = app.listen(0);
  const port = (server.address() as { port: number }).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Rejects honeypot
    const honeypotRes = await fetch(`${baseUrl}/api/consultation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Nguyễn Văn Spam',
        phone: '0909858428',
        websiteUrl: 'https://spam-bot.site',
      }),
    });
    assert.equal(honeypotRes.status, 400);

    // 2. Accepts valid submission
    const validRes = await fetch(`${baseUrl}/api/consultation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-idempotency-key': 'http-test-key-100',
      },
      body: JSON.stringify({
        fullName: 'Nguyễn Anh Tuấn',
        phone: '0909 858 428',
        serviceType: 'Website doanh nghiệp',
        message: 'Cần tư vấn báo giá website tại TP.HCM',
      }),
    });
    assert.equal(validRes.status, 201);
    const validData = (await validRes.json()) as { ok: boolean; requestCode: string; isDuplicate: boolean };
    assert.equal(validData.ok, true);
    assert.equal(validData.isDuplicate, false);
    assert.match(validData.requestCode, /^NXT-\d{8}-\d{4}$/);

    // 3. Repeated submission returns duplicate status 200
    const dupRes = await fetch(`${baseUrl}/api/consultation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-idempotency-key': 'http-test-key-100',
      },
      body: JSON.stringify({
        fullName: 'Nguyễn Anh Tuấn',
        phone: '0909 858 428',
        serviceType: 'Website doanh nghiệp',
      }),
    });
    assert.equal(dupRes.status, 200);
    const dupData = (await dupRes.json()) as { ok: boolean; requestCode: string; isDuplicate: boolean };
    assert.equal(dupData.ok, true);
    assert.equal(dupData.isDuplicate, true);
    assert.equal(dupData.requestCode, validData.requestCode);
  } finally {
    server.close();
    store.close();
  }
});

test('9. Static & Backend Isolation: Express serves ONLY dist/client; /server.js and backend code return 404', async () => {
  const { createServerApp } = await import('../../server.ts');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nxt-static-test-'));
  const clientDir = path.join(tempDir, 'dist', 'client');
  const serverDir = path.join(tempDir, 'dist', 'server');

  fs.mkdirSync(clientDir, { recursive: true });
  fs.mkdirSync(serverDir, { recursive: true });

  // Simulate production build artifacts
  fs.writeFileSync(path.join(clientDir, 'index.html'), '<!doctype html><html><body>Nexis Client</body></html>');
  fs.mkdirSync(path.join(clientDir, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(clientDir, 'assets', 'app.js'), 'console.log("frontend bundle");');
  fs.writeFileSync(path.join(serverDir, 'server.js'), '// CONFIDENTIAL BACKEND CODE - MUST NEVER BE SERVED');

  const testStore = new ConsultationStore(':memory:');
  const { app, store } = await createServerApp({
    clientDistPath: clientDir,
    isProduction: true,
    store: testStore,
  });

  const server = app.listen(0);
  const port = (server.address() as { port: number }).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Health check works
    const healthRes = await fetch(`${baseUrl}/health`);
    assert.equal(healthRes.status, 200);
    const healthJson = (await healthRes.json()) as { status: string; service: string };
    assert.equal(healthJson.status, 'ok');
    assert.equal(healthJson.service, 'nexis-tech');

    // 2. Client frontend files are served properly
    const indexRes = await fetch(`${baseUrl}/`);
    assert.equal(indexRes.status, 200);
    const indexHtml = await indexRes.text();
    assert.ok(indexHtml.includes('Nexis Client'));

    const assetRes = await fetch(`${baseUrl}/assets/app.js`);
    assert.equal(assetRes.status, 200);
    const assetJs = await assetRes.text();
    assert.ok(assetJs.includes('frontend bundle'));

    // 3. CRITICAL: Backend code is NEVER accessible via /server.js or path variants
    const serverJsRes = await fetch(`${baseUrl}/server.js`);
    assert.equal(serverJsRes.status, 404);
    const serverJsText = await serverJsRes.text();
    assert.ok(!serverJsText.includes('CONFIDENTIAL BACKEND CODE'));
    assert.ok(!serverJsText.includes('Nexis Client')); // Must return 404, not fallback to index.html

    const nestedServerRes = await fetch(`${baseUrl}/server/server.js`);
    assert.equal(nestedServerRes.status, 404);

    const distServerRes = await fetch(`${baseUrl}/dist/server/server.js`);
    assert.equal(distServerRes.status, 404);

    // 4. Dotfiles (.env) and database files (.sqlite) return 404
    const envRes = await fetch(`${baseUrl}/.env`);
    assert.equal(envRes.status, 404);

    const dbRes = await fetch(`${baseUrl}/data/nexis_consultations.sqlite`);
    assert.equal(dbRes.status, 404);

    // 5. Unhandled API endpoints return 404 JSON, not HTML
    const unknownApiRes = await fetch(`${baseUrl}/api/unknown-endpoint`);
    assert.equal(unknownApiRes.status, 404);
    const unknownApiJson = (await unknownApiRes.json()) as { ok: boolean };
    assert.equal(unknownApiJson.ok, false);
  } finally {
    server.close();
    store.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('10. Lease-based Crash Recovery: recovers interrupted processing tasks after lease expiry without re-sending accepted tasks', async () => {
  const store = new ConsultationStore(':memory:');
  const t0 = 1_760_000_000_000;
  const leaseDurationMs = 2000; // 2 seconds lease for test

  const created = store.createOrGetConsultation({
    input: {
      fullName: 'Trần Văn Kiên',
      phone: '0901234567',
      serviceType: 'Website doanh nghiệp',
      message: 'Kiểm tra crash recovery',
      sourcePage: 'Trang chủ',
    },
    idempotencyKey: 'nxt-lease-recovery-test',
    clientIp: '127.0.0.1',
    now: new Date(t0),
  });

  // Both tasks start in 'pending'
  const initialTasks = store.getTasksByRequestId(created.request.id);
  assert.equal(initialTasks.length, 2);
  assert.equal(initialTasks[0].status, 'pending');
  assert.equal(initialTasks[0].attemptCount, 0);

  // 1. Worker claims email task at t0
  const claimedTask = store.claimTaskForProcessing(
    created.request.id,
    'email',
    t0,
    leaseDurationMs
  );
  assert.ok(claimedTask);
  assert.equal(claimedTask.status, 'processing');
  assert.equal(claimedTask.attemptCount, 1);
  assert.equal(claimedTask.leaseExpiresAtMs, t0 + leaseDurationMs);

  // 2. Active worker check: while lease is still active (t0 + 500ms), claiming again returns null
  const activeClaim = store.claimTaskForProcessing(
    created.request.id,
    'email',
    t0 + 500,
    leaseDurationMs
  );
  assert.equal(activeClaim, null);

  // And getDueRetryTasks at t0 + 500ms must NOT return the actively processing email task
  const dueWhileActive = store.getDueRetryTasks(t0 + 500);
  const emailInDue = dueWhileActive.find((t) => t.channel === 'email');
  assert.equal(emailInDue, undefined); // Email task is NOT returned because its lease is alive!

  // 3. Crash simulation: server was killed mid-flight. Time elapses past lease expiration (t0 + 2500ms)
  const tCrashRecovered = t0 + 2500;
  const dueAfterCrash = store.getDueRetryTasks(tCrashRecovered);
  const emailRecoverable = dueAfterCrash.find((t) => t.channel === 'email');
  assert.ok(emailRecoverable, 'Email task whose lease expired must be returned for crash recovery');
  assert.equal(emailRecoverable.status, 'processing');
  assert.equal(emailRecoverable.attemptCount, 1);

  // 4. Recovered worker claims the abandoned task
  const recoveredClaim = store.claimTaskForProcessing(
    created.request.id,
    'email',
    tCrashRecovered,
    leaseDurationMs
  );
  assert.ok(recoveredClaim);
  assert.equal(recoveredClaim.status, 'processing');
  assert.equal(recoveredClaim.attemptCount, 2); // Attempt count increments
  assert.equal(recoveredClaim.leaseExpiresAtMs, tCrashRecovered + leaseDurationMs);

  // 5. Worker successfully delivers and marks provider_accepted
  store.markTaskProviderAccepted(recoveredClaim.id, 'smtp:<msg-recovered-999>');
  const acceptedTask = store.getTasksByRequestId(created.request.id).find((t) => t.channel === 'email')!;
  assert.equal(acceptedTask.status, 'provider_accepted');
  assert.equal(acceptedTask.leaseExpiresAtMs, null);

  // 6. Even after long time elapsed (tCrashRecovered + 10_000ms), provider_accepted task is NEVER claimed or returned
  const farFuture = tCrashRecovered + 10_000;
  const futureDue = store.getDueRetryTasks(farFuture);
  assert.equal(futureDue.find((t) => t.channel === 'email'), undefined);

  const invalidClaim = store.claimTaskForProcessing(
    created.request.id,
    'email',
    farFuture,
    leaseDurationMs
  );
  assert.equal(invalidClaim, null);

  store.close();
});

test('11. End-to-End Restart Simulation: dispatcher.processDueRetries recovers abandoned tasks and does not re-send accepted tasks', async () => {
  const store = new ConsultationStore(':memory:');
  const t0 = 1_760_000_000_000;

  let emailSends = 0;
  let zaloSends = 0;

  const mockEmail: ChannelProvider = {
    async send(): Promise<ProviderSendResult> {
      emailSends++;
      return { outcome: 'provider_accepted', providerResponse: 'resend:msg-recovered' };
    },
  };

  const mockZalo: ChannelProvider = {
    async send(): Promise<ProviderSendResult> {
      zaloSends++;
      return { outcome: 'provider_accepted', providerResponse: 'zalo_oa:msg-ok' };
    },
  };

  const dispatcher = new NotificationDispatcher({
    store,
    emailProvider: mockEmail,
    zaloProvider: mockZalo,
    leaseDurationMs: 1000,
  });

  const created = store.createOrGetConsultation({
    input: {
      fullName: 'Vũ Quốc Huy',
      phone: '0908765432',
      serviceType: 'Tư vấn phần mềm',
      message: 'Mô phỏng khởi động lại server',
      sourcePage: 'Trang chủ',
    },
    idempotencyKey: 'nxt-restart-sim-test',
    clientIp: '127.0.0.1',
    now: new Date(t0),
  });

  // Step 1: Claim email task at t0, simulate crash immediately before provider responds
  const claimedEmail = store.claimTaskForProcessing(created.request.id, 'email', t0, 1000);
  assert.ok(claimedEmail);

  // Step 2: Directly mark Zalo as already provider_accepted (e.g. from prior successful run)
  const zaloTask = store.getTasksByRequestId(created.request.id).find((t) => t.channel === 'zalo')!;
  store.markTaskProviderAccepted(zaloTask.id, 'zalo_oa:pre-existing-msg');

  // Step 3: Server restarts after 1500ms (lease has now expired)
  const tRestart = t0 + 1500;
  const processed = await dispatcher.processDueRetries(tRestart);

  // Email task was recovered and processed; Zalo task was NEVER re-sent
  assert.equal(processed, 1);
  assert.equal(emailSends, 1);
  assert.equal(zaloSends, 0);

  const finalTasks = store.getTasksByRequestId(created.request.id);
  const emailFinal = finalTasks.find((t) => t.channel === 'email')!;
  const zaloFinal = finalTasks.find((t) => t.channel === 'zalo')!;

  assert.equal(emailFinal.status, 'provider_accepted');
  assert.equal(emailFinal.attemptCount, 2);
  assert.equal(zaloFinal.status, 'provider_accepted');
  assert.equal(zaloFinal.attemptCount, 0);

  store.close();
});

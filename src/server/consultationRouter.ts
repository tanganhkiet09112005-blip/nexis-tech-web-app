/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Express router for POST /api/consultation with validation, honeypot spam protection,
 * sliding-window rate limiting, idempotency deduplication, persistent storage,
 * and independent Email + Zalo notification dispatch.
 */

import express, { Request, Response, Router } from 'express';
import { validateQuoteForm, QuoteFormInput } from '../utils/validation.ts';
import { ConsultationStore } from './consultationStore.ts';
import { NotificationDispatcher } from './notifiers.ts';

export const SUCCESS_RESPONSE_MESSAGE =
  'Đã tiếp nhận yêu cầu. Nexis Tech sẽ liên hệ với bạn theo thông tin đã cung cấp.';

export const ERROR_RESPONSE_MESSAGE =
  'Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi 0909 858 428.';

export interface ConsultationRouterDependencies {
  store: ConsultationStore;
  dispatcher: NotificationDispatcher;
  rateLimitMaxRequests?: number;
  rateLimitWindowMs?: number;
}

export function createConsultationRouter(
  deps: ConsultationRouterDependencies
): Router {
  const router = express.Router();
  const maxRequests = deps.rateLimitMaxRequests ?? 8;
  const windowMs = deps.rateLimitWindowMs ?? 10 * 60 * 1000; // 10 minutes
  const ipTimestamps = new Map<string, number[]>();

  function getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim()) {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket?.remoteAddress || 'unknown';
  }

  function isRateLimited(ip: string, nowMs: number): boolean {
    const cutoff = nowMs - windowMs;
    const recent = (ipTimestamps.get(ip) || []).filter((ts) => ts > cutoff);
    if (recent.length >= maxRequests) {
      ipTimestamps.set(ip, recent);
      return true;
    }
    recent.push(nowMs);
    ipTimestamps.set(ip, recent);
    return false;
  }

  router.post('/consultation', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as QuoteFormInput;

      // 1. Anti-spam honeypot check: real users never fill the hidden websiteUrl field
      if (typeof body.websiteUrl === 'string' && body.websiteUrl.trim().length > 0) {
        return res.status(400).json({
          ok: false,
          message: ERROR_RESPONSE_MESSAGE,
        });
      }

      // 2. Extract idempotency key from header or body
      const headerKey = req.headers['x-idempotency-key'];
      const idempotencyKey =
        (typeof headerKey === 'string' ? headerKey.trim() : '') ||
        (typeof body.idempotencyKey === 'string' ? body.idempotencyKey.trim() : '');

      // 3. Server-side validation & normalization
      const validation = validateQuoteForm({
        fullName: body.fullName,
        phone: body.phone,
        serviceType: body.serviceType,
        message: body.message,
        sourcePage: body.sourcePage,
      });

      if (!validation.isValid) {
        return res.status(400).json({
          ok: false,
          message: 'Vui lòng kiểm tra lại thông tin bắt buộc.',
          errors: validation.errors,
        });
      }

      const clientIp = getClientIp(req);
      const now = new Date();

      // 4. Rate limit check (bypass rate limit if this idempotencyKey was already recorded)
      const isKnownIdempotentRetry =
        Boolean(idempotencyKey) && deps.store.hasIdempotencyKey(idempotencyKey);

      if (!isKnownIdempotentRetry && isRateLimited(clientIp, now.getTime())) {
        return res.status(429).json({
          ok: false,
          message: ERROR_RESPONSE_MESSAGE,
        });
      }

      // 5. Persist request and both notification tasks (email + zalo) in ACID transaction
      const created = deps.store.createOrGetConsultation({
        input: validation.normalized,
        idempotencyKey,
        clientIp,
        now,
      });

      // 6. Trigger independent Email & Zalo notification tasks
      // We wait up to 1.5s for initial dispatch or let it finish in background so UI is responsive,
      // while the task states are already durably recorded in SQLite.
      const dispatchPromise = deps.dispatcher
        .dispatchForRequest(created.request.id)
        .catch(() => {
          // Never crash or fail the HTTP response if a notification provider has an error
        });

      await Promise.race([
        dispatchPromise,
        new Promise((resolve) => setTimeout(resolve, 1200)),
      ]);

      return res.status(created.isDuplicate ? 200 : 201).json({
        ok: true,
        message: SUCCESS_RESPONSE_MESSAGE,
        requestCode: created.request.requestCode,
        createdAtVn: created.request.createdAtVn,
        isDuplicate: created.isDuplicate,
      });
    } catch {
      return res.status(500).json({
        ok: false,
        message: ERROR_RESPONSE_MESSAGE,
      });
    }
  });

  return router;
}

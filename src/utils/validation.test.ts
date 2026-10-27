/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Unit & integration tests for Nexis Tech consultation validation, formatting,
 * SQLite persistence, idempotency deduplication, independent Email/Zalo channels,
 * and bounded retry behavior.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
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

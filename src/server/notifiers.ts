/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Independent Email and Zalo notification providers and bounded-retry dispatcher.
 * Never logs or exposes secrets/tokens. Never fakes delivery when credentials are missing.
 */

import nodemailer from 'nodemailer';
import {
  ConsultationRecordSummary,
  NEXIS_NOTIFICATION_RECIPIENT_EMAIL,
  buildEmailNotificationContent,
  buildZaloNotificationText,
  isVietnamesePhone,
} from '../utils/validation.ts';
import {
  ConsultationStore,
  NotificationChannel,
  StoredNotificationTask,
} from './consultationStore.ts';

export type ProviderSendResult =
  | {
      outcome: 'provider_accepted';
      providerResponse: string;
    }
  | {
      outcome: 'unconfigured';
      reason: string;
    }
  | {
      outcome: 'failed';
      errorMessage: string;
      retryable: boolean;
    };

export interface ChannelProvider {
  send(record: ConsultationRecordSummary): Promise<ProviderSendResult>;
}

function isPlaceholder(val: string | undefined): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  if (!trimmed) return true;
  const upper = trimmed.toUpperCase();
  return (
    upper.startsWith('YOUR_') ||
    upper.startsWith('MY_') ||
    upper.includes('PLACEHOLDER') ||
    upper === 'CHANGE_ME'
  );
}

/**
 * Server-side Email Provider supporting Gmail/SMTP (Nodemailer) or Resend HTTP API.
 * Always sends to fixed recipient: nexistech.work@gmail.com
 */
export class ServerEmailProvider implements ChannelProvider {
  public async send(record: ConsultationRecordSummary): Promise<ProviderSendResult> {
    const recipient = NEXIS_NOTIFICATION_RECIPIENT_EMAIL;
    const { subject, text, html } = buildEmailNotificationContent(record);

    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();
    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    // Option 1: SMTP / Gmail App Password
    if (!isPlaceholder(smtpUser) && !isPlaceholder(smtpPass)) {
      const smtpHost = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
      const smtpPort = Number(process.env.SMTP_PORT || '465');
      const smtpSecure =
        process.env.SMTP_SECURE !== undefined
          ? process.env.SMTP_SECURE === 'true'
          : smtpPort === 465;
      const smtpFrom = process.env.SMTP_FROM?.trim() || smtpUser!;

      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          connectionTimeout: 10_000,
          greetingTimeout: 10_000,
          socketTimeout: 15_000,
        });

        const info = await transporter.sendMail({
          from: `"Nexis Tech Website" <${smtpFrom}>`,
          to: recipient,
          subject,
          text,
          html,
        });

        const acceptedList = Array.isArray(info.accepted)
          ? info.accepted.map((a) => String(a).toLowerCase())
          : [];

        if (info.messageId && acceptedList.some((a) => a.includes(recipient.toLowerCase()))) {
          return {
            outcome: 'provider_accepted',
            providerResponse: `smtp:${info.messageId}`,
          };
        }

        return {
          outcome: 'failed',
          errorMessage: 'SMTP server did not confirm recipient acceptance',
          retryable: true,
        };
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code || '';
        const responseCode = (err as { responseCode?: number })?.responseCode || 0;
        const msg = err instanceof Error ? err.message : 'SMTP transport error';
        const isTransient =
          code === 'ETIMEDOUT' ||
          code === 'ECONNRESET' ||
          code === 'ESOCKET' ||
          (responseCode >= 400 && responseCode < 500 && responseCode !== 535);

        return {
          outcome: 'failed',
          errorMessage: `SMTP error (${code || responseCode || 'unknown'}): ${msg.slice(0, 180)}`,
          retryable: isTransient,
        };
      }
    }

    // Option 2: Resend HTTP API
    if (!isPlaceholder(resendApiKey)) {
      const emailFrom = process.env.EMAIL_FROM?.trim();
      if (isPlaceholder(emailFrom)) {
        return {
          outcome: 'unconfigured',
          reason: 'EMAIL_FROM is required when using RESEND_API_KEY',
        };
      }

      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: emailFrom,
            to: [recipient],
            subject,
            text,
            html,
          }),
        });

        const data = (await res.json().catch(() => ({}))) as {
          id?: string;
          message?: string;
        };

        if (res.ok && data.id) {
          return {
            outcome: 'provider_accepted',
            providerResponse: `resend:${data.id}`,
          };
        }

        const retryable = res.status === 429 || res.status >= 500;
        return {
          outcome: 'failed',
          errorMessage: `Resend HTTP ${res.status}: ${data.message || 'Unknown error'}`,
          retryable,
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Network error calling Resend';
        return {
          outcome: 'failed',
          errorMessage: msg.slice(0, 180),
          retryable: true,
        };
      }
    }

    return {
      outcome: 'unconfigured',
      reason:
        'Email credentials not configured (set SMTP_USER + SMTP_PASS or RESEND_API_KEY + EMAIL_FROM)',
    };
  }
}

/**
 * Server-side Zalo Official Account (OA) OpenAPI v3.0 Provider.
 * Endpoint: POST https://openapi.zalo.me/v3.0/oa/message/cs
 * Also supports automatic OAuth v4 access_token refresh when ZALO_OA_REFRESH_TOKEN is configured.
 * Strictly validates that ZALO_RECIPIENT_USER_ID is an OA user_id (UID), NOT a phone number.
 */
export class ServerZaloProvider implements ChannelProvider {
  private cachedAccessToken: string | null = null;

  private async resolveAccessToken(forceRefresh = false): Promise<string | null> {
    if (!forceRefresh && this.cachedAccessToken) {
      return this.cachedAccessToken;
    }

    const envAccessToken = process.env.ZALO_OA_ACCESS_TOKEN?.trim();
    if (!forceRefresh && !isPlaceholder(envAccessToken)) {
      this.cachedAccessToken = envAccessToken!;
      return this.cachedAccessToken;
    }

    const appId = process.env.ZALO_APP_ID?.trim();
    const appSecret = process.env.ZALO_APP_SECRET?.trim();
    const refreshToken = process.env.ZALO_OA_REFRESH_TOKEN?.trim();

    if (
      !isPlaceholder(appId) &&
      !isPlaceholder(appSecret) &&
      !isPlaceholder(refreshToken)
    ) {
      const body = new URLSearchParams({
        app_id: appId!,
        grant_type: 'refresh_token',
        refresh_token: refreshToken!,
      });

      const res = await fetch('https://oauth.zaloapp.com/v4/oa/access_token', {
        method: 'POST',
        headers: {
          secret_key: appSecret!,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const data = (await res.json().catch(() => ({}))) as {
        access_token?: string;
        refresh_token?: string;
      };

      if (res.ok && data.access_token) {
        this.cachedAccessToken = data.access_token;
        return this.cachedAccessToken;
      }
    }

    return null;
  }

  public async send(record: ConsultationRecordSummary): Promise<ProviderSendResult> {
    const recipientUserId = process.env.ZALO_RECIPIENT_USER_ID?.trim();

    if (isPlaceholder(recipientUserId)) {
      return {
        outcome: 'unconfigured',
        reason: 'Missing ZALO_RECIPIENT_USER_ID (Zalo OA user_id of person in charge)',
      };
    }

    // Guard against mistakenly configuring a phone number instead of Zalo OA user_id
    if (isVietnamesePhone(recipientUserId!)) {
      return {
        outcome: 'failed',
        errorMessage:
          'ZALO_RECIPIENT_USER_ID must be a Zalo OA user_id (UID), not a phone number',
        retryable: false,
      };
    }

    let accessToken: string | null = null;
    try {
      accessToken = await this.resolveAccessToken(false);
    } catch (err: unknown) {
      return {
        outcome: 'failed',
        errorMessage:
          err instanceof Error
            ? `Zalo token refresh failed: ${err.message}`
            : 'Zalo token refresh failed',
        retryable: true,
      };
    }

    if (!accessToken) {
      return {
        outcome: 'unconfigured',
        reason:
          'Missing ZALO_OA_ACCESS_TOKEN (or ZALO_APP_ID + ZALO_APP_SECRET + ZALO_OA_REFRESH_TOKEN)',
      };
    }

    const messageText = buildZaloNotificationText(record);

    const attemptSend = async (token: string) => {
      const response = await fetch('https://openapi.zalo.me/v3.0/oa/message/cs', {
        method: 'POST',
        headers: {
          access_token: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: {
            user_id: recipientUserId,
          },
          message: {
            text: messageText,
          },
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: number;
        message?: string;
        data?: { message_id?: string };
      };

      return { httpStatus: response.status, payload };
    };

    try {
      let { httpStatus, payload } = await attemptSend(accessToken);

      // Error -216 in Zalo OA API means access_token expired; attempt 1 automatic refresh if configured
      if (payload.error === -216) {
        const refreshed = await this.resolveAccessToken(true).catch(() => null);
        if (refreshed && refreshed !== accessToken) {
          ({ httpStatus, payload } = await attemptSend(refreshed));
        }
      }

      if (httpStatus === 200 && payload.error === 0 && payload.data?.message_id) {
        return {
          outcome: 'provider_accepted',
          providerResponse: `zalo_oa:${payload.data.message_id}`,
        };
      }

      const zaloErrCode = payload.error ?? httpStatus;
      const zaloMsg = payload.message || 'Zalo OpenAPI error';
      // Transient errors: HTTP 429/5xx or Zalo system busy (-1, -201 rate limit)
      const retryable =
        httpStatus === 429 ||
        httpStatus >= 500 ||
        zaloErrCode === -1 ||
        zaloErrCode === -201;

      return {
        outcome: 'failed',
        errorMessage: `Zalo OA API error (${zaloErrCode}): ${zaloMsg.slice(0, 180)}`,
        retryable,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error calling Zalo OpenAPI';
      return {
        outcome: 'failed',
        errorMessage: msg.slice(0, 180),
        retryable: true,
      };
    }
  }
}

export interface DispatcherOptions {
  store: ConsultationStore;
  emailProvider?: ChannelProvider;
  zaloProvider?: ChannelProvider;
  retryDelayMs?: number;
}

/**
 * Coordinates independent execution and bounded retries for Email and Zalo tasks.
 */
export class NotificationDispatcher {
  private store: ConsultationStore;
  private providers: Record<NotificationChannel, ChannelProvider>;
  private retryDelayMs?: number;

  constructor(options: DispatcherOptions) {
    this.store = options.store;
    this.providers = {
      email: options.emailProvider || new ServerEmailProvider(),
      zalo: options.zaloProvider || new ServerZaloProvider(),
    };
    this.retryDelayMs = options.retryDelayMs;
  }

  /**
   * Executes both Email and Zalo notification tasks for a request independently.
   * One channel failing never throws or cancels the other.
   */
  public async dispatchForRequest(
    requestId: number,
    nowMs: number = Date.now()
  ): Promise<StoredNotificationTask[]> {
    const request = this.store.getRequestById(requestId);
    if (!request) return [];

    await Promise.allSettled([
      this.processChannel(request, 'email', nowMs),
      this.processChannel(request, 'zalo', nowMs),
    ]);

    return this.store.getTasksByRequestId(requestId);
  }

  /**
   * Processes a single channel for a given consultation request.
   * Never re-sends if the channel is already in 'provider_accepted' state.
   */
  public async processChannel(
    request: ConsultationRecordSummary & { id: number },
    channel: NotificationChannel,
    nowMs: number = Date.now()
  ): Promise<void> {
    const claimed = this.store.claimTaskForProcessing(request.id, channel, nowMs);
    if (!claimed) {
      return;
    }

    const provider = this.providers[channel];
    try {
      const result = await provider.send(request);
      if (result.outcome === 'provider_accepted') {
        this.store.markTaskProviderAccepted(claimed.id, result.providerResponse);
      } else if (result.outcome === 'unconfigured') {
        this.store.markTaskUnconfigured(claimed.id, result.reason);
      } else {
        this.store.markTaskFailed({
          taskId: claimed.id,
          errorMessage: result.errorMessage,
          retryable: result.retryable,
          retryDelayMs: this.retryDelayMs,
          nowMs,
        });
      }
    } catch (unexpectedErr: unknown) {
      const message =
        unexpectedErr instanceof Error
          ? unexpectedErr.message
          : 'Unexpected channel dispatch error';
      this.store.markTaskFailed({
        taskId: claimed.id,
        errorMessage: message,
        retryable: true,
        retryDelayMs: this.retryDelayMs,
        nowMs,
      });
    }
  }

  /**
   * Finds all tasks in 'pending' or 'failed_retryable' whose backoff timer has elapsed
   * and executes them independently.
   */
  public async processDueRetries(nowMs: number = Date.now()): Promise<number> {
    const dueTasks = this.store.getDueRetryTasks(nowMs);
    if (dueTasks.length === 0) return 0;

    let processed = 0;
    for (const task of dueTasks) {
      const req = this.store.getRequestById(task.requestId);
      if (req) {
        await this.processChannel(req, task.channel, nowMs);
        processed++;
      }
    }
    return processed;
  }
}

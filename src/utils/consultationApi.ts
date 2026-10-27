/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Client helper for submitting consultation requests to POST /api/consultation
 * with idempotency key support and clean Vietnamese error handling.
 */

import { QuoteFormInput } from './validation.ts';

export interface ConsultationSubmitResponse {
  ok: boolean;
  message: string;
  requestCode?: string;
  createdAtVn?: string;
  isDuplicate?: boolean;
  errors?: Partial<Record<keyof QuoteFormInput, string>>;
}

export const FALLBACK_SUBMIT_ERROR_MESSAGE =
  'Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi 0909 858 428.';

export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `nxt-${crypto.randomUUID()}`;
  }
  return `nxt-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export async function submitConsultationRequest(
  input: QuoteFormInput,
  idempotencyKey: string
): Promise<ConsultationSubmitResponse> {
  try {
    const response = await fetch('/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        fullName: input.fullName,
        phone: input.phone,
        serviceType: input.serviceType,
        message: input.message,
        sourcePage: input.sourcePage || window.location.pathname || 'Trang chủ Nexis Tech',
        idempotencyKey,
        websiteUrl: input.websiteUrl || '',
      }),
    });

    const data = (await response.json().catch(() => null)) as ConsultationSubmitResponse | null;

    if (!data) {
      return {
        ok: false,
        message: FALLBACK_SUBMIT_ERROR_MESSAGE,
      };
    }

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        message: data.message || FALLBACK_SUBMIT_ERROR_MESSAGE,
        errors: data.errors,
      };
    }

    return {
      ok: true,
      message:
        data.message ||
        'Đã tiếp nhận yêu cầu. Nexis Tech sẽ liên hệ với bạn theo thông tin đã cung cấp.',
      requestCode: data.requestCode,
      createdAtVn: data.createdAtVn,
      isDuplicate: data.isDuplicate,
    };
  } catch {
    return {
      ok: false,
      message: FALLBACK_SUBMIT_ERROR_MESSAGE,
    };
  }
}

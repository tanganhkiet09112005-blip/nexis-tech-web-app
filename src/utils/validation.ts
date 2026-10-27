/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Pure validation, normalization, HTML escaping, timezone formatting,
 * and notification payload builders for Nexis Tech.
 * Decoupled from React/DOM for deterministic unit testing via node:test.
 */

export interface QuoteFormInput {
  fullName: string;
  phone: string;
  serviceType?: string;
  message?: string;
  sourcePage?: string;
  idempotencyKey?: string;
  websiteUrl?: string; // Honeypot field (must remain empty)
}

export interface NormalizedQuoteInput {
  fullName: string;
  phone: string;
  serviceType: string;
  message: string;
  sourcePage: string;
}

export interface QuoteFormValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof QuoteFormInput, string>>;
  normalized: NormalizedQuoteInput;
}

export interface ConsultationRecordSummary {
  requestCode: string;
  fullName: string;
  phone: string;
  serviceType: string;
  message: string;
  sourcePage: string;
  createdAtVn: string;
}

export const FIELD_LIMITS = {
  FULL_NAME_MIN: 2,
  FULL_NAME_MAX: 100,
  PHONE_MAX: 25,
  SERVICE_TYPE_MAX: 150,
  MESSAGE_MAX: 2000,
  SOURCE_PAGE_MAX: 300,
} as const;

export const NEXIS_NOTIFICATION_RECIPIENT_EMAIL = 'nexistech.work@gmail.com';

/**
 * Collapses multiple spaces/tabs into single spaces and trims outer whitespace.
 */
export function normalizeSingleLine(raw: string | undefined | null): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Normalizes multiline text while preserving line breaks and trimming outer whitespace.
 */
export function normalizeMultiLine(raw: string | undefined | null): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Normalizes a Vietnamese phone number to standard 10-digit domestic format (0xxxxxxxxx).
 * If invalid, returns the stripped digits/plus string for validation check.
 */
export function normalizeVietnamesePhone(raw: string | undefined | null): string {
  if (!raw || typeof raw !== 'string') return '';
  const cleaned = raw.trim().replace(/[\s.\-()]/g, '');
  if (/^\+84(3|5|7|8|9)\d{8}$/.test(cleaned)) {
    return '0' + cleaned.slice(3);
  }
  if (/^84(3|5|7|8|9)\d{8}$/.test(cleaned)) {
    return '0' + cleaned.slice(2);
  }
  return cleaned;
}

/**
 * Checks whether a phone string is a valid Vietnamese mobile phone number
 * (e.g. 0909 858 428, 0909858428, +84909858428).
 */
export function isVietnamesePhone(raw: string): boolean {
  const normalized = normalizeVietnamesePhone(raw);
  return /^0(3|5|7|8|9)\d{8}$/.test(normalized);
}

/**
 * Validates and normalizes the consultation form (used by both browser and server).
 */
export function validateQuoteForm(input: QuoteFormInput): QuoteFormValidationResult {
  const errors: Partial<Record<keyof QuoteFormInput, string>> = {};

  const fullName = normalizeSingleLine(input.fullName);
  const rawPhone = typeof input.phone === 'string' ? input.phone.trim() : '';
  const phone = normalizeVietnamesePhone(rawPhone);
  const serviceType =
    normalizeSingleLine(input.serviceType) || 'Chưa chọn dịch vụ cụ thể';
  const message = normalizeMultiLine(input.message);
  const sourcePage =
    normalizeSingleLine(input.sourcePage) || 'Trang chủ Nexis Tech';

  if (!fullName || fullName.length < FIELD_LIMITS.FULL_NAME_MIN) {
    errors.fullName = 'Vui lòng nhập họ và tên của bạn (tối thiểu 2 ký tự).';
  } else if (fullName.length > FIELD_LIMITS.FULL_NAME_MAX) {
    errors.fullName = `Họ và tên không được vượt quá ${FIELD_LIMITS.FULL_NAME_MAX} ký tự.`;
  }

  if (!rawPhone) {
    errors.phone = 'Vui lòng nhập số điện thoại liên hệ.';
  } else if (rawPhone.length > FIELD_LIMITS.PHONE_MAX || !isVietnamesePhone(rawPhone)) {
    errors.phone = 'Vui lòng nhập số điện thoại hợp lệ (ví dụ: 0909 858 428).';
  }

  if (serviceType.length > FIELD_LIMITS.SERVICE_TYPE_MAX) {
    errors.serviceType = `Tên dịch vụ không được vượt quá ${FIELD_LIMITS.SERVICE_TYPE_MAX} ký tự.`;
  }

  if (message.length > FIELD_LIMITS.MESSAGE_MAX) {
    errors.message = `Mô tả nhu cầu không được vượt quá ${FIELD_LIMITS.MESSAGE_MAX} ký tự.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    normalized: {
      fullName,
      phone,
      serviceType: serviceType.slice(0, FIELD_LIMITS.SERVICE_TYPE_MAX),
      message,
      sourcePage: sourcePage.slice(0, FIELD_LIMITS.SOURCE_PAGE_MAX),
    },
  };
}

/**
 * Escapes user-provided strings before embedding into HTML email templates.
 */
export function escapeHtml(unsafe: string): string {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Formats a Date into Asia/Ho_Chi_Minh timestamp string: "DD/MM/YYYY HH:mm:ss (GMT+7)"
 */
export function formatVietnamTime(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};
  for (const part of parts) {
    map[part.type] = part.value;
  }
  return `${map.day}/${map.month}/${map.year} ${map.hour}:${map.minute}:${map.second} (GMT+7)`;
}

/**
 * Generates a date prefix YYYYMMDD in Asia/Ho_Chi_Minh timezone for request codes.
 */
export function getVietnamDateCompact(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};
  for (const part of parts) {
    map[part.type] = part.value;
  }
  return `${map.year}${map.month}${map.day}`;
}

/**
 * Builds the exact Email subject, plain text, and escaped HTML payload
 * for the Nexis Tech person-in-charge notification.
 */
export function buildEmailNotificationContent(record: ConsultationRecordSummary): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `[Nexis Tech] Yêu cầu tư vấn mới – ${record.fullName}`;
  const descriptionText = record.message || 'Khách hàng chưa để lại mô tả chi tiết.';

  const text = [
    'NEXIS TECH – YÊU CẦU TƯ VẤN MỚI',
    '----------------------------------------',
    `Mã yêu cầu: ${record.requestCode}`,
    `Họ tên: ${record.fullName}`,
    `Số điện thoại: ${record.phone}`,
    `Dịch vụ quan tâm: ${record.serviceType}`,
    `Nội dung khách mô tả: ${descriptionText}`,
    `Thời gian tiếp nhận: ${record.createdAtVn}`,
    `Trang nguồn gửi biểu mẫu: ${record.sourcePage}`,
  ].join('\n');

  const safeCode = escapeHtml(record.requestCode);
  const safeName = escapeHtml(record.fullName);
  const safePhone = escapeHtml(record.phone);
  const safeService = escapeHtml(record.serviceType);
  const safeMessage = escapeHtml(descriptionText).replace(/\n/g, '<br/>');
  const safeTime = escapeHtml(record.createdAtVn);
  const safeSource = escapeHtml(record.sourcePage);

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:24px;background-color:#F3F7FC;font-family:'Be Vietnam Pro',Arial,sans-serif;color:#030B24;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:14px;overflow:hidden;border:1px solid #DCE6F4;">
    <tr>
      <td style="background:#030B24;padding:20px 24px;color:#FFFFFF;">
        <div style="font-size:12px;color:#16D9F3;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">NEXIS TECH</div>
        <h1 style="margin:6px 0 0;font-size:18px;font-weight:700;color:#FFFFFF;">Yêu cầu tư vấn mới – ${safeName}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:14px;line-height:1.6;">
          <tr>
            <td style="padding:8px 0;color:#526581;width:170px;font-weight:600;">Mã yêu cầu:</td>
            <td style="padding:8px 0;color:#087BFF;font-weight:700;">${safeCode}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#526581;font-weight:600;">Họ tên:</td>
            <td style="padding:8px 0;color:#030B24;font-weight:600;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#526581;font-weight:600;">Số điện thoại:</td>
            <td style="padding:8px 0;color:#030B24;font-weight:700;">
              <a href="tel:${safePhone}" style="color:#087BFF;text-decoration:none;">${safePhone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#526581;font-weight:600;">Dịch vụ quan tâm:</td>
            <td style="padding:8px 0;color:#030B24;">${safeService}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#526581;font-weight:600;vertical-align:top;">Nội dung khách mô tả:</td>
            <td style="padding:8px 0;color:#030B24;">${safeMessage}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#526581;font-weight:600;">Thời gian tiếp nhận:</td>
            <td style="padding:8px 0;color:#030B24;">${safeTime}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#526581;font-weight:600;">Trang nguồn gửi biểu mẫu:</td>
            <td style="padding:8px 0;color:#526581;">${safeSource}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

/**
 * Builds the exact Zalo notification message text required by Section 5.
 */
export function buildZaloNotificationText(record: ConsultationRecordSummary): string {
  const conciseMessage = record.message
    ? record.message.slice(0, 500)
    : 'Chưa ghi mô tả chi tiết';

  return [
    'NEXIS TECH – YÊU CẦU TƯ VẤN MỚI',
    `Mã: ${record.requestCode}`,
    `Khách hàng: ${record.fullName}`,
    `Điện thoại: ${record.phone}`,
    `Dịch vụ: ${record.serviceType}`,
    `Nhu cầu: ${conciseMessage}`,
    `Thời gian: ${record.createdAtVn}`,
  ].join('\n');
}

/**
 * Circular index helper for sliders and carousels.
 */
export function getWrappedIndex(current: number, delta: number, total: number): number {
  if (total <= 0) return 0;
  return ((current + delta) % total + total) % total;
}

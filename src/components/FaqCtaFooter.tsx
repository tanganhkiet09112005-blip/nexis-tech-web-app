/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Section 13: FAQ Accordion
 * Section 14: End-of-Page Call to Action Banner
 * Section 15: Multi-Column Footer with Unified Contact Info & Quick Quote Mini-Form
 * Section 16: Floating Action Buttons (Gọi điện, Gửi email, Lên đầu trang)
 */

import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NEXIS_BRAND } from '../config/brand.ts';
import {
  validateQuoteForm,
  QuoteFormInput,
  FIELD_LIMITS,
} from '../utils/validation.ts';
import {
  generateIdempotencyKey,
  submitConsultationRequest,
  ConsultationSubmitResponse,
} from '../utils/consultationApi.ts';

interface FaqCtaFooterProps {
  onScrollToQuote: (serviceName?: string) => void;
}

export const FaqCtaFooter: React.FC<FaqCtaFooterProps> = ({ onScrollToQuote }) => {
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-1']);

  // Footer mini-form state
  const [footerForm, setFooterForm] = useState<QuoteFormInput>({
    fullName: '',
    phone: '',
    serviceType: NEXIS_BRAND.coreServices[0].shortTitle,
    message: '',
    websiteUrl: '',
  });
  const [footerIdempotencyKey, setFooterIdempotencyKey] = useState<string>(() =>
    generateIdempotencyKey()
  );
  const [footerIsSubmitting, setFooterIsSubmitting] = useState(false);
  const [footerErrors, setFooterErrors] = useState<
    Partial<Record<keyof QuoteFormInput, string>>
  >({});
  const [footerSubmitError, setFooterSubmitError] = useState<string | null>(null);
  const [footerSubmitted, setFooterSubmitted] =
    useState<ConsultationSubmitResponse | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFooterChange = (field: keyof QuoteFormInput, val: string) => {
    setFooterForm((prev) => ({ ...prev, [field]: val }));
    if (footerErrors[field]) {
      setFooterErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (footerSubmitError) {
      setFooterSubmitError(null);
    }
  };

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (footerIsSubmitting) return;

    setFooterSubmitError(null);
    const res = validateQuoteForm(footerForm);
    if (!res.isValid) {
      setFooterErrors(res.errors);
      return;
    }

    setFooterErrors({});
    setFooterIsSubmitting(true);

    const submitRes = await submitConsultationRequest(
      {
        ...footerForm,
        sourcePage: 'Biểu mẫu tư vấn nhanh cuối trang (Footer)',
      },
      footerIdempotencyKey
    );

    setFooterIsSubmitting(false);

    if (!submitRes.ok) {
      if (submitRes.errors) {
        setFooterErrors(submitRes.errors);
      }
      setFooterSubmitError(submitRes.message);
      return;
    }

    setFooterSubmitted(submitRes);
  };

  const handleResetFooterForm = () => {
    setFooterSubmitted(null);
    setFooterSubmitError(null);
    setFooterErrors({});
    setFooterIdempotencyKey(generateIdempotencyKey());
    setFooterForm({
      fullName: '',
      phone: '',
      serviceType: NEXIS_BRAND.coreServices[0].shortTitle,
      message: '',
      websiteUrl: '',
    });
  };

  return (
    <>
      {/* =====================================================================
          SECTION 13: CÂU HỎI THƯỜNG GẶP (FAQ ACCORDION WITH SMOOTH EXPANSION)
         ===================================================================== */}
      <section
        id="faq"
        className="py-16 sm:py-24 bg-[#040D2B] text-[#F4F8FF] border-b border-white/10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="inline-block text-xs font-semibold text-[#16D9F3] bg-[#071638] border border-[#16D9F3]/30 px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              Giải đáp thắc mắc
            </span>
            <h2 className="heading-section text-white">
              Bạn hỏi – <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16D9F3] to-[#087BFF]">Nexis Tech giải đáp</span>
            </h2>
            <p className="body-copy text-[#B5C7DF] mt-2">
              Bạn cần hiểu thêm về dịch vụ thiết kế và phát triển website của Nexis Tech? Tham khảo các câu trả lời dưới đây.
            </p>
          </div>

          {/* Single-Column Accordion List with Motion */}
          <div className="space-y-3.5">
            {NEXIS_BRAND.faqs.map((faq) => {
              const isOpen = openFaqIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl overflow-hidden border border-white/10 glass-panel transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${faq.id}`}
                    className={`w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 transition-colors duration-200 cursor-pointer ${
                      isOpen
                        ? 'bg-gradient-to-r from-[#087BFF] to-[#12B8E6] text-white shadow-sm'
                        : 'bg-[#F3F7FC] hover:bg-slate-100 text-[#030B24]'
                    }`}
                  >
                    <span className="text-base font-semibold leading-snug">
                      {faq.question}
                    </span>
                    <span className="shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-white" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 py-5 bg-white text-slate-600 body-copy border-t border-slate-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 14: BANNER KÊU GỌI HÀNH ĐỘNG CUỐI TRANG
         ===================================================================== */}
      <section className="pt-4 pb-16 sm:pb-20 bg-[#030B24] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden px-6 py-12 sm:px-14 sm:py-16 text-center text-white shadow-[0_24px_60px_rgba(3,11,36,0.45)] border border-white/15"
            style={{
              background:
                'linear-gradient(125deg, #030B24 0%, #071D4E 38%, #087BFF 78%, #12B8E6 100%)',
            }}
          >
            {/* Decorative Subtle Wave Line */}
            <svg
              className="pointer-events-none absolute inset-0 w-full h-full opacity-20"
              viewBox="0 0 1200 360"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,260 C350,320 650,40 1200,110"
                stroke="#16D9F3"
                strokeWidth="1.5"
              />
            </svg>

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="heading-section text-white">
                Bước gần hơn đến thành công của bạn bằng cách trò chuyện với chúng tôi
              </h2>

              <div className="pt-1 flex flex-wrap items-center justify-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onScrollToQuote()}
                  className="px-8 py-3.5 rounded-xl bg-white text-[#087BFF] hover:bg-[#16D9F3] hover:text-[#030B24] text-base font-semibold shadow-lg transition-all duration-200 cursor-pointer"
                >
                  Liên hệ ngay
                </button>

                <a
                  href={NEXIS_BRAND.phoneHref}
                  className="px-6 py-3.5 rounded-xl bg-[#030B24]/80 border border-white/20 hover:border-[#16D9F3] text-base font-medium text-white inline-flex items-center gap-2 transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 text-[#16D9F3]" />
                  <span>{NEXIS_BRAND.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 15: CHÂN TRANG (FOOTER 3 CỘT VỚI THÔNG TIN LIÊN HỆ THỐNG NHẤT)
         ===================================================================== */}
      <footer className="bg-[#030B24] text-[#F4F8FF] pt-12 pb-24 sm:pb-16 border-t border-white/10 next-circuit-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* COLUMN 1 (5 cols): Brand Identity & Unified 3-Item Contact Block */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#071638] border border-[#087BFF]/45 flex items-center justify-center">
                  <svg
                    viewBox="0 0 36 36"
                    className="w-6 h-6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M18 3L31 10.5V25.5L18 33L5 25.5V10.5L18 3Z"
                      stroke="#16D9F3"
                      strokeWidth="2"
                    />
                    <path
                      d="M12.5 24V12L23.5 24V12"
                      stroke="#F4F8FF"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold tracking-tight leading-none">
                    <span className="text-white">NEXIS</span>{' '}
                    <span className="text-[#16D9F3]">TECH</span>
                  </div>
                  <span className="text-[11px] text-[#B5C7DF] block mt-1">
                    {NEXIS_BRAND.tagline}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#B5C7DF] leading-relaxed max-w-md font-normal">
                {NEXIS_BRAND.subMessage} Nexis Tech đồng hành cùng doanh nghiệp xây dựng nền tảng website, ứng dụng web, thương mại điện tử và giải pháp tích hợp AI, Cloud hiện đại.
              </p>

              {/* Unified 3-Item Contact List: Gmail, Số điện thoại, Khu vực */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#16D9F3]">
                  Thông tin liên hệ
                </div>
                <ul className="space-y-2.5 text-sm text-[#B5C7DF]">
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#16D9F3] shrink-0" />
                    <span>
                      <strong className="text-white font-medium">Gmail:</strong>{' '}
                      <a
                        href={NEXIS_BRAND.emailHref}
                        className="text-[#F4F8FF] hover:text-[#16D9F3] transition-colors duration-200 break-all"
                      >
                        {NEXIS_BRAND.emailDisplay}
                      </a>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#16D9F3] shrink-0" />
                    <span>
                      <strong className="text-white font-medium">Số điện thoại:</strong>{' '}
                      <a
                        href={NEXIS_BRAND.phoneHref}
                        className="text-[#16D9F3] hover:underline font-semibold"
                      >
                        {NEXIS_BRAND.phoneDisplay}
                      </a>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#16D9F3] shrink-0" />
                    <span>
                      <strong className="text-white font-medium">Khu vực:</strong>{' '}
                      <span className="text-[#F4F8FF]">{NEXIS_BRAND.locationDisplay}</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* COLUMN 2 (3 cols): Core Services & Quick Navigation */}
            <div className="lg:col-span-3 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-white">
                Dịch vụ chính
              </div>
              <ul className="space-y-2.5 text-sm text-[#B5C7DF]">
                {NEXIS_BRAND.coreServices.map((srv) => (
                  <li key={srv.id}>
                    <button
                      type="button"
                      onClick={() => onScrollToQuote(srv.title)}
                      className="text-left hover:text-[#16D9F3] transition-colors duration-200 cursor-pointer"
                    >
                      {srv.shortTitle}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="pt-3 border-t border-white/10">
                <div className="text-xs font-semibold uppercase tracking-wider text-white mb-2">
                  Điều hướng nhanh
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-[#B5C7DF]">
                  <a href="#gioi-thieu" className="hover:text-[#16D9F3]">
                    Giới thiệu
                  </a>
                  <a href="#loi-ich" className="hover:text-[#16D9F3]">
                    Lợi ích
                  </a>
                  <a href="#tieu-chi" className="hover:text-[#16D9F3]">
                    Tiêu chí
                  </a>
                  <a href="#bo-suu-tap" className="hover:text-[#16D9F3]">
                    Website tham khảo
                  </a>
                  <a href="#kien-thuc" className="hover:text-[#16D9F3]">
                    Kiến thức
                  </a>
                  <a href="#faq" className="hover:text-[#16D9F3]">
                    Giải đáp FAQ
                  </a>
                </div>
              </div>
            </div>

            {/* COLUMN 3 (4 cols): Footer Quick Quote Mini-Form */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-white">
                Gửi yêu cầu tư vấn nhanh
              </div>
              <p className="text-xs text-[#B5C7DF]">
                Để lại thông tin để đội ngũ Nexis Tech liên hệ tư vấn hoặc gọi trực tiếp {NEXIS_BRAND.phoneDisplay}.
              </p>

              <AnimatePresence mode="wait">
                {!footerSubmitted ? (
                  <motion.form
                    key="footer-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleFooterSubmit}
                    noValidate
                    className="space-y-2.5"
                  >
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={footerForm.websiteUrl || ''}
                        onChange={(e) => handleFooterChange('websiteUrl', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        maxLength={FIELD_LIMITS.FULL_NAME_MAX}
                        disabled={footerIsSubmitting}
                        value={footerForm.fullName}
                        onChange={(e) => handleFooterChange('fullName', e.target.value)}
                        placeholder="Họ và tên *"
                        aria-label="Họ và tên"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#071638] border border-white/15 text-xs text-white placeholder:text-[#B5C7DF]/60 focus:outline-1 focus:outline-[#16D9F3] disabled:opacity-70"
                      />
                      <input
                        type="tel"
                        maxLength={FIELD_LIMITS.PHONE_MAX}
                        disabled={footerIsSubmitting}
                        value={footerForm.phone}
                        onChange={(e) => handleFooterChange('phone', e.target.value)}
                        placeholder="Số điện thoại *"
                        aria-label="Số điện thoại"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#071638] border border-white/15 text-xs text-white placeholder:text-[#B5C7DF]/60 focus:outline-1 focus:outline-[#16D9F3] disabled:opacity-70"
                      />
                    </div>

                    <select
                      disabled={footerIsSubmitting}
                      value={footerForm.serviceType}
                      onChange={(e) => handleFooterChange('serviceType', e.target.value)}
                      aria-label="Chọn dịch vụ"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#071638] border border-white/15 text-xs text-white focus:outline-1 focus:outline-[#16D9F3] disabled:opacity-70 cursor-pointer"
                    >
                      {NEXIS_BRAND.coreServices.map((s) => (
                        <option key={s.id} value={s.shortTitle}>
                          {s.shortTitle}
                        </option>
                      ))}
                    </select>

                    <textarea
                      rows={2}
                      maxLength={FIELD_LIMITS.MESSAGE_MAX}
                      disabled={footerIsSubmitting}
                      value={footerForm.message}
                      onChange={(e) => handleFooterChange('message', e.target.value)}
                      placeholder="Mô tả nhu cầu (tùy chọn)..."
                      aria-label="Mô tả nhu cầu"
                      className="w-full px-3 py-2 rounded-xl bg-[#071638] border border-white/15 text-xs text-white placeholder:text-[#B5C7DF]/60 focus:outline-1 focus:outline-[#16D9F3] disabled:opacity-70"
                    />

                    {(footerErrors.fullName || footerErrors.phone || footerErrors.message || footerSubmitError) && (
                      <motion.div
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="alert"
                        className="text-[11px] text-amber-300 flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {footerErrors.fullName ||
                            footerErrors.phone ||
                            footerErrors.message ||
                            footerSubmitError}
                        </span>
                      </motion.div>
                    )}

                    <div className="pt-1 flex items-center gap-2.5">
                      <button
                        type="submit"
                        disabled={footerIsSubmitting}
                        className="px-5 py-2.5 rounded-xl text-xs font-medium text-white next-glow-pill disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-1.5"
                      >
                        {footerIsSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Đang gửi…</span>
                          </>
                        ) : (
                          <span>Gửi yêu cầu tư vấn</span>
                        )}
                      </button>
                      <a
                        href={NEXIS_BRAND.phoneHref}
                        className="px-4 py-2.5 rounded-xl bg-[#071638] border border-white/15 hover:border-[#16D9F3] text-xs font-medium text-[#F4F8FF] inline-flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#16D9F3]" />
                        <span>{NEXIS_BRAND.phoneDisplay}</span>
                      </a>
                    </div>

                    <p className="text-[11px] text-[#B5C7DF]/90">
                      Thông tin của bạn được dùng để liên hệ tư vấn theo yêu cầu.
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="footer-success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-[#071638] border border-[#16D9F3]/40 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between text-[#16D9F3] font-semibold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mã: {footerSubmitted.requestCode}</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleResetFooterForm}
                        className="underline text-[#B5C7DF] hover:text-white cursor-pointer"
                      >
                        Gửi yêu cầu mới
                      </button>
                    </div>
                    <p className="text-white font-medium">
                      {footerSubmitted.message}
                    </p>
                    <p className="text-[11px] text-[#B5C7DF]">
                      Thông tin của bạn được dùng để liên hệ tư vấn theo yêu cầu.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B5C7DF]">
            <p>© 2026 {NEXIS_BRAND.brandName} — {NEXIS_BRAND.tagline}</p>
            <div className="flex items-center gap-4">
              <a href={NEXIS_BRAND.emailHref} className="hover:text-[#16D9F3]">
                {NEXIS_BRAND.emailDisplay}
              </a>
              <span>·</span>
              <a href={NEXIS_BRAND.phoneHref} className="hover:text-[#16D9F3]">
                {NEXIS_BRAND.phoneDisplay}
              </a>
              <span>·</span>
              <span>{NEXIS_BRAND.locationDisplay}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          SECTION 16: CỤM NÚT HÀNH ĐỘNG NỔI (GỌI ĐIỆN, GỬI EMAIL, LÊN ĐẦU TRANG)
         ===================================================================== */}
      <div
        className="fixed right-3 sm:right-5 bottom-4 sm:bottom-6 z-40 flex flex-col items-center gap-2.5"
        aria-label="Công cụ liên hệ nhanh"
      >
        {/* 1. Nút gọi điện */}
        <motion.a
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          href={NEXIS_BRAND.phoneHref}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full next-glow-pill text-white flex items-center justify-center shadow-lg focus-visible:outline-2 focus-visible:outline-white"
          aria-label={`Gọi điện tư vấn: ${NEXIS_BRAND.phoneDisplay}`}
          title={`Gọi ngay: ${NEXIS_BRAND.phoneDisplay}`}
        >
          <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.a>

        {/* 2. Nút gửi email */}
        <motion.a
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          href={NEXIS_BRAND.emailHref}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#071638]/95 border border-[#16D9F3]/45 hover:bg-[#087BFF] text-[#16D9F3] hover:text-white flex items-center justify-center shadow-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#16D9F3]"
          aria-label={`Gửi email: ${NEXIS_BRAND.emailDisplay}`}
          title={`Gửi email: ${NEXIS_BRAND.emailDisplay}`}
        >
          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.a>

        {/* 3. Nút lên đầu trang */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#030B24]/90 border border-white/20 hover:border-[#16D9F3] text-white flex items-center justify-center shadow-md transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#16D9F3]"
          aria-label="Cuộn lên đầu trang"
          title="Lên đầu trang"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      </div>
    </>
  );
};

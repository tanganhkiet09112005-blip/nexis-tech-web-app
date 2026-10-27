/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Section 11: Industry Solutions Slider (iMac + Smartphone + MacBook 3-Device Showcase)
 * Section 12: Contact & Quote Form (Unified 3-item contact block: Gmail, Số điện thoại, Khu vực TP. Hồ Chí Minh)
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { NEXIS_BRAND } from '../config/brand.ts';
import {
  validateQuoteForm,
  QuoteFormInput,
  getWrappedIndex,
  FIELD_LIMITS,
} from '../utils/validation.ts';
import {
  generateIdempotencyKey,
  submitConsultationRequest,
  ConsultationSubmitResponse,
} from '../utils/consultationApi.ts';

interface SolutionsAndQuoteProps {
  preselectedService?: string;
}

export const SolutionsAndQuote: React.FC<SolutionsAndQuoteProps> = ({
  preselectedService,
}) => {
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const solutions = NEXIS_BRAND.industrySolutions;
  const currentSolution = solutions[solutionIndex] || solutions[0];

  const [formData, setFormData] = useState<QuoteFormInput>({
    fullName: '',
    phone: '',
    serviceType: preselectedService || NEXIS_BRAND.coreServices[0].title,
    message: '',
    websiteUrl: '',
  });

  const [idempotencyKey, setIdempotencyKey] = useState<string>(() =>
    generateIdempotencyKey()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormInput, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<{
    form: QuoteFormInput;
    response: ConsultationSubmitResponse;
  } | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({
        ...prev,
        serviceType: preselectedService,
      }));
    }
  }, [preselectedService]);

  const handleFieldChange = (field: keyof QuoteFormInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitError(null);
    const validation = validateQuoteForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const result = await submitConsultationRequest(
      {
        ...formData,
        sourcePage: 'Khu vực đăng ký tư vấn (#bao-gia)',
      },
      idempotencyKey
    );

    setIsSubmitting(false);

    if (!result.ok) {
      if (result.errors) {
        setErrors(result.errors);
      }
      setSubmitError(result.message);
      return;
    }

    setSubmittedRecord({
      form: {
        ...formData,
        fullName: validation.normalized.fullName,
        phone: validation.normalized.phone,
      },
      response: result,
    });
  };

  const handleResetNewRequest = () => {
    setSubmittedRecord(null);
    setSubmitError(null);
    setErrors({});
    setIdempotencyKey(generateIdempotencyKey());
    setFormData({
      fullName: '',
      phone: '',
      serviceType: preselectedService || NEXIS_BRAND.coreServices[0].title,
      message: '',
      websiteUrl: '',
    });
  };

  const scrollToQuoteForm = (industryTitle: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceType: `${NEXIS_BRAND.coreServices[0].shortTitle} (${industryTitle})`,
    }));
    const formEl = document.getElementById('bao-gia');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        setSolutionIndex((prev) => getWrappedIndex(prev, -1, solutions.length));
      } else {
        setSolutionIndex((prev) => getWrappedIndex(prev, 1, solutions.length));
      }
    }
    setTouchStartX(null);
  };

  return (
    <div
      className="relative overflow-hidden text-[#F4F8FF] bg-[#030B24]"
      style={{
        background:
          'linear-gradient(180deg, #041030 0%, #071D4F 42%, #061539 72%, #030B24 100%)',
      }}
    >
      {/* Decorative Curved Tech Wave Line */}
      <svg
        className="pointer-events-none absolute top-[22%] left-0 w-full h-64 opacity-20"
        viewBox="0 0 1440 320"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,192 C360,64 1080,288 1440,96"
          stroke="#16D9F3"
          strokeWidth="1.5"
        />
      </svg>

      {/* =====================================================================
          SECTION 11: GIẢI PHÁP THEO NGÀNH (3-Device iMac + Phone + MacBook Slider)
         ===================================================================== */}
      <section
        id="giai-phap-nganh"
        className="pt-16 sm:pt-24 pb-16 relative z-10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Centered Industry Copy */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block text-xs font-medium text-[#16D9F3] bg-[#071638] border border-white/10 px-3.5 py-1 rounded-full">
              {currentSolution.kicker}
            </span>

            <h2 className="heading-section text-white">
              {currentSolution.title}
            </h2>

            <p className="body-copy text-[#B5C7DF]">
              {currentSolution.description}
            </p>

            {/* Industry Quick Switch Tabs */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
              {solutions.map((sol, idx) => (
                <button
                  key={sol.id}
                  type="button"
                  onClick={() => setSolutionIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    solutionIndex === idx
                      ? 'bg-[#087BFF] text-white shadow-sm'
                      : 'bg-white/10 text-[#F4F8FF] border border-white/10 hover:bg-white/15'
                  }`}
                >
                  {sol.industryTag}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => scrollToQuoteForm(currentSolution.industryTag)}
                className="px-7 py-3 rounded-xl text-sm font-medium text-white next-glow-pill cursor-pointer"
              >
                Nhận tư vấn giải pháp này
              </button>
            </div>
          </div>

          {/* 3-Device Showcase (iMac Monitor + Smartphone + MacBook) */}
          <div className="mt-12 sm:mt-14 relative max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            {/* Left Prev Arrow */}
            <button
              type="button"
              onClick={() =>
                setSolutionIndex((prev) => getWrappedIndex(prev, -1, solutions.length))
              }
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/20 hover:bg-[#087BFF] text-white flex items-center justify-center shrink-0 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#16D9F3]"
              aria-label="Giải pháp ngành trước"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Center 3-Device Composition */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              {/* LEFT: Large Desktop iMac Monitor (7 cols) */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <div className="w-full bg-[#0F172A] border-[4px] border-[#334155] rounded-2xl p-2 sm:p-3 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                  <div className="bg-white rounded-xl overflow-hidden text-[#030B24]">
                    {/* Top Store Bar */}
                    <div className="px-3.5 py-2 bg-[#030B24] text-white flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#16D9F3]">
                        {currentSolution.desktopScreen.brandHeader}
                      </span>
                      <div className="hidden sm:flex items-center gap-2 bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] text-[#B5C7DF]">
                        <span>Tìm kiếm danh mục...</span>
                      </div>
                      <span className="text-[10px] text-[#16D9F3] font-medium">
                        {NEXIS_BRAND.phoneDisplay}
                      </span>
                    </div>

                    {/* Store Body Split: Sidebar Categories + Main Hero & Products */}
                    <div className="grid grid-cols-12 p-3 gap-3 bg-[#F3F7FC]">
                      {/* Left Category Sidebar */}
                      <div className="hidden sm:block col-span-3 bg-white rounded-lg p-2.5 border border-slate-200/80 space-y-1.5 text-left">
                        <div className="text-[10px] font-semibold text-[#087BFF] pb-1 border-b border-slate-100">
                          Danh mục chính
                        </div>
                        {currentSolution.desktopScreen.categories.map((cat, idx) => (
                          <div
                            key={idx}
                            className="text-[10px] font-medium text-slate-700 py-1 px-1.5 rounded hover:bg-slate-100 flex items-center justify-between"
                          >
                            <span className="truncate">{cat}</span>
                            <span className="text-[#087BFF]">›</span>
                          </div>
                        ))}
                      </div>

                      {/* Right Main Banner & 3 Product Cards */}
                      <div className="col-span-12 sm:col-span-9 space-y-2.5">
                        <div
                          className="rounded-lg p-3.5 text-white text-left"
                          style={{
                            background:
                              'linear-gradient(120deg, #030B24 0%, #071638 55%, #087BFF 100%)',
                          }}
                        >
                          <span className="text-[10px] font-medium text-[#16D9F3] block">
                            {currentSolution.industryTag}
                          </span>
                          <div className="text-xs sm:text-sm font-semibold mt-0.5">
                            {currentSolution.desktopScreen.heroHeadline}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {currentSolution.desktopScreen.products.map((prod, idx) => (
                            <div
                              key={idx}
                              className="bg-white rounded-lg p-2 border border-slate-200/80 text-left"
                            >
                              <span className="inline-block text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#087BFF]/10 text-[#087BFF]">
                                {prod.tag}
                              </span>
                              <div className="text-[10px] font-semibold text-[#030B24] mt-1 truncate">
                                {prod.name}
                              </div>
                              <div className="text-[9px] text-slate-500 truncate mt-0.5">
                                {prod.spec}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* iMac Aluminum Stand */}
                <div className="w-16 h-6 bg-gradient-to-b from-slate-500 to-slate-400" />
                <div className="w-28 h-2 bg-slate-300 rounded-full shadow-md" />
              </div>

              {/* RIGHT: Smartphone + MacBook Pair (5 cols) */}
              <div className="lg:col-span-5 flex items-end justify-center gap-3">
                {/* Smartphone Mockup */}
                <div className="w-32 sm:w-36 bg-[#0F172A] border-[3px] border-[#334155] rounded-2xl p-1.5 shadow-2xl shrink-0">
                  <div className="bg-white rounded-xl p-2.5 text-[#030B24] space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-[#030B24] truncate">
                        {currentSolution.desktopScreen.brandHeader}
                      </span>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-[#030B24] to-[#087BFF] p-2.5 text-white">
                      <span className="text-[9px] text-[#16D9F3] block">Giao diện di động</span>
                      <span className="text-[10px] font-semibold leading-tight block mt-0.5">
                        {currentSolution.mobileScreen.title}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {currentSolution.mobileScreen.bullets.map((b, i) => (
                        <div
                          key={i}
                          className="text-[9px] text-slate-600 bg-slate-50 px-1.5 py-1 rounded border border-slate-100 truncate"
                        >
                          ✓ {b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Secondary MacBook Mockup */}
                <div className="hidden sm:flex flex-col items-center flex-1 max-w-[240px]">
                  <div className="w-full bg-[#0F172A] border-[3px] border-[#334155] rounded-t-xl p-2 shadow-2xl">
                    <div className="bg-white rounded-lg p-2.5 text-[#030B24] text-left space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span className="text-[9px] font-semibold text-[#030B24]">
                          {currentSolution.desktopScreen.brandHeader}
                        </span>
                        <span className="text-[8px] text-[#087BFF] font-medium">Full-stack</span>
                      </div>
                      <div className="rounded bg-gradient-to-r from-[#030B24] to-[#087BFF] p-2 text-white">
                        <div className="text-[8px] text-[#16D9F3]">Nexis Tech</div>
                        <div className="text-[9px] font-semibold truncate">
                          {currentSolution.desktopScreen.heroHeadline}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {currentSolution.desktopScreen.products.slice(0, 2).map((p, idx) => (
                          <div key={idx} className="bg-slate-50 rounded p-1.5 border border-slate-200">
                            <div className="text-[8px] font-semibold text-[#030B24] truncate">
                              {p.name}
                            </div>
                            <div className="text-[7px] text-slate-500 truncate">{p.spec}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-[106%] h-2.5 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500 rounded-b-lg shadow" />
                </div>
              </div>
            </div>

            {/* Right Next Arrow */}
            <button
              type="button"
              onClick={() =>
                setSolutionIndex((prev) => getWrappedIndex(prev, 1, solutions.length))
              }
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/20 hover:bg-[#087BFF] text-white flex items-center justify-center shrink-0 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#16D9F3]"
              aria-label="Giải pháp ngành tiếp theo"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-8">
            {solutions.map((sol, idx) => (
              <button
                key={sol.id}
                type="button"
                onClick={() => setSolutionIndex(idx)}
                aria-label={`Chọn giải pháp ${sol.industryTag}`}
                className={`rounded-full transition-all duration-200 cursor-pointer ${
                  solutionIndex === idx
                    ? 'w-7 h-2.5 bg-[#16D9F3]'
                    : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 12: KHU VỰC ĐĂNG KÝ NHẬN BÁO GIÁ / TƯ VẤN (THÔNG TIN LIÊN HỆ THỐNG NHẤT)
         ===================================================================== */}
      <section
        id="bao-gia"
        className="pt-8 pb-20 sm:pb-28 relative z-10 border-t border-white/10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* LEFT COLUMN (5 cols): Heading, Guidance & 3 Unified Contact Items */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="inline-block text-xs font-medium text-[#16D9F3] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  Tư vấn dự án
                </span>
                <h2 className="heading-section text-white">
                  Đăng ký tư vấn và{' '}
                  <span className="text-[#16D9F3]">nhận báo giá thiết kế web</span>
                </h2>
              </div>

              <p className="body-copy text-[#B5C7DF]">
                Hãy để lại thông tin hoặc liên hệ trực tiếp qua điện thoại và email dưới đây để trao đổi nhu cầu thiết kế, phát triển website cùng đội ngũ <span className="text-white font-medium">Nexis Tech</span>.
              </p>

              {/* Unified 3-Item Contact Block: Gmail, Số điện thoại, Khu vực */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#071638]/90 border border-white/15 space-y-4">
                {/* 1. Gmail */}
                <a
                  href={NEXIS_BRAND.emailHref}
                  className="flex items-center gap-3.5 group"
                >
                  <span className="w-10 h-10 rounded-xl bg-[#087BFF]/20 border border-[#16D9F3]/35 flex items-center justify-center text-[#16D9F3] shrink-0 group-hover:bg-[#087BFF] group-hover:text-white transition-colors duration-200">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-[#B5C7DF] block">
                      Gmail
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#16D9F3] transition-colors duration-200 break-all">
                      {NEXIS_BRAND.emailDisplay}
                    </span>
                  </div>
                </a>

                {/* 2. Số điện thoại */}
                <a
                  href={NEXIS_BRAND.phoneHref}
                  className="flex items-center gap-3.5 group"
                >
                  <span className="w-10 h-10 rounded-xl bg-[#087BFF]/20 border border-[#16D9F3]/35 flex items-center justify-center text-[#16D9F3] shrink-0 group-hover:bg-[#087BFF] group-hover:text-white transition-colors duration-200">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-xs font-medium text-[#B5C7DF] block">
                      Số điện thoại
                    </span>
                    <span className="text-base sm:text-lg font-bold text-white group-hover:text-[#16D9F3] transition-colors duration-200">
                      {NEXIS_BRAND.phoneDisplay}
                    </span>
                  </div>
                </a>

                {/* 3. Khu vực */}
                <div className="flex items-center gap-3.5">
                  <span className="w-10 h-10 rounded-xl bg-[#087BFF]/20 border border-[#16D9F3]/35 flex items-center justify-center text-[#16D9F3] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-xs font-medium text-[#B5C7DF] block">
                      Khu vực
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {NEXIS_BRAND.locationDisplay}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (7 cols): Consultation Form */}
            <div className="lg:col-span-7">
              {!submittedRecord ? (
                <form
                  onSubmit={handleQuoteSubmit}
                  noValidate
                  className="space-y-4"
                >
                  {/* Honeypot field for spam protection */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="quote-website-url">Website</label>
                    <input
                      id="quote-website-url"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.websiteUrl || ''}
                      onChange={(e) => handleFieldChange('websiteUrl', e.target.value)}
                    />
                  </div>

                  {/* Field 1: Họ tên (Bắt buộc) */}
                  <div>
                    <label htmlFor="quote-fullname" className="block text-xs font-medium text-[#B5C7DF] mb-1.5">
                      Họ và tên <span className="text-[#16D9F3]">*</span>
                    </label>
                    <input
                      id="quote-fullname"
                      type="text"
                      maxLength={FIELD_LIMITS.FULL_NAME_MAX}
                      disabled={isSubmitting}
                      value={formData.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      placeholder="Nhập họ và tên của bạn *"
                      className={`w-full px-4 py-3.5 rounded-xl bg-white text-[#030B24] placeholder:text-slate-400 text-base font-normal focus:outline-2 focus:outline-[#16D9F3] transition-all disabled:opacity-70 ${
                        errors.fullName ? 'ring-2 ring-amber-400' : ''
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-amber-300 flex items-center gap-1.5 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Field 2: Số điện thoại (Bắt buộc) */}
                  <div>
                    <label htmlFor="quote-phone" className="block text-xs font-medium text-[#B5C7DF] mb-1.5">
                      Số điện thoại liên hệ <span className="text-[#16D9F3]">*</span>
                    </label>
                    <input
                      id="quote-phone"
                      type="tel"
                      maxLength={FIELD_LIMITS.PHONE_MAX}
                      disabled={isSubmitting}
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="Ví dụ: 0909 858 428 *"
                      className={`w-full px-4 py-3.5 rounded-xl bg-white text-[#030B24] placeholder:text-slate-400 text-base font-normal focus:outline-2 focus:outline-[#16D9F3] transition-all disabled:opacity-70 ${
                        errors.phone ? 'ring-2 ring-amber-400' : ''
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-amber-300 flex items-center gap-1.5 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Field 3: Loại website (Tùy chọn) */}
                  <div>
                    <label htmlFor="quote-service" className="block text-xs font-medium text-[#B5C7DF] mb-1.5">
                      Loại website quan tâm (tùy chọn)
                    </label>
                    <select
                      id="quote-service"
                      disabled={isSubmitting}
                      value={formData.serviceType}
                      onChange={(e) => handleFieldChange('serviceType', e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-white text-[#030B24] text-base font-medium focus:outline-2 focus:outline-[#16D9F3] cursor-pointer disabled:opacity-70"
                    >
                      {NEXIS_BRAND.coreServices.map((srv) => (
                        <option key={srv.id} value={srv.title}>
                          {srv.title}
                        </option>
                      ))}
                      <option value="Chưa xác định — Cần tư vấn thêm">
                        Chưa xác định — Cần tư vấn thêm
                      </option>
                    </select>
                  </div>

                  {/* Field 4: Mô tả nhu cầu (Tùy chọn) */}
                  <div>
                    <label htmlFor="quote-message" className="block text-xs font-medium text-[#B5C7DF] mb-1.5">
                      Mô tả nhu cầu (tùy chọn)
                    </label>
                    <textarea
                      id="quote-message"
                      rows={4}
                      maxLength={FIELD_LIMITS.MESSAGE_MAX}
                      disabled={isSubmitting}
                      value={formData.message}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      placeholder="Chia sẻ ngắn gọn về lĩnh vực kinh doanh hoặc tính năng website bạn mong muốn..."
                      className="w-full px-4 py-3.5 rounded-xl bg-white text-[#030B24] placeholder:text-slate-400 text-base font-normal focus:outline-2 focus:outline-[#16D9F3] transition-all disabled:opacity-70"
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-amber-300 flex items-center gap-1.5 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Error Alert when submission fails (preserves typed fields) */}
                  {submitError && (
                    <div
                      role="alert"
                      className="px-4 py-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs sm:text-sm flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Submit & Direct Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 rounded-xl bg-white text-[#087BFF] hover:bg-[#16D9F3] hover:text-[#030B24] disabled:opacity-70 disabled:cursor-not-allowed text-base font-semibold shadow-lg transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Đang gửi…</span>
                        </>
                      ) : (
                        <span>Gửi yêu cầu tư vấn</span>
                      )}
                    </button>

                    <a
                      href={NEXIS_BRAND.phoneHref}
                      className="px-5 py-3.5 rounded-xl bg-[#071638] border border-white/15 hover:border-[#16D9F3] text-sm font-medium text-white inline-flex items-center gap-2 transition-colors duration-200"
                    >
                      <Phone className="w-4 h-4 text-[#16D9F3]" />
                      <span>Gọi {NEXIS_BRAND.phoneDisplay}</span>
                    </a>

                    <a
                      href={NEXIS_BRAND.emailHref}
                      className="px-5 py-3.5 rounded-xl bg-[#071638] border border-white/15 hover:border-[#16D9F3] text-sm font-medium text-white inline-flex items-center gap-2 transition-colors duration-200"
                    >
                      <Mail className="w-4 h-4 text-[#16D9F3]" />
                      <span>Gửi email</span>
                    </a>
                  </div>

                  {/* Privacy Note required by Section 2 */}
                  <p className="text-xs text-[#B5C7DF] pt-1">
                    Thông tin của bạn được dùng để liên hệ tư vấn theo yêu cầu.
                  </p>
                </form>
              ) : (
                /* Accepted Consultation Card */
                <div
                  role="region"
                  aria-live="polite"
                  className="bg-white text-[#030B24] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-emerald-700 block">
                          Mã yêu cầu: {submittedRecord.response.requestCode}
                        </span>
                        <h3 className="text-lg font-semibold text-[#030B24]">
                          {submittedRecord.response.message}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetNewRequest}
                      className="text-xs font-medium text-slate-600 hover:text-[#087BFF] inline-flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Gửi yêu cầu mới</span>
                    </button>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F3F7FC] p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <dt className="text-slate-500 font-medium">Họ và tên:</dt>
                      <dd className="font-semibold text-[#030B24] mt-0.5 text-sm">
                        {submittedRecord.form.fullName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 font-medium">Số điện thoại:</dt>
                      <dd className="font-semibold text-[#030B24] mt-0.5 text-sm">
                        {submittedRecord.form.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 font-medium">Loại website quan tâm:</dt>
                      <dd className="font-semibold text-[#087BFF] mt-0.5 text-sm">
                        {submittedRecord.form.serviceType || 'Chưa chọn'}
                      </dd>
                    </div>
                    {submittedRecord.response.createdAtVn && (
                      <div>
                        <dt className="text-slate-500 font-medium">Thời gian tiếp nhận:</dt>
                        <dd className="font-medium text-slate-700 mt-0.5 text-sm">
                          {submittedRecord.response.createdAtVn}
                        </dd>
                      </div>
                    )}
                    {submittedRecord.form.message && (
                      <div className="sm:col-span-2">
                        <dt className="text-slate-500 font-medium">Mô tả nhu cầu:</dt>
                        <dd className="text-slate-700 mt-0.5 whitespace-pre-line text-sm">
                          {submittedRecord.form.message}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <p className="text-xs text-slate-500">
                    Thông tin của bạn được dùng để liên hệ tư vấn theo yêu cầu.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

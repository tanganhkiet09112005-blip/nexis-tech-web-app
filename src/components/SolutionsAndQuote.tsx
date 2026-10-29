/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Section 11: Industry Solutions Slider (iMac + Smartphone + MacBook 3-Device Showcase)
 * Section 12: Contact & Quote Form (Unified contact block: Gmail, 2 Điện thoại, Zalo 2 người, Facebook, Khu vực)
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
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  onOpenZaloModal?: () => void;
}

export const SolutionsAndQuote: React.FC<SolutionsAndQuoteProps> = ({
  preselectedService,
  onOpenZaloModal,
}) => {
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
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
      form: { ...formData },
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

  const handlePrevSolution = () => {
    setSlideDirection('left');
    setSolutionIndex((prev) => getWrappedIndex(prev, -1, solutions.length));
  };

  const handleNextSolution = () => {
    setSlideDirection('right');
    setSolutionIndex((prev) => getWrappedIndex(prev, 1, solutions.length));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) handlePrevSolution();
      else handleNextSolution();
    }
    setTouchStartX(null);
  };

  const scrollToQuoteForm = (serviceTitle?: string) => {
    if (serviceTitle) {
      setFormData((prev) => ({ ...prev, serviceType: serviceTitle }));
    }
    const el = document.getElementById('bao-gia');
    if (el) {
      const headerOffset = 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* =====================================================================
          SECTION 11: GIẢI PHÁP THEO LĨNH VỰC (3-DEVICE SHOWCASE SLIDER)
         ===================================================================== */}
      <section
        id="giai-phap"
        className="py-16 sm:py-24 bg-[#F5F7FA] dark:bg-[#0B1120] text-[#172033] dark:text-[#E8EDF5] border-b border-slate-200/80 dark:border-white/10 overflow-hidden transition-colors duration-200"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Section Kicker + Active Title */}
          <div className="max-w-3xl mx-auto space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSolution.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3"
              >
                <span className="inline-block text-xs font-medium text-[#087BFF] dark:text-[#16D9F3] bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 px-3.5 py-1 rounded-full shadow-xs">
                  {currentSolution.kicker}
                </span>

                <h2 className="heading-section text-slate-900 dark:text-white">
                  {currentSolution.title}
                </h2>

                <p className="body-copy text-slate-600 dark:text-[#A5B2C7]">
                  {currentSolution.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Industry Quick Switch Tabs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              {solutions.map((sol, idx) => (
                <button
                  key={sol.id}
                  type="button"
                  onClick={() => {
                    setSlideDirection(idx > solutionIndex ? 'right' : 'left');
                    setSolutionIndex(idx);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    solutionIndex === idx
                      ? 'bg-[#087BFF] text-white shadow-xs'
                      : 'bg-white dark:bg-[#111827] text-slate-700 dark:text-[#E8EDF5] border border-slate-200 dark:border-white/10 hover:border-[#087BFF]'
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

          {/* 3-Device Showcase with Motion */}
          <div className="mt-12 sm:mt-14 relative max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            {/* Left Prev Arrow */}
            <button
              type="button"
              onClick={handlePrevSolution}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/20 hover:bg-[#087BFF] hover:border-[#087BFF] text-slate-800 dark:text-white hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#087BFF]"
              aria-label="Giải pháp ngành trước"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Center 3-Device Composition with Motion Transition */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSolution.id}
                  initial={{ opacity: 0, x: slideDirection === 'right' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDirection === 'right' ? -20 : 20 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end"
                >
                  {/* LEFT: Large Desktop iMac Monitor (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col items-center">
                    <div className="w-full bg-[#0F172A] border-[4px] border-[#334155] rounded-2xl p-2 sm:p-3 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
                      <div className="bg-white rounded-xl overflow-hidden text-[#030B24]">
                        {/* Top Store Bar */}
                        <div className="px-3.5 py-2 bg-[#0B1120] text-white flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-[#16D9F3]">
                            {currentSolution.desktopScreen.brandHeader}
                          </span>
                          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] text-[#B5C7DF]">
                            <span>Tìm kiếm danh mục...</span>
                          </div>
                          <span className="text-[10px] text-[#16D9F3] font-medium">
                            {NEXIS_BRAND.phone1}
                          </span>
                        </div>

                        {/* Store Body Split: Sidebar Categories + Main Hero & Products */}
                        <div className="grid grid-cols-12 p-3 gap-3 bg-[#F5F7FA]">
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
                                  'linear-gradient(120deg, #0B1120 0%, #111827 55%, #087BFF 100%)',
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
                        <div className="rounded-lg bg-gradient-to-br from-[#0B1120] to-[#087BFF] p-2.5 text-white">
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
                          <div className="rounded bg-gradient-to-r from-[#0B1120] to-[#087BFF] p-2 text-white">
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
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Next Arrow */}
            <button
              type="button"
              onClick={handleNextSolution}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/20 hover:bg-[#087BFF] hover:border-[#087BFF] text-slate-800 dark:text-white hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#087BFF]"
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
                onClick={() => {
                  setSlideDirection(idx > solutionIndex ? 'right' : 'left');
                  setSolutionIndex(idx);
                }}
                aria-label={`Chọn giải pháp ${sol.industryTag}`}
                className={`rounded-full transition-all duration-200 cursor-pointer ${
                  solutionIndex === idx
                    ? 'w-7 h-2.5 bg-[#087BFF] dark:bg-[#16D9F3]'
                    : 'w-2.5 h-2.5 bg-slate-300 dark:bg-white/30 hover:bg-slate-400'
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
        className="py-16 sm:py-24 bg-white dark:bg-[#111827] text-[#172033] dark:text-[#E8EDF5] relative z-10 transition-colors duration-200"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* LEFT COLUMN (5 cols): Heading, Guidance & Unified Contact Items */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="inline-block text-xs font-medium text-[#087BFF] dark:text-[#16D9F3] bg-[#087BFF]/10 dark:bg-[#087BFF]/20 px-3 py-1 rounded-full">
                  Tư vấn dự án
                </span>
                <h2 className="heading-section text-slate-900 dark:text-white">
                  Đăng ký tư vấn và{' '}
                  <span className="text-[#087BFF] dark:text-[#16D9F3]">nhận báo giá thiết kế web</span>
                </h2>
              </div>

              <p className="body-copy text-slate-600 dark:text-[#A5B2C7]">
                Hãy để lại thông tin hoặc liên hệ trực tiếp qua điện thoại, email, Zalo và Facebook dưới đây để trao đổi nhu cầu cùng đội ngũ <span className="font-semibold text-slate-900 dark:text-white">Nexis Tech</span>.
              </p>

              {/* Unified Contact Block: Gmail, 2 Hotline, Zalo Selector, Facebook, Khu vực */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#F5F7FA] dark:bg-[#0B1120] border border-slate-200 dark:border-white/10 space-y-4">
                {/* 1. Gmail */}
                <a
                  href={NEXIS_BRAND.emailHref}
                  className="flex items-center gap-3.5 group"
                >
                  <span className="w-10 h-10 rounded-xl bg-[#087BFF]/15 border border-[#087BFF]/30 flex items-center justify-center text-[#087BFF] dark:text-[#16D9F3] shrink-0 group-hover:bg-[#087BFF] group-hover:text-white transition-colors duration-200">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-slate-500 dark:text-[#A5B2C7] block">
                      Email chính thức
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white group-hover:text-[#087BFF] dark:group-hover:text-[#16D9F3] transition-colors duration-200 break-all">
                      {NEXIS_BRAND.emailDisplay}
                    </span>
                  </div>
                </a>

                {/* 2. Hotline 1 */}
                <a
                  href={NEXIS_BRAND.phone1Href}
                  className="flex items-center gap-3.5 group"
                >
                  <span className="w-10 h-10 rounded-xl bg-[#087BFF]/15 border border-[#087BFF]/30 flex items-center justify-center text-[#087BFF] dark:text-[#16D9F3] shrink-0 group-hover:bg-[#087BFF] group-hover:text-white transition-colors duration-200">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-[#A5B2C7] block">
                      Điện thoại 1
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#087BFF] dark:group-hover:text-[#16D9F3] transition-colors duration-200">
                      {NEXIS_BRAND.phone1}
                    </span>
                  </div>
                </a>

                {/* 3. Hotline 2 */}
                <a
                  href={NEXIS_BRAND.phone2Href}
                  className="flex items-center gap-3.5 group"
                >
                  <span className="w-10 h-10 rounded-xl bg-[#087BFF]/15 border border-[#087BFF]/30 flex items-center justify-center text-[#087BFF] dark:text-[#16D9F3] shrink-0 group-hover:bg-[#087BFF] group-hover:text-white transition-colors duration-200">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-[#A5B2C7] block">
                      Điện thoại 2
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#087BFF] dark:group-hover:text-[#16D9F3] transition-colors duration-200">
                      {NEXIS_BRAND.phone2}
                    </span>
                  </div>
                </a>

                {/* 4. Zalo Advisor Selector */}
                <button
                  type="button"
                  onClick={onOpenZaloModal}
                  className="w-full flex items-center gap-3.5 group text-left cursor-pointer"
                >
                  <span className="w-10 h-10 rounded-xl bg-[#087BFF]/15 border border-[#087BFF]/30 flex items-center justify-center text-[#087BFF] dark:text-[#16D9F3] shrink-0 group-hover:bg-[#087BFF] group-hover:text-white transition-colors duration-200">
                    <MessageSquare className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-[#A5B2C7] block">
                      Tư vấn qua Zalo
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white group-hover:text-[#087BFF] dark:group-hover:text-[#16D9F3] transition-colors duration-200 flex items-center gap-1.5">
                      <span>Chọn người tư vấn Zalo</span>
                      <span className="text-xs font-normal text-[#087BFF] dark:text-[#16D9F3] bg-[#087BFF]/10 px-2 py-0.5 rounded-md">
                        2 tư vấn viên
                      </span>
                    </span>
                  </div>
                </button>

                {/* 5. Facebook Official */}
                <a
                  href={NEXIS_BRAND.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 group"
                >
                  <span className="w-10 h-10 rounded-xl bg-[#087BFF]/15 border border-[#087BFF]/30 flex items-center justify-center text-[#087BFF] dark:text-[#16D9F3] shrink-0 group-hover:bg-[#087BFF] group-hover:text-white transition-colors duration-200">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </span>
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-[#A5B2C7] block">
                      Facebook
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white group-hover:text-[#087BFF] dark:group-hover:text-[#16D9F3] transition-colors duration-200 flex items-center gap-1.5">
                      <span>{NEXIS_BRAND.facebookDisplay}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </span>
                  </div>
                </a>

                {/* 6. Khu vực */}
                <div className="flex items-center gap-3.5">
                  <span className="w-10 h-10 rounded-xl bg-[#087BFF]/15 border border-[#087BFF]/30 flex items-center justify-center text-[#087BFF] dark:text-[#16D9F3] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-[#A5B2C7] block">
                      Khu vực hoạt động
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                      {NEXIS_BRAND.locationDisplay}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (7 cols): Consultation Form */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {!submittedRecord ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
                      <label htmlFor="quote-fullname" className="block text-xs font-medium text-slate-700 dark:text-[#A5B2C7] mb-1.5">
                        Họ và tên <span className="text-[#087BFF] dark:text-[#16D9F3]">*</span>
                      </label>
                      <input
                        id="quote-fullname"
                        type="text"
                        maxLength={FIELD_LIMITS.FULL_NAME_MAX}
                        disabled={isSubmitting}
                        value={formData.fullName}
                        onChange={(e) => handleFieldChange('fullName', e.target.value)}
                        placeholder="Nhập họ và tên của bạn *"
                        className={`w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#172033] text-slate-900 dark:text-[#E8EDF5] placeholder:text-slate-400 dark:placeholder:text-[#526176] text-base font-normal border border-slate-300 dark:border-white/10 focus:outline-2 focus:outline-[#087BFF] dark:focus:outline-[#16D9F3] transition-all disabled:opacity-70 ${
                          errors.fullName ? 'ring-2 ring-amber-400' : ''
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1.5 text-xs text-amber-500 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Field 2: Số điện thoại (Bắt buộc) */}
                    <div>
                      <label htmlFor="quote-phone" className="block text-xs font-medium text-slate-700 dark:text-[#A5B2C7] mb-1.5">
                        Số điện thoại liên hệ <span className="text-[#087BFF] dark:text-[#16D9F3]">*</span>
                      </label>
                      <input
                        id="quote-phone"
                        type="tel"
                        maxLength={FIELD_LIMITS.PHONE_MAX}
                        disabled={isSubmitting}
                        value={formData.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        placeholder="Ví dụ: 0909 858 428 hoặc 0326 128 141 *"
                        className={`w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#172033] text-slate-900 dark:text-[#E8EDF5] placeholder:text-slate-400 dark:placeholder:text-[#526176] text-base font-normal border border-slate-300 dark:border-white/10 focus:outline-2 focus:outline-[#087BFF] dark:focus:outline-[#16D9F3] transition-all disabled:opacity-70 ${
                          errors.phone ? 'ring-2 ring-amber-400' : ''
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1.5 text-xs text-amber-500 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Field 3: Loại website (Tùy chọn) */}
                    <div>
                      <label htmlFor="quote-service" className="block text-xs font-medium text-slate-700 dark:text-[#A5B2C7] mb-1.5">
                        Loại website quan tâm (tùy chọn)
                      </label>
                      <select
                        id="quote-service"
                        disabled={isSubmitting}
                        value={formData.serviceType}
                        onChange={(e) => handleFieldChange('serviceType', e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#172033] text-slate-900 dark:text-[#E8EDF5] border border-slate-300 dark:border-white/10 text-base font-medium focus:outline-2 focus:outline-[#087BFF] dark:focus:outline-[#16D9F3] cursor-pointer disabled:opacity-70"
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
                      <label htmlFor="quote-message" className="block text-xs font-medium text-slate-700 dark:text-[#A5B2C7] mb-1.5">
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
                        className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#172033] text-slate-900 dark:text-[#E8EDF5] placeholder:text-slate-400 dark:placeholder:text-[#526176] text-base font-normal border border-slate-300 dark:border-white/10 focus:outline-2 focus:outline-[#087BFF] dark:focus:outline-[#16D9F3] transition-all disabled:opacity-70"
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-xs text-amber-500 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Error Alert when submission fails */}
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="alert"
                        className="px-4 py-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-700 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-2.5"
                      >
                        <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-300 shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                      </motion.div>
                    )}

                    {/* Submit & Direct Actions */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3.5 rounded-xl text-white next-glow-pill disabled:opacity-70 disabled:cursor-not-allowed text-base font-semibold shadow-lg transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
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
                        href={NEXIS_BRAND.phone1Href}
                        className="px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-white/15 hover:border-[#087BFF] dark:hover:border-[#16D9F3] text-sm font-medium text-slate-800 dark:text-white inline-flex items-center gap-2 transition-colors duration-200"
                      >
                        <Phone className="w-4 h-4 text-[#087BFF] dark:text-[#16D9F3]" />
                        <span>Gọi 0909 858 428</span>
                      </a>

                      <a
                        href={NEXIS_BRAND.phone2Href}
                        className="px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-white/15 hover:border-[#087BFF] dark:hover:border-[#16D9F3] text-sm font-medium text-slate-800 dark:text-white inline-flex items-center gap-2 transition-colors duration-200"
                      >
                        <Phone className="w-4 h-4 text-[#087BFF] dark:text-[#16D9F3]" />
                        <span>Gọi 0326 128 141</span>
                      </a>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-[#A5B2C7] pt-1">
                      Thông tin của bạn được dùng để liên hệ tư vấn theo yêu cầu.
                    </p>
                  </motion.form>
                ) : (
                  /* Accepted Consultation Card */
                  <motion.div
                    key="accepted"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    role="region"
                    aria-live="polite"
                    className="bg-white dark:bg-[#172033] text-slate-900 dark:text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/15 space-y-5"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
                            Mã yêu cầu: {submittedRecord.response.requestCode}
                          </span>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {submittedRecord.response.message}
                          </h3>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetNewRequest}
                        className="text-xs text-[#087BFF] dark:text-[#16D9F3] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Gửi yêu cầu khác</span>
                      </button>
                    </div>

                    <div className="bg-[#F5F7FA] dark:bg-[#0B1120] rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-white/10 space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/10">
                        <span className="text-slate-500 dark:text-[#A5B2C7]">Họ và tên</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {submittedRecord.form.fullName}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/10">
                        <span className="text-slate-500 dark:text-[#A5B2C7]">Số điện thoại</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {submittedRecord.form.phone}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/10">
                        <span className="text-slate-500 dark:text-[#A5B2C7]">Dịch vụ</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {submittedRecord.form.serviceType}
                        </span>
                      </div>
                      {submittedRecord.form.message && (
                        <div className="pt-2 text-xs text-slate-600 dark:text-[#A5B2C7]">
                          <span className="font-medium text-slate-900 dark:text-white block mb-0.5">Nhu cầu:</span>
                          <p className="italic">“{submittedRecord.form.message}”</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-[#A5B2C7]">
                      <span>Đội ngũ Nexis Tech sẽ phản hồi qua điện thoại trong thời gian sớm nhất.</span>
                      <a
                        href={NEXIS_BRAND.phone1Href}
                        className="font-semibold text-[#087BFF] dark:text-[#16D9F3] hover:underline"
                      >
                        Gọi ngay {NEXIS_BRAND.phone1}
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

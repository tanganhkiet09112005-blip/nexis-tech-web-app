/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Section 03: Service Introduction (2-column prose + 3-device showcase on circular arch)
 * Section 04: Benefits Slider (Left title & arrows + Right staggered tall cards slider)
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NEXIS_BRAND } from '../config/brand.ts';
import { getWrappedIndex } from '../utils/validation.ts';

interface IntroAndBenefitsProps {
  onNavigateToQuote?: (topic?: string) => void;
}

export const IntroAndBenefits: React.FC<IntroAndBenefitsProps> = ({ onNavigateToQuote }) => {
  const [benefitStartIndex, setBenefitStartIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const benefits = NEXIS_BRAND.benefits;

  const handlePrevBenefit = () => {
    setSlideDirection('left');
    setBenefitStartIndex((prev) => getWrappedIndex(prev, -1, benefits.length));
  };

  const handleNextBenefit = () => {
    setSlideDirection('right');
    setBenefitStartIndex((prev) => getWrappedIndex(prev, 1, benefits.length));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) handlePrevBenefit();
      else handleNextBenefit();
    }
    setTouchStartX(null);
  };

  // Get 4 visible cards in circular order for the desktop staggered slider
  const visibleBenefits = [
    benefits[getWrappedIndex(benefitStartIndex, 0, benefits.length)],
    benefits[getWrappedIndex(benefitStartIndex, 1, benefits.length)],
    benefits[getWrappedIndex(benefitStartIndex, 2, benefits.length)],
    benefits[getWrappedIndex(benefitStartIndex, 3, benefits.length)],
  ];

  return (
    <>
      {/* =====================================================================
          SECTION 03: KHỐI GIỚI THIỆU VAI TRÒ CỦA WEBSITE
         ===================================================================== */}
      <section
        id="gioi-thieu"
        className="py-16 sm:py-24 bg-[#F5F7FA] dark:bg-[#0B1120] text-[#172033] dark:text-[#E8EDF5] overflow-hidden border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 2-Column Editorial Prose */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 body-copy text-slate-600 dark:text-[#A5B2C7]">
            <div className="space-y-4">
              <p className="font-semibold text-slate-900 dark:text-[#E8EDF5]">
                {NEXIS_BRAND.introSection.leftParagraphs[0]}
              </p>
              <p>{NEXIS_BRAND.introSection.leftParagraphs[1]}</p>
            </div>
            <div className="space-y-4">
              {NEXIS_BRAND.introSection.rightParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* 3 Vital Business Pillars (Bento Grid) - Replaces redundant second laptop */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Pillar 1 */}
            <div className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-white/10 shadow-sm hover:border-[#087BFF]/50 dark:hover:border-[#16D9F3]/50 transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#087BFF]/10 text-[#087BFF] dark:bg-[#16D9F3]/15 dark:text-[#16D9F3]">
                  100% Mã Nguồn
                </span>
                <span className="text-2xl font-black text-slate-300 dark:text-white/15 font-mono">01</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-[#087BFF] dark:text-[#16D9F3] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Sở hữu tài sản số vĩnh viễn
              </h3>
              <p className="text-sm text-slate-600 dark:text-[#A5B2C7] leading-relaxed mb-4">
                Bàn giao 100% mã nguồn và cơ sở dữ liệu. Doanh nghiệp toàn quyền lưu trữ độc lập trên Cloud riêng, không bị giữ dữ liệu và không phát sinh phí thuê nền tảng định kỳ hàng năm.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-white/10 space-y-2 text-xs text-slate-700 dark:text-[#E8EDF5]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Không phụ thuộc nền tảng đóng bên thứ ba</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Toàn quyền mở rộng, nâng cấp theo lộ trình</span>
                </div>
              </div>

              {onNavigateToQuote && (
                <button
                  type="button"
                  onClick={() => onNavigateToQuote('Tư vấn tiêu chuẩn sở hữu 100% mã nguồn')}
                  className="mt-5 w-full py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-[#087BFF] dark:bg-white/5 dark:hover:bg-[#087BFF] text-slate-800 hover:text-white dark:text-[#E8EDF5] dark:hover:text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs"
                >
                  <span>Tư vấn tiêu chuẩn này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-white/10 shadow-sm hover:border-[#087BFF]/50 dark:hover:border-[#16D9F3]/50 transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  &lt; 1.2s Tốc độ
                </span>
                <span className="text-2xl font-black text-slate-300 dark:text-white/15 font-mono">02</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Tối ưu chốt đơn di động 1-chạm
              </h3>
              <p className="text-sm text-slate-600 dark:text-[#A5B2C7] leading-relaxed mb-4">
                Hơn 80% người mua hàng dùng điện thoại. Giao diện được tối ưu chuẩn Core Web Vitals của Google, luồng đặt hàng tinh gọn, tích hợp sẵn quét mã VietQR và ví điện tử MoMo / VNPay.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-white/10 space-y-2 text-xs text-slate-700 dark:text-[#E8EDF5]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Tải trang siêu tốc dưới 1.2s, giữ chân khách</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Thanh toán VietQR tự động, giảm rớt đơn</span>
                </div>
              </div>

              {onNavigateToQuote && (
                <button
                  type="button"
                  onClick={() => onNavigateToQuote('Tư vấn tối ưu tốc độ chốt đơn di động')}
                  className="mt-5 w-full py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-emerald-600 dark:bg-white/5 dark:hover:bg-emerald-600 text-slate-800 hover:text-white dark:text-[#E8EDF5] dark:hover:text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs"
                >
                  <span>Tư vấn tiêu chuẩn này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-white/10 shadow-sm hover:border-[#087BFF]/50 dark:hover:border-[#16D9F3]/50 transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-[#16D9F3]">
                  API & AI Ready
                </span>
                <span className="text-2xl font-black text-slate-300 dark:text-white/15 font-mono">03</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-[#087BFF] dark:text-[#16D9F3] flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Sẵn sàng tích hợp IoT & AI Agent
              </h3>
              <p className="text-sm text-slate-600 dark:text-[#A5B2C7] leading-relaxed mb-4">
                Kiến trúc module tách lớp (Clean Architecture). Dễ dàng kết nối thêm Chatbot AI CSKH tự động, phần mềm kho/POS hoặc Dashboard giám sát cảm biến IoT theo nhu cầu kinh doanh.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-white/10 space-y-2 text-xs text-slate-700 dark:text-[#E8EDF5]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Mở rộng tính năng linh hoạt, không đập đi làm lại</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Bảo mật dữ liệu cấp doanh nghiệp (WAF & SSL)</span>
                </div>
              </div>

              {onNavigateToQuote && (
                <button
                  type="button"
                  onClick={() => onNavigateToQuote('Tư vấn giải pháp IoT & AI Agent')}
                  className="mt-5 w-full py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-[#16D9F3] hover:text-[#0B1120] dark:bg-white/5 dark:hover:bg-[#16D9F3] dark:hover:text-[#0B1120] text-slate-800 dark:text-[#E8EDF5] text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs"
                >
                  <span>Tư vấn tiêu chuẩn này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 04: LỢI ÍCH KHI CÓ WEBSITE (Left Sticky Copy + Right Staggered Cards)
         ===================================================================== */}
      <section
        id="loi-ich"
        className="py-16 sm:py-24 bg-white dark:bg-[#111827] text-[#172033] dark:text-[#E8EDF5] border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* LEFT COLUMN (4 cols): Title, Description, Slider Arrow Controls */}
            <div className="lg:col-span-4 space-y-5">
              <span className="inline-block text-xs font-medium text-[#087BFF] dark:text-[#16D9F3] bg-[#087BFF]/10 dark:bg-[#087BFF]/20 px-3 py-1 rounded-full">
                Giá trị mang lại
              </span>

              <h2 className="heading-section text-slate-900 dark:text-[#E8EDF5]">
                Bạn sẽ nhận được những lợi ích gì khi thiết kế website tại{' '}
                <span className="text-[#087BFF] dark:text-[#16D9F3]">Nexis Tech?</span>
              </h2>

              <p className="body-copy text-slate-600 dark:text-[#A5B2C7]">
                Một website được đầu tư bài bản giúp doanh nghiệp chủ động tiếp cận khách hàng, chuẩn hóa quy trình tư vấn và tạo dựng tài sản thương hiệu dài hạn.
              </p>

              {/* Circular Prev / Next Controls */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevBenefit}
                  className="w-11 h-11 rounded-full border border-slate-300 dark:border-white/20 bg-white dark:bg-[#172033] hover:border-[#087BFF] dark:hover:border-[#16D9F3] text-slate-700 dark:text-[#E8EDF5] flex items-center justify-center transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#087BFF]"
                  aria-label="Xem lợi ích trước"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextBenefit}
                  className="w-11 h-11 rounded-full border border-slate-300 dark:border-white/20 bg-white dark:bg-[#172033] hover:border-[#087BFF] dark:hover:border-[#16D9F3] text-slate-700 dark:text-[#E8EDF5] flex items-center justify-center transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#087BFF]"
                  aria-label="Xem lợi ích tiếp theo"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-slate-500 dark:text-[#A5B2C7] ml-2">
                  0{benefitStartIndex + 1} / 0{benefits.length}
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN (8 cols): 4 Staggered Vertical Cards with Motion Transition */}
            <div className="lg:col-span-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={benefitStartIndex}
                  initial={{ opacity: 0, x: slideDirection === 'right' ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDirection === 'right' ? -16 : 16 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start"
                >
                  {visibleBenefits.map((item, idx) => {
                    const isFeaturedFirst = idx === 0;
                    const staggerClass = idx % 2 === 1 ? 'xl:mt-8' : 'xl:mt-0';

                    return (
                      <article
                        key={`${item.id}-${idx}`}
                        className={`rounded-2xl p-6 transition-all duration-200 min-h-[320px] flex flex-col justify-between card-hover-lift ${staggerClass} ${
                          isFeaturedFirst
                            ? 'bg-[#0B1120] dark:bg-[#172033] text-[#E8EDF5] shadow-xl border border-[#087BFF]/40'
                            : 'bg-[#F5F7FA] dark:bg-[#172033]/60 text-slate-900 dark:text-[#E8EDF5] border border-slate-200/80 dark:border-white/10 hover:border-[#087BFF]/40 dark:hover:border-[#16D9F3]/40'
                        }`}
                      >
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                                isFeaturedFirst
                                  ? 'bg-[#087BFF]/25 text-[#16D9F3]'
                                  : 'bg-[#087BFF]/10 dark:bg-[#087BFF]/20 text-[#087BFF] dark:text-[#16D9F3]'
                              }`}
                            >
                              {item.number}
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                isFeaturedFirst ? 'text-[#16D9F3]' : 'text-slate-500 dark:text-[#A5B2C7]'
                              }`}
                            >
                              {item.highlight}
                            </span>
                          </div>

                          <h3
                            className={`text-[17px] font-semibold leading-snug ${
                              isFeaturedFirst ? 'text-white' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {item.title}
                          </h3>

                          <p
                            className={`text-[15px] leading-relaxed font-normal ${
                              isFeaturedFirst ? 'text-[#A5B2C7]' : 'text-slate-600 dark:text-[#A5B2C7]'
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Section 03: Service Introduction (2-column prose + 3-device showcase on circular arch)
 * Section 04: Benefits Slider (Left title & arrows + Right staggered tall cards slider)
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Search, ShoppingCart, ShieldCheck, Truck, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NEXIS_BRAND } from '../config/brand.ts';
import { getWrappedIndex } from '../utils/validation.ts';

export const IntroAndBenefits: React.FC = () => {
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
        className="py-16 sm:py-24 bg-[#F3F7FC] text-[#030B24] overflow-hidden border-b border-slate-200/80"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 2-Column Editorial Prose */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 body-copy text-slate-700">
            <div className="space-y-4">
              <p className="font-semibold text-[#030B24]">
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

          {/* 3-Device Showcase over Circular Blue/Cyan Arch */}
          <div className="mt-14 sm:mt-20 relative max-w-4xl mx-auto flex items-center justify-center min-h-[300px] sm:min-h-[410px]">
            {/* Large Right Circular Arch */}
            <div
              className="pointer-events-none absolute right-[4%] sm:right-[10%] top-1/2 -translate-y-1/2 w-60 h-60 sm:w-[390px] sm:h-[390px] rounded-full opacity-85"
              style={{
                background: 'linear-gradient(135deg, #16D9F3 0%, #087BFF 62%, #071638 100%)',
              }}
              aria-hidden="true"
            />
            {/* Smaller Left Bottom Circular Accent */}
            <div
              className="pointer-events-none absolute left-[6%] sm:left-[12%] bottom-0 w-36 h-36 sm:w-56 sm:h-56 rounded-full opacity-75"
              style={{
                background: 'linear-gradient(135deg, #087BFF 0%, #16D9F3 100%)',
              }}
              aria-hidden="true"
            />

            {/* CENTER TABLET / DESKTOP E-COMMERCE INTERFACE */}
            <div className="relative z-10 w-full max-w-[590px] bg-[#0F172A] border-[3px] border-[#1E293B] rounded-2xl p-2 sm:p-3 shadow-[0_24px_60px_rgba(3,11,36,0.24)]">
              <div className="bg-white rounded-xl overflow-hidden text-[#030B24]">
                {/* Top Browser Header */}
                <div className="px-4 py-2 bg-[#030B24] text-white flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#16D9F3]" />
                    <span className="w-2 h-2 rounded-full bg-[#087BFF]" />
                    <span className="ml-2 text-[#B5C7DF]">Giao diện thương mại điện tử Nexis Tech</span>
                  </div>
                  <span className="text-[#16D9F3] font-medium">HTTPS / SSL</span>
                </div>

                {/* Inner Store Navigation */}
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="font-semibold text-xs tracking-tight text-[#030B24]">
                    Nexis <span className="text-[#087BFF]">Commerce</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-[11px] font-medium text-slate-600">
                    <span>Sản phẩm mới</span>
                    <span>Bộ sưu tập</span>
                    <span>Giải pháp</span>
                    <span>Ưu đãi</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Search className="w-3.5 h-3.5" />
                    <ShoppingCart className="w-3.5 h-3.5 text-[#087BFF]" />
                  </div>
                </div>

                {/* Inner Store Hero Banner */}
                <div
                  className="p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  style={{
                    background: 'linear-gradient(120deg, #030B24 0%, #071638 50%, #087BFF 100%)',
                  }}
                >
                  <div className="space-y-1.5 max-w-xs">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#16D9F3]/20 text-[#16D9F3] text-[10px] font-medium">
                      Nền tảng bán hàng trực tuyến
                    </span>
                    <div className="text-sm sm:text-base font-semibold leading-snug">
                      Tối ưu hành trình mua sắm và quản lý đơn hàng tập trung
                    </div>
                    <p className="text-[11px] text-[#B5C7DF]">
                      Giao diện thiết kế riêng · Tích hợp thanh toán & tồn kho
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 shrink-0 w-full sm:w-auto">
                    <div className="bg-white/10 border border-white/15 rounded-lg p-2.5 text-center">
                      <div className="text-xs font-semibold text-[#16D9F3]">UI/UX</div>
                      <div className="text-[10px] text-white/80">Chuẩn thương hiệu</div>
                    </div>
                    <div className="bg-white/10 border border-white/15 rounded-lg p-2.5 text-center">
                      <div className="text-xs font-semibold text-white">Full-stack</div>
                      <div className="text-[10px] text-white/80">Tốc độ phản hồi cao</div>
                    </div>
                  </div>
                </div>

                {/* Trust Feature Row */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 py-2.5 px-2 text-center bg-slate-50/70">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-700">
                    <Truck className="w-3.5 h-3.5 text-[#087BFF] shrink-0" />
                    <span className="truncate">Đồng bộ vận chuyển</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#087BFF] shrink-0" />
                    <span className="truncate">Bảo mật chuẩn SSL</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-700">
                    <Award className="w-3.5 h-3.5 text-[#087BFF] shrink-0" />
                    <span className="truncate">Hỗ trợ kỹ thuật</span>
                  </div>
                </div>

                {/* Product Showcase Grid */}
                <div className="p-4">
                  <div className="text-[11px] font-semibold text-center text-[#030B24] mb-3">
                    Danh mục sản phẩm & giải pháp tiêu biểu
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { name: 'Smart Hub X1', tag: 'Mới' },
                      { name: 'Pro Dock CNC', tag: 'Nổi bật' },
                      { name: 'AI Sensor Kit', tag: 'Hot' },
                      { name: 'Cloud Gateway', tag: 'Pro' },
                    ].map((prod, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-200 p-2 bg-white text-left"
                      >
                        <div className="h-12 rounded bg-gradient-to-br from-[#F3F7FC] to-[#087BFF]/15 flex items-start justify-end p-1">
                          <span className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-[#030B24] text-white">
                            {prod.tag}
                          </span>
                        </div>
                        <div className="text-[10px] font-medium text-[#030B24] mt-1.5 truncate">
                          {prod.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* LEFT OVERLAPPING SECONDARY TABLET FRAME */}
            <div className="hidden md:block absolute left-2 lg:left-6 -bottom-4 z-20 w-64 bg-[#0F172A] border-[3px] border-[#334155] rounded-xl p-1.5 shadow-xl">
              <div className="bg-white rounded-lg p-3 space-y-2 text-[#030B24]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#030B24]">Danh mục sản phẩm</span>
                  <span className="text-[9px] text-[#087BFF] font-medium">Bộ lọc nhanh</span>
                </div>
                <div className="rounded-md bg-gradient-to-r from-[#030B24] to-[#087BFF] p-2.5 text-white">
                  <div className="text-[9px] text-[#16D9F3]">Giao diện đa thiết bị</div>
                  <div className="text-[11px] font-semibold">Tương thích mọi màn hình</div>
                </div>
              </div>
            </div>

            {/* RIGHT OVERLAPPING MOBILE FRAME */}
            <div className="hidden md:block absolute right-4 lg:right-10 -bottom-4 z-20 w-48 bg-[#0F172A] border-[3px] border-[#334155] rounded-xl p-1.5 shadow-xl">
              <div className="bg-white rounded-lg p-2.5 space-y-1.5 text-[#030B24]">
                <div className="text-[9px] font-semibold text-[#087BFF]">Thanh toán di động</div>
                <div className="rounded bg-[#030B24] text-white p-2">
                  <div className="text-[9px] text-[#16D9F3]">Quy trình tinh gọn</div>
                  <div className="text-[10px] font-semibold">Đặt hàng nhanh chóng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 04: LỢI ÍCH KHI CÓ WEBSITE (Left Sticky Copy + Right Staggered Cards)
         ===================================================================== */}
      <section
        id="loi-ich"
        className="py-16 sm:py-24 bg-white text-[#030B24] border-b border-slate-200/80"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* LEFT COLUMN (4 cols): Title, Description, Slider Arrow Controls */}
            <div className="lg:col-span-4 space-y-5">
              <span className="inline-block text-xs font-medium text-[#087BFF] bg-[#087BFF]/10 px-3 py-1 rounded-full">
                Giá trị mang lại
              </span>

              <h2 className="heading-section text-[#030B24]">
                Bạn sẽ nhận được những lợi ích gì khi thiết kế website tại{' '}
                <span className="text-[#087BFF]">Nexis Tech?</span>
              </h2>

              <p className="body-copy text-slate-600">
                Một website được đầu tư bài bản giúp doanh nghiệp chủ động tiếp cận khách hàng, chuẩn hóa quy trình tư vấn và tạo dựng tài sản thương hiệu dài hạn.
              </p>

              {/* Circular Prev / Next Controls */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevBenefit}
                  className="w-11 h-11 rounded-full border border-slate-300 bg-white hover:border-[#087BFF] hover:text-[#087BFF] text-slate-700 flex items-center justify-center transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#087BFF]"
                  aria-label="Xem lợi ích trước"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextBenefit}
                  className="w-11 h-11 rounded-full border border-slate-300 bg-white hover:border-[#087BFF] hover:text-[#087BFF] text-slate-700 flex items-center justify-center transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#087BFF]"
                  aria-label="Xem lợi ích tiếp theo"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-slate-500 ml-2">
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
                            ? 'bg-[#030B24] text-[#F4F8FF] shadow-xl border border-[#087BFF]/40'
                            : 'bg-[#F3F7FC] text-[#030B24] border border-slate-200/80 hover:border-[#087BFF]/40'
                        }`}
                      >
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                                isFeaturedFirst
                                  ? 'bg-[#087BFF]/25 text-[#16D9F3]'
                                  : 'bg-[#087BFF]/10 text-[#087BFF]'
                              }`}
                            >
                              {item.number}
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                isFeaturedFirst ? 'text-[#16D9F3]' : 'text-slate-500'
                              }`}
                            >
                              {item.highlight}
                            </span>
                          </div>

                          <h3
                            className={`text-[17px] font-semibold leading-snug ${
                              isFeaturedFirst ? 'text-white' : 'text-[#030B24]'
                            }`}
                          >
                            {item.title}
                          </h3>

                          <p
                            className={`text-[15px] leading-relaxed font-normal ${
                              isFeaturedFirst ? 'text-[#B5C7DF]' : 'text-slate-600'
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

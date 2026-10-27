/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Section 03: Core Value Bento Grid & 3-Device Architecture Showcase
 * Section 04: Interactive Benefits Slider (Staggered Glassmorphic Cards)
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  Palette,
  CheckCircle2,
} from 'lucide-react';
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

  // Get 4 visible cards in circular order
  const visibleBenefits = [
    benefits[getWrappedIndex(benefitStartIndex, 0, benefits.length)],
    benefits[getWrappedIndex(benefitStartIndex, 1, benefits.length)],
    benefits[getWrappedIndex(benefitStartIndex, 2, benefits.length)],
    benefits[getWrappedIndex(benefitStartIndex, 3, benefits.length)],
  ];

  return (
    <>
      {/* =====================================================================
          SECTION 03: BENTO GRID NĂNG LỰC CỐT LÕI & VAI TRÒ WEBSITE
         ===================================================================== */}
      <section
        id="gioi-thieu"
        className="py-16 sm:py-24 bg-[#040D2B] text-[#F4F8FF] overflow-hidden border-b border-white/10 relative"
      >
        {/* Subtle Ambient Radial Lighting */}
        <div
          className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-15 blur-[140px]"
          style={{
            background: 'radial-gradient(circle, #087BFF 0%, #16D9F3 50%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="inline-block text-xs font-semibold text-[#16D9F3] bg-[#071638] border border-[#16D9F3]/30 px-3.5 py-1 rounded-full uppercase tracking-wider">
              Năng Lực Cốt Lõi
            </span>
            <h2 className="heading-section text-[#F4F8FF]">
              Kiến Tạo Website Vượt Chuẩn —{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16D9F3] to-[#087BFF]">
                Dẫn Dắt Chuyển Đổi &amp; Doanh Số
              </span>
            </h2>
            <p className="body-copy text-[#B5C7DF]">
              Không chỉ đơn thuần là giao diện trực quan, Nexis Tech xây dựng hệ sinh thái web tốc độ cao, có chiều sâu trải nghiệm và gắn liền với mục tiêu kinh doanh bền vững.
            </p>
          </div>

          {/* 4-Card Modern Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-16 sm:mb-20">
            {/* Bento 1: UI/UX Excellence (Span 7) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-7 glass-panel glass-panel-hover rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#087BFF]/30 to-[#16D9F3]/20 border border-[#16D9F3]/40 flex items-center justify-center text-[#16D9F3]">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="heading-card text-white">
                  Thiết Kế UI/UX Độc Bản &amp; Đồng Bộ Thương Hiệu
                </h3>
                <p className="body-copy text-[#B5C7DF]">
                  Nghiên cứu hành trình người dùng sâu sắc để tạo nên giao diện may đo độc quyền, định hình vị thế cao cấp cho thương hiệu và tăng thời gian tương tác trung bình lên 2.8 lần.
                </p>
              </div>

              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 border-t border-white/10 text-xs text-[#F4F8FF]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16D9F3] shrink-0" />
                  <span>Chuẩn Design System</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16D9F3] shrink-0" />
                  <span>100% Mobile Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16D9F3] shrink-0" />
                  <span>Chuyển động mượt mà</span>
                </div>
              </div>
            </motion.div>

            {/* Bento 2: Speed & Google SEO (Span 5) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-5 glass-panel glass-panel-hover rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#16D9F3]/30 to-[#087BFF]/20 border border-[#16D9F3]/40 flex items-center justify-center text-[#16D9F3]">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="heading-card text-white">
                  Tốc Độ Siêu Tốc &amp; Chuẩn SEO Google
                </h3>
                <p className="body-copy text-[#B5C7DF]">
                  Tối ưu hóa Core Web Vitals đạt 95+ điểm xanh, nạp trang dưới 1.2s giúp thứ hạng từ khóa bứt phá và giữ chân khách hàng tức thì.
                </p>
              </div>

              <div className="pt-6 space-y-2 border-t border-white/10 text-xs text-[#F4F8FF]">
                <div className="flex items-center justify-between">
                  <span>Google PageSpeed:</span>
                  <span className="font-bold text-[#16D9F3]">95 - 99 / 100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Thời gian phản hồi TTFB:</span>
                  <span className="font-bold text-[#16D9F3]">&lt; 80ms</span>
                </div>
              </div>
            </motion.div>

            {/* Bento 3: Conversion Rate Optimization (Span 5) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-5 glass-panel glass-panel-hover rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#087BFF]/30 to-[#12B8E6]/20 border border-[#087BFF]/40 flex items-center justify-center text-[#16D9F3]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="heading-card text-white">
                  Tối Đa Hóa Tỷ Lệ Chuyển Đổi (CRO)
                </h3>
                <p className="body-copy text-[#B5C7DF]">
                  Bố cục phễu thu hút thông minh, nút kêu gọi hành động đặt đúng điểm nóng thị giác và quy trình tiếp nhận tư vấn tinh gọn 2 bước.
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-white/10 text-xs text-[#F4F8FF]">
                <span>Tỷ lệ hoàn tất biểu mẫu:</span>
                <span className="font-bold text-[#16D9F3]">+35% so với chuẩn</span>
              </div>
            </motion.div>

            {/* Bento 4: Scalability & Rock-Solid Security (Span 7) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-7 glass-panel glass-panel-hover rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#12B8E6]/30 to-[#071638] border border-[#16D9F3]/40 flex items-center justify-center text-[#16D9F3]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="heading-card text-white">
                  Bảo Mật Đa Tầng &amp; Khả Năng Mở Rộng Cao
                </h3>
                <p className="body-copy text-[#B5C7DF]">
                  Kiến trúc backend độc lập, tách biệt dữ liệu tĩnh, cơ chế phục hồi lease timeout 60s và sẵn sàng kết nối API ERP, CRM hoặc cổng thanh toán.
                </p>
              </div>

              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 border-t border-white/10 text-xs text-[#F4F8FF]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16D9F3] shrink-0" />
                  <span>SSL/TLS 256-bit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16D9F3] shrink-0" />
                  <span>Docker Container</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16D9F3] shrink-0" />
                  <span>Chống tấn công DDOS</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 3-Device Showcase over Circular Blue/Cyan Arch */}
          <div className="relative max-w-4xl mx-auto flex items-center justify-center min-h-[300px] sm:min-h-[410px]">
            {/* Large Right Circular Arch */}
            <div
              className="pointer-events-none absolute right-[4%] sm:right-[10%] top-1/2 -translate-y-1/2 w-60 h-60 sm:w-[390px] sm:h-[390px] rounded-full opacity-60 blur-md"
              style={{
                background: 'linear-gradient(135deg, #16D9F3 0%, #087BFF 62%, #071638 100%)',
              }}
              aria-hidden="true"
            />
            {/* Smaller Left Bottom Circular Accent */}
            <div
              className="pointer-events-none absolute left-[6%] sm:left-[12%] bottom-0 w-36 h-36 sm:w-56 sm:h-56 rounded-full opacity-50 blur-md"
              style={{
                background: 'linear-gradient(135deg, #087BFF 0%, #16D9F3 100%)',
              }}
              aria-hidden="true"
            />

            {/* CENTER TABLET / DESKTOP E-COMMERCE INTERFACE */}
            <div className="relative z-10 w-full max-w-[620px] bg-[#0B162C] border-[3px] border-[#1E293B] rounded-2xl p-2 sm:p-3 shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
              <div className="bg-[#030B24] rounded-xl overflow-hidden text-[#F4F8FF] border border-white/10">
                {/* Top Browser Header */}
                <div className="px-4 py-2 bg-[#071638] text-white flex items-center justify-between text-[11px] border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#16D9F3]" />
                    <span className="w-2 h-2 rounded-full bg-[#087BFF]" />
                    <span className="ml-2 text-[#B5C7DF]">Giao diện thương mại điện tử Nexis Tech</span>
                  </div>
                  <span className="text-[#16D9F3] font-medium">HTTPS / SSL Secure</span>
                </div>

                {/* Inner Store Navigation */}
                <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between bg-[#040D2B]">
                  <div className="font-semibold text-xs tracking-tight text-white">
                    Nexis <span className="text-[#16D9F3]">Commerce</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-[11px] font-medium text-slate-300">
                    <span>Sản phẩm mới</span>
                    <span>Bộ sưu tập</span>
                    <span>Giải pháp</span>
                    <span>Ưu đãi</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Search className="w-3.5 h-3.5" />
                    <ShoppingCart className="w-3.5 h-3.5 text-[#16D9F3]" />
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
                      Giao diện thiết kế riêng · Tích hợp thanh toán &amp; tồn kho
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 shrink-0 w-full sm:w-auto">
                    <div className="bg-white/10 border border-white/15 rounded-lg p-2.5 text-center">
                      <div className="text-xs font-semibold text-[#16D9F3]">UI/UX</div>
                      <div className="text-[10px] text-white/80">Chuẩn nhận diện</div>
                    </div>
                    <div className="bg-white/10 border border-white/15 rounded-lg p-2.5 text-center">
                      <div className="text-xs font-semibold text-white">Full-stack</div>
                      <div className="text-[10px] text-white/80">Phản hồi &lt; 0.1s</div>
                    </div>
                  </div>
                </div>

                {/* Trust Feature Row */}
                <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 py-2.5 px-2 text-center bg-[#071638]/70">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-300">
                    <Truck className="w-3.5 h-3.5 text-[#16D9F3] shrink-0" />
                    <span className="truncate">Đồng bộ vận chuyển</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16D9F3] shrink-0" />
                    <span className="truncate">Bảo mật chuẩn SSL</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-300">
                    <Award className="w-3.5 h-3.5 text-[#16D9F3] shrink-0" />
                    <span className="truncate">Hỗ trợ kỹ thuật 24/7</span>
                  </div>
                </div>

                {/* Product Showcase Grid */}
                <div className="p-4 bg-[#030B24]">
                  <div className="text-[11px] font-semibold text-center text-white mb-3">
                    Danh mục sản phẩm &amp; giải pháp tiêu biểu
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
                        className="rounded-lg border border-white/10 p-2 bg-[#071638]/60 text-left hover:border-[#16D9F3]/40 transition-colors"
                      >
                        <div className="h-12 rounded bg-gradient-to-br from-[#030B24] to-[#087BFF]/20 flex items-start justify-end p-1 border border-white/5">
                          <span className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-[#087BFF] text-white">
                            {prod.tag}
                          </span>
                        </div>
                        <div className="text-[10px] font-medium text-[#F4F8FF] mt-1.5 truncate">
                          {prod.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 04: KHỐI SLIDER LỢI ÍCH KHI CÓ WEBSITE
         ===================================================================== */}
      <section
        id="loi-ich"
        tabIndex={0}
        aria-label="Lợi ích khi thiết kế website"
        className="py-16 sm:py-24 bg-[#030B24] text-[#F4F8FF] border-b border-white/10 overflow-hidden focus:outline-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN (4 cols): Sticky Lead & Header */}
            <div className="lg:col-span-4 space-y-5">
              <span className="inline-block text-xs font-semibold text-[#16D9F3] bg-[#071638] border border-[#16D9F3]/30 px-3.5 py-1 rounded-full uppercase tracking-wider">
                Giá Trị Khác Biệt
              </span>

              <h2 className="heading-section text-white">
                Bạn sẽ nhận được những lợi ích gì khi hợp tác cùng{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16D9F3] to-[#087BFF]">
                  Nexis Tech?
                </span>
              </h2>

              <p className="body-copy text-[#B5C7DF]">
                Một website được đầu tư bài bản giúp doanh nghiệp chủ động tiếp cận khách hàng tiềm năng 24/7, chuẩn hóa quy trình tư vấn và tạo dựng tài sản số giá trị cao.
              </p>

              {/* Circular Prev / Next Controls */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevBenefit}
                  className="w-11 h-11 rounded-full border border-white/15 bg-[#071638] hover:border-[#16D9F3] hover:text-[#16D9F3] text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg focus-visible:outline-2 focus-visible:outline-[#16D9F3]"
                  aria-label="Xem lợi ích trước"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextBenefit}
                  className="w-11 h-11 rounded-full border border-white/15 bg-[#071638] hover:border-[#16D9F3] hover:text-[#16D9F3] text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg focus-visible:outline-2 focus-visible:outline-[#16D9F3]"
                  aria-label="Xem lợi ích tiếp theo"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-[#B5C7DF] ml-2">
                  0{benefitStartIndex + 1} / 0{benefits.length}
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN (8 cols): 4 Staggered Glassmorphic Cards with Motion */}
            <div className="lg:col-span-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={benefitStartIndex}
                  initial={{ opacity: 0, x: slideDirection === 'right' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDirection === 'right' ? -20 : 20 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start"
                >
                  {visibleBenefits.map((item, idx) => {
                    const isFeaturedFirst = idx === 0;
                    const staggerClass = idx % 2 === 1 ? 'xl:mt-8' : 'xl:mt-0';

                    return (
                      <article
                        key={`${item.id}-${idx}`}
                        className={`rounded-2xl p-6 transition-all duration-200 min-h-[320px] flex flex-col justify-between glass-panel glass-panel-hover ${staggerClass} ${
                          isFeaturedFirst
                            ? 'border-[#16D9F3]/50 shadow-[0_0_30px_rgba(22,217,243,0.15)]'
                            : 'border-white/10'
                        }`}
                      >
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                                isFeaturedFirst
                                  ? 'bg-[#16D9F3] text-[#030B24]'
                                  : 'bg-[#087BFF]/20 text-[#16D9F3]'
                              }`}
                            >
                              {item.number}
                            </span>
                            <span
                              className={`text-xs font-semibold ${
                                isFeaturedFirst ? 'text-[#16D9F3]' : 'text-[#B5C7DF]'
                              }`}
                            >
                              {item.highlight}
                            </span>
                          </div>

                          <h3 className="text-[17px] font-semibold leading-snug text-white">
                            {item.title}
                          </h3>

                          <p className="text-[15px] leading-relaxed font-normal text-[#B5C7DF]">
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

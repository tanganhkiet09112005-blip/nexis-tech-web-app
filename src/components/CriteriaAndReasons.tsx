/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Section 05: Design Criteria (Dual-Tablet Illustration + Glassmorphic Icon Carousel)
 * Section 06: Reasons to Choose Nexis Tech (Interactive 8-Node Cyber Orbital Hub)
 * Section 07: Capabilities & Commitments (Mobile Showcase + Qualitative Glass Pillars + 2x2 Commitments)
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Shield,
  CreditCard,
  Zap,
  Smartphone,
  Layers,
  Code2,
  Wrench,
  Compass,
  Lock,
  Cpu,
  TrendingUp,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NEXIS_BRAND, CriteriaItem, ReasonWheelItem } from '../config/brand.ts';
import { getWrappedIndex } from '../utils/validation.ts';

interface CriteriaAndReasonsProps {
  onNavigateToQuote: (context?: string) => void;
}

export const CriteriaAndReasons: React.FC<CriteriaAndReasonsProps> = ({ onNavigateToQuote }) => {
  const [criteriaIndex, setCriteriaIndex] = useState(0);
  const [activeReasonIndex, setActiveReasonIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const criteriaList = NEXIS_BRAND.criteriaList;
  const reasons = NEXIS_BRAND.reasonsWheel;
  const activeReason = reasons[activeReasonIndex] || reasons[0];

  const visibleCriteria = [
    criteriaList[getWrappedIndex(criteriaIndex, 0, criteriaList.length)],
    criteriaList[getWrappedIndex(criteriaIndex, 1, criteriaList.length)],
    criteriaList[getWrappedIndex(criteriaIndex, 2, criteriaList.length)],
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        setCriteriaIndex((prev) => getWrappedIndex(prev, -1, criteriaList.length));
      } else {
        setCriteriaIndex((prev) => getWrappedIndex(prev, 1, criteriaList.length));
      }
    }
    setTouchStartX(null);
  };

  const renderCriteriaIcon = (iconName: CriteriaItem['iconName']) => {
    switch (iconName) {
      case 'globe':
        return <Globe className="w-6 h-6 text-white" />;
      case 'shield':
        return <Shield className="w-6 h-6 text-white" />;
      case 'credit-card':
        return <CreditCard className="w-6 h-6 text-white" />;
      case 'zap':
        return <Zap className="w-6 h-6 text-white" />;
      case 'smartphone':
        return <Smartphone className="w-6 h-6 text-white" />;
      case 'layers':
        return <Layers className="w-6 h-6 text-white" />;
    }
  };

  const renderReasonIcon = (iconName: ReasonWheelItem['iconName']) => {
    switch (iconName) {
      case 'code':
        return <Code2 className="w-5 h-5" />;
      case 'wrench':
        return <Wrench className="w-5 h-5" />;
      case 'compass':
        return <Compass className="w-5 h-5" />;
      case 'lock':
        return <Lock className="w-5 h-5" />;
      case 'cpu':
        return <Cpu className="w-5 h-5" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'check':
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  const leftReasons = reasons.slice(0, 4);
  const rightReasons = reasons.slice(4, 8);

  return (
    <>
      {/* =====================================================================
          SECTION 05: TIÊU CHÍ WEBSITE CHẤT LƯỢNG
         ===================================================================== */}
      <section
        id="tieu-chi"
        className="py-16 sm:py-24 bg-[#030B24] next-circuit-bg text-[#F4F8FF] border-b border-white/10 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top 2-Column Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block text-xs font-semibold text-[#16D9F3] bg-[#071638] border border-[#16D9F3]/30 px-3.5 py-1 rounded-full uppercase tracking-wider">
                Tiêu Chuẩn Kỹ Thuật
              </span>
              <h2 className="heading-section text-white">
                Tiêu chuẩn đánh giá website{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16D9F3] to-[#087BFF]">
                  chuyên nghiệp &amp; chuẩn SEO
                </span>
              </h2>
              <p className="body-copy text-[#B5C7DF]">
                Website không chỉ cần đẹp mắt mà phải đáp ứng đầy đủ các tiêu chuẩn kỹ thuật khắt khe về tốc độ, bảo mật và trải nghiệm thao tác trên mọi kích cỡ màn hình.
              </p>
            </div>

            {/* Right: Dual-Tablet Staggered Illustration on Dark Glass */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              <div className="relative w-full max-w-[520px] min-h-[220px] sm:min-h-[260px] flex items-center justify-center">
                {/* Back Tablet */}
                <div className="absolute top-0 right-4 sm:right-8 w-[72%] bg-[#0B162C] border-2 border-white/15 rounded-xl p-2 shadow-2xl rotate-3">
                  <div className="bg-[#071638] rounded-lg p-3 text-[11px] text-[#F4F8FF] space-y-1.5 border border-white/5">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span className="text-[#16D9F3] font-semibold">Tối Ưu Hiển Thị</span>
                      <span>Desktop 1440px</span>
                    </div>
                    <div className="h-10 rounded bg-[#030B24] border border-white/10 p-2 flex items-center">
                      <div className="w-16 h-2 rounded bg-[#087BFF]/40" />
                    </div>
                  </div>
                </div>

                {/* Front Tablet */}
                <div className="relative z-10 w-[78%] bg-[#0F1E3D] border-2 border-[#16D9F3]/30 rounded-xl p-2.5 shadow-2xl -rotate-2">
                  <div className="bg-[#030B24] rounded-lg p-3 text-[11px] text-[#F4F8FF] space-y-2 border border-white/10">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-[#16D9F3]">Chuẩn UI/UX Doanh Nghiệp</span>
                      <span className="text-[#087BFF]">Tablet 768px</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="h-12 rounded bg-[#071638] border border-white/5 p-1 text-center flex flex-col justify-center">
                        <span className="text-[9px] text-[#16D9F3] font-bold">100%</span>
                        <span className="text-[7px] text-slate-300">Responsive</span>
                      </div>
                      <div className="h-12 rounded bg-[#071638] border border-white/5 p-1 text-center flex flex-col justify-center">
                        <span className="text-[9px] text-white font-bold">&lt; 1s</span>
                        <span className="text-[7px] text-slate-300">Nạp trang</span>
                      </div>
                      <div className="h-12 rounded bg-[#071638] border border-white/5 p-1 text-center flex flex-col justify-center">
                        <span className="text-[9px] text-[#16D9F3] font-bold">A+</span>
                        <span className="text-[7px] text-slate-300">Bảo mật</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 3-Card Carousel with Top-Centered Circular Icon Badge */}
          <div className="mt-14 sm:mt-18 relative">
            <div className="flex items-center gap-3">
              {/* Left Prev Button */}
              <button
                type="button"
                onClick={() =>
                  setCriteriaIndex((prev) => getWrappedIndex(prev, -1, criteriaList.length))
                }
                className="hidden md:flex w-11 h-11 rounded-full bg-[#071638] border border-white/15 hover:border-[#16D9F3] text-white hover:text-[#16D9F3] items-center justify-center shrink-0 shadow-lg transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#16D9F3]"
                aria-label="Tiêu chí trước"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* 3 Cards Grid with Smooth Transition */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={criteriaIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-7"
                  >
                    {visibleCriteria.map((item, idx) => (
                      <article
                        key={`${item.id}-${idx}`}
                        className="relative glass-panel glass-panel-hover rounded-2xl pt-12 pb-7 px-6 border-white/10 text-white"
                      >
                        {/* Overlapping Top-Center Circular Gradient Icon Badge */}
                        <div
                          className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-[#030B24]"
                          style={{
                            background:
                              'linear-gradient(135deg, #16D9F3 0%, #087BFF 65%, #030B24 100%)',
                          }}
                        >
                          {renderCriteriaIcon(item.iconName)}
                        </div>

                        <div className="text-center space-y-3">
                          <h3 className="heading-card text-white">
                            {item.title}
                          </h3>
                          <p className="body-copy text-[#B5C7DF] text-sm">
                            {item.description}
                          </p>
                        </div>
                      </article>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Next Button */}
              <button
                type="button"
                onClick={() =>
                  setCriteriaIndex((prev) => getWrappedIndex(prev, 1, criteriaList.length))
                }
                className="hidden md:flex w-11 h-11 rounded-full bg-[#071638] border border-white/15 hover:border-[#16D9F3] text-white hover:text-[#16D9F3] items-center justify-center shrink-0 shadow-lg transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#16D9F3]"
                aria-label="Tiêu chí tiếp theo"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Arrow Controls */}
            <div className="flex md:hidden items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() =>
                  setCriteriaIndex((prev) => getWrappedIndex(prev, -1, criteriaList.length))
                }
                className="w-10 h-10 rounded-full bg-[#071638] border border-white/20 flex items-center justify-center text-white cursor-pointer"
                aria-label="Tiêu chí trước"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-[#B5C7DF]">
                0{criteriaIndex + 1} / 0{criteriaList.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCriteriaIndex((prev) => getWrappedIndex(prev, 1, criteriaList.length))
                }
                className="w-10 h-10 rounded-full bg-[#071638] border border-white/20 flex items-center justify-center text-white cursor-pointer"
                aria-label="Tiêu chí tiếp theo"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 06: 8 LÝ DO LỰA CHỌN NEXIS TECH (INTERACTIVE CYBER ORBITAL WHEEL)
         ===================================================================== */}
      <section
        id="ly-do"
        className="py-16 sm:py-24 bg-[#040D2B] text-[#F4F8FF] border-b border-white/10 overflow-hidden relative"
      >
        {/* Subtle Ambient Radial Lighting */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full opacity-15 blur-[150px]"
          style={{
            background: 'radial-gradient(circle, #087BFF 0%, #16D9F3 50%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Centered Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="inline-block text-xs font-semibold text-[#16D9F3] bg-[#071638] border border-[#16D9F3]/30 px-3.5 py-1 rounded-full uppercase tracking-wider">
              Giá Trị Cốt Lõi
            </span>
            <h2 className="heading-section text-white">
              8 Lý do doanh nghiệp nên đồng hành cùng{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16D9F3] to-[#087BFF]">
                Nexis Tech
              </span>
            </h2>
            <p className="body-copy text-[#B5C7DF]">
              Chọn từng hạng mục bên dưới để khám phá cam kết chất lượng và quy trình phát triển chuyên sâu của chúng tôi.
            </p>
          </div>

          {/* DESKTOP CIRCULAR ORBITAL WHEEL (lg and up) */}
          <div className="hidden lg:grid lg:grid-cols-12 items-center gap-4 max-w-6xl mx-auto">
            {/* Left 4 Arc Nodes */}
            <div className="col-span-3 space-y-11 py-6">
              {leftReasons.map((item, idx) => {
                const isSelected = activeReasonIndex === idx;
                const offsetClass =
                  idx === 0 || idx === 3 ? 'translate-x-8' : '-translate-x-2';

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-end gap-4 transition-transform duration-200 ${offsetClass}`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveReasonIndex(idx)}
                      className={`text-right text-[15px] font-medium transition-colors duration-200 cursor-pointer ${
                        isSelected
                          ? 'text-[#16D9F3] font-semibold'
                          : 'text-[#B5C7DF] hover:text-white'
                      }`}
                    >
                      {item.shortTitle}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveReasonIndex(idx)}
                      aria-label={item.shortTitle}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer shadow-md ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#087BFF] to-[#16D9F3] text-[#030B24] scale-110 ring-4 ring-[#16D9F3]/30 shadow-[0_0_20px_rgba(22,217,243,0.3)]'
                          : 'bg-[#071638] text-[#16D9F3] border border-white/15 hover:border-[#16D9F3]'
                      }`}
                    >
                      {renderReasonIcon(item.iconName)}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Center Orbital Hub Circle with Animated Content Switch */}
            <div className="col-span-6 flex items-center justify-center">
              <div className="relative w-[430px] h-[430px] rounded-full border border-[#16D9F3]/30 bg-[#071638]/85 backdrop-blur-xl shadow-[0_0_60px_rgba(8,123,255,0.2)] flex flex-col items-center justify-center p-10 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeReason.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    {/* Large Number */}
                    <span className="text-4xl font-extrabold text-[#16D9F3] tracking-tight mb-2">
                      {activeReason.number}
                    </span>

                    {/* Active Reason Full Title */}
                    <h3 className="text-lg xl:text-xl font-semibold text-white leading-snug mb-3 max-w-xs">
                      {activeReason.fullTitle}
                    </h3>

                    {/* Active Reason Description */}
                    <p className="text-[14px] text-[#B5C7DF] leading-relaxed mb-6 max-w-sm font-normal">
                      {activeReason.description}
                    </p>

                    {/* Center Pill CTA Button */}
                    <button
                      type="button"
                      onClick={() => onNavigateToQuote(activeReason.shortTitle)}
                      className="px-7 py-3 rounded-xl text-sm font-semibold text-white next-glow-pill cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
                    >
                      Tư vấn báo giá ngay
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right 4 Arc Nodes */}
            <div className="col-span-3 space-y-11 py-6">
              {rightReasons.map((item, idx) => {
                const realIdx = idx + 4;
                const isSelected = activeReasonIndex === realIdx;
                const offsetClass =
                  idx === 0 || idx === 3 ? '-translate-x-8' : 'translate-x-2';

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-start gap-4 transition-transform duration-200 ${offsetClass}`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveReasonIndex(realIdx)}
                      aria-label={item.shortTitle}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer shadow-md ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#087BFF] to-[#16D9F3] text-[#030B24] scale-110 ring-4 ring-[#16D9F3]/30 shadow-[0_0_20px_rgba(22,217,243,0.3)]'
                          : 'bg-[#071638] text-[#16D9F3] border border-white/15 hover:border-[#16D9F3]'
                      }`}
                    >
                      {renderReasonIcon(item.iconName)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveReasonIndex(realIdx)}
                      className={`text-left text-[15px] font-medium transition-colors duration-200 cursor-pointer ${
                        isSelected
                          ? 'text-[#16D9F3] font-semibold'
                          : 'text-[#B5C7DF] hover:text-white'
                      }`}
                    >
                      {item.shortTitle}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE & TABLET RESPONSIVE VIEW FOR SECTION 06 */}
          <div className="lg:hidden space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {reasons.map((item, idx) => {
                const isSelected = activeReasonIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveReasonIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#071638] text-white border-[#16D9F3] shadow-[0_0_15px_rgba(22,217,243,0.2)]'
                        : 'bg-[#071638]/50 text-[#B5C7DF] border-white/10'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                        isSelected
                          ? 'bg-[#16D9F3] text-[#030B24]'
                          : 'bg-white/10 text-[#16D9F3]'
                      }`}
                    >
                      {item.number}
                    </span>
                    <span className="text-xs font-medium leading-tight line-clamp-2">
                      {item.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeReason.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel border-[#16D9F3]/30 rounded-2xl p-6 text-center space-y-3 shadow-lg"
              >
                <span className="text-3xl font-extrabold text-[#16D9F3] block">
                  {activeReason.number}
                </span>
                <h3 className="text-lg font-semibold text-white">
                  {activeReason.fullTitle}
                </h3>
                <p className="body-copy text-[#B5C7DF] max-w-xl mx-auto">
                  {activeReason.description}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigateToQuote(activeReason.shortTitle)}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-white next-glow-pill cursor-pointer"
                  >
                    Tư vấn báo giá ngay
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 07: NĂNG LỰC & CAM KẾT ĐỒNG HÀNH
         ===================================================================== */}
      <section
        id="cam-ket"
        className="py-16 sm:py-24 bg-[#030B24] text-[#F4F8FF] border-b border-white/10 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* LEFT SIDE (6 cols): Dual Mobile Showcase Circle + Qualitative Glass Pillars */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-center gap-6 relative">
              {/* Large Blue Gradient Circle with 2 Tilted Mobile Phones */}
              <div
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center shrink-0 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #16D9F3 0%, #087BFF 65%, #030B24 100%)',
                }}
              >
                {/* Left Phone */}
                <div className="w-28 sm:w-32 bg-[#0B162C] border-[3px] border-[#1E293B] rounded-2xl p-1.5 shadow-xl -rotate-12 -translate-x-2">
                  <div className="bg-[#030B24] rounded-xl p-2 text-white space-y-1.5 border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-semibold text-[#16D9F3]">Nexis Tech</span>
                      <span className="text-[7px] px-1 rounded bg-[#087BFF] text-white">UI/UX</span>
                    </div>
                    <div className="h-14 rounded bg-gradient-to-br from-[#071638] to-[#087BFF] p-1.5 text-white flex flex-col justify-end">
                      <span className="text-[8px] font-semibold leading-tight">
                        Trải nghiệm mượt mà
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-6 rounded bg-[#071638] border border-white/5" />
                      <div className="h-6 rounded bg-[#071638] border border-white/5" />
                    </div>
                  </div>
                </div>

                {/* Right Phone */}
                <div className="w-28 sm:w-32 bg-[#0B162C] border-[3px] border-[#1E293B] rounded-2xl p-1.5 shadow-xl rotate-12 translate-x-2 translate-y-4">
                  <div className="bg-[#030B24] rounded-xl p-2 text-white space-y-1.5 border border-white/10">
                    <span className="text-[8px] font-semibold text-[#16D9F3] block">
                      Web App &amp; Cloud
                    </span>
                    <div className="h-12 rounded bg-gradient-to-r from-[#087BFF] to-[#16D9F3] p-1.5 text-[#030B24] flex items-center">
                      <span className="text-[8px] font-bold leading-tight">
                        Kiến trúc mở rộng
                      </span>
                    </div>
                    <div className="h-7 rounded bg-[#071638] border border-white/5" />
                  </div>
                </div>
              </div>

              {/* 3 Staggered Qualitative Glass Pillars */}
              <div className="flex sm:flex-col items-center justify-center gap-3 sm:-ml-8 z-10 flex-wrap">
                {NEXIS_BRAND.qualitativePillars.map((pillar, idx) => (
                  <div
                    key={pillar.id}
                    className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full glass-panel border-white/15 flex flex-col items-center justify-center p-3.5 text-center shadow-lg ${
                      idx === 1 ? 'sm:translate-x-5 border-[#16D9F3]/40' : ''
                    }`}
                  >
                    <span className="text-sm sm:text-[15px] font-bold text-[#16D9F3] tracking-tight">
                      {pillar.label}
                    </span>
                    <span className="text-[11px] sm:text-xs text-[#B5C7DF] font-normal mt-1 leading-snug">
                      {pillar.sublabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE (6 cols): Heading + 2x2 Commitments Glass Card */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="inline-block text-xs font-semibold text-[#16D9F3] bg-[#071638] border border-[#16D9F3]/30 px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                  Định Hướng Triển Khai
                </span>
                <h2 className="heading-section text-white">
                  Năng lực và cam kết đồng hành
                </h2>
              </div>

              <div className="glass-panel rounded-2xl p-6 sm:p-8 border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {NEXIS_BRAND.commitments.map((commit) => (
                    <div key={commit.id} className="space-y-2">
                      {/* Dual blue/cyan dash accent */}
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-1 rounded-full bg-[#087BFF]" />
                        <span className="w-3 h-1 rounded-full bg-[#16D9F3]" />
                      </div>
                      <h3 className="text-base font-semibold text-white leading-snug">
                        {commit.title}
                      </h3>
                      <p className="text-sm text-[#B5C7DF] leading-relaxed font-normal">
                        {commit.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

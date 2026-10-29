/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Section 05: Design Criteria (2-col top with dual-tablet illustration + 3-card icon-top carousel)
 * Section 06: Reasons to Choose Nexis Tech (Interactive 8-node Circular Wheel / Orbital Hub)
 * Section 07: Capabilities & Commitments (Mobile Showcase + 3 Qualitative Pillar Circles + 2x2 Commitments)
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
        className="py-16 sm:py-24 bg-[#F5F7FA] dark:bg-[#0B1120] text-[#172033] dark:text-[#E8EDF5] border-b border-slate-200/80 dark:border-white/10 overflow-hidden transition-colors duration-200"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top 2-Column Split: Editorial Left + Dual-Tablet Circle Illustration Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-block text-xs font-medium text-[#087BFF] dark:text-[#16D9F3] bg-[#087BFF]/10 dark:bg-[#087BFF]/20 px-3 py-1 rounded-full">
                Tiêu chuẩn chất lượng
              </span>
              <h2 className="heading-section text-slate-900 dark:text-[#E8EDF5]">
                Những điều cần lưu ý khi thiết kế website{' '}
                <span className="text-[#087BFF] dark:text-[#16D9F3]">doanh nghiệp và bán hàng</span>
              </h2>
              <p className="body-copy text-slate-600 dark:text-[#A5B2C7]">
                {NEXIS_BRAND.criteriaIntro.paragraph1}
              </p>
              <p className="body-copy text-slate-600 dark:text-[#A5B2C7]">
                {NEXIS_BRAND.criteriaIntro.paragraph2}
              </p>
            </div>

            {/* Right: Circular Blue Backdrop with 2 Tilted Tablets & Metallic Shelf Bar */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
                {/* Main Gradient Circle */}
                <div
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-full shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #16D9F3 0%, #087BFF 60%, #030B24 100%)',
                  }}
                  aria-hidden="true"
                />

                {/* Left Tilted Tablet Screen */}
                <div className="absolute left-3 sm:left-6 top-6 sm:top-8 w-36 sm:w-44 bg-[#0F172A] border-[3px] border-[#334155] rounded-2xl p-2 shadow-2xl -rotate-12 z-10">
                  <div className="bg-white rounded-xl p-2.5 text-[#030B24] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-[#030B24]">Nexis UI</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#087BFF] text-white font-medium">
                        Hệ thống
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-medium text-[#087BFF]"
                        >
                          0{i}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg bg-[#030B24] text-white p-2 text-center">
                      <span className="text-[9px] text-[#16D9F3] block">Hiệu năng</span>
                      <span className="text-[10px] font-semibold">Tối ưu tốc độ & chuyển đổi</span>
                    </div>
                  </div>
                </div>

                {/* Right Tilted Tablet Screen */}
                <div className="absolute right-3 sm:right-6 bottom-12 sm:bottom-14 w-36 sm:w-44 bg-[#0F172A] border-[3px] border-[#334155] rounded-2xl p-2 shadow-2xl rotate-12 z-20">
                  <div className="bg-white rounded-xl p-2.5 text-[#030B24] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-[#087BFF]">Nexis Store</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#087BFF] text-white font-medium">
                        Mới
                      </span>
                    </div>
                    <div className="h-10 rounded bg-slate-100 border border-slate-200 p-1.5 flex items-center justify-between">
                      <div className="w-8 h-6 rounded bg-[#087BFF]/20" />
                      <div className="w-16 h-2 rounded bg-slate-300" />
                    </div>
                    <div className="rounded-lg bg-gradient-to-r from-[#087BFF] to-[#12B8E6] text-white p-1.5 text-center text-[9px] font-semibold">
                      Chuẩn UI/UX hiện đại
                    </div>
                  </div>
                </div>

                {/* Bottom Metallic Shelf Bar */}
                <div
                  className="absolute bottom-5 sm:bottom-7 w-64 sm:w-80 h-8 sm:h-10 rounded-xl shadow-xl -rotate-6 z-30 border border-white/50"
                  style={{
                    background: 'linear-gradient(90deg, #DDE6F2 0%, #FFFFFF 50%, #BACBE0 100%)',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Bottom 3-Card Carousel with Top-Centered Circular Icon Badge */}
          <div className="mt-16 sm:mt-20 relative">
            <div className="flex items-center gap-3">
              {/* Left Prev Button */}
              <button
                type="button"
                onClick={() =>
                  setCriteriaIndex((prev) => getWrappedIndex(prev, -1, criteriaList.length))
                }
                className="hidden md:flex w-11 h-11 rounded-full bg-white dark:bg-[#172033] border border-slate-300 dark:border-white/20 hover:border-[#087BFF] dark:hover:border-[#16D9F3] text-slate-700 dark:text-[#E8EDF5] hover:text-[#087BFF] items-center justify-center shrink-0 shadow-xs transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#087BFF]"
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
                        className="relative bg-white dark:bg-[#172033] rounded-2xl pt-12 pb-7 px-6 shadow-sm border border-slate-200/80 dark:border-white/10 hover:border-[#087BFF]/40 dark:hover:border-[#16D9F3]/40 card-hover-lift"
                      >
                        {/* Overlapping Top-Center Circular Gradient Icon Badge */}
                        <div
                          className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center shadow-md border-4 border-[#F5F7FA] dark:border-[#0B1120]"
                          style={{
                            background: 'linear-gradient(135deg, #087BFF 0%, #12B8E6 100%)',
                          }}
                        >
                          {renderCriteriaIcon(item.iconName)}
                        </div>

                        <h3 className="heading-card text-[#087BFF] dark:text-[#16D9F3] mb-3 text-left">
                          {item.title}
                        </h3>
                        <p className="text-[15px] text-slate-600 dark:text-[#A5B2C7] leading-relaxed text-left font-normal">
                          {item.description}
                        </p>
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
                className="hidden md:flex w-11 h-11 rounded-full bg-white dark:bg-[#172033] border border-slate-300 dark:border-white/20 hover:border-[#087BFF] dark:hover:border-[#16D9F3] text-slate-700 dark:text-[#E8EDF5] hover:text-[#087BFF] items-center justify-center shrink-0 shadow-xs transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#087BFF]"
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
                className="w-10 h-10 rounded-full bg-white dark:bg-[#172033] border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-700 dark:text-[#E8EDF5] cursor-pointer"
                aria-label="Tiêu chí trước"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-slate-600 dark:text-[#A5B2C7]">
                0{criteriaIndex + 1} / 0{criteriaList.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCriteriaIndex((prev) => getWrappedIndex(prev, 1, criteriaList.length))
                }
                className="w-10 h-10 rounded-full bg-white dark:bg-[#172033] border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-700 dark:text-[#E8EDF5] cursor-pointer"
                aria-label="Tiêu chí tiếp theo"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 06: VÒNG TRÒN 8 LÝ DO CHỌN NEXIS TECH (ORBITAL HUB)
         ===================================================================== */}
      <section
        id="ly-do"
        className="py-16 sm:py-24 bg-white dark:bg-[#111827] text-[#172033] dark:text-[#E8EDF5] border-b border-slate-200/80 dark:border-white/10 overflow-hidden transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-medium text-[#087BFF] dark:text-[#16D9F3] bg-[#087BFF]/10 dark:bg-[#087BFF]/20 px-3.5 py-1 rounded-full mb-3">
            Điểm khác biệt
          </span>

          <h2 className="heading-section text-slate-900 dark:text-[#E8EDF5] max-w-3xl mx-auto">
            Tại sao các thương hiệu tin chọn{' '}
            <span className="text-[#087BFF] dark:text-[#16D9F3]">Nexis Tech?</span>
          </h2>

          <p className="body-copy text-slate-600 dark:text-[#A5B2C7] max-w-2xl mx-auto mt-3">
            Quy trình làm việc chuẩn mực, công nghệ hiện đại và cam kết bảo hành dài hạn tạo nên giá trị bền vững cho mỗi dự án.
          </p>

          {/* DESKTOP CIRCULAR ORBITAL HUB (8 Nodes arranged on Left & Right Arcs) */}
          <div className="hidden lg:grid grid-cols-12 gap-4 items-center mt-14 max-w-6xl mx-auto min-h-[500px]">
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
                          ? 'text-[#087BFF] dark:text-[#16D9F3] font-semibold'
                          : 'text-slate-800 dark:text-[#E8EDF5] hover:text-[#087BFF] dark:hover:text-[#16D9F3]'
                      }`}
                    >
                      {item.shortTitle}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveReasonIndex(idx)}
                      aria-label={item.shortTitle}
                      className={`w-15 h-15 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer shadow-md ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#087BFF] to-[#12B8E6] text-white scale-105 ring-4 ring-[#087BFF]/20'
                          : 'bg-white dark:bg-[#172033] text-[#087BFF] dark:text-[#16D9F3] border border-slate-200 dark:border-white/10 hover:border-[#087BFF] dark:hover:border-[#16D9F3]'
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
              <div className="relative w-[430px] h-[430px] rounded-full border border-[#087BFF]/25 bg-gradient-to-b from-slate-50 to-white dark:from-[#172033] dark:to-[#0B1120] shadow-[0_20px_50px_rgba(8,123,255,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-10 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeReason.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    {/* Large Number */}
                    <span className="text-4xl font-bold text-[#087BFF] dark:text-[#16D9F3] tracking-tight mb-2">
                      {activeReason.number}
                    </span>

                    {/* Active Reason Full Title */}
                    <h3 className="text-lg xl:text-xl font-semibold text-slate-900 dark:text-white leading-snug mb-3 max-w-xs">
                      {activeReason.fullTitle}
                    </h3>

                    {/* Active Reason Description */}
                    <p className="text-[15px] text-slate-600 dark:text-[#A5B2C7] leading-relaxed mb-6 max-w-sm font-normal">
                      {activeReason.description}
                    </p>

                    {/* Center Pill CTA Button */}
                    <button
                      type="button"
                      onClick={() => onNavigateToQuote(activeReason.shortTitle)}
                      className="px-7 py-3 rounded-xl text-sm font-medium text-white next-glow-pill cursor-pointer focus-visible:outline-2 focus-visible:outline-[#087BFF]"
                    >
                      Tư vấn báo giá
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
                      className={`w-15 h-15 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer shadow-md ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#087BFF] to-[#12B8E6] text-white scale-105 ring-4 ring-[#087BFF]/20'
                          : 'bg-white dark:bg-[#172033] text-[#087BFF] dark:text-[#16D9F3] border border-slate-200 dark:border-white/10 hover:border-[#087BFF] dark:hover:border-[#16D9F3]'
                      }`}
                    >
                      {renderReasonIcon(item.iconName)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveReasonIndex(realIdx)}
                      className={`text-left text-[15px] font-medium transition-colors duration-200 cursor-pointer ${
                        isSelected
                          ? 'text-[#087BFF] dark:text-[#16D9F3] font-semibold'
                          : 'text-slate-800 dark:text-[#E8EDF5] hover:text-[#087BFF] dark:hover:text-[#16D9F3]'
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
          <div className="lg:hidden space-y-6 mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {reasons.map((item, idx) => {
                const isSelected = activeReasonIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveReasonIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[#087BFF] text-white border-[#087BFF] shadow-sm'
                        : 'bg-slate-50 dark:bg-[#172033] text-slate-800 dark:text-[#E8EDF5] border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold opacity-80">{item.number}</span>
                      <div className={isSelected ? 'text-white' : 'text-[#087BFF] dark:text-[#16D9F3]'}>
                        {renderReasonIcon(item.iconName)}
                      </div>
                    </div>
                    <div className="text-xs font-semibold truncate leading-tight">
                      {item.shortTitle}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Details Card on Mobile */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReason.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-slate-50 dark:bg-[#172033] rounded-2xl p-6 border border-slate-200 dark:border-white/10 text-left space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#087BFF] dark:text-[#16D9F3]">
                    {activeReason.number}
                  </span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {activeReason.fullTitle}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-[#A5B2C7] leading-relaxed">
                  {activeReason.description}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigateToQuote(activeReason.shortTitle)}
                    className="px-6 py-3 rounded-xl text-sm font-medium text-white next-glow-pill cursor-pointer"
                  >
                    Tư vấn báo giá
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
        className="py-16 sm:py-24 bg-[#F5F7FA] dark:bg-[#0B1120] text-[#172033] dark:text-[#E8EDF5] border-b border-slate-200/80 dark:border-white/10 overflow-hidden transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* LEFT SIDE (6 cols): Dual Mobile Showcase Circle + 3 Staggered Qualitative Pillar Circles */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-center gap-6 relative">
              {/* Large Blue Gradient Circle with 2 Tilted Mobile Phones */}
              <div
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center shrink-0 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #16D9F3 0%, #087BFF 65%, #030B24 100%)',
                }}
              >
                {/* Left Phone */}
                <div className="w-28 sm:w-32 bg-[#0F172A] border-[3px] border-[#334155] rounded-2xl p-1.5 shadow-xl -rotate-12 -translate-x-2">
                  <div className="bg-white rounded-xl p-2 text-[#030B24] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-semibold text-[#030B24]">Nexis Tech</span>
                      <span className="text-[7px] px-1 rounded bg-[#087BFF] text-white">UI/UX</span>
                    </div>
                    <div className="h-14 rounded bg-gradient-to-br from-[#030B24] to-[#087BFF] p-1.5 text-white flex flex-col justify-end">
                      <span className="text-[8px] font-semibold leading-tight">
                        Trải nghiệm di động mượt mà
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-6 rounded bg-slate-100" />
                      <div className="h-6 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>

                {/* Right Phone */}
                <div className="w-28 sm:w-32 bg-[#0F172A] border-[3px] border-[#334155] rounded-2xl p-1.5 shadow-xl rotate-12 translate-x-2 translate-y-4">
                  <div className="bg-white rounded-xl p-2 text-[#030B24] space-y-1.5">
                    <span className="text-[8px] font-semibold text-[#087BFF] block">
                      Web App & Cloud
                    </span>
                    <div className="h-12 rounded bg-gradient-to-r from-[#087BFF] to-[#12B8E6] p-1.5 text-white flex items-center">
                      <span className="text-[8px] font-semibold leading-tight">
                        Kiến trúc mở rộng
                      </span>
                    </div>
                    <div className="h-7 rounded bg-slate-100 border border-slate-200" />
                  </div>
                </div>
              </div>

              {/* 3 Staggered Qualitative Pillar Circles */}
              <div className="flex sm:flex-col items-center justify-center gap-3 sm:-ml-8 z-10 flex-wrap">
                {NEXIS_BRAND.qualitativePillars.map((pillar, idx) => (
                  <div
                    key={pillar.id}
                    className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white dark:bg-[#172033] shadow-[0_12px_30px_rgba(3,11,36,0.08)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-white/10 flex flex-col items-center justify-center p-3.5 text-center ${
                      idx === 1 ? 'sm:translate-x-5' : ''
                    }`}
                  >
                    <span className="text-sm sm:text-[15px] font-bold text-[#087BFF] dark:text-[#16D9F3] tracking-tight">
                      {pillar.label}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-600 dark:text-[#A5B2C7] font-normal mt-1 leading-snug">
                      {pillar.sublabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE (6 cols): Heading + 2x2 Commitments Card */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="inline-block text-xs font-medium text-[#087BFF] dark:text-[#16D9F3] bg-[#087BFF]/10 dark:bg-[#087BFF]/20 px-3 py-1 rounded-full mb-2">
                  Định hướng triển khai
                </span>
                <h2 className="heading-section text-slate-900 dark:text-[#E8EDF5]">
                  Năng lực và cam kết đồng hành
                </h2>
              </div>

              <div className="bg-white dark:bg-[#172033] rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {NEXIS_BRAND.commitments.map((commit) => (
                    <div key={commit.id} className="space-y-2">
                      {/* Dual blue dash accent */}
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-1 rounded-full bg-[#087BFF]" />
                        <span className="w-3 h-1 rounded-full bg-[#12B8E6]" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                        {commit.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-[#A5B2C7] leading-relaxed font-normal">
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

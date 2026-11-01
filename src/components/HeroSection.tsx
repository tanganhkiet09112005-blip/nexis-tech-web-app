/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Section 02: Hero, CTA & 3D Stepped Podium Device Illustrations — Nexis Tech
 */

import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Phone,
  ShoppingCart,
  Cpu,
  Activity,
  Bot,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NEXIS_BRAND } from '../config/brand.ts';

interface HeroSectionProps {
  onPrimaryCta: () => void;
  onOpenPhoneModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPrimaryCta,
  onOpenPhoneModal,
}) => {
  const [activeDevicePreview, setActiveDevicePreview] = useState<'ecommerce' | 'corporate'>('ecommerce');

  return (
    <section
      id="top"
      className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24 bg-[#F5F7FA] dark:bg-[#0B1120] text-[#172033] dark:text-[#E8EDF5] overflow-hidden next-circuit-bg border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200"
    >
      {/* Subtle Electric Blue & Cyan Radial Aura */}
      <div
        className="pointer-events-none absolute top-1/2 right-[8%] -translate-y-1/2 w-[480px] h-[480px] rounded-full opacity-15 dark:opacity-25 blur-[110px]"
        style={{
          background: 'radial-gradient(circle, #087BFF 0%, #16D9F3 45%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT COLUMN (5 cols): Brand Lead, Heading, Description, CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/15 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#087BFF] dark:text-[#16D9F3]" />
              <span className="text-xs sm:text-[13px] font-medium text-slate-700 dark:text-[#A5B2C7]">
                {NEXIS_BRAND.hero.lead}
              </span>
            </div>

            <h1 className="heading-hero text-slate-900 dark:text-[#E8EDF5]">
              <span className="block">{NEXIS_BRAND.hero.titleLine1}</span>
              <span className="block mt-1 font-bold text-[#087BFF] dark:text-[#16D9F3]">
                {NEXIS_BRAND.hero.titleLine2}
              </span>
            </h1>

            <p className="body-copy text-slate-600 dark:text-[#A5B2C7] max-w-xl">
              {NEXIS_BRAND.hero.description}
            </p>

            {/* Primary CTA + Phone Selector Modal Trigger */}
            <div className="pt-1 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onPrimaryCta}
                className="px-7 py-3.5 rounded-xl text-base font-medium text-white next-glow-pill inline-flex items-center gap-2.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#087BFF]"
              >
                <span>{NEXIS_BRAND.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenPhoneModal}
                className="px-5 py-3.5 rounded-xl text-base font-medium text-slate-800 dark:text-[#E8EDF5] bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/15 hover:border-[#087BFF] dark:hover:border-[#16D9F3]/60 transition-colors duration-200 inline-flex items-center gap-2 cursor-pointer shadow-xs"
                aria-label="Chọn số điện thoại tư vấn"
              >
                <Phone className="w-4 h-4 text-[#087BFF] dark:text-[#16D9F3]" />
                <span>Hotline tư vấn</span>
              </button>
            </div>

            {/* Interactive Preview Mode Switcher for the 3D Podium Devices */}
            <div className="pt-1 flex items-center gap-3">
              <span className="text-xs font-medium text-slate-600 dark:text-[#A5B2C7]">Giao diện hiển thị:</span>
              <div className="inline-flex items-center bg-slate-200/70 dark:bg-[#111827]/90 border border-slate-300 dark:border-white/10 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setActiveDevicePreview('ecommerce')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 cursor-pointer ${
                    activeDevicePreview === 'ecommerce'
                      ? 'bg-[#087BFF] text-white shadow-xs'
                      : 'text-slate-700 dark:text-[#A5B2C7] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Thương mại điện tử
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDevicePreview('corporate')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 cursor-pointer ${
                    activeDevicePreview === 'corporate'
                      ? 'bg-[#087BFF] text-white shadow-xs'
                      : 'text-slate-700 dark:text-[#A5B2C7] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Doanh nghiệp
                </button>
              </div>
            </div>

            {/* Key Value Highlights */}
            <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-[#A5B2C7]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087BFF] dark:text-[#16D9F3] shrink-0" />
                <span className="truncate">Web & E-commerce</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087BFF] dark:text-[#16D9F3] shrink-0" />
                <span className="truncate">IoT & AI Agent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087BFF] dark:text-[#16D9F3] shrink-0" />
                <span className="truncate">Nền tảng Game</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087BFF] dark:text-[#16D9F3] shrink-0" />
                <span className="truncate">UI/UX độc bản</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN (7 cols): 2-Tier Stepped 3D Podium with Laptop + Tablet + Stylus */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative pt-4 lg:pt-6"
          >
            <div className="relative mx-auto max-w-[660px] min-h-[380px] sm:min-h-[450px] flex items-end justify-end">
              {/* 3D Podium Upper Step (Right/Back) */}
              <div
                className="hidden sm:block absolute bottom-6 right-0 w-[64%] h-28 rounded-xl border-t border-slate-300 dark:border-white/15 shadow-2xl"
                style={{
                  background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 50%, #0B1120 100%)',
                }}
                aria-hidden="true"
              />

              {/* 3D Podium Lower Step (Left/Front) */}
              <div
                className="hidden sm:block absolute bottom-0 left-[6%] w-[44%] h-20 rounded-xl border-t border-slate-300 dark:border-white/15 shadow-2xl z-10"
                style={{
                  background: 'linear-gradient(180deg, #334155 0%, #1E293B 50%, #0F172A 100%)',
                }}
                aria-hidden="true"
              />

              {/* UPPER STEP: Wide Laptop Mockup */}
              <div className="relative z-10 w-full sm:w-[74%] sm:mb-20 sm:mr-2">
                {/* Laptop Screen Bezel */}
                <div className="bg-[#0F172A] border-[3px] border-[#334155] rounded-t-2xl p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16D9F3]/70 mx-auto mb-1.5" />

                  {/* Inner Website UI Screen with Smooth AnimatePresence */}
                  <div className="bg-[#F5F7FA] text-[#030B24] rounded-xl overflow-hidden shadow-inner min-h-[220px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeDevicePreview}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {/* Mockup Screen View: Switch between E-commerce Store and Corporate IoT/AI Portal */}
                        {activeDevicePreview === 'ecommerce' ? (
                          <div className="space-y-0">
                            {/* E-Commerce Top Bar */}
                            <div className="px-3.5 py-2 bg-white border-b border-slate-200 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[11px] tracking-tight text-[#030B24]">
                                  Nexis Store
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium">
                                  Bán lẻ
                                </span>
                              </div>
                              <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-full w-40 text-[10px] text-slate-500">
                                <span>Tìm sản phẩm, phụ kiện...</span>
                                <Search className="w-3 h-3 ml-auto text-[#087BFF]" />
                              </div>
                              <div className="flex items-center gap-2.5 text-[10px] font-medium text-slate-600">
                                <span className="hidden sm:inline">Khuyến mãi</span>
                                <div className="flex items-center gap-1 bg-[#087BFF]/10 text-[#087BFF] px-2 py-0.5 rounded-full font-semibold">
                                  <ShoppingCart className="w-3 h-3" />
                                  <span>2</span>
                                </div>
                              </div>
                            </div>

                            {/* E-Commerce Mini Hero Banner */}
                            <div className="px-4 py-2.5 bg-gradient-to-r from-[#0B1120] via-[#1E293B] to-[#087BFF] text-white flex items-center justify-between">
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-[#16D9F3] font-semibold">Bộ sưu tập 2026</span>
                                <div className="text-xs sm:text-sm font-bold leading-tight">Thiết bị công nghệ & IoT</div>
                              </div>
                              <span className="text-[10px] bg-[#16D9F3] text-[#030B24] font-bold px-2 py-1 rounded shadow-xs">
                                Giảm 20%
                              </span>
                            </div>

                            {/* E-Commerce 2 Mini Product Cards */}
                            <div className="p-3 bg-slate-50/80 grid grid-cols-2 gap-2 text-left">
                              <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-2xs space-y-1">
                                <div className="h-14 rounded bg-slate-100 flex items-center justify-center text-slate-400 relative">
                                  <Cpu className="w-6 h-6 text-[#087BFF]" />
                                  <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-bold px-1 rounded">HOT</span>
                                </div>
                                <div className="text-[10px] font-semibold text-slate-800 truncate">Nexis IoT Hub Pro</div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-[#087BFF]">1.250.000₫</span>
                                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">+ Giỏ</span>
                                </div>
                              </div>

                              <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-2xs space-y-1">
                                <div className="h-14 rounded bg-slate-100 flex items-center justify-center text-slate-400 relative">
                                  <Bot className="w-6 h-6 text-[#16D9F3]" />
                                  <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded">MỚI</span>
                                </div>
                                <div className="text-[10px] font-semibold text-slate-800 truncate">Sensor AI Vision 4K</div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-[#087BFF]">850.000₫</span>
                                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">+ Giỏ</span>
                                </div>
                              </div>
                            </div>

                            {/* E-Commerce Bottom Strip */}
                            <div className="px-3.5 py-2 bg-white text-center border-t border-slate-200">
                              <div className="text-[10px] text-slate-600 font-medium">
                                Tích hợp thanh toán VNPay / MoMo · Tồn kho & Đơn hàng thời gian thực
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-0">
                            {/* Corporate Top Bar */}
                            <div className="px-3.5 py-2 bg-[#0B1120] text-white border-b border-white/10 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[11px] tracking-tight text-white">
                                  Nexis Cloud Portal
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  ONLINE 99.9%
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span>IoT Hub</span>
                                <span className="text-[#16D9F3]">AI Engine</span>
                                <span>Báo cáo</span>
                              </div>
                            </div>

                            {/* Corporate Telemetry Stats Grid */}
                            <div className="p-3 bg-slate-900 text-white space-y-2">
                              <div className="grid grid-cols-3 gap-2">
                                <div className="bg-slate-800/80 border border-white/10 rounded-lg p-2 text-left">
                                  <div className="flex items-center gap-1 text-[9px] text-[#16D9F3]">
                                    <Cpu className="w-3 h-3" />
                                    <span>Thiết bị IoT</span>
                                  </div>
                                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">128 Online</div>
                                </div>
                                <div className="bg-slate-800/80 border border-white/10 rounded-lg p-2 text-left">
                                  <div className="flex items-center gap-1 text-[9px] text-[#087BFF]">
                                    <Bot className="w-3 h-3" />
                                    <span>AI Agents</span>
                                  </div>
                                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">1.4k req/m</div>
                                </div>
                                <div className="bg-slate-800/80 border border-white/10 rounded-lg p-2 text-left">
                                  <div className="flex items-center gap-1 text-[9px] text-emerald-400">
                                    <Activity className="w-3 h-3" />
                                    <span>Phản hồi API</span>
                                  </div>
                                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">18ms</div>
                                </div>
                              </div>

                              {/* Telemetry Console Row */}
                              <div className="bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-left font-mono space-y-1">
                                <div className="flex items-center justify-between text-slate-300">
                                  <span className="text-[#16D9F3]">&gt; Hệ thống cảm biến:</span>
                                  <span className="text-emerald-400">Đã đồng bộ hóa</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-300">
                                  <span className="text-[#087BFF]">&gt; Tự động hóa quy trình:</span>
                                  <span className="text-cyan-300">Hoạt động bình thường</span>
                                </div>
                              </div>
                            </div>

                            {/* Corporate Bottom Strip */}
                            <div className="px-3.5 py-2 bg-slate-950 text-center border-t border-white/10">
                              <div className="text-[10px] text-slate-400 font-medium">
                                Kiến trúc tách lớp · Bảo mật WAF & SSL đa lớp · Tùy biến doanh nghiệp
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Laptop Base Hinge */}
                <div className="h-3 bg-gradient-to-r from-slate-600 via-slate-300 to-slate-600 rounded-b-xl mx-[-3%] shadow-lg flex items-center justify-center">
                  <div className="w-12 h-1 rounded-full bg-slate-500" />
                </div>
              </div>

              {/* LOWER STEP: Vertical Tablet + Stylus Pen + 3D Sphere */}
              <div className="hidden sm:block absolute bottom-12 left-[8%] z-20 w-[34%] max-w-[215px]">
                {/* Blue 3D Sphere Accent */}
                <div
                  className="absolute -left-7 bottom-5 w-8 h-8 rounded-full shadow-lg"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #16D9F3, #087BFF 65%, #0B1120)',
                  }}
                  aria-hidden="true"
                />

                {/* Diagonal Stylus Pen */}
                <div
                  className="absolute -left-5 top-10 w-2 h-28 rounded-full origin-bottom -rotate-[26deg] shadow-md z-30"
                  style={{
                    background: 'linear-gradient(180deg, #16D9F3 0%, #087BFF 50%, #1E293B 100%)',
                  }}
                  aria-hidden="true"
                />

                {/* Tablet Frame */}
                <div className="bg-[#0F172A] border-[3px] border-[#334155] rounded-2xl p-2 shadow-[0_20px_45px_rgba(0,0,0,0.65)] -rotate-2">
                  <div className="bg-white rounded-xl overflow-hidden text-[#030B24] p-2.5 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-[10px] font-semibold text-[#087BFF]">Nexis Mobile</span>
                      <ShoppingBag className="w-3 h-3 text-[#030B24]" />
                    </div>

                    <div className="rounded-lg bg-gradient-to-r from-[#0B1120] to-[#087BFF] p-2.5 text-white">
                      <div className="text-[9px] text-[#16D9F3] font-medium">Tối ưu di động</div>
                      <div className="text-[10px] font-semibold leading-tight mt-0.5">
                        Hiển thị sắc nét trên mọi màn hình
                      </div>
                    </div>

                    {/* Category Icon Row */}
                    <div className="grid grid-cols-5 gap-1 pt-0.5">
                      {['Web', 'App', 'AI', 'Cloud', 'UI'].map((item, idx) => (
                        <div key={idx} className="text-center">
                          <div className="w-5 h-5 mx-auto rounded-full bg-[#087BFF] text-white text-[8px] font-semibold flex items-center justify-center">
                            {item[0]}
                          </div>
                          <span className="text-[7px] text-slate-600 block mt-0.5">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Product Grid Cards inside Tablet */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5, 6].map((card) => (
                        <div
                          key={card}
                          className="rounded border border-slate-200 p-1 bg-slate-50"
                        >
                          <div className="h-5 rounded bg-gradient-to-br from-[#087BFF]/20 to-[#16D9F3]/30" />
                          <div className="h-1 w-3/4 bg-slate-300 rounded mt-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

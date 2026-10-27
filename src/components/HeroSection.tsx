/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Section 02: Hero, Impact Metrics & Tech Stack Marquee — Nexis Tech
 */

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Phone,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Globe2,
  Database,
  Terminal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NEXIS_BRAND } from '../config/brand.ts';

interface HeroSectionProps {
  onPrimaryCta: () => void;
}

const TECH_STACK = [
  { name: 'React 19', tag: 'Frontend', icon: Layers },
  { name: 'TypeScript', tag: 'Type-safe', icon: Terminal },
  { name: 'Next.js / Vite', tag: 'High-Speed', icon: Zap },
  { name: 'Node.js Express', tag: 'Backend', icon: Cpu },
  { name: 'Tailwind CSS', tag: 'UI Engine', icon: Sparkles },
  { name: 'Docker', tag: 'DevOps', icon: Layers },
  { name: 'PostgreSQL / SQLite', tag: 'Database', icon: Database },
  { name: 'Vercel / Cloud', tag: 'Global Edge', icon: Globe2 },
  { name: 'Security 256-bit', tag: 'SSL & Shield', icon: ShieldCheck },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onPrimaryCta }) => {
  const [activeDevicePreview, setActiveDevicePreview] = useState<'ecommerce' | 'corporate'>('ecommerce');

  return (
    <section
      id="top"
      className="relative pt-28 sm:pt-32 lg:pt-36 pb-14 lg:pb-20 bg-[#030B24] text-[#F4F8FF] overflow-hidden next-circuit-bg border-b border-white/10"
    >
      {/* Subtle Electric Blue & Cyan Radial Aura */}
      <div
        className="pointer-events-none absolute top-1/3 right-[5%] -translate-y-1/2 w-[520px] h-[520px] rounded-full opacity-25 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #087BFF 0%, #16D9F3 45%, transparent 75%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-10 left-[5%] w-[380px] h-[380px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #087BFF 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT COLUMN (5 cols): Brand Lead, Heading, Description, CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6 text-left"
          >
            {/* Live pulsating badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#071638]/90 border border-[#16D9F3]/35 shadow-[0_0_15px_rgba(22,217,243,0.15)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16D9F3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16D9F3]"></span>
              </span>
              <span className="text-xs sm:text-[13px] font-medium text-[#F4F8FF]">
                {NEXIS_BRAND.hero.lead}
              </span>
            </div>

            <h1 className="heading-hero text-[#F4F8FF]">
              <span className="block">{NEXIS_BRAND.hero.titleLine1}</span>
              <span className="block mt-1.5 font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#16D9F3] via-[#75E6FF] to-[#087BFF]">
                {NEXIS_BRAND.hero.titleLine2}
              </span>
            </h1>

            <p className="body-copy text-[#B5C7DF] max-w-xl">
              {NEXIS_BRAND.hero.description}
            </p>

            {/* Primary CTA + Direct Phone Link */}
            <div className="pt-1 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onPrimaryCta}
                className="px-7 py-3.5 rounded-xl text-base font-semibold text-white next-glow-pill inline-flex items-center gap-2.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
              >
                <span>{NEXIS_BRAND.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={NEXIS_BRAND.phoneHref}
                className="px-5 py-3.5 rounded-xl text-base font-medium text-[#F4F8FF] bg-[#071638]/90 border border-white/15 hover:border-[#16D9F3]/60 hover:bg-[#0B1E48] transition-all duration-200 inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#16D9F3]" />
                <span>{NEXIS_BRAND.phoneDisplay}</span>
              </a>
            </div>

            {/* Interactive Preview Mode Switcher */}
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-medium text-[#B5C7DF]">Mô phỏng:</span>
              <div className="inline-flex items-center bg-[#071638]/90 border border-white/10 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setActiveDevicePreview('ecommerce')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    activeDevicePreview === 'ecommerce'
                      ? 'bg-[#087BFF] text-white shadow-sm'
                      : 'text-[#B5C7DF] hover:text-white'
                  }`}
                >
                  E-Commerce / Bán lẻ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDevicePreview('corporate')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    activeDevicePreview === 'corporate'
                      ? 'bg-[#087BFF] text-white shadow-sm'
                      : 'text-[#B5C7DF] hover:text-white'
                  }`}
                >
                  Doanh nghiệp / B2B
                </button>
              </div>
            </div>

            {/* Key Value Highlights */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 border-t border-white/10 text-xs sm:text-sm text-[#B5C7DF]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16D9F3] shrink-0" />
                <span>Thiết kế UI/UX độc bản</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16D9F3] shrink-0" />
                <span>Tối ưu phễu chuyển đổi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16D9F3] shrink-0" />
                <span>Bảo hành &amp; hỗ trợ 24/7</span>
              </div>
            </div>

            {/* Live Landing Page Metrics Bar */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="glass-panel rounded-xl p-2.5 text-center border border-white/10">
                <div className="text-lg sm:text-xl font-bold text-[#16D9F3]">150+</div>
                <div className="text-[11px] text-[#B5C7DF] mt-0.5 truncate">Dự án bàn giao</div>
              </div>
              <div className="glass-panel rounded-xl p-2.5 text-center border border-white/10">
                <div className="text-lg sm:text-xl font-bold text-[#16D9F3]">&lt; 1.2s</div>
                <div className="text-[11px] text-[#B5C7DF] mt-0.5 truncate">Tốc độ tải trang</div>
              </div>
              <div className="glass-panel rounded-xl p-2.5 text-center border border-white/10">
                <div className="text-lg sm:text-xl font-bold text-[#16D9F3]">99.9%</div>
                <div className="text-[11px] text-[#B5C7DF] mt-0.5 truncate">Uptime hệ thống</div>
              </div>
              <div className="glass-panel rounded-xl p-2.5 text-center border border-white/10">
                <div className="text-lg sm:text-xl font-bold text-[#16D9F3]">4.9/5</div>
                <div className="text-[11px] text-[#B5C7DF] mt-0.5 truncate">Đánh giá tin cậy</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN (7 cols): Stepped 3D Podium with Laptop + Mobile Device */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative pt-4 lg:pt-6"
          >
            <div className="relative mx-auto max-w-[660px] min-h-[380px] sm:min-h-[450px] flex items-end justify-end">
              {/* 3D Podium Upper Step (Right/Back) */}
              <div
                className="hidden sm:block absolute bottom-6 right-0 w-[64%] h-28 rounded-xl border-t border-white/15 shadow-2xl"
                style={{
                  background: 'linear-gradient(180deg, #09204F 0%, #05112E 45%, #020818 100%)',
                }}
                aria-hidden="true"
              />

              {/* 3D Podium Lower Step (Left/Front) */}
              <div
                className="hidden sm:block absolute bottom-0 left-4 w-[52%] h-20 rounded-xl border-t border-white/20 shadow-2xl"
                style={{
                  background: 'linear-gradient(180deg, #0D2D68 0%, #07173D 50%, #030A1C 100%)',
                }}
                aria-hidden="true"
              />

              {/* UPPER STEP: Wide Laptop Mockup */}
              <div className="relative z-10 w-full sm:w-[76%] sm:mb-20 sm:mr-2">
                {/* Laptop Screen Bezel */}
                <div className="bg-[#0B162C] border-[3px] border-[#1E293B] rounded-t-2xl p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16D9F3]/60 mx-auto mb-1.5" />

                  {/* Inner Website UI Screen with Smooth AnimatePresence */}
                  <div className="bg-[#030B24] text-[#F4F8FF] rounded-xl overflow-hidden shadow-inner min-h-[220px] border border-white/10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeDevicePreview}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {/* Mockup Top Bar */}
                        <div className="px-3.5 py-2 bg-[#071638] border-b border-white/10 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[11px] tracking-tight text-[#16D9F3]">
                              {activeDevicePreview === 'ecommerce' ? 'Nexis Store' : 'Nexis Enterprise'}
                            </span>
                          </div>
                          <div className="hidden sm:flex items-center gap-2 bg-[#030B24] border border-white/10 px-2.5 py-1 rounded-full w-36 text-[10px] text-slate-400">
                            <span>Tìm kiếm sản phẩm...</span>
                            <Search className="w-3 h-3 ml-auto text-[#087BFF]" />
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-300">
                            <span>Trang chủ</span>
                            <span className="text-[#16D9F3]">Giải pháp</span>
                            <span>Liên hệ</span>
                          </div>
                        </div>

                        {/* Mockup Hero Banner */}
                        <div
                          className="p-4 sm:p-5 text-white relative overflow-hidden"
                          style={{
                            background:
                              activeDevicePreview === 'ecommerce'
                                ? 'linear-gradient(135deg, #030B24 0%, #071638 55%, #087BFF 100%)'
                                : 'linear-gradient(135deg, #071638 0%, #087BFF 65%, #12B8E6 100%)',
                          }}
                        >
                          <div className="grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-7 space-y-1.5">
                              <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-white/15 text-[#16D9F3]">
                                {activeDevicePreview === 'ecommerce'
                                  ? 'Giao diện thương mại điện tử'
                                  : 'Nền tảng số doanh nghiệp'}
                              </span>
                              <div className="text-sm sm:text-base font-semibold leading-snug">
                                {activeDevicePreview === 'ecommerce'
                                  ? 'Trải nghiệm mua sắm trực tuyến chuẩn nhận diện'
                                  : 'Hệ sinh thái giải pháp công nghệ & vận hành'}
                              </div>
                              <div className="pt-1">
                                <span className="inline-block px-2.5 py-1 rounded-md bg-[#16D9F3] text-[#030B24] text-[10px] font-bold">
                                  Khám phá ngay
                                </span>
                              </div>
                            </div>

                            {/* Mini Visual Cards inside Laptop Hero */}
                            <div className="col-span-5 grid grid-cols-2 gap-1.5">
                              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-lg p-2 text-center">
                                <div className="w-6 h-6 mx-auto rounded bg-[#16D9F3]/20 flex items-center justify-center text-[#16D9F3] text-[10px] font-semibold">
                                  01
                                </div>
                                <div className="text-[9px] mt-1 font-medium truncate">UI/UX Riêng</div>
                              </div>
                              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-lg p-2 text-center">
                                <div className="w-6 h-6 mx-auto rounded bg-[#087BFF]/30 flex items-center justify-center text-white text-[10px] font-semibold">
                                  02
                                </div>
                                <div className="text-[9px] mt-1 font-medium truncate">Full-stack</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mockup Bottom Strip */}
                        <div className="px-4 py-2 bg-[#071638] text-center border-t border-white/10">
                          <div className="text-[11px] font-semibold text-[#F4F8FF]">
                            Cấu trúc trực quan · Tối ưu chuyển đổi đa thiết bị
                          </div>
                          <div className="text-[10px] text-[#B5C7DF] mt-0.5">
                            May đo theo đúng nhận diện thương hiệu của từng doanh nghiệp
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Laptop Base Hinge */}
                <div className="h-3 bg-gradient-to-r from-slate-700 via-slate-400 to-slate-700 rounded-b-xl mx-[-3%] shadow-lg flex items-center justify-center">
                  <div className="w-12 h-1 rounded-full bg-slate-600" />
                </div>
              </div>

              {/* LOWER STEP: Smartphone Standing Left */}
              <div className="hidden sm:block absolute bottom-2 left-6 z-20 w-[145px] shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                <div className="bg-[#0B162C] border-[3px] border-[#1E293B] rounded-3xl p-1.5 shadow-2xl">
                  {/* Dynamic Island Pill */}
                  <div className="w-10 h-2.5 rounded-full bg-black mx-auto mb-1 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16D9F3]/60" />
                  </div>

                  <div className="bg-[#030B24] text-white rounded-2xl p-2.5 text-[9px] space-y-2 border border-white/10">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <span className="font-bold text-[#16D9F3]">Nexis Mobile</span>
                      <span className="text-[8px] text-slate-400">99.9% Uptime</span>
                    </div>

                    <div className="bg-gradient-to-br from-[#071638] to-[#087BFF] p-2 rounded-lg text-white">
                      <div className="text-[8px] font-semibold">Tối ưu di động</div>
                      <div className="text-[7px] text-white/80 mt-0.5">Hiển thị sắc nét trên mọi màn hình</div>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-center text-[7px]">
                      <div className="bg-white/10 p-1 rounded font-medium">Web</div>
                      <div className="bg-white/10 p-1 rounded font-medium">App</div>
                      <div className="bg-white/10 p-1 rounded font-medium">UI</div>
                      <div className="bg-white/10 p-1 rounded font-medium">Cloud</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Infinite Tech Stack & Trust Marquee */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 overflow-hidden relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#030B24] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#030B24] to-transparent z-10" />
          
          <div className="text-center mb-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#B5C7DF]/80">
              Công Nghệ Hiện Đại • Sẵn Sàng Vận Hành Quy Mô Cao
            </span>
          </div>

          <div className="flex overflow-hidden select-none">
            <div className="animate-marquee flex items-center gap-4 sm:gap-6">
              {TECH_STACK.concat(TECH_STACK).map((tech, idx) => (
                <div
                  key={`${tech.name}-${idx}`}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#071638]/70 border border-white/10 text-xs sm:text-sm text-[#F4F8FF] shrink-0 hover:border-[#16D9F3]/50 transition-colors"
                >
                  <tech.icon className="w-3.5 h-3.5 text-[#16D9F3]" />
                  <span className="font-medium">{tech.name}</span>
                  <span className="text-[10px] text-[#B5C7DF]/70 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                    {tech.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

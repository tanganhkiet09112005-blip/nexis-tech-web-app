/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Section 01: Header and Navigation — Nexis Tech
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NEXIS_BRAND } from '../config/brand.ts';

interface HeaderNavProps {
  onNavigateToQuote: (serviceName?: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onNavigateToQuote }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>('services');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string, label?: string) => {
    setMobileOpen(false);
    setOpenDropdownId(null);

    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (href === '#bao-gia' && label) {
      onNavigateToQuote(label);
      return;
    }

    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#030B24]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-3'
          : 'bg-[#030B24]/90 backdrop-blur-sm border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Nexis Tech Brand Logo */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#top');
          }}
          className="flex items-center gap-3 group shrink-0 focus-visible:outline-2 focus-visible:outline-[#16D9F3] rounded-lg"
          aria-label="Nexis Tech — Trang chủ"
        >
          {/* Geometric N Hexagon Mark */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#071638] to-[#030B24] border border-[#087BFF]/45 flex items-center justify-center transition-colors duration-200 group-hover:border-[#16D9F3]">
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
                strokeOpacity="0.85"
              />
              <path
                d="M12.5 24V12L23.5 24V12"
                stroke="#F4F8FF"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="23.5" cy="12" r="2" fill="#16D9F3" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center tracking-tight leading-none">
              <span className="text-lg sm:text-xl font-bold text-[#F4F8FF]">NEXIS</span>
              <span className="text-lg sm:text-xl font-bold text-[#16D9F3] ml-1.5">TECH</span>
            </div>
            <span className="text-[11px] text-[#B5C7DF] font-normal tracking-normal mt-1 hidden sm:block">
              {NEXIS_BRAND.tagline}
            </span>
          </div>
        </a>

        {/* Center: Horizontal Navigation Menu with Smooth Animated Dropdowns */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2"
          aria-label="Điều hướng chính"
        >
          {NEXIS_BRAND.navigation.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isOpen = openDropdownId === item.id;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => hasChildren && setOpenDropdownId(item.id)}
                onMouseLeave={() => hasChildren && setOpenDropdownId(null)}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (hasChildren) {
                      setOpenDropdownId(isOpen ? null : item.id);
                    } else {
                      handleNavClick(item.href);
                    }
                  }}
                  aria-expanded={hasChildren ? isOpen : undefined}
                  className="px-3.5 py-2 rounded-lg text-[15px] font-medium text-[#F4F8FF]/90 hover:text-[#16D9F3] hover:bg-white/5 transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{item.label}</span>
                  {hasChildren && (
                    <ChevronDown
                      className={`w-4 h-4 text-[#16D9F3] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown Panel with Motion */}
                <AnimatePresence>
                  {hasChildren && isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 top-full pt-2 w-72 z-50"
                    >
                      <div className="bg-[#071638] border border-white/15 rounded-xl shadow-2xl p-2 space-y-1">
                        {item.children!.map((child, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleNavClick(child.href, child.label)}
                            className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#F4F8FF]/90 hover:text-white hover:bg-[#087BFF]/25 transition-colors duration-180 flex items-center justify-between gap-2 cursor-pointer"
                          >
                            <span>{child.label}</span>
                            {child.badge && (
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#087BFF]/30 text-[#16D9F3]">
                                {child.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Right: Contact CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href={NEXIS_BRAND.phoneHref}
            className="hidden xl:inline-flex items-center gap-2 text-sm font-medium text-[#B5C7DF] hover:text-white transition-colors duration-200 mr-1"
            aria-label={`Gọi hotline ${NEXIS_BRAND.phoneDisplay}`}
          >
            <Phone className="w-4 h-4 text-[#16D9F3]" />
            <span>{NEXIS_BRAND.phoneDisplay}</span>
          </a>

          <button
            type="button"
            onClick={() => onNavigateToQuote()}
            className="hidden sm:inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-white next-glow-pill cursor-pointer focus-visible:outline-2 focus-visible:outline-[#16D9F3]"
          >
            Liên hệ tư vấn
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-[#071638] border border-white/15 text-[#F4F8FF] hover:border-[#16D9F3] transition-colors duration-200 cursor-pointer"
            aria-label={mobileOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer with Motion */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[#030B24] border-b border-white/15 px-4 pt-3 pb-6 space-y-2 max-h-[82vh] overflow-y-auto"
          >
            {NEXIS_BRAND.navigation.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isExpanded = mobileExpandedId === item.id;

              return (
                <div key={item.id} className="border-b border-white/10 pb-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (hasChildren) {
                          setMobileExpandedId(isExpanded ? null : item.id);
                        } else {
                          handleNavClick(item.href);
                        }
                      }}
                      className="w-full text-left py-2.5 text-base font-medium text-[#F4F8FF] flex items-center justify-between cursor-pointer"
                    >
                      <span>{item.label}</span>
                      {hasChildren && (
                        <ChevronDown
                          className={`w-4 h-4 text-[#16D9F3] transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {hasChildren && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="pl-3 pt-1 pb-2 space-y-1 border-l border-[#087BFF]/40 ml-2 overflow-hidden"
                      >
                        {item.children!.map((child, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleNavClick(child.href, child.label)}
                            className="w-full text-left py-2 px-2 rounded-lg text-sm font-normal text-[#B5C7DF] hover:text-white hover:bg-white/5 flex items-center justify-between cursor-pointer"
                          >
                            <span>{child.label}</span>
                            {child.badge && (
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#087BFF]/25 text-[#16D9F3]">
                                {child.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <div className="pt-3 flex flex-col gap-2.5">
              <a
                href={NEXIS_BRAND.phoneHref}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#071638] border border-white/15 text-base font-medium text-[#F4F8FF]"
              >
                <Phone className="w-4 h-4 text-[#16D9F3]" />
                <span>Gọi tư vấn: {NEXIS_BRAND.phoneDisplay}</span>
              </a>

              <a
                href={NEXIS_BRAND.emailHref}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#071638] border border-white/15 text-sm font-medium text-[#B5C7DF]"
              >
                <Mail className="w-4 h-4 text-[#16D9F3]" />
                <span>{NEXIS_BRAND.emailDisplay}</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onNavigateToQuote();
                }}
                className="w-full py-3 rounded-xl text-base font-medium text-white next-glow-pill cursor-pointer"
              >
                Nhận tư vấn dự án
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

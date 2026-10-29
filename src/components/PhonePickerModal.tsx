/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * PhonePickerModal: Bộ chọn 2 số điện thoại liên hệ chính thức của Nexis Tech.
 * - Hotline 1: 0909 858 428 (tel:+84909858428)
 * - Hotline 2: 0326 128 141 (tel:+84326128141)
 * Hỗ trợ mở trên cả desktop và mobile, thao tác gọi 1 chạm, phím Escape và hỗ trợ đầy đủ Dark/Light theme.
 */

import React, { useEffect, useState } from 'react';
import { Phone, PhoneCall, Copy, Check, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NEXIS_BRAND, PhoneContact } from '../config/brand.ts';

interface PhonePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhonePickerModal: React.FC<PhonePickerModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(text.replace(/\s+/g, ''));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="phone-picker-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-2xl p-5 sm:p-6 text-slate-800 dark:text-[#E8EDF5]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-[#087BFF] dark:text-[#16D9F3] flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="phone-picker-title" className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                    Chọn số điện thoại liên hệ
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#A5B2C7]">
                    Nexis Tech — Tư vấn nhanh & hỗ trợ kỹ thuật
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Đóng bảng chọn số điện thoại"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of 2 phone numbers */}
            <div className="py-4 space-y-3">
              {NEXIS_BRAND.phones.map((p: PhoneContact) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-200 dark:border-white/10 p-3.5 bg-slate-50 dark:bg-[#172033] hover:border-[#087BFF]/60 dark:hover:border-[#16D9F3]/60 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#087BFF]/10 text-[#087BFF] dark:bg-[#087BFF]/25 dark:text-[#16D9F3]">
                          {p.label}
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                        {p.number}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#A5B2C7] mt-0.5">
                        {p.note}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleCopy(p.id, p.number, e)}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer border border-slate-200/60 dark:border-white/10"
                        title="Sao chép số"
                        aria-label={`Sao chép số ${p.number}`}
                      >
                        {copiedId === p.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <a
                        href={p.href}
                        className="px-3.5 py-2 rounded-lg bg-[#087BFF] hover:bg-[#0666D6] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-sm transition-colors"
                        aria-label={`Gọi ngay số ${p.number}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Gọi ngay</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Security note */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-400 dark:text-[#A5B2C7]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Số điện thoại chính thức được bảo đảm</span>
              </span>
              <span>Khu vực: {NEXIS_BRAND.locationDisplay}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

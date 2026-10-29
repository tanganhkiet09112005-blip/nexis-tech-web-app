/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ZaloPickerModal: Bộ chọn người tư vấn qua Zalo chính thức của Nexis Tech.
 * - Người tư vấn 1: Chưa có URL hợp lệ -> Hiển thị "Đang cập nhật", không điều hướng.
 * - Người tư vấn 2: https://zaloapp.com/qr/p/ryusg52izbti -> Mở tab mới trực tiếp.
 * Tuân thủ nghiêm ngặt: Nhãn trung tính, biểu tượng đại diện trung tính, không giả mạo danh tính,
 * quản lý focus chuẩn, đóng bằng phím Escape, đồng bộ Light/Dark theme.
 */

import React, { useEffect, useRef } from 'react';
import { UserCheck, MessageSquare, AlertCircle, ExternalLink, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NEXIS_BRAND, ZaloContact } from '../config/brand.ts';

interface ZaloPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZaloPickerModal: React.FC<ZaloPickerModalProps> = ({ isOpen, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="zalo-picker-title"
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
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-[#0068FF] dark:text-[#16D9F3] flex items-center justify-center font-bold text-sm">
                  <MessageSquare className="w-5 h-5 text-[#0068FF] dark:text-[#16D9F3]" />
                </div>
                <div>
                  <h3 id="zalo-picker-title" className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                    Chọn người tư vấn qua Zalo
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#A5B2C7]">
                    Kết nối trực tiếp với đội ngũ tư vấn Nexis Tech
                  </p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Đóng cửa sổ chọn người tư vấn Zalo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of 2 Zalo options */}
            <div className="py-4 space-y-3">
              {NEXIS_BRAND.zaloContacts.map((contact: ZaloContact) => {
                const isUpdating = contact.status === 'updating' || !contact.url;

                return (
                  <div
                    key={contact.id}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      isUpdating
                        ? 'bg-slate-50/70 dark:bg-[#172033]/60 border-slate-200/80 dark:border-white/5 opacity-85'
                        : 'bg-white dark:bg-[#172033] border-slate-200 dark:border-white/10 hover:border-[#0068FF]/60 dark:hover:border-[#16D9F3]/60 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Neutral Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-[#A5B2C7] shrink-0">
                          <UserCheck className="w-5 h-5 text-[#087BFF] dark:text-[#16D9F3]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {contact.label}
                            </span>
                            {isUpdating ? (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20">
                                Đang cập nhật
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20">
                                Sẵn sàng
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-[#A5B2C7] truncate mt-0.5">
                            {contact.role}
                          </p>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="shrink-0">
                        {isUpdating ? (
                          <div
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 text-xs font-medium cursor-not-allowed inline-flex items-center gap-1.5"
                            title="Liên kết Zalo người thứ nhất đang được cập nhật"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                            <span>Chờ link</span>
                          </div>
                        ) : (
                          <a
                            href={contact.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="px-3.5 py-2 rounded-lg bg-[#0068FF] hover:bg-[#0055D4] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-colors"
                            aria-label={`Mở liên kết Zalo của ${contact.label}`}
                          >
                            <span>Nhắn tin Zalo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {isUpdating && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-white/5 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        <span>Kênh này đang được cấu hình đường link chính thức</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Notice */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10 text-[11px] text-slate-400 dark:text-[#A5B2C7] leading-relaxed">
              Bạn sẽ được chuyển trực tiếp tới ứng dụng Zalo trên điện thoại hoặc trình duyệt web.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

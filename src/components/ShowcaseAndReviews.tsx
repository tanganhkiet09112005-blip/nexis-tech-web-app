/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Section 08: Tham khảo website theo lĩnh vực (Real Reference Websites Carousel + Large Preview Modal)
 * Section 09: Đánh giá từ khách hàng (Laptop Frame with honest "Phản hồi khách hàng đang được cập nhật" state)
 * Section 10: Kiến thức website (3-Card Grid with Nexis Tech Top Tab Banner + Full Article Reader Modal)
 */

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Quote,
  BookOpen,
  X,
  CheckCircle2,
  Sparkles,
  Globe,
  ImageOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  NEXIS_BRAND,
  ReferenceWebsite,
  KnowledgeArticle,
} from '../config/brand.ts';
import { getWrappedIndex } from '../utils/validation.ts';

interface ShowcaseAndReviewsProps {
  onSelectTemplateForQuote: (templateName: string) => void;
}

export const ShowcaseAndReviews: React.FC<ShowcaseAndReviewsProps> = ({
  onSelectTemplateForQuote,
}) => {
  const allWebsites = NEXIS_BRAND.referenceWebsites;
  const categories = ['Tất cả', ...Array.from(new Set(allWebsites.map((w) => w.category)))];

  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [modalSite, setModalSite] = useState<ReferenceWebsite | null>(null);
  const [modalArticle, setModalArticle] = useState<KnowledgeArticle | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const filteredWebsites =
    selectedCategory === 'Tất cả'
      ? allWebsites
      : allWebsites.filter((site) => site.category === selectedCategory);

  const safeSlideIndex = activeSlideIndex % filteredWebsites.length;
  const currentSite = filteredWebsites[safeSlideIndex] || allWebsites[0];
  const prevSite =
    filteredWebsites[getWrappedIndex(safeSlideIndex, -1, filteredWebsites.length)] ||
    allWebsites[0];
  const nextSite =
    filteredWebsites[getWrappedIndex(safeSlideIndex, 1, filteredWebsites.length)] ||
    allWebsites[0];

  // Prevent background scroll when any modal is open
  useEffect(() => {
    if (modalSite || modalArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalSite, modalArticle]);

  // Handle Escape key to close modals
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (modalSite) setModalSite(null);
        if (modalArticle) setModalArticle(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modalSite, modalArticle]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setActiveSlideIndex(0);
  };

  const handlePrevSlide = () => {
    setSlideDirection('left');
    setActiveSlideIndex((prev) => getWrappedIndex(prev, -1, filteredWebsites.length));
  };

  const handleNextSlide = () => {
    setSlideDirection('right');
    setActiveSlideIndex((prev) => getWrappedIndex(prev, 1, filteredWebsites.length));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) handlePrevSlide();
      else handleNextSlide();
    }
    setTouchStartX(null);
  };

  const markImageBroken = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  const canShowImage = (site: ReferenceWebsite) => {
    return Boolean(site.previewImage && !brokenImages[site.id]);
  };

  return (
    <>
      {/* =====================================================================
          SECTION 08: THAM KHẢO WEBSITE THEO LĨNH VỰC (CAROUSEL + PREVIEW)
         ===================================================================== */}
      <section
        id="tham-khao"
        className="py-16 sm:py-24 bg-[#F5F7FA] dark:bg-[#0B1120] text-[#172033] dark:text-[#E8EDF5] border-b border-slate-200/80 dark:border-white/10 overflow-hidden transition-colors duration-200"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-medium text-[#087BFF] dark:text-[#16D9F3] bg-[#087BFF]/10 dark:bg-[#087BFF]/20 px-3.5 py-1 rounded-full mb-3">
            Thư viện giao diện
          </span>

          <h2 className="heading-section text-slate-900 dark:text-[#E8EDF5] max-w-3xl mx-auto">
            Tham khảo website theo{' '}
            <span className="text-[#087BFF] dark:text-[#16D9F3]">từng lĩnh vực kinh doanh</span>
          </h2>

          <p className="body-copy text-slate-600 dark:text-[#A5B2C7] max-w-2xl mx-auto mt-3">
            Tuyển tập website mẫu và dự án thực tế giúp bạn dễ dàng hình dung phong cách bố cục, màu sắc và trải nghiệm phù hợp với thương hiệu của mình.
          </p>

          {/* Dynamic Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#087BFF] text-white shadow-xs'
                    : 'bg-white dark:bg-[#111827] text-slate-700 dark:text-[#A5B2C7] border border-slate-200 dark:border-white/10 hover:border-[#087BFF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Large Interactive 3D Stepped Carousel */}
          <div className="relative max-w-5xl mx-auto flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
            {/* Left Side Card Preview */}
            {filteredWebsites.length > 1 && (
              <button
                type="button"
                onClick={handlePrevSlide}
                className="hidden xl:block absolute left-0 w-[26%] bg-white/90 dark:bg-[#111827]/90 border border-slate-200 dark:border-white/15 rounded-2xl p-3 opacity-65 hover:opacity-95 -translate-x-4 transition-all duration-300 cursor-pointer text-left shadow-lg"
                aria-label={`Chuyển sang ${prevSite.name}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {prevSite.name}
                  </span>
                  <span className="text-[11px] font-medium text-[#087BFF] dark:text-[#16D9F3] bg-[#087BFF]/15 px-2 py-0.5 rounded-md shrink-0">
                    {prevSite.category}
                  </span>
                </div>
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-[#0B1120] border border-slate-200 dark:border-white/10">
                  {canShowImage(prevSite) ? (
                    <img
                      src={prevSite.previewImage}
                      alt={`Ảnh chụp trang chủ ${prevSite.name}`}
                      onError={() => markImageBroken(prevSite.id)}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                      <Globe className="w-5 h-5 text-[#087BFF] dark:text-[#16D9F3] mb-1" />
                      <span className="text-[11px] text-slate-500 dark:text-[#A5B2C7]">
                        Ảnh xem trước đang được cập nhật
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[11px] text-slate-500 dark:text-[#A5B2C7] truncate">
                  {prevSite.domain}
                </div>
              </button>
            )}

            {/* Right Side Card Preview */}
            {filteredWebsites.length > 1 && (
              <button
                type="button"
                onClick={handleNextSlide}
                className="hidden xl:block absolute right-0 w-[26%] bg-white/90 dark:bg-[#111827]/90 border border-slate-200 dark:border-white/15 rounded-2xl p-3 opacity-65 hover:opacity-95 translate-x-4 transition-all duration-300 cursor-pointer text-left shadow-lg"
                aria-label={`Chuyển sang ${nextSite.name}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {nextSite.name}
                  </span>
                  <span className="text-[11px] font-medium text-[#087BFF] dark:text-[#16D9F3] bg-[#087BFF]/15 px-2 py-0.5 rounded-md shrink-0">
                    {nextSite.category}
                  </span>
                </div>
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-[#0B1120] border border-slate-200 dark:border-white/10">
                  {canShowImage(nextSite) ? (
                    <img
                      src={nextSite.previewImage}
                      alt={`Ảnh chụp trang chủ ${nextSite.name}`}
                      onError={() => markImageBroken(nextSite.id)}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                      <Globe className="w-5 h-5 text-[#087BFF] dark:text-[#16D9F3] mb-1" />
                      <span className="text-[11px] text-slate-500 dark:text-[#A5B2C7]">
                        Ảnh xem trước đang được cập nhật
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[11px] text-slate-500 dark:text-[#A5B2C7] truncate">
                  {nextSite.domain}
                </div>
              </button>
            )}

            {/* Left Prev Button */}
            {filteredWebsites.length > 1 && (
              <button
                type="button"
                onClick={handlePrevSlide}
                className="z-30 mr-2 sm:mr-4 w-11 h-11 rounded-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/20 hover:bg-[#087BFF] hover:border-[#087BFF] text-slate-800 dark:text-white hover:text-white flex items-center justify-center shrink-0 shadow-lg transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#087BFF]"
                aria-label="Website tham khảo trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* CENTER LARGE BROWSER PREVIEW CARD WITH MOTION */}
            <div className="relative z-20 w-full max-w-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.article
                  key={currentSite.id}
                  initial={{ opacity: 0, x: slideDirection === 'right' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDirection === 'right' ? -20 : 20 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white dark:bg-[#111827] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/15"
                >
                  {/* Minimalist Browser Top Bar */}
                  <div className="px-4 py-2.5 bg-slate-100 dark:bg-[#0B1120] border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                      <a
                        href={currentSite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 px-3 py-1 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-[#E8EDF5] hover:border-[#087BFF] dark:hover:border-[#16D9F3] flex items-center gap-1.5 truncate transition-colors duration-200"
                        title={`Mở ${currentSite.url} trong tab mới`}
                      >
                        <Globe className="w-3.5 h-3.5 text-[#087BFF] dark:text-[#16D9F3] shrink-0" />
                        <span className="truncate">{currentSite.domain}</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-md bg-slate-200/80 dark:bg-white/10 text-xs font-medium text-slate-700 dark:text-[#B5C7DF]">
                        {currentSite.category}
                      </span>
                      <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-[#087BFF]/15 dark:bg-[#087BFF]/25 text-[#087BFF] dark:text-[#16D9F3] text-xs font-medium">
                        {currentSite.isTemplate ? 'Mẫu giao diện tham khảo' : 'Website tham khảo'}
                      </span>
                    </div>
                  </div>

                  {/* Screenshot Display Area (16:10 aspect ratio, object-top) */}
                  <div className="relative bg-slate-100 dark:bg-[#0B1120] aspect-[16/10] w-full overflow-hidden border-b border-slate-200 dark:border-white/10">
                    {canShowImage(currentSite) ? (
                      <a
                        href={currentSite.demoUrl || currentSite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full group relative cursor-pointer"
                        aria-label={`Mở ${currentSite.name} (${currentSite.domain})`}
                      >
                        <img
                          src={currentSite.previewImage}
                          alt={`Ảnh chụp giao diện trang chủ ${currentSite.name} (${currentSite.domain})`}
                          onError={() => markImageBroken(currentSite.id)}
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.015]"
                        />
                        <div className="absolute inset-0 bg-[#0B1120]/0 group-hover:bg-[#0B1120]/30 transition-colors duration-200 flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 py-2 rounded-xl bg-slate-900/90 text-white text-sm font-medium inline-flex items-center gap-2 shadow-lg">
                            <span>{currentSite.demoUrl ? 'Xem demo thực tế' : `Mở ${currentSite.domain}`}</span>
                            <ExternalLink className="w-4 h-4 text-[#16D9F3]" />
                          </span>
                        </div>
                      </a>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-gradient-to-b from-slate-100 to-slate-200 dark:from-[#111827] dark:to-[#0B1120]">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-slate-300 dark:border-white/10 flex items-center justify-center text-[#087BFF] dark:text-[#16D9F3] mb-3">
                          <ImageOff className="w-6 h-6" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
                          Ảnh xem trước đang được cập nhật
                        </h3>
                        <a
                          href={currentSite.demoUrl || currentSite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 px-5 py-2.5 rounded-xl text-sm font-medium text-white next-glow-pill inline-flex items-center gap-2"
                        >
                          <span>{currentSite.demoUrl ? 'Xem bản demo' : `Mở website thật (${currentSite.domain})`}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Info & Action Buttons */}
                  <div className="p-5 sm:p-6 bg-white dark:bg-[#111827] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 text-left max-w-xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                          {currentSite.name}
                        </h3>
                        <span className="text-xs font-medium text-[#087BFF] dark:text-[#16D9F3] bg-[#087BFF]/15 px-2.5 py-0.5 rounded-md">
                          {currentSite.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-[#A5B2C7]">
                          {currentSite.domain}
                        </span>
                      </div>
                      <p className="text-sm sm:text-[15px] text-slate-600 dark:text-[#A5B2C7] font-normal leading-relaxed">
                        {currentSite.description}
                      </p>
                    </div>

                    {/* Action Buttons: Xem trước + Xem demo / Nguồn mẫu / Mở website thật */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setModalSite(currentSite)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#0B1120] border border-slate-200 dark:border-white/15 hover:border-[#087BFF] dark:hover:border-[#16D9F3]/60 text-sm font-medium text-slate-800 dark:text-[#E8EDF5] inline-flex items-center gap-2 transition-colors duration-200 cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-[#087BFF] dark:text-[#16D9F3]" />
                        <span>Xem trước</span>
                      </button>

                      {currentSite.demoUrl ? (
                        <>
                          <a
                            href={currentSite.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-white next-glow-pill inline-flex items-center gap-1.5"
                          >
                            <span>Xem demo</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <a
                            href={currentSite.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-[#E8EDF5] bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-white/15 hover:border-[#087BFF] inline-flex items-center gap-1.5 transition-colors"
                          >
                            <span>Nguồn mẫu</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </a>
                        </>
                      ) : (
                        <a
                          href={currentSite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl text-sm font-medium text-white next-glow-pill inline-flex items-center gap-2"
                        >
                          <span>Mở website thật</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>

            {/* Right Next Button */}
            {filteredWebsites.length > 1 && (
              <button
                type="button"
                onClick={handleNextSlide}
                className="z-30 ml-2 sm:ml-4 w-11 h-11 rounded-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/20 hover:bg-[#087BFF] hover:border-[#087BFF] text-slate-800 dark:text-white hover:text-white flex items-center justify-center shrink-0 shadow-lg transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#087BFF]"
                aria-label="Website tham khảo tiếp theo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-6">
            {filteredWebsites.map((site, idx) => (
              <button
                key={site.id}
                type="button"
                onClick={() => {
                  setSlideDirection(idx > safeSlideIndex ? 'right' : 'left');
                  setActiveSlideIndex(idx);
                }}
                aria-label={`Chọn website ${site.name}`}
                className={`rounded-full transition-all duration-200 cursor-pointer ${
                  safeSlideIndex === idx
                    ? 'w-7 h-2.5 bg-[#087BFF] dark:bg-[#16D9F3]'
                    : 'w-2.5 h-2.5 bg-slate-300 dark:bg-white/30 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 09: PHẢN HỒI KHÁCH HÀNG (Laptop Mockup with Honest Status)
         ===================================================================== */}
      <section
        id="danh-gia"
        className="py-16 sm:py-24 bg-white dark:bg-[#111827] text-[#172033] dark:text-[#E8EDF5] border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-medium text-[#087BFF] dark:text-[#16D9F3] bg-[#087BFF]/10 dark:bg-[#087BFF]/20 px-3 py-1 rounded-full mb-3">
            Thông tin xác thực
          </span>
          <h2 className="heading-section text-slate-900 dark:text-[#E8EDF5] mb-10 sm:mb-12">
            Đánh giá từ khách hàng
          </h2>

          {/* Centered Laptop Mockup Frame */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#1E293B] border-[4px] border-[#334155] rounded-t-2xl p-3 sm:p-4 shadow-[0_20px_50px_rgba(3,11,36,0.14)]">
              {/* Screen Content */}
              <div className="rounded-xl bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#087BFF] text-white p-8 sm:p-12 relative overflow-hidden">
                <Quote
                  className="w-14 h-14 sm:w-20 sm:h-20 text-[#16D9F3]/20 absolute top-4 left-6 pointer-events-none"
                  aria-hidden="true"
                />

                <div className="relative z-10 max-w-xl mx-auto space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-[#16D9F3]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Phản hồi khách hàng đang được cập nhật</span>
                  </span>

                  <p className="body-copy text-[#E8EDF5]">
                    Nexis Tech tôn trọng tính xác thực trong mọi thông tin công bố. Khu vực phản hồi và đánh giá thực tế từ khách hàng đang trong quá trình tổng hợp và chỉ hiển thị sau khi có sự đồng ý chính thức từ doanh nghiệp đối tác.
                  </p>

                  <p className="text-sm text-[#A5B2C7]">
                    Bạn có thể liên hệ trực tiếp qua số {NEXIS_BRAND.phone1} / {NEXIS_BRAND.phone2} hoặc email {NEXIS_BRAND.emailDisplay} để trao đổi cùng đội ngũ kỹ thuật của chúng tôi.
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onSelectTemplateForQuote('Tư vấn giải pháp website')}
                      className="px-6 py-2.5 rounded-xl bg-white text-[#030B24] hover:bg-[#16D9F3] text-sm font-medium transition-colors duration-200 cursor-pointer"
                    >
                      Liên hệ trao đổi trực tiếp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop Metallic Base Deck */}
            <div className="h-3.5 sm:h-4 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b-2xl mx-[-12px] sm:mx-[-24px] shadow-md flex items-center justify-center">
              <div className="w-16 h-1 rounded-full bg-slate-700" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 10: BÀI VIẾT KIẾN THỨC WEBSITE
         ===================================================================== */}
      <section
        id="kien-thuc"
        className="py-16 sm:py-24 bg-[#F5F7FA] dark:bg-[#0B1120] text-[#172033] dark:text-[#E8EDF5] border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-medium text-[#087BFF] dark:text-[#16D9F3] bg-[#087BFF]/10 dark:bg-[#087BFF]/20 px-3 py-1 rounded-full mb-2">
              Tin tức & Cẩm nang
            </span>
            <h2 className="heading-section text-slate-900 dark:text-[#E8EDF5]">
              Kiến thức website
            </h2>
            <p className="body-copy text-slate-600 dark:text-[#A5B2C7] mt-2">
              Cập nhật thông tin, kiến thức và kinh nghiệm thiết kế, phát triển website cho doanh nghiệp của bạn.
            </p>
          </div>

          {/* 3-Card Knowledge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {NEXIS_BRAND.knowledgeArticles.map((art, index) => (
              <article
                key={art.id}
                className="bg-white dark:bg-[#172033] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-[#087BFF]/40 flex flex-col justify-between card-hover-lift"
              >
                <div>
                  {/* Card Thumbnail Header with Top-Center Nexis Tech Tab */}
                  <div
                    onClick={() => setModalArticle(art)}
                    className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#087BFF] p-5 pt-9 text-white cursor-pointer group"
                  >
                    {/* Top-Center Brand Tab Badge */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 rounded-b-lg bg-[#087BFF] text-white text-[11px] font-medium tracking-wide shadow-xs">
                      Nexis Tech
                    </div>

                    {/* Inner Card Box */}
                    <div className="bg-white/95 text-[#030B24] rounded-lg p-4 shadow-md group-hover:scale-[1.01] transition-transform duration-200">
                      <span className="text-[11px] font-medium text-[#087BFF] block mb-1">
                        Cẩm nang 0{index + 1} · {art.category}
                      </span>
                      <div className="text-sm font-semibold leading-snug line-clamp-2">
                        {art.title}
                      </div>
                      <div className="mt-3 flex items-center gap-1.5">
                        <span className="w-6 h-1 rounded-full bg-[#087BFF]" />
                        <span className="w-3 h-1 rounded-full bg-[#16D9F3]" />
                        <span className="w-1.5 h-1 rounded-full bg-slate-300" />
                      </div>
                    </div>
                  </div>

                  {/* Card Text Body */}
                  <div className="pt-4 px-1 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#A5B2C7] font-medium">
                      <span className="text-[#087BFF] dark:text-[#16D9F3]">{art.category}</span>
                      <span>{art.readTime}</span>
                    </div>

                    <h3 className="heading-card text-slate-900 dark:text-[#E8EDF5] hover:text-[#087BFF] dark:hover:text-[#16D9F3] transition-colors duration-200">
                      <button
                        type="button"
                        onClick={() => setModalArticle(art)}
                        className="text-left cursor-pointer"
                      >
                        {art.title}
                      </button>
                    </h3>

                    <p className="text-[15px] text-slate-600 dark:text-[#A5B2C7] leading-relaxed line-clamp-3 font-normal">
                      {art.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-4 px-1 mt-4 border-t border-slate-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalArticle(art)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#087BFF] dark:text-[#16D9F3] hover:text-slate-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Đọc nội dung hướng dẫn</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          MODAL 1: XEM TRƯỚC WEBSITE THAM KHẢO WITH MOTION
         ===================================================================== */}
      <AnimatePresence>
        {modalSite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#0B1120]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-site-title"
            onClick={() => setModalSite(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/15 rounded-2xl max-w-4xl w-full overflow-hidden text-slate-900 dark:text-[#E8EDF5] shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-100 dark:bg-[#0B1120] border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#087BFF]/15 dark:bg-[#087BFF]/25 text-[#087BFF] dark:text-[#16D9F3]">
                    {modalSite.isTemplate ? 'Mẫu giao diện tham khảo' : 'Website tham khảo'} · {modalSite.category}
                  </span>
                  <h3 id="modal-site-title" className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                    {modalSite.name} ({modalSite.domain})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalSite(null)}
                  className="p-2 rounded-lg bg-slate-200/80 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-600 dark:text-[#A5B2C7] hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  aria-label="Đóng hộp thoại xem trước"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Real Screenshot Preview + Reference Highlights */}
              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                {canShowImage(modalSite) ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-[#0B1120]">
                    <img
                      src={modalSite.previewImage}
                      alt={`Ảnh chụp giao diện thật của ${modalSite.name}`}
                      onError={() => markImageBroken(modalSite.id)}
                      className="w-full h-auto object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#0B1120] p-6 text-center space-y-3">
                    <ImageOff className="w-7 h-7 text-[#087BFF] dark:text-[#16D9F3] mx-auto" />
                    <div className="text-base font-semibold text-slate-800 dark:text-white">
                      Ảnh xem trước đang được cập nhật
                    </div>
                    <a
                      href={modalSite.demoUrl || modalSite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white next-glow-pill"
                    >
                      <span>{modalSite.demoUrl ? 'Xem demo' : `Mở website thật (${modalSite.domain})`}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                <div className="space-y-3 text-left">
                  <p className="body-copy text-slate-600 dark:text-[#A5B2C7]">
                    {modalSite.description}
                  </p>

                  <div className="text-sm font-medium text-[#087BFF] dark:text-[#16D9F3] pt-1">
                    Đặc điểm tham khảo trên mẫu này:
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {modalSite.highlights.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 bg-slate-50 dark:bg-[#0B1120]/70 border border-slate-200 dark:border-white/10 rounded-xl p-3.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#087BFF] dark:text-[#16D9F3] shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-800 dark:text-[#E8EDF5]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const selectedCategoryName = modalSite.category;
                      setModalSite(null);
                      onSelectTemplateForQuote(`Tham khảo phong cách ngành ${selectedCategoryName}`);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-sm font-medium text-slate-800 dark:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Nhận tư vấn website cùng lĩnh vực
                  </button>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    {modalSite.demoUrl ? (
                      <>
                        <a
                          href={modalSite.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white next-glow-pill inline-flex items-center justify-center gap-2"
                        >
                          <span>Xem demo</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <a
                          href={modalSite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-[#E8EDF5] bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-white/15 hover:border-[#087BFF] inline-flex items-center gap-1.5"
                        >
                          <span>Nguồn mẫu</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </>
                    ) : (
                      <a
                        href={modalSite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium text-white next-glow-pill inline-flex items-center justify-center gap-2"
                      >
                        <span>Mở website thật ({modalSite.domain})</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          MODAL 2: FULL KNOWLEDGE ARTICLE READER WITH MOTION
         ===================================================================== */}
      <AnimatePresence>
        {modalArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#0B1120]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-article-title"
            onClick={() => setModalArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/15 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-[#172033] dark:text-[#E8EDF5] shadow-2xl space-y-5 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
                <div>
                  <span className="text-xs font-medium text-[#087BFF] dark:text-[#16D9F3]">
                    {modalArticle.category} · {modalArticle.readTime}
                  </span>
                  <h3 id="modal-article-title" className="text-xl font-semibold text-slate-900 dark:text-white mt-1">
                    {modalArticle.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalArticle(null)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-600 dark:text-[#A5B2C7] cursor-pointer"
                  aria-label="Đóng bài viết"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 body-copy text-slate-600 dark:text-[#A5B2C7] max-h-[60vh] overflow-y-auto pr-1">
                {modalArticle.contentParagraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="bg-[#F5F7FA] dark:bg-[#0B1120] border border-slate-200 dark:border-white/10 rounded-xl p-4 space-y-2">
                <div className="text-xs font-semibold text-[#087BFF] dark:text-[#16D9F3]">
                  Điểm cốt lõi cần ghi nhớ:
                </div>
                <ul className="space-y-1.5">
                  {modalArticle.keyTakeaways.map((tk, idx) => (
                    <li key={idx} className="text-sm text-slate-700 dark:text-[#E8EDF5] flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#087BFF] dark:text-[#16D9F3] shrink-0 mt-0.5" />
                      <span>{tk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalArticle(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-[#087BFF] dark:hover:bg-[#16D9F3] transition-colors duration-200 cursor-pointer"
                >
                  Đóng bài viết
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

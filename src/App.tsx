/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Nexis Tech — Single-page digital experience application
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { HeaderNav } from './components/HeaderNav.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { IntroAndBenefits } from './components/IntroAndBenefits.tsx';
import { CriteriaAndReasons } from './components/CriteriaAndReasons.tsx';
import { ShowcaseAndReviews } from './components/ShowcaseAndReviews.tsx';
import { SolutionsAndQuote } from './components/SolutionsAndQuote.tsx';
import { FaqCtaFooter } from './components/FaqCtaFooter.tsx';
import { PhonePickerModal } from './components/PhonePickerModal.tsx';
import { ZaloPickerModal } from './components/ZaloPickerModal.tsx';

function AppContent() {
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isZaloModalOpen, setIsZaloModalOpen] = useState(false);

  const scrollToQuote = (serviceTitle?: string) => {
    if (serviceTitle) {
      setPreselectedService(serviceTitle);
    }
    const el = document.getElementById('bao-gia');
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
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-[#0B1120] text-[#172033] dark:text-[#E8EDF5] selection:bg-[#087BFF] selection:text-white overflow-x-hidden transition-colors duration-200">
      {/* 01. Thanh điều hướng đầu trang */}
      <HeaderNav
        onNavigateToQuote={scrollToQuote}
        onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
      />

      <main className="flex-1">
        {/* 02. Khu vực mở đầu (Hero) */}
        <HeroSection
          onPrimaryCta={() => scrollToQuote()}
          onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
        />

        {/* 03. Khối giới thiệu vai trò website & 04. Lợi ích khi có website */}
        <IntroAndBenefits />

        {/* 05. Tiêu chí website chất lượng, 06. Vòng tròn 8 lý do chọn Nexis Tech & 07. Năng lực - Cam kết */}
        <CriteriaAndReasons onNavigateToQuote={scrollToQuote} />

        {/* 08. Kho giao diện mẫu, 09. Đánh giá khách hàng & 10. Bài viết kiến thức */}
        <ShowcaseAndReviews onSelectTemplateForQuote={(templateName: string) => scrollToQuote(templateName)} />

        {/* 11. Giải pháp theo lĩnh vực & 12. Khu vực đăng ký tư vấn / nhận báo giá */}
        <SolutionsAndQuote
          preselectedService={preselectedService}
          onOpenZaloModal={() => setIsZaloModalOpen(true)}
        />

        {/* 13. Câu hỏi thường gặp (FAQ), 14. Banner kêu gọi hành động cuối trang, 15. Chân trang (Footer) & 16. Cụm nút hành động nổi */}
        <FaqCtaFooter
          onScrollToQuote={scrollToQuote}
          onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
          onOpenZaloModal={() => setIsZaloModalOpen(true)}
        />
      </main>

      {/* Bộ chọn điện thoại 2 số */}
      <PhonePickerModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />

      {/* Bộ chọn Zalo 2 người tư vấn */}
      <ZaloPickerModal
        isOpen={isZaloModalOpen}
        onClose={() => setIsZaloModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeaderNav } from './components/HeaderNav.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { IntroAndBenefits } from './components/IntroAndBenefits.tsx';
import { CriteriaAndReasons } from './components/CriteriaAndReasons.tsx';
import { ShowcaseAndReviews } from './components/ShowcaseAndReviews.tsx';
import { SolutionsAndQuote } from './components/SolutionsAndQuote.tsx';
import { FaqCtaFooter } from './components/FaqCtaFooter.tsx';

export default function App() {
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const scrollToQuote = (serviceTitle?: string) => {
    if (serviceTitle) {
      setPreselectedService(serviceTitle);
    }
    const el = document.getElementById('bao-gia');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F7FC] text-[#030B24] selection:bg-[#087BFF] selection:text-white overflow-x-hidden">
      {/* 01. Thanh điều hướng đầu trang */}
      <HeaderNav onNavigateToQuote={scrollToQuote} />

      <main className="flex-1">
        {/* 02. Khu vực mở đầu (Hero) */}
        <HeroSection onPrimaryCta={() => scrollToQuote()} />

        {/* 03. Khối giới thiệu vai trò website & 04. Lợi ích khi có website */}
        <IntroAndBenefits />

        {/* 05. Tiêu chí website chất lượng, 06. Vòng tròn 8 lý do chọn NEXTTECH & 07. Năng lực - Cam kết */}
        <CriteriaAndReasons onNavigateToQuote={scrollToQuote} />

        {/* 08. Kho giao diện mẫu (Coverflow), 09. Đánh giá khách hàng & 10. Bài viết kiến thức */}
        <ShowcaseAndReviews onSelectTemplateForQuote={(templateName: string) => scrollToQuote(templateName)} />

        {/* 11. Giải pháp theo lĩnh vực & 12. Khu vực đăng ký tư vấn / nhận báo giá */}
        <SolutionsAndQuote preselectedService={preselectedService} />

        {/* 13. Câu hỏi thường gặp (FAQ), 14. Banner kêu gọi hành động cuối trang, 15. Chân trang (Footer) & 16. Cụm nút hành động nổi */}
        <FaqCtaFooter onScrollToQuote={scrollToQuote} />
      </main>
    </div>
  );
}

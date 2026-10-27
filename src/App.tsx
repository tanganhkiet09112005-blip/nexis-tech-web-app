/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Nexis Tech — High-converting modern tech landing page
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
    <div className="min-h-screen flex flex-col bg-[#030B24] text-[#F4F8FF] selection:bg-[#087BFF] selection:text-white overflow-x-hidden">
      {/* 01. Thanh điều hướng đầu trang */}
      <HeaderNav onNavigateToQuote={scrollToQuote} />

      <main className="flex-1">
        {/* 02. Khu vực mở đầu (Hero) với Marquee công nghệ & Thống kê chuyển đổi */}
        <HeroSection onPrimaryCta={() => scrollToQuote()} />

        {/* 03. Bento Grid Năng lực cốt lõi & 04. Slider Lợi ích nổi bật */}
        <IntroAndBenefits />

        {/* 05. Tiêu chí chuẩn mực, 06. Orbital Hub 8 Lý do & 07. Năng lực - Cam kết */}
        <CriteriaAndReasons onNavigateToQuote={scrollToQuote} />

        {/* 08. Kho website mẫu theo lĩnh vực, 09. Đánh giá khách hàng & 10. Kiến thức website */}
        <ShowcaseAndReviews onSelectTemplateForQuote={(templateName: string) => scrollToQuote(templateName)} />

        {/* 11. Bảng gói dịch vụ / Giải pháp & 12. Biểu mẫu đăng ký tư vấn trực tuyến */}
        <SolutionsAndQuote preselectedService={preselectedService} />

        {/* 13. FAQ Accordion mượt mà, 14. Banner CTA cuối trang, 15. Footer & 16. Nút gọi nổi */}
        <FaqCtaFooter onScrollToQuote={scrollToQuote} />
      </main>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Cấu hình tập trung cho thương hiệu Nexis Tech và danh sách website tham khảo.
 * Quản lý thống nhất thông tin liên hệ chính thức:
 * - Thương hiệu: Nexis Tech
 * - Gmail: nexistech.work@gmail.com
 * - Số điện thoại: 0909 858 428
 * - Khu vực: TP. Hồ Chí Minh
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  children?: { label: string; href: string; badge?: string }[];
}

export interface BenefitSlide {
  id: string;
  number: string;
  title: string;
  description: string;
  highlight: string;
}

export interface CriteriaItem {
  id: string;
  iconName: 'globe' | 'shield' | 'credit-card' | 'zap' | 'smartphone' | 'layers';
  title: string;
  description: string;
}

export interface ReasonWheelItem {
  id: string;
  number: string;
  shortTitle: string;
  fullTitle: string;
  description: string;
  position:
    | 'left-1'
    | 'left-2'
    | 'left-3'
    | 'left-4'
    | 'right-1'
    | 'right-2'
    | 'right-3'
    | 'right-4';
  iconName: 'code' | 'wrench' | 'compass' | 'lock' | 'cpu' | 'trending' | 'users' | 'check';
}

export interface QualitativePillar {
  id: string;
  label: string;
  sublabel: string;
}

export interface CommitmentItem {
  id: string;
  title: string;
  summary: string;
}

export interface ReferenceWebsite {
  id: string;
  name: string;
  category: string;
  badge?: string;
  isTemplate?: boolean;
  url: string;
  demoUrl?: string;
  domain: string;
  previewImage: string;
  description: string;
  highlights: string[];
}

export interface PhoneContact {
  id: string;
  number: string;
  href: string;
  label: string;
  note: string;
}

export interface ZaloContact {
  id: string;
  label: string;
  role: string;
  url: string;
  status: 'updating' | 'available';
  statusText: string;
  note?: string;
}

export interface KnowledgeArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  readTime: string;
  contentParagraphs: string[];
  keyTakeaways: string[];
}

export interface IndustrySolution {
  id: string;
  kicker: string;
  title: string;
  description: string;
  industryTag: string;
  desktopScreen: {
    brandHeader: string;
    heroHeadline: string;
    categories: string[];
    products: { name: string; spec: string; tag: string }[];
  };
  mobileScreen: {
    title: string;
    actionLabel: string;
    bullets: string[];
  };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Dữ liệu website thật đang hoạt động để khách hàng tham khảo theo lĩnh vực.
 * Tách riêng gồm: name, category, url, previewImage, description.
 */
export const REFERENCE_WEBSITES: ReferenceWebsite[] = [
  {
    id: 'ref-jysk',
    name: 'JYSK',
    category: 'Nội thất',
    url: 'https://jysk.vn/',
    domain: 'jysk.vn',
    previewImage: './previews/jysk.png',
    description:
      'Đáng tham khảo ở cách phân chia danh mục nội thất theo từng không gian phòng, thanh tìm kiếm nổi bật ngay đầu trang và bố cục banner khuyến mãi rõ ràng.',
    highlights: [
      'Phân nhóm sản phẩm trực quan theo phòng chức năng (phòng khách, phòng ngủ, phòng ăn)',
      'Thanh tìm kiếm trung tâm kết hợp tiện ích tra cứu cửa hàng và giỏ hàng dễ thao tác',
      'Hình ảnh phối cảnh nội thất Bắc Âu sáng sủa, làm nổi bật sản phẩm thực tế',
    ],
  },
  {
    id: 'ref-cocoon',
    name: 'Cocoon',
    category: 'Mỹ phẩm',
    url: 'https://cocoonvietnam.com/',
    domain: 'cocoonvietnam.com',
    previewImage: './previews/cocoon.png',
    description:
      'Đáng tham khảo ở nghệ thuật kể chuyện thương hiệu qua hình ảnh sản phẩm cỡ lớn, bảng màu thiên nhiên dịu mắt và phông chữ biên tập sang trọng.',
    highlights: [
      'Khu vực mở đầu (Hero) chia đôi cân đối giữa hình ảnh sản phẩm thực tế và thông điệp ngắn gọn',
      'Hệ thống điều hướng tối giản giúp người xem tập trung vào dòng sản phẩm và nguyên liệu',
      'Trải nghiệm thị giác đồng nhất, thể hiện rõ cá tính thương hiệu mỹ phẩm thuần chay',
    ],
  },
  {
    id: 'ref-canifa',
    name: 'Canifa',
    category: 'Thời trang',
    url: 'https://canifa.com/',
    domain: 'canifa.com',
    previewImage: './previews/canifa.png',
    description:
      'Đáng tham khảo ở thanh điều hướng phân nhóm thời trang rõ ràng (Nữ, Nam, Bé gái, Bé trai), ô tìm kiếm rộng rãi và banner chiến dịch trực quan ngay đầu trang.',
    highlights: [
      'Thanh menu danh mục thời trang trực quan, dễ tra cứu theo từng nhóm đối tượng mặc',
      'Tích hợp thanh thông báo ưu đãi vận chuyển và khu vực mã giảm giá ngay dưới banner chính',
      'Bố cục thương mại điện tử hiện đại, đồng bộ trải nghiệm giữa website và ứng dụng mua sắm',
    ],
  },
  {
    id: 'ref-base',
    name: 'Base',
    category: 'Giải pháp doanh nghiệp/B2B',
    url: 'https://base.vn/',
    domain: 'base.vn',
    previewImage: './previews/base.png',
    description:
      'Đáng tham khảo ở cách trình bày giải pháp công nghệ B2B mạch lạc, đặt khung giao diện phần mềm thực tế ngay đầu trang để người xem dễ hình dung.',
    highlights: [
      'Tiêu đề giải pháp súc tích đi kèm nút kêu gọi đăng ký trải nghiệm rõ ràng',
      'Minh họa trực tiếp giao diện vận hành ngay bên phải khu vực mở đầu',
      'Phân nhóm bộ giải pháp theo từng nghiệp vụ quản trị doanh nghiệp khoa học',
    ],
  },
  {
    id: 'ref-oh-ecommerce',
    name: 'OH! Thương mại điện tử',
    category: 'Bán hàng tổng hợp',
    badge: 'Mẫu giao diện tham khảo',
    url: 'https://themes.sapo.vn/oh-thuong-mai-dien-tu',
    demoUrl: 'https://themes.sapo.vn/demo/oh-thuong-mai-dien-tu',
    domain: 'themes.sapo.vn',
    previewImage: './previews/oh-ecommerce.png',
    description:
      'Mẫu website thương mại điện tử đa ngành hàng với bố cục khoa học, banner chương trình khuyến mãi nổi bật và phân loại danh mục sản phẩm chi tiết.',
    highlights: [
      'Thanh tìm kiếm thông minh và bộ lọc danh mục trực quan',
      'Khối đếm ngược khuyến mãi giờ vàng kích thích quyết định mua',
      'Trang chi tiết sản phẩm chuẩn nhận diện thương mại hiện đại',
    ],
  },
  {
    id: 'ref-ega-minimart',
    name: 'EGA Mini Mart',
    category: 'Siêu thị mini, gia dụng',
    badge: 'Mẫu giao diện tham khảo',
    url: 'https://themes.sapo.vn/ega-mini-mart/',
    demoUrl: 'https://themes.sapo.vn/demo/ega-mini-mart',
    domain: 'themes.sapo.vn',
    previewImage: './previews/ega-minimart.jpg',
    description:
      'Giao diện tối ưu tỷ lệ chuyển đổi cho siêu thị mini, thực phẩm và gia dụng với bố cục giỏ hàng tiện lợi và thao tác đặt hàng nhanh chóng.',
    highlights: [
      'Tính năng thêm nhanh vào giỏ hàng ngay tại danh mục',
      'Bộ lọc khoảng giá và thương hiệu phản hồi tức thì',
      'Tối ưu hiển thị và trải nghiệm vuốt chạm linh hoạt trên di động',
    ],
  },
  {
    id: 'ref-dola-style',
    name: 'Dola Style',
    category: 'Thời trang, phụ kiện',
    badge: 'Mẫu giao diện tham khảo',
    url: 'https://themes.sapo.vn/dola-style',
    demoUrl: 'https://themes.sapo.vn/demo/dola-style',
    domain: 'themes.sapo.vn',
    previewImage: './previews/dola-style.png',
    description:
      'Phong cách thiết kế thời trang tinh giản, hình ảnh sản phẩm lớn sắc nét kết hợp cùng lookbook theo mùa và bộ lọc size, màu sắc linh hoạt.',
    highlights: [
      'Banner trình diễn Lookbook chuyển động mượt mà',
      'Xem nhanh thông tin và bảng kích cỡ sản phẩm (Size Guide)',
      'Giao diện giỏ hàng bên hông (Slide Cart) tiện lợi',
    ],
  },
  {
    id: 'ref-wolf-mart',
    name: 'Wolf Mart',
    category: 'Cửa hàng nhiều ngành hàng',
    badge: 'Mẫu giao diện tham khảo',
    url: 'https://themes.sapo.vn/wolf-mart',
    demoUrl: 'https://themes.sapo.vn/demo/wolf-mart',
    domain: 'themes.sapo.vn',
    previewImage: './previews/wolf-mart.jpg',
    description:
      'Giao diện kinh doanh đa ngành nghề hiện đại, hỗ trợ trưng bày danh mục sản phẩm phong phú và tốc độ tải trang nhanh.',
    highlights: [
      'Bố cục phân khu danh mục sản phẩm nổi bật ngay trang chủ',
      'Tab chuyển đổi danh mục sản phẩm bán chạy linh hoạt',
      'Chứng chỉ bảo mật và hệ thống thông tin rõ ràng',
    ],
  },
];

export const NEXIS_BRAND = {
  brandName: 'Nexis Tech',
  logoWordmark: 'NEXIS TECH',
  tagline: "Build Digital. Create What's Next.",
  subMessage: 'Giải pháp thiết kế và phát triển website hướng tới hiệu quả vận hành cho doanh nghiệp hiện đại.',
  
  // Phone numbers (Phone 1 and Phone 2)
  phone1: '0909 858 428',
  phone1Href: 'tel:+84909858428',
  phone2: '0326 128 141',
  phone2Href: 'tel:+84326128141',
  
  // Backward compatible primary display
  phoneDisplay: '0909 858 428',
  phoneHref: 'tel:+84909858428',

  phones: [
    {
      id: 'phone-1',
      number: '0909 858 428',
      href: 'tel:+84909858428',
      label: 'Hotline chính',
      note: 'Tư vấn dự án & Báo giá',
    },
    {
      id: 'phone-2',
      number: '0326 128 141',
      href: 'tel:+84326128141',
      label: 'Hỗ trợ kỹ thuật',
      note: 'Tư vấn kỹ thuật & Giải pháp số',
    },
  ] as PhoneContact[],

  // Zalo advisors configuration
  zaloContacts: [
    {
      id: 'zalo-1',
      label: 'Người tư vấn 1',
      role: 'Tư vấn giải pháp website',
      url: 'https://www.image2url.com/vi/qr-to-url',
      status: 'available',
      statusText: 'Sẵn sàng kết nối',
      note: 'Nhắn tin trực tiếp qua Zalo',
    },
    {
      id: 'zalo-2',
      label: 'Người tư vấn 2',
      role: 'Tư vấn kỹ thuật & triển khai',
      url: 'https://zaloapp.com/qr/p/ryusg52izbti',
      status: 'available',
      statusText: 'Sẵn sàng kết nối',
      note: 'Nhắn tin trực tiếp qua Zalo',
    },
  ] as ZaloContact[],

  // Facebook
  facebookUrl: 'https://www.facebook.com/share/1EAzFhaCab/?mibextid=wwXIfr',
  facebookDisplay: 'Facebook Nexis Tech',

  emailDisplay: 'nexistech.work@gmail.com',
  emailHref:
    'mailto:nexistech.work@gmail.com?subject=Y%C3%AAu%20c%E1%BA%A7u%20t%C6%B0%20v%E1%BA%A5n%20website%20%E2%80%93%20Nexis%20Tech',
  locationDisplay: 'TP. Hồ Chí Minh',

  // Muted tech palette with dedicated dark and light modes
  colors: {
    // Dark mode
    navyPrimary: '#0B1120',
    navySecondary: '#111827',
    cardDark: '#172033',
    textMainDark: '#E8EDF5',
    textSubDark: '#A5B2C7',
    electricBlue: '#087BFF',
    cyanAccent: '#16D9F3',

    // Light mode
    lightPrimary: '#F5F7FA',
    lightSurface: '#FFFFFF',
    lightSecondary: '#EBF0F6',
    textMainLight: '#172033',
    textSubLight: '#526176',
    accentBlueLight: '#087BFF',
  },

  coreServices: [
    {
      id: 'web-ecommerce',
      title: 'Phát triển Website, Web App & Thương mại điện tử',
      shortTitle: 'Website, Web App & E-commerce',
      description:
        'Thiết kế và phát triển website doanh nghiệp, trang bán hàng trực tuyến và ứng dụng web theo yêu cầu với kiến trúc hiện đại, tốc độ phản hồi nhanh và dễ mở rộng.',
    },
    {
      id: 'ui-ux-design',
      title: 'Thiết kế giao diện UI/UX',
      shortTitle: 'Thiết kế giao diện UI/UX',
      description:
        'Nghiên cứu hành trình người dùng, xây dựng hệ thống giao diện đồng bộ và trình bày nội dung trực quan trên máy tính, máy tính bảng và điện thoại.',
    },
    {
      id: 'software-dev',
      title: 'Phát triển phần mềm Frontend, Backend & Full-stack',
      shortTitle: 'Frontend, Backend & Full-stack',
      description:
        'Xây dựng hệ thống phần mềm nền tảng web, API hiệu năng cao, cơ sở dữ liệu an toàn và kiến trúc tách lớp dễ bảo trì dài hạn.',
    },
    {
      id: 'ai-integration',
      title: 'Giải pháp tích hợp AI',
      shortTitle: 'Giải pháp tích hợp AI',
      description:
        'Tích hợp công cụ tìm kiếm thông minh, gợi ý sản phẩm theo ngữ cảnh, tự động hóa quy trình xử lý dữ liệu và hỗ trợ tra cứu thông tin.',
    },
    {
      id: 'cloud-deployment',
      title: 'Cloud & Triển khai hạ tầng',
      shortTitle: 'Cloud & Triển khai hạ tầng',
      description:
        'Cấu hình hạ tầng đám mây, tối ưu phân phối nội dung CDN, bảo mật chứng chỉ SSL và quy trình triển khai ổn định.',
    },
    {
      id: 'maintenance-support',
      title: 'Bảo trì & Hỗ trợ kỹ thuật',
      shortTitle: 'Bảo trì & Hỗ trợ kỹ thuật',
      description:
        'Đồng hành kiểm tra định kỳ, tối ưu hiệu năng, sao lưu dữ liệu và nâng cấp tính năng theo từng giai đoạn phát triển của doanh nghiệp.',
    },
  ],

  navigation: [
    { id: 'home', label: 'Trang chủ', href: '#top' },
    { id: 'intro', label: 'Giới thiệu', href: '#gioi-thieu' },
    {
      id: 'web-design',
      label: 'Thiết kế website',
      href: '#tieu-chi',
      children: [
        { label: 'Lợi ích khi có website', href: '#loi-ich' },
        { label: 'Tiêu chí website chất lượng', href: '#tieu-chi' },
        { label: 'Lý do chọn Nexis Tech', href: '#ly-do' },
        { label: 'Giải pháp theo ngành', href: '#giai-phap-nganh' },
      ],
    },
    {
      id: 'services',
      label: 'Dịch vụ',
      href: '#giai-phap-nganh',
      children: [
        { label: 'Phát triển Website, Web App & E-commerce', href: '#bao-gia', badge: 'Trọng tâm' },
        { label: 'Thiết kế giao diện UI/UX', href: '#bao-gia' },
        { label: 'Phát triển Frontend, Backend & Full-stack', href: '#bao-gia' },
        { label: 'Giải pháp tích hợp AI', href: '#bao-gia' },
        { label: 'Cloud & Triển khai hạ tầng', href: '#bao-gia' },
        { label: 'Bảo trì & Hỗ trợ kỹ thuật', href: '#bao-gia' },
      ],
    },
    { id: 'portfolio', label: 'Website tham khảo', href: '#bo-suu-tap' },
    { id: 'knowledge', label: 'Kiến thức', href: '#kien-thuc' },
    { id: 'faq', label: 'Giải đáp', href: '#faq' },
  ] as NavItem[],

  hero: {
    lead: 'Giải pháp website cho doanh nghiệp',
    titleLine1: 'Thiết kế website',
    titleLine2: 'mang dấu ấn thương hiệu',
    description:
      'Nexis Tech thiết kế và phát triển website theo nhu cầu kinh doanh, kết hợp giao diện rõ ràng, trải nghiệm dễ sử dụng và khả năng mở rộng lâu dài.',
    primaryCta: 'Nhận tư vấn dự án',
  },

  introSection: {
    leftParagraphs: [
      'Thiết kế website chuyên nghiệp là nền tảng chiến lược giúp doanh nghiệp khẳng định bản sắc thương hiệu, chủ động giới thiệu năng lực và mở rộng kênh kinh doanh trên môi trường số. Một website được đầu tư bài bản không chỉ là nơi trưng bày sản phẩm hay dịch vụ, mà còn là trung tâm kết nối hoạt động tiếp thị và chăm sóc khách hàng.',
      'Trong bối cảnh người dùng ngày càng ưu tiên tra cứu thông tin, so sánh chất lượng và thực hiện giao dịch trực tuyến trước khi ra quyết định, việc sở hữu một nền tảng web riêng giúp doanh nghiệp giảm phụ thuộc vào các kênh trung gian và chủ động quản trị dữ liệu.',
    ],
    rightParagraphs: [
      'Tuy nhiên, chỉ có mặt trên Internet là chưa đủ. Để tạo ra chuyển đổi thực tế, website cần được quy hoạch đồng bộ từ kiến trúc thông tin, hệ thống nhận diện thị giác, tốc độ tải trang cho đến luồng đặt hàng và liên hệ tư vấn tinh gọn trên cả máy tính lẫn điện thoại.',
      'Tại Nexis Tech, chúng tôi kết hợp tư duy thiết kế UI/UX hiện đại cùng kỹ thuật lập trình Frontend, Backend chuẩn mực để xây dựng những website vừa mang dấu ấn riêng của từng thương hiệu, vừa đảm bảo tính ổn định, bảo mật và sẵn sàng mở rộng tính năng.',
    ],
  },

  benefits: [
    {
      id: 'benefit-1',
      number: '01',
      title: 'Chủ động tiếp cận và mở rộng thị trường nhanh chóng',
      description:
        'Website hoạt động liên tục như một showroom và văn phòng số không giới hạn vị trí địa lý. Khách hàng ở bất kỳ đâu đều có thể tìm hiểu danh mục sản phẩm, xem hồ sơ năng lực và gửi yêu cầu đặt hàng hay tư vấn thuận tiện.',
      highlight: 'Hiện diện thương hiệu liên tục',
    },
    {
      id: 'benefit-2',
      number: '02',
      title: 'Tối ưu chi phí vận hành và nâng cao hiệu suất kinh doanh',
      description:
        'Thay vì phân tán thông tin qua nhiều kênh rời rạc, hệ thống quản trị tập trung giúp doanh nghiệp cập nhật danh mục, chương trình ưu đãi và nội dung tư vấn nhanh chóng, giảm tải khối lượng công việc thủ công.',
      highlight: 'Quản trị dữ liệu tập trung',
    },
    {
      id: 'benefit-3',
      number: '03',
      title: 'Nâng tầm chất lượng trải nghiệm và dịch vụ khách hàng',
      description:
        'Giao diện rõ ràng, bộ lọc tìm kiếm thông minh, biểu mẫu liên hệ trực quan cùng khả năng tích hợp công cụ tư vấn giúp khách hàng tìm đúng giải pháp chỉ sau vài thao tác chạm.',
      highlight: 'Hành trình người dùng mượt mà',
    },
    {
      id: 'benefit-4',
      number: '04',
      title: 'Xây dựng uy tín thương hiệu với tài sản số độc lập',
      description:
        'Một website có nhận diện đồng bộ, thông tin minh bạch và cấu trúc chuyên nghiệp tạo dựng niềm tin vững chắc ngay từ lần truy cập đầu tiên, đặc biệt với sản phẩm giá trị cao hoặc dịch vụ B2B.',
      highlight: 'Khẳng định vị thế chuyên nghiệp',
    },
    {
      id: 'benefit-5',
      number: '05',
      title: 'Sẵn sàng tích hợp đa kênh, thanh toán và mở rộng lâu dài',
      description:
        'Kiến trúc được thiết kế mở giúp doanh nghiệp dễ dàng kết nối cổng thanh toán trực tuyến, đơn vị vận chuyển, hệ thống quản lý nội bộ hoặc nâng cấp thành Web App chuyên sâu khi nhu cầu tăng trưởng.',
      highlight: 'Kiến trúc linh hoạt, dễ nâng cấp',
    },
  ] as BenefitSlide[],

  criteriaIntro: {
    heading: 'Những điều cần lưu ý khi thiết kế website doanh nghiệp và bán hàng',
    paragraph1:
      'Mỗi doanh nghiệp khi bắt đầu xây dựng hoặc nâng cấp website đều hiểu rằng chất lượng giao diện và độ ổn định kỹ thuật ảnh hưởng trực tiếp đến ấn tượng của khách hàng cũng như hiệu quả chuyển đổi.',
    paragraph2:
      'Nexis Tech chú trọng từng chi tiết từ bước phân tích yêu cầu, phác thảo cấu trúc UI/UX đến lập trình và triển khai hạ tầng, nhằm đảm bảo website vận hành trơn tru, dễ quản trị và phát triển bền vững cùng kế hoạch kinh doanh của bạn.',
  },

  criteriaList: [
    {
      id: 'crit-1',
      iconName: 'globe',
      title: 'Kết nối đa kênh và đồng bộ hệ sinh thái số',
      description:
        'Website hiện đại cần khả năng liên kết mượt mà với các kênh truyền thông, công cụ phân tích dữ liệu, API vận chuyển và hệ thống quản lý nội bộ để thu hút khách hàng tiềm năng hiệu quả.',
    },
    {
      id: 'crit-2',
      iconName: 'shield',
      title: 'Lựa chọn đơn vị thiết kế và phát triển có chiều sâu kỹ thuật',
      description:
        'Một trang web đẹp bên ngoài là chưa đủ; nền tảng mã nguồn bên dưới cần sạch sẽ, chuẩn cấu trúc HTML ngữ nghĩa và dễ bảo trì. Đội ngũ kết hợp UI/UX và Full-stack tại Nexis Tech giúp dự án triển khai bài bản ngay từ gốc.',
    },
    {
      id: 'crit-3',
      iconName: 'credit-card',
      title: 'Tính năng đặt hàng, báo giá và thanh toán trực quan',
      description:
        'Luồng giỏ hàng, biểu mẫu yêu cầu tư vấn và phương thức thanh toán cần được thiết kế ngắn gọn, rõ ràng trên cả máy tính lẫn điện thoại để giảm tỷ lệ khách hàng rời trang.',
    },
    {
      id: 'crit-4',
      iconName: 'zap',
      title: 'Tối ưu tốc độ tải trang và hiệu năng phản hồi',
      description:
        'Tốc độ hiển thị khung hình đầu tiên và sự mượt mà khi chuyển trang giữ vai trò quan trọng để giữ chân người xem. Chúng tôi tối ưu tài nguyên hình ảnh, mã nguồn và bộ nhớ đệm ngay từ giai đoạn phát triển.',
    },
    {
      id: 'crit-5',
      iconName: 'smartphone',
      title: 'Thiết kế thích ứng hoàn hảo trên thiết bị di động',
      description:
        'Phần lớn lưu lượng truy cập đến từ điện thoại. Giao diện tại Nexis Tech được tinh chỉnh bố cục, kích thước vùng chạm và phông chữ tiếng Việt rõ nét trên mọi kích thước màn hình từ 360px đến 1440px.',
    },
    {
      id: 'crit-6',
      iconName: 'layers',
      title: 'Kiến trúc chuẩn SEO và dễ dàng mở rộng tính năng',
      description:
        'Cấu trúc thẻ tiêu đề hợp lý, đường dẫn thân thiện và khả năng thêm mới danh mục, trang đích giúp doanh nghiệp chủ động phát triển nội dung bền vững theo thời gian.',
    },
  ] as CriteriaItem[],

  reasonsWheel: [
    {
      id: 'reason-1',
      number: '01',
      shortTitle: 'Bàn giao mã nguồn rõ ràng',
      fullTitle: 'Bàn giao mã nguồn và quyền quản trị',
      description:
        'Sau khi hoàn thiện dự án theo thỏa thuận, doanh nghiệp được bàn giao đầy đủ mã nguồn và tài liệu hướng dẫn quản trị để chủ động vận hành, làm chủ tài sản số và thuận tiện nâng cấp trong tương lai.',
      position: 'left-1',
      iconName: 'code',
    },
    {
      id: 'reason-2',
      number: '02',
      shortTitle: 'Bảo hành và bảo trì',
      fullTitle: 'Đồng hành bảo hành và bảo trì kỹ thuật',
      description:
        'Chính sách bảo hành và hỗ trợ kỹ thuật được xác định minh bạch theo phạm vi từng dự án. Đội ngũ kỹ thuật Nexis Tech đồng hành kiểm tra lỗi phát sinh, hướng dẫn vận hành và duy trì sự ổn định của hệ thống.',
      position: 'left-2',
      iconName: 'wrench',
    },
    {
      id: 'reason-3',
      number: '03',
      shortTitle: 'Tư vấn cấu trúc chuyển đổi',
      fullTitle: 'Tư vấn kiến trúc thông tin hướng chuyển đổi',
      description:
        'Không chỉ lập trình theo mẫu có sẵn, chúng tôi phân tích hành vi nhóm khách hàng mục tiêu để đề xuất sơ đồ trang, vị trí nút kêu gọi hành động và luồng tra cứu sản phẩm hợp lý.',
      position: 'left-3',
      iconName: 'compass',
    },
    {
      id: 'reason-4',
      number: '04',
      shortTitle: 'Bảo mật hệ thống website',
      fullTitle: 'Chú trọng an toàn dữ liệu và bảo mật',
      description:
        'Triển khai chuẩn giao thức HTTPS/SSL, kiểm soát dữ liệu đầu vào biểu mẫu, phân quyền quản trị viên rõ ràng và thiết lập cơ chế sao lưu định kỳ khi triển khai trên hạ tầng Cloud.',
      position: 'left-4',
      iconName: 'lock',
    },
    {
      id: 'reason-5',
      number: '05',
      shortTitle: 'Đa dạng nền tảng công nghệ',
      fullTitle: 'Làm chủ công nghệ Web, Full-stack và AI',
      description:
        'Tùy theo bài toán thực tế, Nexis Tech tư vấn giải pháp công nghệ phù hợp từ hệ thống quản trị nội dung linh hoạt đến ứng dụng Web App chuyên biệt tích hợp AI.',
      position: 'right-1',
      iconName: 'cpu',
    },
    {
      id: 'reason-6',
      number: '06',
      shortTitle: 'Dễ dàng nâng cấp mở rộng',
      fullTitle: 'Kiến trúc mở sẵn sàng cho giai đoạn tăng trưởng',
      description:
        'Cấu trúc module tách biệt giúp doanh nghiệp dễ dàng bổ sung tính năng mới, kết nối cổng thanh toán, vận chuyển hoặc tích hợp công cụ tự động hóa mà không phải đập đi xây lại.',
      position: 'right-2',
      iconName: 'trending',
    },
    {
      id: 'reason-7',
      number: '07',
      shortTitle: 'Quy trình phối hợp chuyên nghiệp',
      fullTitle: 'Quy trình làm việc minh bạch theo từng cột mốc',
      description:
        'Mỗi giai đoạn từ khảo sát, thiết kế UI/UX trên Figma, lập trình bản chạy thử đến kiểm thử nghiệm thu đều có tiêu chí đánh giá rõ ràng để khách hàng dễ theo dõi.',
      position: 'right-3',
      iconName: 'users',
    },
    {
      id: 'reason-8',
      number: '08',
      shortTitle: 'Đáp ứng đủ các tiêu chí chuẩn',
      fullTitle: 'Đảm bảo thẩm mỹ, tốc độ và trải nghiệm di động',
      description:
        'Mỗi dự án trước khi xuất bản đều trải qua danh sách kiểm tra giao diện đa thiết bị, tốc độ phản hồi, cấu trúc SEO kỹ thuật và tính nhất quán của nhận diện thương hiệu.',
      position: 'right-4',
      iconName: 'check',
    },
  ] as ReasonWheelItem[],

  qualitativePillars: [
    {
      id: 'pillar-design',
      label: 'Thiết kế',
      sublabel: 'Chuẩn nhận diện riêng & tối ưu UI/UX',
    },
    {
      id: 'pillar-dev',
      label: 'Phát triển',
      sublabel: 'Kiến trúc Full-stack, Web App & AI',
    },
    {
      id: 'pillar-support',
      label: 'Đồng hành',
      sublabel: 'Triển khai Cloud & bảo trì ổn định',
    },
  ] as QualitativePillar[],

  commitments: [
    {
      id: 'commit-1',
      title: 'Cam kết bảo mật thông tin và dữ liệu của doanh nghiệp',
      summary: 'Quy trình làm việc và lưu trữ tuân thủ nguyên tắc bảo mật riêng tư.',
    },
    {
      id: 'commit-2',
      title: 'Ứng dụng công nghệ hiện đại và xu hướng thiết kế mới',
      summary: 'Kết hợp hài hòa giữa thẩm mỹ thương hiệu, hiệu năng và giải pháp AI.',
    },
    {
      id: 'commit-3',
      title: 'Hỗ trợ tư vấn tận tâm theo đúng phạm vi nhu cầu thực tế',
      summary: 'Đề xuất giải pháp vừa vặn với mục tiêu kinh doanh và ngân sách dự kiến.',
    },
    {
      id: 'commit-4',
      title: 'Đáp ứng đa dạng công nghệ và ngôn ngữ xây dựng website',
      summary: 'Từ landing page, website doanh nghiệp, e-commerce đến hệ thống web app.',
    },
  ] as CommitmentItem[],

  showcaseSection: {
    heading: 'Tham khảo website theo lĩnh vực',
    description:
      'Khám phá những website đang hoạt động để tham khảo cách trình bày nội dung, sản phẩm và trải nghiệm người dùng.',
    badgeLabel: 'Website tham khảo',
  },

  referenceWebsites: REFERENCE_WEBSITES,

  knowledgeArticles: [
    {
      id: 'art-1',
      category: 'Kiến trúc & UI/UX',
      title: 'Cấu trúc website bán hàng và doanh nghiệp giúp tối ưu tỷ lệ chuyển đổi',
      summary:
        'Tìm hiểu cách bố trí thanh điều hướng, khu vực mở đầu, danh mục sản phẩm và luồng liên hệ để người dùng dễ nắm bắt thông tin và ra quyết định nhanh hơn.',
      readTime: '5 phút đọc',
      contentParagraphs: [
        'Một website hiệu quả không nằm ở việc nhồi nhét thật nhiều hiệu ứng chuyển động, mà ở khả năng dẫn dắt ánh nhìn của người truy cập qua từng tầng thông tin một cách tự nhiên. Trong 5 giây đầu tiên tại khu vực Hero, khách hàng cần trả lời được ba câu hỏi: Doanh nghiệp cung cấp sản phẩm/dịch vụ gì? Điểm khác biệt nằm ở đâu? Và bước tiếp theo cần bấm vào đâu?',
        'Đối với website thương mại điện tử và giới thiệu sản phẩm, cấu trúc danh mục rõ ràng cùng bộ lọc theo nhu cầu thực tế giúp rút ngắn đáng kể số lần nhấp chuột. Các thông tin quan trọng như thông số kỹ thuật, chính sách bảo hành và phương thức vận chuyển nên được đặt ngay cạnh khu vực hành động chính.',
        'Cuối cùng, biểu mẫu nhận báo giá hoặc đặt hàng cần loại bỏ những trường thông tin không thực sự cần thiết ở bước đầu tiên, đồng thời tối ưu vùng chạm trên màn hình điện thoại để khách hàng có thể hoàn tất yêu cầu chỉ trong dưới một phút.',
      ],
      keyTakeaways: [
        'Khu vực mở đầu cần truyền tải rõ giá trị cốt lõi và có nút kêu gọi hành động nổi bật.',
        'Thanh điều hướng nên gom nhóm khoa học, tránh quá nhiều cấp menu gây rối.',
        'Luồng liên hệ tư vấn hoặc giỏ hàng cần tinh gọn, ưu tiên thao tác trên di động.',
      ],
    },
    {
      id: 'art-2',
      category: 'Kỹ thuật & Hiệu năng',
      title: 'Core Web Vitals là gì? Hướng dẫn tối ưu tốc độ website trên di động',
      summary:
        'Tốc độ tải trang và độ ổn định khung hình không chỉ ảnh hưởng đến trải nghiệm người mua mà còn là tiêu chí quan trọng của các công cụ tìm kiếm hiện đại.',
      readTime: '6 phút đọc',
      contentParagraphs: [
        'Core Web Vitals là bộ chỉ số đo lường chất lượng trải nghiệm người dùng thực tế trên website, tập trung vào ba yếu tố chính: tốc độ hiển thị nội dung lớn nhất (LCP), độ phản hồi khi tương tác (INP) và độ ổn định bố cục khi trang đang tải (CLS).',
        'Để cải thiện tốc độ hiển thị, hình ảnh sản phẩm và banner cần được nén ở định dạng hiện đại như WebP hoặc AVIF với kích thước phù hợp cho từng độ phân giải màn hình. Bên cạnh đó, việc cố định tỷ lệ khung ảnh giúp ngăn chặn hiện tượng nhảy bố cục gây khó chịu khi người dùng đang đọc.',
        'Ở tầng kỹ thuật Frontend và Cloud, việc phân tách mã nguồn theo từng trang, kết hợp mạng phân phối nội dung (CDN) và cấu hình bộ nhớ đệm hợp lý giúp website phản hồi tức thì ngay cả khi lượng truy cập tăng cao.',
      ],
      keyTakeaways: [
        'Tối ưu dung lượng và định dạng ảnh (WebP/AVIF) cho từng khung nhìn.',
        'Khai báo kích thước khung chứa rõ ràng để loại bỏ hiện tượng xô lệch bố cục.',
        'Kết hợp kiến trúc mã nguồn gọn nhẹ và hạ tầng Cloud/CDN ổn định.',
      ],
    },
    {
      id: 'art-3',
      category: 'Công nghệ & Mở rộng',
      title: 'Ứng dụng AI và tự động hóa trong website doanh nghiệp hiện đại',
      summary:
        'Cách tích hợp công cụ tìm kiếm ngữ nghĩa, gợi ý sản phẩm phù hợp và phân loại yêu cầu tư vấn tự động để nâng cao hiệu suất phục vụ khách hàng.',
      readTime: '5 phút đọc',
      contentParagraphs: [
        'Thay vì chỉ đóng vai trò một cuốn hồ sơ tĩnh, website thế hệ mới có thể tích hợp các mô hình trí tuệ nhân tạo (AI) để hỗ trợ khách hàng tra cứu thông tin sản phẩm, so sánh cấu hình hoặc tìm kiếm theo ngôn ngữ tự nhiên.',
        'Trong hoạt động thương mại điện tử, thuật toán gợi ý theo ngữ cảnh giúp hiển thị những sản phẩm đi kèm phù hợp với nhu cầu đang xem, từ đó gia tăng giá trị đơn hàng một cách tự nhiên mà không gây cảm giác quảng cáo làm phiền.',
        'Đối với doanh nghiệp dịch vụ B2B, việc kết nối biểu mẫu website với luồng phân loại nhu cầu và thông báo tức thì giúp đội ngũ tư vấn nắm bắt bối cảnh dự án ngay trước khi liên hệ với khách hàng.',
      ],
      keyTakeaways: [
        'Tìm kiếm thông minh theo ngữ cảnh giúp khách hàng tìm đúng sản phẩm nhanh hơn.',
        'Gợi ý nội dung và giải pháp liên quan dựa trên hành trình xem trang.',
        'Tự động hóa khâu tiếp nhận và phân loại yêu cầu tư vấn cho đội ngũ kinh doanh.',
      ],
    },
  ] as KnowledgeArticle[],

  industrySolutions: [
    {
      id: 'sol-ecommerce',
      kicker: 'Giải pháp chuyên sâu',
      title: 'Thiết kế website thương mại điện tử và bán lẻ',
      description:
        'Xây dựng hệ thống cửa hàng trực tuyến với danh mục sản phẩm khoa học, bộ lọc thuộc tính nhanh, giỏ hàng thông minh và quy trình đặt hàng tinh gọn. Giúp thương hiệu chủ động triển khai chiến dịch ưu đãi và chăm sóc khách hàng trên chính nền tảng của mình.',
      industryTag: 'Thương mại điện tử',
      desktopScreen: {
        brandHeader: 'NEXIS COMMERCE',
        heroHeadline: 'Trải nghiệm mua sắm đa thiết bị mượt mà',
        categories: ['Sản phẩm mới', 'Bán chạy', 'Bộ sưu tập', 'Ưu đãi thành viên'],
        products: [
          { name: 'Tai nghe Studio Wireless Pro', spec: 'Chống ồn chủ động ANC', tag: 'Mới' },
          { name: 'Bàn phím Cơ Nhôm CNC', spec: 'Kết nối 3 chế độ', tag: 'Nổi bật' },
          { name: 'Đồng hồ Thông minh Titanium', spec: 'Pin 14 ngày · GPS kép', tag: 'Bán chạy' },
        ],
      },
      mobileScreen: {
        title: 'Thương mại điện tử',
        actionLabel: 'Đặt hàng 1 chạm',
        bullets: [
          'Bộ lọc đa thuộc tính tức thì',
          'Giỏ hàng & Thanh toán 1 bước',
          'Tối ưu hiển thị trên di động',
        ],
      },
    },
    {
      id: 'sol-cosmetics',
      kicker: 'Giải pháp ngành làm đẹp',
      title: 'Thiết kế website mỹ phẩm, spa và chăm sóc cá nhân',
      description:
        'Tôn vinh vẻ đẹp sản phẩm bằng bố cục biên tập tinh tế, bảng thành phần minh bạch và công cụ gợi ý quy trình chăm sóc da theo từng nhu cầu của khách hàng.',
      industryTag: 'Mỹ phẩm & Làm đẹp',
      desktopScreen: {
        brandHeader: 'NEXIS BEAUTY UI',
        heroHeadline: 'Giao diện tôn vinh hình ảnh và câu chuyện thương hiệu',
        categories: ['Làm sạch', 'Dưỡng ẩm', 'Phục hồi chuyên sâu', 'Combo liệu trình'],
        products: [
          { name: 'Tinh chất Cấp ẩm Đa tầng B5', spec: 'Phục hồi hàng rào bảo vệ da', tag: 'Best Seller' },
          { name: 'Kem dưỡng Khoá ẩm Ban đêm', spec: 'Chiết xuất thực vật lành tính', tag: 'Thuần chay' },
          { name: 'Sữa rửa mặt Dịu nhẹ pH 5.5', spec: 'Dành cho mọi loại da', tag: 'Mới' },
        ],
      },
      mobileScreen: {
        title: 'Mỹ phẩm & Spa',
        actionLabel: 'Tư vấn liệu trình',
        bullets: [
          'Trình bày bảng thành phần trực quan',
          'Gợi ý sản phẩm theo tình trạng da',
          'Đặt lịch hẹn tư vấn nhanh chóng',
        ],
      },
    },
    {
      id: 'sol-corporate',
      kicker: 'Giải pháp doanh nghiệp',
      title: 'Thiết kế website doanh nghiệp, tập đoàn và dịch vụ B2B',
      description:
        'Khẳng định vị thế thương hiệu với cấu trúc hồ sơ năng lực số chuyên nghiệp, trình bày hệ sinh thái giải pháp, dự án tiêu biểu và hệ thống tiếp nhận yêu cầu hợp tác rõ ràng.',
      industryTag: 'Doanh nghiệp & B2B',
      desktopScreen: {
        brandHeader: 'NEXIS ENTERPRISE',
        heroHeadline: 'Hồ sơ năng lực số và cổng kết nối đối tác B2B',
        categories: ['Về chúng tôi', 'Giải pháp cốt lõi', 'Dự án tiêu biểu', 'Tài liệu kỹ thuật'],
        products: [
          { name: 'Hệ thống Quản trị Chuỗi cung ứng', spec: 'Tích hợp dữ liệu thời gian thực', tag: 'Enterprise' },
          { name: 'Nền tảng Tự động hóa Quy trình', spec: 'Tối ưu vận hành liên phòng ban', tag: 'Cloud' },
          { name: 'Cổng thông tin Khách hàng Doanh nghiệp', spec: 'Bảo mật phân quyền đa cấp', tag: 'B2B Portal' },
        ],
      },
      mobileScreen: {
        title: 'Doanh nghiệp B2B',
        actionLabel: 'Nhận hồ sơ năng lực',
        bullets: [
          'Cấu trúc thông tin chuẩn tập đoàn',
          'Hỗ trợ đa ngôn ngữ Việt - Anh',
          'Biểu mẫu yêu cầu báo giá chuyên biệt',
        ],
      },
    },
    {
      id: 'sol-interior',
      kicker: 'Giải pháp không gian sống',
      title: 'Thiết kế website nội thất, kiến trúc và bất động sản',
      description:
        'Trưng bày bộ sưu tập không gian sống và danh mục vật liệu với thư viện hình ảnh độ phân giải cao, bộ lọc kích thước – phong cách và tiện ích đặt lịch tham quan trực tiếp.',
      industryTag: 'Nội thất & Kiến trúc',
      desktopScreen: {
        brandHeader: 'NEXIS LIVING STUDIO',
        heroHeadline: 'Trưng bày bộ sưu tập không gian và dự án kiến trúc',
        categories: ['Phòng khách', 'Phòng ngủ', 'Dự án hoàn thiện', 'Vật liệu'],
        products: [
          { name: 'Bộ sưu tập Phòng khách Đương đại', spec: 'Thiết kế mô-đun linh hoạt', tag: 'Signature' },
          { name: 'Hệ tủ Bếp Hợp kim & Đá tự nhiên', spec: 'Thi công theo kích thước riêng', tag: 'Custom' },
          { name: 'Giải pháp Chiếu sáng Kiến trúc', spec: 'Tối ưu cảm xúc không gian', tag: 'New' },
        ],
      },
      mobileScreen: {
        title: 'Nội thất & Kiến trúc',
        actionLabel: 'Đặt lịch tư vấn',
        bullets: [
          'Thư viện phối cảnh sắc nét',
          'Tùy chọn kích thước & vật liệu',
          'Kết nối kiến trúc sư nhanh chóng',
        ],
      },
    },
  ] as IndustrySolution[],

  faqs: [
    {
      id: 'faq-1',
      question: 'Thiết kế website doanh nghiệp và bán hàng tại Nexis Tech gồm những hạng mục gì?',
      answer:
        'Tùy theo nhu cầu thực tế của từng dự án, dịch vụ tại Nexis Tech bao gồm: tư vấn cấu trúc thông tin, thiết kế giao diện UI/UX theo nhận diện thương hiệu, lập trình Frontend/Backend hoàn chỉnh, tối ưu hiển thị đa thiết bị (Responsive), cấu hình SEO kỹ thuật cơ bản và hướng dẫn quản trị nội dung trước khi bàn giao.',
    },
    {
      id: 'faq-2',
      question: 'Doanh nghiệp cần chuẩn bị những thông tin gì trước khi bắt đầu thiết kế website?',
      answer:
        'Bạn chỉ cần chuẩn bị thông tin giới thiệu cơ bản về doanh nghiệp, logo hoặc màu sắc thương hiệu (nếu đã có), danh mục sản phẩm/dịch vụ chính và mục tiêu mong muốn đạt được. Đội ngũ Nexis Tech sẽ đồng hành gợi ý bố cục và hoàn thiện cấu trúc nội dung chi tiết. Bạn có thể liên hệ qua số 0909 858 428 hoặc email nexistech.work@gmail.com để được hướng dẫn nhanh.',
    },
    {
      id: 'faq-3',
      question: 'Chi phí và thời gian hoàn thiện một dự án website được xác định như thế nào?',
      answer:
        'Chi phí và lộ trình triển khai phụ thuộc vào quy mô số lượng trang, mức độ thiết kế UI/UX độc bản và các tính năng kỹ thuật đi kèm (như giỏ hàng, bộ lọc nâng cao, tích hợp thanh toán, AI hoặc hệ thống quản lý riêng). Sau khi tiếp nhận nhu cầu qua điện thoại 0909 858 428 hoặc email nexistech.work@gmail.com, Nexis Tech sẽ gửi bảng phân tích hạng mục và báo giá minh bạch.',
    },
    {
      id: 'faq-4',
      question: 'Website bán hàng cần những tính năng quan trọng nào để thu hút khách hàng?',
      answer:
        'Một website bán hàng hiệu quả cần có thanh tìm kiếm và bộ lọc sản phẩm nhanh, trang chi tiết sản phẩm trình bày rõ hình ảnh – thông số – giá bán, giỏ hàng và biểu mẫu đặt hàng ngắn gọn trên điện thoại, cùng tốc độ tải trang nhanh và chứng chỉ bảo mật SSL.',
    },
    {
      id: 'faq-5',
      question: 'Website do Nexis Tech xây dựng có dễ dàng nâng cấp thêm tính năng sau này không?',
      answer:
        'Có. Chúng tôi ưu tiên thiết kế kiến trúc mã nguồn theo hướng tách lớp (modular), sạch sẽ và có tài liệu rõ ràng. Khi doanh nghiệp mở rộng quy mô, bạn có thể dễ dàng nâng cấp thêm ngôn ngữ, trang đích mới, tính năng Web App hoặc tích hợp API bên thứ ba.',
    },
    {
      id: 'faq-6',
      question: 'Quy trình thiết kế và phát triển website tại Nexis Tech diễn ra như thế nào?',
      answer:
        'Quy trình gồm 5 bước rõ ràng: (1) Tiếp nhận nhu cầu & tư vấn cấu trúc trang; (2) Thiết kế khung bố cục (Wireframe) & giao diện UI/UX; (3) Lập trình Frontend, Backend & tích hợp hệ thống quản trị; (4) Kiểm thử hiển thị đa thiết bị, tốc độ & bảo mật; (5) Bàn giao, hướng dẫn quản trị & đồng hành hỗ trợ kỹ thuật.',
    },
    {
      id: 'faq-7',
      question: 'Chính sách bảo hành và hỗ trợ kỹ thuật sau bàn giao được áp dụng ra sao?',
      answer:
        'Mọi dự án đều đi kèm chính sách bảo hành lỗi kỹ thuật theo phạm vi hợp đồng và hướng dẫn sử dụng chi tiết. Ngoài ra, Nexis Tech cung cấp dịch vụ bảo trì, cập nhật định kỳ và quản trị hạ tầng Cloud khi doanh nghiệp có nhu cầu đồng hành lâu dài. Liên hệ hotline 0909 858 428 hoặc email nexistech.work@gmail.com để trao đổi trực tiếp.',
    },
  ] as FaqItem[],
};



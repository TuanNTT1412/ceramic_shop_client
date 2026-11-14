import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge } from '../../components/ui';
import { ProductCard, CategoryCard, ReviewCard } from '../../components/shared';
import { useCart, useToast } from '../../context';
import { ROUTES } from '../../constants';

// 1. Dữ liệu Danh Mục Tuyển Chọn
const CATEGORIES = [
  {
    title: 'Ấm Chén Sa Thạch',
    subtitle: 'Trà Đạo Thiền Định',
    description: 'Khả năng giữ nhiệt vượt bậc, tích tụ hương trà sau nhiều năm nung dưỡng men.',
    image: '/images/cat-tra-dao.jpg',
    link: ROUTES.PRODUCTS,
  },
  {
    title: 'Bình Dáng Tỳ Bà & Men Tro',
    subtitle: 'Cắm Hoa Tĩnh Lược',
    description: 'Dáng dấp thanh tú hoài cổ kết hợp cùng bề mặt thô nhám phong vị sương gió.',
    image: '/images/cat-binh-hoa.jpg',
    link: ROUTES.PRODUCTS,
  },
  {
    title: 'Bát Đĩa Bàn Tiệc Hoàng Triều',
    subtitle: 'Ẩm Thực Tự Nhiên',
    description: 'Khắc vạch thủ công tinh xảo, men khoáng bền bỉ chịu nhiệt lò nướng và máy rửa.',
    image: '/images/cat-bat-dia.jpg',
    link: ROUTES.PRODUCTS,
  },
  {
    title: 'Tượng Thiền Điêu Khắc Mộc',
    subtitle: 'Tác Phẩm Không Gian',
    description: 'Tạo hình tối giản, khơi dậy sự tĩnh tại an nhiên nơi góc đọc sách và thiền định.',
    image: '/images/cat-tuong-thien.jpg',
    link: ROUTES.PRODUCTS,
  },
];

// 2. Dữ liệu Tác Phẩm Tiêu Biểu Xuất Lò
const FEATURED_PRODUCTS = [
  {
    id: 'ML-2401',
    code: 'ML-2401',
    name: 'Ấm Trà Thạch Vân Nung Lò Củi',
    spec: 'Dung tích 220ml • Men tro tự nhiên Quảng Nam',
    price: 2450000,
    badge: 'Độc bản nung củi',
    badgeVariant: 'primary',
    image: '/images/product-1.jpg',
  },
  {
    id: 'ML-2409',
    code: 'ML-2409',
    name: 'Bình Sa Nham Trụ Cao Dáng Mộc',
    spec: 'Cao 38cm • Đất phù sa lòng sông Thu Bồn',
    price: 4200000,
    badge: 'Men Tro Sa Mạc',
    badgeVariant: 'sand',
    image: '/images/product-2.jpg',
  },
  {
    id: 'ML-2414',
    code: 'ML-2414',
    name: 'Bộ Đĩa Mộc Vành Sóng Trầm Tích',
    spec: 'Bộ 4 món • Men rơm phong hóa sa thạch',
    price: 1850000,
    badge: 'Độc bản nung củi',
    badgeVariant: 'primary',
    image: '/images/product-3.jpg',
  },
  {
    id: 'ML-2420',
    code: 'ML-2420',
    name: 'Hũ Trữ Trà Phong Sa Nắp Kín',
    spec: 'Khử ẩm tự nhiên • Triện son nghệ nhân Bùi Hải',
    price: 1600000,
    badge: 'Men Tro Sa Mạc',
    badgeVariant: 'sand',
    image: '/images/product-4.jpg',
  },
];

// 3. Dữ liệu Đánh Giá & Lời Bình
const TESTIMONIALS = [
  {
    name: 'Trần Thiện Tuệ',
    role: 'Chủ Không Gian Trà Quán Vô Thường, Hà Nội',
    quote: 'Cầm chiếc chén sa thạch trên tay, cảm giác ấm sâu và xốp nhẹ tự nhiên như chạm vào đá cuội bên suối. Lớp men tro nham thạch làm nước trà thơm đượm hơn rất nhiều.',
    rating: 5,
    avatarLetter: 'T',
  },
  {
    name: 'KTS. Mai Hoàng Lâm',
    role: 'Sáng lập Studio Kiến Trúc Sa Mộc, TP.HCM',
    quote: 'Các dự án biệt thự phong cách Wabi-Sabi và Japandi của tôi chỉ tin tưởng chọn bình gốm lớn của Gốm Mộc. Đóng gói 5 lớp rơm bảo vệ gửi vào Sài Gòn hoàn hảo, nguyên vẹn không một vết xước.',
    rating: 5,
    avatarLetter: 'M',
  },
  {
    name: 'Lê Ngọc Diệp',
    role: 'Nhà Sưu Tập Nghệ Thuật Thủ Công Tự Nhiên',
    quote: 'Mỗi bình hoa là một độc bản không thể có chiếc thứ hai. Vết rạn men tro của lửa củi 1300 độ mang lại cái tình rất riêng mà gốm lò điện hay lò gas không thể chạm tới.',
    rating: 5,
    avatarLetter: 'L',
  },
];

export const HomePage = () => {
  const { addToCart } = useCart();
  const toast = useToast();

  const handleQuickAdd = async (product) => {
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="flex flex-col w-full bg-surface font-sans">
      {/* ========================================================= */}
      {/* 1. HERO SECTION                                            */}
      {/* ========================================================= */}
      <section
        id="section-hero"
        className="relative w-full overflow-hidden bg-surface py-12 md:py-20 lg:py-24 px-6 lg:px-12"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* Cột Trái: Thông điệp nghệ thuật */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            <div className="mb-6">
              <Badge variant="sand" shape="pill" dot size="sm">
                Khai Hỏa Mùa Lò Sa Thạch 2026
              </Badge>
            </div>

            <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-normal text-on-surface tracking-normal leading-[1.15] mb-6">
              Hồn Đất Nung<br />
              Khơi Sắc Lửa Củi
            </h1>

            <p className="font-body text-base sm:text-lg text-on-surface-variant font-normal leading-relaxed max-w-xl mb-8">
              Chưng cất tinh hoa gốm thủ công nung củi sa thạch nhiệt độ cao 1.300°C. Nơi vệt tro phong hóa tự nhiên và bàn tay nghệ nhân kiến tạo nên vẻ đẹp tĩnh tại, thô mộc vĩnh cửu.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link to={ROUTES.PRODUCTS}>
                <Button variant="primary" size="lg" className="shadow-lg">
                  <span>Khám Phá Bộ Sưu Tập Mùa Lò</span>
                  <span className="material-symbols-outlined text-[18px]">east</span>
                </Button>
              </Link>

              <Link to="/story">
                <Button variant="outline" size="lg">
                  <span className="material-symbols-outlined text-[18px] text-primary">local_fire_department</span>
                  <span>Câu Chuyện Xưởng Gốm</span>
                </Button>
              </Link>
            </div>

            {/* Chỉ số bảo chứng di sản */}
            <div className="mt-10 flex items-center gap-6 text-xs text-on-surface-variant">
              <div className="flex -space-x-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold border border-white">VN</span>
                <span className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-[10px] font-bold border border-white">13C</span>
                <span className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface text-[10px] font-bold border border-white">★</span>
              </div>
              <span>Được giám tuyển bởi hơn 420+ không gian trà đạo & trà thất thiền định.</span>
            </div>

          </div>

          {/* Cột Phải: Bức Tranh Mosaic Tác Phẩm */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-surface-container">
              <img
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                alt="Bình Gốm Họa Vũ Điệp Hoa"
                src="/images/hero-vase.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-surface/95 backdrop-blur-md shadow-lg flex items-center justify-between border border-white/40">
                <div>
                  <p className="font-headline text-lg font-medium text-on-surface">
                    Bình Gốm Họa Vũ Điệp Hoa - Men Sa Thạch
                  </p>
                  <p className="font-label text-xs text-on-surface-variant">
                    Mộc bản số #08 • Nung củi 72 giờ
                  </p>
                </div>
                <span className="font-headline text-base font-semibold text-primary">
                  3.850.000 đ
                </span>
              </div>
            </div>

            {/* Thẻ phụ nổi bật góc dưới */}
            <div className="hidden sm:block absolute -bottom-6 -left-8 w-48 rounded-xl p-3 bg-surface-container-lowest shadow-xl text-left border border-outline-variant/30">
              <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-surface-container">
                <img
                  className="w-full h-full object-cover"
                  alt="Chén Sa Mộc Men Tro"
                  src="/images/hero-cup.jpg"
                />
              </div>
              <p className="font-headline text-sm font-semibold text-on-surface truncate">
                Chén Sa Mộc Men Tro
              </p>
              <p className="text-[11px] text-on-surface-variant font-medium">Đất nung Bát Tràng</p>
            </div>
          </div>
        </div>

        {/* Nút chỉ dẫn trượt xuống - đã bỏ */}
      </section>

      {/* ========================================================= */}
      {/* 2. CURATED CATEGORIES                                      */}
      {/* ========================================================= */}
      <section
        id="section-categories"
        className="w-full py-20 px-6 lg:px-12 bg-surface"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="font-label text-xs uppercase tracking-widest text-[#8a705b] font-semibold block mb-2">
                02 • Danh Mục Tuyển Chọn
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-normal text-on-surface tracking-normal">
                Nghệ Thuật Cho Từng Không Gian
              </h2>
            </div>
            <p className="font-body text-sm text-on-surface-variant max-w-md">
              Mỗi dòng tác phẩm phản ánh một trạng thái của tĩnh lặng: từ hơi ấm của chén trà mai sương đến đường nét tôn nghiêm của bình gốm phong thủy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.title} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. FEATURED MASTERPIECES                                   */}
      {/* ========================================================= */}
      <section
        id="section-featured"
        className="w-full py-20 px-6 lg:px-12 bg-surface-container-low"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-label text-xs uppercase tracking-widest text-[#8a705b] font-semibold block mb-2">
                03 • Sản Phẩm Độc Bản
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl font-normal text-on-surface">
                Tác Phẩm Tiêu Biểu Xuất Lò
              </h2>
            </div>
            <Link
              to={ROUTES.PRODUCTS}
              className="text-xs font-semibold text-primary hover:text-on-primary-fixed-variant transition-colors flex items-center gap-1 group"
            >
              <span>Xem Toàn Bộ Tác Phẩm</span>
              <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. STUDIO PHILOSOPHY                                       */}
      {/* ========================================================= */}
      <section
        id="section-philosophy"
        className="w-full py-20 px-6 lg:px-12 bg-surface"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="rounded-3xl bg-surface-container p-8 lg:p-16 relative overflow-hidden shadow-xs border border-outline-variant/30">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="font-label text-xs uppercase tracking-widest text-[#8a705b] font-bold">
                  04 • Triết Lý Lò Nung Mộc
                </span>
                <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-normal text-on-surface leading-tight tracking-normal">
                  Khi Đất, Nước & Lửa<br />
                  <span className="italic font-medium text-on-surface tracking-wide">Giao Hòa Thành Kiệt Tác</span>
                </h2>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-light">
                  Chúng tôi không tìm kiếm sự bóng bẩy nhân tạo của các hợp chất hóa học. Tại xưởng Gốm Mộc, đất được nhào luyện từ phù sa sông Thu Bồn giàu khoáng sắt, ủ qua nhiều mùa trăng để đất ngậm sinh khí.
                </p>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-light">
                  Ngọn lửa củi đượm từ gỗ nhãn rừng nung liên tục 72 giờ không ngắt quãng ở 1.300°C. Lớp men không phải do con người vẽ lên, mà là tàn tro tự nhiên bay phủ lên bề mặt đất đỏ, hóa thành lớp áo thủy tinh tự nhiên mang sắc thái độc nhất vô nhị.
                </p>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface/70 border border-outline-variant/30">
                    <h4 className="font-headline text-base font-semibold text-on-surface">
                      Vuốt Tay 100%
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      Không dập khuôn công nghiệp, mỗi góc cạnh là dấu ấn vân tay nghệ nhân.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface/70 border border-outline-variant/30">
                    <h4 className="font-headline text-base font-semibold text-on-surface">
                      Triện Son Chứng Chỉ
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      Tất cả tác phẩm đều có triện khắc đáy và chứng chỉ giấy dó xuất xưởng.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/story"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-on-primary-fixed-variant transition-colors group"
                  >
                    <span>Tìm hiểu quy trình nung củi 7 ngày</span>
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      north_east
                    </span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container-high shadow-lg">
                  <img
                    className="w-full h-full object-cover"
                    alt="Nghệ nhân vuốt gốm"
                    src="/images/craftsman.jpg"
                  />
                </div>

                {/* Khối chỉ số tiến độ mẻ lò */}
                <div className="absolute -bottom-6 right-6 p-5 rounded-2xl bg-surface-container-lowest shadow-2xl max-w-xs hidden sm:block border border-outline-variant/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                    </div>
                    <div>
                      <p className="font-headline text-sm font-semibold text-on-surface">
                        Mẻ Lò Khai Hỏa 05
                      </p>
                      <p className="text-[10px] text-outline">Thời gian nung: 72 giờ liên tục</p>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full w-[85%] rounded-full" />
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1.5 text-right font-medium">
                    85% Tác phẩm đã được đặt trước
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nút chỉ dẫn trượt xuống - đã bỏ */}
      </section>

      {/* ========================================================= */}
      {/* 5. TESTIMONIALS                                            */}
      {/* ========================================================= */}
      <section
        id="section-testimonials"
        className="w-full py-20 px-6 lg:px-12 bg-surface-container-low"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-label text-xs uppercase tracking-widest text-[#8a705b] font-semibold block mb-2">
              05 • Lời Bình & Chiêm Nghiệm
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl font-normal text-on-surface">
              Đồng Điệu Cùng Người Yêu Gốm
            </h2>
            <p className="text-sm text-on-surface-variant mt-3 font-light">
              Những chia sẻ chân thành từ các nghệ nhân trà đạo, nhà thiết kế nội thất và những tâm hồn trân quý vẻ đẹp mộc mạc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((review) => (
              <ReviewCard key={review.name} review={review} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart, useToast } from '../../context';
import { Pagination } from '../../components/shared';
import { ROUTES } from '../../constants';

// Dữ liệu danh sách 9 tác phẩm gốm mộc chuẩn khớp Stitch
const INITIAL_PRODUCTS = [
  {
    id: 1,
    tag: 'ĐỘC BẢN 01/01',
    category1: 'ẤM TRÀ THẠCH LỰU',
    category2: 'MEN TRO VỎ TRẤU',
    categoryGroup: 'Ấm Chén Trà Đạo',
    glaze: 'Men Tro Củi Tự Nhiên',
    artisan: 'nnut',
    title: 'Ấm Trà Sa Thạch Vị Cố 220ml',
    desc: 'Cốt đất sét thô duyên hải nung liên tục 36 giờ bằng củi nhãn, lòng ấm thoáng khí giúp nước trà tròn vị.',
    price: '1.250.000đ',
    priceNumber: 1250000,
    image: '/images/product-1.jpg',
  },
  {
    id: 2,
    tag: 'MẺ LÒ SỐ 04',
    category1: 'BÌNH HOA ĐIÊU KHẮC',
    category2: 'MEN SA MẠC CỔ',
    categoryGroup: 'Bình Hoa Điêu Khắc',
    glaze: 'Men Sa Thạch Sa Mạc',
    artisan: 'tuan',
    title: 'Bình Hoa Dáng Cổ - Lan Vàng Hồ Điệp',
    desc: 'Họa tiết hoa phong lan vàng uốn lượn tinh tế trên cốt gốm men trắng mộc sa thạch.',
    price: '2.180.000đ',
    priceNumber: 2180000,
    image: '/images/hero-vase.jpg',
  },
  {
    id: 3,
    tag: 'BỘ 4 CHÉN KHÁCH',
    category1: 'TRÀ ĐẠO',
    category2: 'HỎA BIẾN 1300°C',
    categoryGroup: 'Ấm Chén Trà Đạo',
    glaze: 'Men Hỏa Biến Đất Nung',
    artisan: 'all',
    title: 'Tứ Chén Mộc Hỏa Biến Tro Tự Nhiên',
    desc: 'Lớp men tro rơi tự nhiên bám cháy tạo vân rêu phong kỳ ảo, cầm chắc tay và giữ nhiệt tuyệt hảo.',
    price: '680.000đ',
    priceNumber: 680000,
    image: '/images/cat-tra-dao.jpg',
  },
  {
    id: 4,
    tag: 'ĐỘC BẢN 01/01',
    category1: 'BÀN ĂN MỘC',
    category2: 'MEN CỐT RẠN MỘC',
    categoryGroup: 'Bát Đĩa Bàn Tiệc Mộc',
    glaze: 'Men Cốt Rạn Mộc',
    artisan: 'chudau',
    title: 'Đĩa Tiệc Sa Thạch Rạn Cốt Vàng Cát',
    desc: 'Cốt đất sét thô duyên hải truyền thống, viền đĩa lượn nhấp nhô mô phỏng những triền cát sa mạc.',
    price: '540.000đ',
    priceNumber: 540000,
    image: '/images/cat-bat-dia.jpg',
  },
  {
    id: 5,
    tag: 'TRIỆN TAY NNƯT',
    category1: 'BÌNH HOA ĐIÊU KHẮC',
    category2: 'HỌA KHẮC ĐỘC BẢN',
    categoryGroup: 'Bình Hoa Điêu Khắc',
    glaze: 'Men Sa Thạch Sa Mạc',
    artisan: 'nnut',
    title: 'Tác Phẩm Khắc Họa Bọ Ngựa Cành Thu',
    desc: 'Khắc họa sinh vật bọ ngựa tự nhiên trên dáng bình sa thạch mộc mạc, đường nét sắc sảo độc bản.',
    price: '2.600.000đ',
    priceNumber: 2600000,
    image: '/images/product-2.jpg',
  },
  {
    id: 6,
    tag: 'BỘ SƯU TẬP THU',
    category1: 'TRÀ ĐẠO',
    category2: 'MEN TRO SA MẠC',
    categoryGroup: 'Ấm Chén Trà Đạo',
    glaze: 'Men Tro Củi Tự Nhiên',
    artisan: 'tuan',
    title: 'Bát Trà Đạo Chawan Men Tro Xoay Vòng',
    desc: 'Thiết kế lòng rộng chuyên dụng đánh matcha hay trà mạn sương mù, gờ miệng uốn mềm giữ hương.',
    price: '890.000đ',
    priceNumber: 890000,
    image: '/images/hero-cup.jpg',
  },
  {
    id: 7,
    tag: 'TIỂU CẢNH',
    category1: 'BÌNH ĐIÊU KHẮC',
    category2: 'MEN TRẮNG SA MẠC',
    categoryGroup: 'Tượng Thiền & Cảnh Gốm',
    glaze: 'Men Vàng Cát Cổ',
    artisan: 'all',
    title: 'Bình Hoa Chim Ruồi & Hoa Chuông',
    desc: 'Dành riêng cho việc cắm một nhánh cây dại hay hoa cỏ lau khô theo tinh thần trà thất thiền định.',
    price: '380.000đ',
    priceNumber: 380000,
    image: '/images/cat-binh-hoa.jpg',
  },
  {
    id: 8,
    tag: 'BỘ 6 CHIẾC',
    category1: 'BÀN TIỆC MỘC',
    category2: 'MEN VÀNG CÁT CỔ',
    categoryGroup: 'Bát Đĩa Bàn Tiệc Mộc',
    glaze: 'Men Vàng Cát Cổ',
    artisan: 'chudau',
    title: 'Tác Phẩm Tôm Thủy Mặc Độc Bản',
    desc: 'Chế tác từ đất sông Thu Bồn đãi sạch sạn vôi, giữ độ ẩm thức ăn gấp hai lần bát đĩa công nghiệp.',
    price: '720.000đ',
    priceNumber: 720000,
    image: '/images/product-3.jpg',
  },
  {
    id: 9,
    tag: 'ĐỘC BẢN 01/01',
    category1: 'TRỮ TRÀ CỔ',
    category2: 'KHỬ OXY 1300°C',
    categoryGroup: 'Ấm Chén Trà Đạo',
    glaze: 'Men Hỏa Biến Đất Nung',
    artisan: 'nnut',
    title: 'Bình Dáng Tròn Chùa Một Cột Dát Vàng',
    desc: 'Nắp mài thủ công khít tuyệt đối, cốt gốm xốp vi thể giúp trà cổ thụ lên hương tự nhiên sau nhiều năm.',
    price: '1.850.000đ',
    priceNumber: 1850000,
    image: '/images/product-4.jpg',
  },
];

export const CollectionPage = () => {
  const [searchKeywords, setSearchKeywords] = useState('');
  const [priceRange, setPriceRange] = useState(2600000);
  const [selectedForm, setSelectedForm] = useState('all');
  const [artisanFilter, setArtisanFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState({});

  const { addToCart } = useCart();
  const toast = useToast();

  // Xử lý nút Thêm vào giỏ hàng
  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`Đã thêm "${product.title}" vào giỏ hàng!`);
  };

  // Xử lý nút Yêu thích
  const handleToggleFavorite = (product) => {
    const nextState = !favorites[product.id];
    setFavorites((prev) => ({ ...prev, [product.id]: nextState }));
    if (nextState) {
      toast.success(`Đã lưu "${product.title}" vào danh sách yêu thích!`);
    } else {
      toast.info(`Đã gỡ "${product.title}" khỏi danh sách yêu thích.`);
    }
  };

  // Reset toàn bộ bộ lọc
  const handleResetFilters = () => {
    setSearchKeywords('');
    setPriceRange(2600000);
    setSelectedForm('all');
    setArtisanFilter('all');
    setCurrentPage(1);
    toast.info('Đã thiết lập lại toàn bộ bộ lọc.');
  };

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((item) => {
      // 1. Lọc theo từ khóa tìm kiếm
      if (searchKeywords.trim()) {
        const query = searchKeywords.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.desc.toLowerCase().includes(query);
        const matchCat =
          item.category1.toLowerCase().includes(query) ||
          item.category2.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }

      // 2. Lọc theo dáng gốm
      if (selectedForm !== 'all' && item.categoryGroup !== selectedForm) {
        return false;
      }

      // 3. Lọc theo khoảng giá
      if (item.priceNumber > priceRange) {
        return false;
      }

      // 4. Lọc theo nghệ nhân
      if (artisanFilter !== 'all' && item.artisan !== artisanFilter) {
        return false;
      }

      return true;
    });
  }, [searchKeywords, selectedForm, priceRange, artisanFilter]);

  return (
    <div className="w-full bg-[#faf6f0] text-[#2b241e] font-sans antialiased flex flex-col selection:bg-[#c2652a]/20 selection:text-[#c2652a]">
      {/* ========================================================= */}
      {/* 1. HERO SEARCH BANNER SECTION                             */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-b from-[#f5ede2] via-[#faf6f0] to-[#faf6f0] py-10 px-4 sm:px-6 lg:px-8 border-b border-[#ece2d5]">
        <div className="max-w-7xl mx-auto">
          {/* Eyebrow Label */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#c2652a] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#c2652a]"></span>
            <span>Tuyển tập mẻ nung tháng 10 • Khí vận Sa Thạch</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#26201b] font-normal leading-tight max-w-3xl">
            Kho Tác Phẩm <span className="italic font-serif text-[#c2652a]">Gốm Mộc</span> Sa Thạch
          </h1>

          <p className="mt-3 text-sm text-[#735e4d] max-w-2xl leading-relaxed">
            Hội tụ 48 hiện vật nung mộc tự nhiên từ củi gỗ dầu ở nhiệt độ 1300°C. Mỗi vết tro bám, sắc hoả biến và đường chỉ vuốt tay đều giữ trọn vẹn nhịp thở của đất cằn duyên hải.
          </p>

          {/* Search Box Bar Lớn */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-7 w-full bg-white p-2.5 rounded-2xl shadow-[0_4px_20px_rgba(194,101,42,0.08)] border border-[#e8ded2] flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="flex items-center flex-1 w-full pl-3 gap-3">
              <svg
                className="w-5 h-5 text-[#9e8774] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
                placeholder="Tìm theo kiểu dáng (bình tỳ bà, tinh bình, chung trà), chất men tro..."
                className="w-full text-xs text-[#26201b] placeholder-[#a69280] outline-none bg-transparent py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-2.5 bg-[#c2652a] hover:bg-[#a8521d] text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 shrink-0"
            >
              <span>Truy Tìm</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT: SIDEBAR + PRODUCT GRID                   */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ======================================================= */}
          {/* CỘT TRÁI: BỘ LỌC TÁC PHẨM (SIDEBAR FILTERS)             */}
          {/* ======================================================= */}
          <aside className="space-y-6">
            {/* Header Bộ Lọc */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e5d8cb]">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#c2652a]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <h3 className="font-serif font-bold text-sm text-[#26201b]">
                  Bộ Lọc Tác Phẩm
                </h3>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] text-[#a69280] hover:text-[#c2652a] transition-colors"
              >
                Thiết lập lại
              </button>
            </div>

            {/* 1. Dòng Men Tự Nhiên */}
            <div className="bg-white p-4 rounded-xl border border-[#ebe1d5] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#26201b]">
                <span>Dòng Men Tự Nhiên</span>
                <span className="text-[10px] text-[#a69280] font-normal">5 sắc men</span>
              </div>
              <div className="space-y-2 text-xs text-[#524337]">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-[#c2652a] rounded-sm"
                    />
                    Men Tro Củi Tự Nhiên
                  </span>
                  <span className="text-[10px] bg-[#f5ede2] text-[#8a7260] px-1.5 py-0.5 rounded-full">
                    18
                  </span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-[#c2652a] rounded-sm"
                    />
                    Men Sa Thạch Sa Mạc
                  </span>
                  <span className="text-[10px] bg-[#f5ede2] text-[#8a7260] px-1.5 py-0.5 rounded-full">
                    12
                  </span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-[#c2652a] rounded-sm"
                    />
                    Men Hỏa Biến Đất Nung
                  </span>
                  <span className="text-[10px] bg-[#f5ede2] text-[#8a7260] px-1.5 py-0.5 rounded-full">
                    09
                  </span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-[#c2652a] rounded-sm"
                    />
                    Men Cốt Rạn Mộc
                  </span>
                  <span className="text-[10px] bg-[#f5ede2] text-[#8a7260] px-1.5 py-0.5 rounded-full">
                    05
                  </span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-[#c2652a] rounded-sm"
                    />
                    Men Vàng Cát Cổ
                  </span>
                  <span className="text-[10px] bg-[#f5ede2] text-[#8a7260] px-1.5 py-0.5 rounded-full">
                    04
                  </span>
                </label>
              </div>
            </div>

            {/* 2. Phân Loại Dáng Gốm */}
            <div className="bg-white p-4 rounded-xl border border-[#ebe1d5] shadow-xs space-y-2">
              <h4 className="text-xs font-semibold text-[#26201b] pb-1">
                Phân Loại Dáng Gốm
              </h4>
              <button
                type="button"
                onClick={() => setSelectedForm('all')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all ${
                  selectedForm === 'all'
                    ? 'bg-[#faefe4] text-[#c2652a] font-semibold'
                    : 'text-[#524337] hover:bg-[#faf6f0]'
                }`}
              >
                <span>Tất cả dáng gốm</span>
                <span className="text-[10px] opacity-75">{INITIAL_PRODUCTS.length}</span>
              </button>
              {[
                { name: 'Ấm Chén Trà Đạo', count: 16 },
                { name: 'Bình Hoa Điêu Khắc', count: 14 },
                { name: 'Bát Đĩa Bàn Tiệc Mộc', count: 11 },
                { name: 'Tượng Thiền & Cảnh Gốm', count: 7 },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSelectedForm(item.name)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all ${
                    selectedForm === item.name
                      ? 'bg-[#faefe4] text-[#c2652a] font-semibold'
                      : 'text-[#524337] hover:bg-[#faf6f0]'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] opacity-75">{item.count}</span>
                </button>
              ))}
            </div>

            {/* 3. Kỹ Thuật Lò & Cốt Đất */}
            <div className="bg-white p-4 rounded-xl border border-[#ebe1d5] shadow-xs space-y-3">
              <h4 className="text-xs font-semibold text-[#26201b]">
                Kỹ Thuật Lò & Cốt Đất
              </h4>
              <div className="space-y-2 text-xs text-[#524337]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-[#c2652a] rounded-sm"
                  />
                  Lò củi truyền thống khử oxy 1300°C
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-[#c2652a] rounded-sm"
                  />
                  Đất sa thạch ủ ẩm trên 6 tháng
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-[#c2652a] rounded-sm"
                  />
                  Vuốt tay thủ công bàn xoay gỗ
                </label>
              </div>
            </div>

            {/* 4. Dấu Ấn Nghệ Nhân */}
            <div className="bg-white p-4 rounded-xl border border-[#ebe1d5] shadow-xs space-y-2.5">
              <h4 className="text-xs font-semibold text-[#26201b]">
                Dấu Ấn Nghệ Nhân
              </h4>
              <div className="space-y-2 text-xs text-[#524337]">
                {[
                  { id: 'all', label: 'Tất cả nghệ nhân xưởng' },
                  { id: 'nnut', label: 'NNƯT. Trần Hữu Trọng' },
                  { id: 'tuan', label: 'Nghệ nhân Nguyễn Viết Tuấn' },
                  { id: 'chudau', label: 'Xưởng phục dựng cổ Chu Đậu' },
                ].map((art) => (
                  <label key={art.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="artisan"
                      checked={artisanFilter === art.id}
                      onChange={() => setArtisanFilter(art.id)}
                      className="accent-[#c2652a]"
                    />
                    <span>{art.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Khoảng Giá Sưu Tầm */}
            <div className="bg-white p-4 rounded-xl border border-[#ebe1d5] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#26201b]">
                <span>Khoảng Giá Sưu Tầm</span>
                <span className="text-[#c2652a]">
                  ≤ {priceRange.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <input
                type="range"
                min="380000"
                max="2600000"
                step="50000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#c2652a] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#9e8774]">
                <span>380.000đ</span>
                <span>2.600.000đ</span>
              </div>
              <div className="pt-2 border-t border-[#f0e7dd]">
                <label className="flex items-start gap-2 text-xs text-[#524337] cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-[#c2652a] rounded-sm mt-0.5"
                  />
                  <div>
                    <span className="font-medium text-[#26201b] block">
                      Độc bản duy nhất kèm chứng thư
                    </span>
                    <span className="text-[10px] text-[#8a7260]">
                      Có ấn triện khắc đáy lò nung
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* 6. Card Cam Kết Bảo Hành Bể Vỡ */}
            <div className="bg-[#fcf8f3] p-4 rounded-xl border border-[#eedecf] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#c2652a]">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>BẢO HÀNH VỠ NỨT</span>
              </div>
              <p className="text-[11px] text-[#735e4d] leading-relaxed">
                Mọi kiện gốm mộc được bao bọc 5 lớp xơ dừa và nẹp nan tre chống va đập. Mở hộp tại nhà an tâm 100%.
              </p>
            </div>
          </aside>

          {/* ======================================================= */}
          {/* CỘT PHẢI: LƯỚI TÁC PHẨM (PRODUCT GRID - 3 CỘT)           */}
          {/* ======================================================= */}
          <section className="lg:col-span-3 space-y-6">
            {/* Header Lưới: Active Tags Filter & Đếm số lượng */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#ebe1d5]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#8a7260]">Lọc theo:</span>
                <span className="inline-flex items-center gap-1 text-xs bg-[#f6eee4] text-[#c2652a] px-2.5 py-1 rounded-full border border-[#eddccc]">
                  Men Tro Củi Tự Nhiên
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="hover:text-black font-bold"
                  >
                    ×
                  </button>
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-[#f6eee4] text-[#c2652a] px-2.5 py-1 rounded-full border border-[#eddccc]">
                  Khử oxy 1300°C
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="hover:text-black font-bold"
                  >
                    ×
                  </button>
                </span>
                {selectedForm !== 'all' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-[#f6eee4] text-[#c2652a] px-2.5 py-1 rounded-full border border-[#eddccc]">
                    {selectedForm}
                    <button
                      type="button"
                      onClick={() => setSelectedForm('all')}
                      className="hover:text-black font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              <span className="text-xs text-[#8a7260]">
                Hiển thị {filteredProducts.length} trên 48 tác phẩm
              </span>
            </div>

            {/* LƯỚI SẢN PHẨM (3 Cột) */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ebdcd0] p-12 text-center space-y-3">
                <p className="font-serif text-lg text-[#26201b]">
                  Không tìm thấy tác phẩm phù hợp với bộ lọc
                </p>
                <p className="text-xs text-[#8a7260]">
                  Vui lòng thử điều chỉnh lại mức giá hoặc từ khóa tìm kiếm.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#c2652a] text-white text-xs rounded-xl hover:bg-[#a8521d] transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((item) => {
                  const isFavorited = !!favorites[item.id];
                  const detailUrl = `${ROUTES.PRODUCTS}/${item.id}`;

                  return (
                    <article
                      key={item.id}
                      className="bg-white rounded-2xl border border-[#ebdcd0] overflow-hidden shadow-[0_2px_12px_rgba(194,101,42,0.04)] hover:shadow-[0_8px_24px_rgba(194,101,42,0.12)] hover:border-[#c2652a]/40 transition-all duration-300 flex flex-col group"
                    >
                      {/* Khung Ảnh Sản Phẩm */}
                      <div className="relative aspect-[4/5] bg-[#f3ece2] overflow-hidden">
                        <Link to={detailUrl} className="block w-full h-full">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </Link>

                        {/* Tag góc trên trái */}
                        <div className="absolute top-3 left-3 bg-[#e8ded2]/90 backdrop-blur-xs text-[#5c493a] text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider border border-[#dfd2c4]">
                          {item.tag}
                        </div>

                        {/* Nút Yêu Thích góc trên phải */}
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(item)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-xs flex items-center justify-center transition-colors shadow-xs ${
                            isFavorited
                              ? 'bg-red-50 text-red-600'
                              : 'bg-white/80 hover:bg-white text-[#5c493a] hover:text-[#c2652a]'
                          }`}
                          title="Lưu tác phẩm"
                          aria-label="Lưu tác phẩm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill={isFavorited ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Nội Dung Thẻ */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          {/* Phân loại phụ */}
                          <div className="flex items-center gap-1.5 text-[10px] text-[#9c8472] font-semibold tracking-wider uppercase mb-1">
                            <span>{item.category1}</span>
                            <span>•</span>
                            <span>{item.category2}</span>
                          </div>

                          {/* Tiêu đề */}
                          <Link to={detailUrl}>
                            <h4 className="font-serif font-bold text-sm text-[#26201b] group-hover:text-[#c2652a] transition-colors line-clamp-1">
                              {item.title}
                            </h4>
                          </Link>

                          {/* Mô tả tóm tắt */}
                          <p className="text-xs text-[#735e4d] mt-1.5 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>

                        {/* Phần Chân Card: Giá & Thao tác */}
                        <div className="pt-3 border-t border-[#f2e7db] flex items-center justify-between">
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-[#9c8472]">
                              Giá Niêm Yết Xưởng
                            </span>
                            <span className="text-sm font-bold text-[#26201b] font-serif">
                              {item.price}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Nút Xem Chi Tiết */}
                            <Link
                              to={detailUrl}
                              className="w-8 h-8 rounded-lg border border-[#e5d6c8] text-[#735e4d] hover:text-[#c2652a] hover:bg-[#faefe4] flex items-center justify-center transition-colors"
                              title="Xem chi tiết"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </Link>

                            {/* Nút Thêm Vào Giỏ */}
                            <button
                              type="button"
                              onClick={() => handleAddToCart(item)}
                              className="px-3 py-1.5 rounded-lg bg-[#c2652a] hover:bg-[#a8521d] text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs active:scale-95"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              <span>Thêm</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* THANH PHÂN TRANG (PAGINATION SHARED COMPONENT) */}
            <Pagination
              currentPage={currentPage}
              totalPages={6}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default CollectionPage;


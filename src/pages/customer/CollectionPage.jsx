import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart, useToast } from '../../context';
import { Pagination } from '../../components/shared';
import { ROUTES } from '../../constants';
import { categoryApi, productApi } from '../../api';

export const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchKeywords, setSearchKeywords] = useState('');
  const [priceRange, setPriceRange] = useState(2600000);
  const [selectedForm, setSelectedForm] = useState('all');
  const [selectedGlazes, setSelectedGlazes] = useState([]);
  const [selectedTechniques, setSelectedTechniques] = useState([]);
  const [isCertifiedOnly, setIsCertifiedOnly] = useState(false);
  const [artisanFilter, setArtisanFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { addToCart } = useCart();
  const toast = useToast();

  // Tải danh mục và sản phẩm thật từ Backend
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        // 1. Tải danh mục thật
        const catRes = await categoryApi.getCategories();
        if (isMounted && catRes?.data && Array.isArray(catRes.data) && catRes.data.length > 0) {
          setDbCategories(catRes.data);
        }

        // 2. Tải sản phẩm thật từ Backend
        const prodRes = await productApi.getProducts({ limit: 50 });
        if (
          isMounted &&
          prodRes?.data?.products &&
          Array.isArray(prodRes.data.products) &&
          prodRes.data.products.length > 0
        ) {
          const fallbackImages = [
            '/images/product-1.jpg',
            '/images/hero-vase.jpg',
            '/images/cat-tra-dao.jpg',
            '/images/cat-bat-dia.jpg',
            '/images/product-2.jpg',
          ];

          const mapped = prodRes.data.products.map((p, idx) => {
            const primaryVariant = p.variants?.[0] || {};
            const imgFromDb =
              primaryVariant.images?.find((img) => img.isPrimary)?.imageUrl ||
              primaryVariant.images?.[0]?.imageUrl;

            // Nếu ảnh DB là example.com hoặc không khả dụng, dùng ảnh gốm mộc Sahara
            const validImage =
              imgFromDb && !imgFromDb.includes('example.com')
                ? imgFromDb
                : fallbackImages[idx % fallbackImages.length];

            const priceNum = primaryVariant.price || 0;

            return {
              id: p.id,
              tag:
                primaryVariant.stockQuantity > 0
                  ? `CÒN ${primaryVariant.stockQuantity} TÁC PHẨM`
                  : 'HẾT HÀNG TẠI XƯỞNG',
              category1: p.category?.name?.toUpperCase() || 'GỐM MỘC',
              category2: primaryVariant.variantName?.toUpperCase() || 'TIÊU CHUẨN',
              categoryGroup: p.category?.name || 'Tác Phẩm Gốm',
              glaze: p.category?.name || 'Men Tro Tự Nhiên',
              artisan: 'all',
              title: p.name,
              desc:
                p.description ||
                'Cốt đất sét thô nung nhiệt độ cao 1300°C bằng củi tự nhiên tại xưởng Sahara Atelier.',
              price: `${priceNum.toLocaleString('vi-VN')}₫`,
              priceNumber: priceNum,
              image: validImage,
              raw: p,
            };
          });

          setProducts(mapped);
        }
      } catch (err) {
        console.warn('Lỗi kết nối máy chủ, hiển thị danh sách dự phòng:', err?.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Xử lý nút Thêm vào giỏ hàng
  const handleAddToCart = async (product) => {
    const variantId = product.raw?.variants?.[0]?.id;
    if (variantId) {
      await addToCart(variantId, 1);
    } else {
      toast.success(`Đã thêm "${product.title}" vào giỏ hàng!`);
    }
  };

  // Toggle bộ lọc men
  const toggleGlaze = (glazeName) => {
    setSelectedGlazes((prev) =>
      prev.includes(glazeName) ? prev.filter((g) => g !== glazeName) : [...prev, glazeName]
    );
  };

  // Toggle kỹ thuật lò
  const toggleTechnique = (tech) => {
    setSelectedTechniques((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  // Reset toàn bộ bộ lọc
  const handleResetFilters = () => {
    setSearchKeywords('');
    setPriceRange(2600000);
    setSelectedForm('all');
    setSelectedGlazes([]);
    setSelectedTechniques([]);
    setIsCertifiedOnly(false);
    setArtisanFilter('all');
    setCurrentPage(1);
    toast.info('Đã thiết lập lại toàn bộ bộ lọc.');
  };

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Lọc theo từ khóa tìm kiếm
      if (searchKeywords.trim()) {
        const query = searchKeywords.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.desc.toLowerCase().includes(query);
        const matchCat =
          (item.category1 && item.category1.toLowerCase().includes(query)) ||
          (item.category2 && item.category2.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }

      // 2. Lọc theo dáng gốm
      if (selectedForm !== 'all' && item.categoryGroup !== selectedForm) {
        return false;
      }

      // 3. Lọc theo dòng men (nếu có chọn)
      if (selectedGlazes.length > 0 && !selectedGlazes.includes(item.glaze)) {
        return false;
      }

      // 4. Lọc theo khoảng giá
      if (item.priceNumber > priceRange) {
        return false;
      }

      // 5. Lọc theo nghệ nhân
      if (artisanFilter !== 'all' && item.artisan !== artisanFilter) {
        return false;
      }

      return true;
    });
  }, [products, searchKeywords, selectedForm, selectedGlazes, priceRange, artisanFilter]);

  // Quy chuẩn phân trang: 9 sản phẩm / trang
  // <= 9: Không hiển thị | > 9 (đến 18): Hiện trang 1, 2 | > 18 (đến 27): Hiện trang 1, 2, 3
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Reset về trang 1 nếu bộ lọc làm giảm số trang
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Danh sách tác phẩm cắt theo trang hiện tại
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

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
              </div>
              <div className="space-y-2 text-xs text-[#524337]">
                {[
                  'Men Tro Củi Tự Nhiên',
                  'Men Sa Thạch Sa Mạc',
                  'Men Hỏa Biến Đất Nung',
                  'Men Cốt Rạn Mộc',
                  'Men Vàng Cát Cổ',
                ].map((glazeName) => (
                  <label key={glazeName} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGlazes.includes(glazeName)}
                      onChange={() => toggleGlaze(glazeName)}
                      className="accent-[#c2652a] rounded-sm"
                    />
                    <span>{glazeName}</span>
                  </label>
                ))}
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
              </button>
              {(dbCategories.length > 0
                ? dbCategories
                : [
                    { id: 'cat-1', name: 'Ấm Chén Trà Đạo' },
                    { id: 'cat-2', name: 'Bình Hoa Điêu Khắc' },
                    { id: 'cat-3', name: 'Bát Đĩa Bàn Tiệc Mộc' },
                    { id: 'cat-4', name: 'Tượng Thiền & Cảnh Gốm' },
                  ]
              ).map((item) => (
                <button
                  key={item.id || item.name}
                  type="button"
                  onClick={() => setSelectedForm(item.name)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all ${
                    selectedForm === item.name
                      ? 'bg-[#faefe4] text-[#c2652a] font-semibold'
                      : 'text-[#524337] hover:bg-[#faf6f0]'
                  }`}
                >
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            {/* 3. Kỹ Thuật Lò & Cốt Đất */}
            <div className="bg-white p-4 rounded-xl border border-[#ebe1d5] shadow-xs space-y-3">
              <h4 className="text-xs font-semibold text-[#26201b]">
                Kỹ Thuật Lò & Cốt Đất
              </h4>
              <div className="space-y-2 text-xs text-[#524337]">
                {[
                  'Lò củi truyền thống khử oxy 1300°C',
                  'Đất sa thạch ủ ẩm trên 6 tháng',
                  'Vuốt tay thủ công bàn xoay gỗ',
                ].map((tech) => (
                  <label key={tech} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTechniques.includes(tech)}
                      onChange={() => toggleTechnique(tech)}
                      className="accent-[#c2652a] rounded-sm"
                    />
                    <span>{tech}</span>
                  </label>
                ))}
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
                    checked={isCertifiedOnly}
                    onChange={(e) => setIsCertifiedOnly(e.target.checked)}
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
                <span className="text-xs text-[#8a7260] font-medium">Lọc theo:</span>
                {!(
                  searchKeywords.trim() !== '' ||
                  selectedForm !== 'all' ||
                  selectedGlazes.length > 0 ||
                  selectedTechniques.length > 0 ||
                  artisanFilter !== 'all' ||
                  priceRange < 2600000
                ) && (
                  <span className="text-xs text-[#a08975] italic">Tất cả tác phẩm</span>
                )}

                {/* Tag từ khóa tìm kiếm */}
                {searchKeywords.trim() !== '' && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-[#f6eee4] text-[#c2652a] px-2.5 py-1 rounded-full border border-[#eddccc]">
                    <span>Từ khóa: "{searchKeywords}"</span>
                    <button
                      type="button"
                      onClick={() => setSearchKeywords('')}
                      className="hover:text-black font-bold cursor-pointer text-sm leading-none"
                      title="Xóa tìm kiếm"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Tag dáng gốm */}
                {selectedForm !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-[#f6eee4] text-[#c2652a] px-2.5 py-1 rounded-full border border-[#eddccc]">
                    <span>Dáng: {selectedForm}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedForm('all')}
                      className="hover:text-black font-bold cursor-pointer text-sm leading-none"
                      title="Bỏ chọn dáng"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Tag các dòng men đã chọn */}
                {selectedGlazes.map((glaze) => (
                  <span
                    key={glaze}
                    className="inline-flex items-center gap-1.5 text-xs bg-[#f6eee4] text-[#c2652a] px-2.5 py-1 rounded-full border border-[#eddccc]"
                  >
                    <span>{glaze}</span>
                    <button
                      type="button"
                      onClick={() => toggleGlaze(glaze)}
                      className="hover:text-black font-bold cursor-pointer text-sm leading-none"
                      title={`Bỏ lọc ${glaze}`}
                    >
                      ×
                    </button>
                  </span>
                ))}

                {/* Tag các kỹ thuật lò đã chọn */}
                {selectedTechniques.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 text-xs bg-[#f6eee4] text-[#c2652a] px-2.5 py-1 rounded-full border border-[#eddccc]"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => toggleTechnique(tech)}
                      className="hover:text-black font-bold cursor-pointer text-sm leading-none"
                      title={`Bỏ lọc ${tech}`}
                    >
                      ×
                    </button>
                  </span>
                ))}

                {/* Tag nghệ nhân */}
                {artisanFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-[#f6eee4] text-[#c2652a] px-2.5 py-1 rounded-full border border-[#eddccc]">
                    <span>
                      Nghệ nhân: {
                        artisanFilter === 'nnut'
                          ? 'NNƯT. Trần Hữu Trọng'
                          : artisanFilter === 'tuan'
                          ? 'Nguyễn Viết Tuấn'
                          : artisanFilter === 'chudau'
                          ? 'Xưởng Chu Đậu'
                          : artisanFilter
                      }
                    </span>
                    <button
                      type="button"
                      onClick={() => setArtisanFilter('all')}
                      className="hover:text-black font-bold cursor-pointer text-sm leading-none"
                      title="Bỏ chọn nghệ nhân"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Tag khoảng giá */}
                {priceRange < 2600000 && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-[#f6eee4] text-[#c2652a] px-2.5 py-1 rounded-full border border-[#eddccc]">
                    <span>Giá ≤ {priceRange.toLocaleString('vi-VN')}₫</span>
                    <button
                      type="button"
                      onClick={() => setPriceRange(2600000)}
                      className="hover:text-black font-bold cursor-pointer text-sm leading-none"
                      title="Bỏ lọc giá"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              {(searchKeywords.trim() !== '' ||
                selectedForm !== 'all' ||
                selectedGlazes.length > 0 ||
                selectedTechniques.length > 0 ||
                artisanFilter !== 'all' ||
                priceRange < 2600000) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[#a69280] hover:text-[#c2652a] transition-colors underline cursor-pointer"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {/* LƯỚI SẢN PHẨM (3 Cột) */}
            {isLoading ? (
              <div className="bg-white rounded-2xl border border-[#ebdcd0] p-16 text-center space-y-4">
                <div className="w-10 h-10 border-3 border-[#c2652a]/20 border-t-[#c2652a] rounded-full animate-spin mx-auto"></div>
                <p className="font-serif text-base text-[#26201b]">Đang tải danh sách tác phẩm gốm mộc...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
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
                {paginatedProducts.map((item) => {
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

            {/* THANH PHÂN TRANG (Chỉ hiển thị khi tổng sản phẩm vượt quá 9) */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default CollectionPage;


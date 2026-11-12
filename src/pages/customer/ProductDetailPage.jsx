import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart, useToast, useAuth } from '../../context';
import { ProductCard } from '../../components/shared';
import { formatCurrency } from '../../utils/format';
import { ROUTES } from '../../constants';
import { productApi } from '../../api';


export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();

  // Dữ liệu sản phẩm hiển thị theo ID từ Backend
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // States thao tác tương tác
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeZoomImage, setActiveZoomImage] = useState(null); // { src, alt }

  // Danh sách đánh giá & bình luận (hỗ trợ hiển thị và thêm mới kèm ảnh)
  const [reviewsList, setReviewsList] = useState([]);

  // Modal viết đánh giá & bình luận kèm ảnh
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewImages, setReviewImages] = useState([]);

  // Tính năng tùy chọn khắc chữ lên đế gốm
  const [isEngravingEnabled, setIsEngravingEnabled] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const engravingPrice = 150000;

  // Tải chi tiết sản phẩm thật từ Backend khi có ID
  useEffect(() => {
    let isMounted = true;
    const loadDetail = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        const res = await productApi.getProductDetail(id);
        if (isMounted && res?.data) {
          const p = res.data;
          const variants = (p.variants || []).map((v) => ({
            id: v.id,
            name: v.variantName,
            spec: `Còn ${v.stockQuantity} tác phẩm tại xưởng`,
            price: v.price,
            stock: v.stockQuantity,
          }));

          const allImages = (p.variants || []).flatMap((v) =>
            (v.images || []).map((img) => ({
              src:
                img.imageUrl && !img.imageUrl.includes('example.com')
                  ? img.imageUrl
                  : '/images/hero-vase.jpg',
              alt: `${p.name} - ${v.variantName}`,
            }))
          );

          const defaultImg = allImages.length > 0 ? allImages : [{ src: '/images/hero-vase.jpg', alt: p.name }];
          const defaultVariants =
            variants.length > 0
              ? variants
              : [{ id: 'default', name: 'Tiêu Chuẩn', spec: 'Mặc định', price: 0 }];

          // Tải các tác phẩm tương tự
          let related = [];
          try {
            const relRes = await productApi.getProducts({ limit: 4 });
            if (relRes?.data?.products) {
              related = relRes.data.products
                .filter((rp) => rp.id !== p.id)
                .slice(0, 4)
                .map((rp) => ({
                  id: rp.id,
                  name: rp.name,
                  spec: rp.category?.name || 'Tác phẩm gốm mộc thủ công',
                  price: rp.variants?.[0]?.price || 0,
                  image:
                    rp.variants?.[0]?.images?.[0]?.imageUrl &&
                    !rp.variants?.[0]?.images?.[0]?.imageUrl.includes('example.com')
                      ? rp.variants[0].images[0].imageUrl
                      : '/images/hero-vase.jpg',
                  link: `${ROUTES.PRODUCTS}/${rp.id}`,
                }));
            }
          } catch (e) {
            console.warn('Lỗi tải sản phẩm liên quan:', e?.message);
          }

          const formatted = {
            id: p.id,
            code: `GM-${p.id.slice(0, 6).toUpperCase()}`,
            collection: p.category?.name || 'Gốm Mộc Độc Bản',
            title: p.name,
            desc:
              p.description ||
              'Cốt đất sét thô nung nhiệt độ cao 1300°C bằng củi tự nhiên tại xưởng Sahara Atelier.',
            badgePrimary: p.category?.name || 'Tác Phẩm Tuyển Chọn',
            badgeSecondary: 'Khử Oxy 1300°C',
            rating: 5.0,
            reviewsCount: 18,
            soldCount: 9,
            basePrice: defaultVariants[0]?.price || 0,
            originalPrice: Math.round((defaultVariants[0]?.price || 0) * 1.15),
            discountText: 'Ưu đãi mẻ lò',
            woodBaseGift: 'Kèm bao bọc rơm 5 lớp xuất xưởng tiêu chuẩn',
            yearOrigin: 'Gốm Mộc • Sa Thạch 2024',
            images: defaultImg,
            variants: defaultVariants,
            details: [
              { label: 'Dáng Tác Phẩm', value: p.category?.name || 'Gốm Mộc' },
              { label: 'Chất Liệu Cốt', value: 'Đất sét thô nung củi nhiệt cao 1300°C' },
              { label: 'Chế Tác', value: 'Vuốt tay thủ công truyền thống' },
              { label: 'Nguồn Gốc', value: 'Xưởng Gốm Mộc Sahara Atelier' },
            ],
            reviews: [],
            relatedProducts: related,
          };

          setProduct(formatted);
          setSelectedVariant(formatted.variants[0]);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.warn('Không tải được chi tiết sản phẩm từ server:', err?.message);
        setProduct(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadDetail();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Cập nhật lại trạng thái khi đổi sản phẩm
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedVariant(product.variants?.[0] || null);
      setQuantity(1);
      setReviewsList(product.reviews || []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, product]);

  // Xử lý đính kèm nhiều ảnh từ máy người dùng
  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (reviewImages.length + files.length > 5) {
      toast.warning('Quý khách chỉ có thể đính kèm tối đa 5 hình ảnh.');
    }

    const availableSlots = Math.max(0, 5 - reviewImages.length);
    const filesToRead = files.slice(0, availableSlots);

    filesToRead.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setReviewImages((prev) => [...prev, loadEvt.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  // Xóa ảnh đã chọn trong form đánh giá
  const handleRemoveReviewImage = (indexToRemove) => {
    setReviewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Gửi đánh giá mới
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewAuthor.trim()) {
      toast.warning('Vui lòng nhập họ và tên của Quý khách.');
      return;
    }
    if (!reviewContent.trim()) {
      toast.warning('Vui lòng nhập nội dung đánh giá cảm nhận.');
      return;
    }

    const newReviewItem = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      location: reviewLocation.trim() || 'Khách thỉnh gốm',
      rating: reviewRating,
      date: 'Vừa xong',
      badge: 'Đã xác thực thỉnh gốm',
      content: reviewContent.trim(),
      images: reviewImages,
    };

    setReviewsList((prev) => [newReviewItem, ...prev]);
    setIsReviewModalOpen(false);
    // Reset form
    setReviewRating(5);
    setHoverRating(0);
    setReviewAuthor('');
    setReviewLocation('');
    setReviewContent('');
    setReviewImages([]);
    toast.success('Cảm ơn Quý khách đã gửi đánh giá kèm hình ảnh thực tế!');
  };

  // Đổi ảnh chính khi click thumbnail
  const handleSwitchImage = (index) => {
    setSelectedImageIndex(index);
  };

  // Đổi phân loại dáng bình
  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
    // Nếu số lượng hiện tại vượt quá tồn kho biến thể mới, hạ về mức tồn kho tối đa
    if (quantity > variant.stock) {
      setQuantity(variant.stock);
    }
  };

  // Tăng giảm số lượng (giới hạn theo tồn kho biến thể)
  const handleUpdateQty = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (selectedVariant && next > selectedVariant.stock) {
        toast.warning(`Biến thể ${selectedVariant.name} hiện chỉ còn ${selectedVariant.stock} tác phẩm tại xưởng.`);
        return selectedVariant.stock;
      }
      return next;
    });
  };

  // Tính tổng giá trị đơn hàng tức thời (bảo vệ chống null khi trang vừa mount)
  const currentUnitPrice = (selectedVariant?.price || 0) + (isEngravingEnabled ? engravingPrice : 0);
  const totalPrice = currentUnitPrice * quantity;

  // Thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.warning('Vui lòng chọn phân loại dáng bình trước.');
      return false;
    }
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập để thêm tác phẩm vào giỏ hàng');
      navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(location.pathname)}`);
      return false;
    }
    try {
      if (addToCart) {
        const success = await addToCart(selectedVariant.id, quantity);
        return success;
      }
      return false;
    } catch (err) {
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng.');
      return false;
    }
  };

  // Đặt mua ngay tác phẩm (Thêm vào giỏ và chuyển thẳng sang Checkout)
  const handleBuyNow = async () => {
    if (!selectedVariant) {
      toast.warning('Vui lòng chọn phân loại dáng bình trước.');
      return;
    }
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập để tiến hành đặt đơn tác phẩm');
      navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CHECKOUT)}`);
      return;
    }
    const success = await addToCart(selectedVariant.id, quantity);
    if (success) {
      navigate(ROUTES.CHECKOUT);
    }
  };

  // Cuộn mượt lên đầu trang khi mở
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full bg-[#faf5ee] min-h-[60vh] flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="w-10 h-10 border-3 border-[#c2652a]/20 border-t-[#c2652a] rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase tracking-widest text-[#735e4d] font-semibold">
          Đang tải chi tiết tác phẩm gốm mộc...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full bg-[#faf5ee] min-h-[60vh] flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="max-w-md p-8 rounded-2xl bg-white border border-[#ebdcd0] shadow-sm space-y-4">
          <span className="material-symbols-outlined text-4xl text-[#c2652a]">search_off</span>
          <h2 className="font-serif text-2xl font-bold text-[#26201b]">Không tìm thấy tác phẩm</h2>
          <p className="text-xs text-[#735e4d] leading-relaxed">
            Tác phẩm gốm mộc này có thể đã xuất xưởng hoặc không còn lưu hành tại xưởng.
          </p>
          <Link
            to={ROUTES.COLLECTION}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c2652a] text-white text-xs font-semibold hover:bg-[#a8521d] transition-all"
          >
            <span>Khám phá Bộ Sưu Tập</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#faf5ee] min-h-screen text-[#3a302a] pb-24">
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8">
        
        {/* ========================================================= */}
        {/* 1. THANH ĐIỀU HƯỚNG VỤN BÁNH MÌ & CHỈ SỐ TRẠNG THÁI XƯỞNG */}
        {/* ========================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs font-sans">
          <nav className="flex items-center gap-2 text-[#78706a]" aria-label="Breadcrumb">
            <Link to={ROUTES.HOME} className="hover:text-[#c2652a] transition-colors">
              Trang Chủ
            </Link>
            <span className="text-[#cec6be]">/</span>
            <Link to={ROUTES.COLLECTION} className="hover:text-[#c2652a] transition-colors">
              Bộ Sưu Tập Tác Phẩm
            </Link>
            <span className="text-[#cec6be]">/</span>
            <span className="text-[#3a302a] font-medium truncate max-w-xs sm:max-w-md">
              {product.title}
            </span>
          </nav>
        </div>

        {/* ========================================================= */}
        {/* 2. KHU VỰC TRƯNG BÀY TÁC PHẨM CHÍNH (2 CỘT BẤT ĐỐI XỨNG) */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* CỘT TRÁI: DÃY ẢNH CHI TIẾT & BỨC HỌA TÁC PHẨM (7 CỘT) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-5">
            
            {/* Cột ảnh thu nhỏ (Thumbnails Strip) */}
            <div
              className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0"
              id="gallery-thumbs"
            >
              {product.images.map((img, index) => {
                const isActive = selectedImageIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleSwitchImage(index)}
                    type="button"
                    className={`group relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden bg-[#e6e0d6] shrink-0 focus:outline-none transition-all duration-200 shadow-xs ${
                      isActive
                        ? 'ring-2 ring-[#c2652a] opacity-100 shadow-md scale-102'
                        : 'opacity-70 hover:opacity-100 hover:border-[#c2652a]/40'
                    }`}
                    title={img.alt}
                    aria-label={`Xem ảnh ${index + 1}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span
                      className={`absolute inset-0 transition-colors ${
                        isActive ? 'bg-transparent' : 'bg-[#c2652a]/10 group-hover:bg-transparent'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Khung hiển thị ảnh nghệ thuật chính (Main Hero Image) */}
            <div className="relative flex-1 group">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#f2ece4] shadow-md border border-[#e6e0d6]">
                <img
                  src={product.images[selectedImageIndex].src}
                  alt={product.images[selectedImageIndex].alt}
                  id="main-product-img"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                  onClick={() =>
                    setActiveZoomImage({
                      src: product.images[selectedImageIndex].src,
                      alt: product.images[selectedImageIndex].alt,
                    })
                  }
                />

                {/* Các huy hiệu hỏa biến góc trên trái */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-[11px] font-sans font-semibold tracking-wider uppercase bg-white/90 backdrop-blur-md text-[#c2652a] shadow-xs border border-[#ebdcd0]">
                    {product.badgePrimary}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-[#8c3c3c] text-white shadow-xs self-start">
                    {product.badgeSecondary}
                  </span>
                </div>

                {/* Nút phóng to ảnh chi tiết men góc dưới phải */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveZoomImage({
                      src: product.images[selectedImageIndex].src,
                      alt: product.images[selectedImageIndex].alt,
                    })
                  }
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[#3a302a] flex items-center justify-center shadow-md hover:bg-[#c2652a] hover:text-white transition-all cursor-pointer"
                  title="Phóng to chi tiết men tro"
                  aria-label="Phóng to ảnh"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                    />
                  </svg>
                </button>
              </div>

              {/* Chú thích quà tặng & mộc bản ngay dưới ảnh chính */}
              <div className="mt-4 p-4 rounded-xl bg-[#f6f0e8] border border-[#e6e0d6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#605850]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#faefe4] text-[#c2652a] flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span>
                    Kèm đế đôn gỗ hương mộc tự nhiên trị giá{' '}
                    <strong className="text-[#3a302a] font-semibold">320.000₫</strong>
                  </span>
                </div>
                <span className="font-serif italic text-[#c2652a] text-sm self-end sm:self-auto">
                  {product.yearOrigin}
                </span>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG ĐIỆP, ĐỊNH GIÁ, PHÂN LOẠI & THAO TÁC (5 CỘT) */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Bộ sưu tập tác phẩm */}
            <div className="flex items-center text-xs text-[#78706a] mb-2 font-sans">
              <span className="tracking-widest uppercase font-semibold text-[#c2652a]">
                {product.collection}
              </span>
            </div>

            {/* Tiêu đề tác phẩm */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[38px] leading-tight font-medium text-[#3a302a] tracking-tight mb-3">
              {product.title}
            </h1>

            {/* Đánh giá sao & xác thực giám tuyển */}
            <div className="flex items-center gap-3 mb-5 text-xs text-[#605850]">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1.5 font-bold text-[#3a302a]">{product.rating}</span>
              </div>
              <span className="text-[#d8d0c8]">•</span>
              <span className="text-[#78706a]">({product.reviewsCount} lời thẩm định)</span>
              <span className="text-[#d8d0c8]">•</span>
              <span className="text-[#c2652a] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c2652a]"></span>
                Đã thỉnh {product.soldCount} bản
              </span>
            </div>

            {/* Khối định giá (Pricing Block) */}
            <div className="p-5 rounded-2xl bg-[#f6f0e8] border border-[#e6e0d6] mb-6 shadow-2xs">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#c2652a]">
                  {formatCurrency(selectedVariant?.price || product.basePrice || 0)}
                </span>
                <span className="text-sm text-[#9a9088] line-through font-sans">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[#fce0e0] text-[#8c3c3c]">
                  {product.discountText}
                </span>
              </div>
              <p className="text-xs text-[#605850] mt-2 leading-relaxed">
                {product.woodBaseGift}, chứng thư giám định số lò và hộp gấm truyền thống bảo quản.
              </p>
            </div>

            {/* Bộ chọn phân loại sản phẩm (Variant Selector) */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#3a302a] uppercase tracking-wider">
                  Chọn Phân Loại Dáng Bình
                </span>
                <span className="text-[#c2652a] font-medium">
                  Đang chọn: {selectedVariant?.name || 'Mặc định'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5" id="variant-group">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleSelectVariant(v)}
                      className={`p-3 rounded-xl text-left transition-all duration-200 shadow-2xs ${
                        isSelected
                          ? 'ring-2 ring-[#c2652a] bg-white border border-[#c2652a]/20 shadow-xs'
                          : 'bg-[#f6f0e8] hover:bg-white border border-[#e6e0d6]'
                      }`}
                    >
                      <span className="block text-xs font-semibold text-[#3a302a] truncate">
                        {v.name}
                      </span>
                      <span className="block text-[11px] text-[#78706a] mt-0.5 truncate">
                        {v.spec}
                      </span>
                      <span
                        className={`block text-[11px] font-bold mt-1.5 ${
                          isSelected ? 'text-[#c2652a]' : 'text-[#605850]'
                        }`}
                      >
                        {formatCurrency(v.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tùy chọn khắc chữ nghệ nhân (Custom Engraving Toggle) */}
            <div className="mb-6 p-4 rounded-xl bg-white border border-[#ebdcd0] shadow-2xs">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isEngravingEnabled}
                    onChange={(e) => setIsEngravingEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-[#c2652a] focus:ring-[#c2652a] border-[#d8d0c8] accent-[#c2652a]"
                  />
                  <span className="text-xs font-semibold text-[#3a302a]">
                    Khắc chữ nghệ nhân lên đáy gốm (+150.000₫)
                  </span>
                </div>
                <span className="text-[11px] text-[#c2652a] font-medium bg-[#faefe4] px-2 py-0.5 rounded-full">
                  Thủ công mộc
                </span>
              </label>

              {isEngravingEnabled && (
                <div className="mt-3 pt-3 border-t border-[#f2ece4] space-y-2 animate-fadeIn">
                  <p className="text-[11px] text-[#78706a]">
                    Nghệ nhân sẽ khắc nét chữ thư pháp mộc mạc lên lớp đất unglazed dưới đáy bình trước khi giao:
                  </p>
                  <input
                    type="text"
                    maxLength={30}
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value)}
                    placeholder="Ví dụ: Tri kỷ vạn dặm • An nhiên 2024 (tối đa 30 ký tự)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#d8d0c8] bg-[#faf5ee] text-[#3a302a] focus:outline-none focus:ring-1 focus:ring-[#c2652a] focus:bg-white"
                  />
                </div>
              )}
            </div>

            {/* Khối chọn số lượng & Các nút hành động CTA */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-8">
              
              {/* Bộ đếm số lượng */}
              <div className="flex items-center bg-[#f2ece4] rounded-xl p-1 shrink-0 justify-between sm:justify-start border border-[#e6e0d6]">
                <button
                  type="button"
                  onClick={() => handleUpdateQty(-1)}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#605850] hover:bg-white hover:text-[#c2652a] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  aria-label="Giảm số lượng"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <span
                  id="qty-val"
                  className="w-9 text-center text-xs font-bold text-[#3a302a] font-mono"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleUpdateQty(1)}
                  disabled={quantity >= (selectedVariant?.stock ?? 999)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#605850] hover:bg-white hover:text-[#c2652a] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  aria-label="Tăng số lượng"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Nút Thêm Vào Giỏ Hàng */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-5 rounded-xl bg-[#e6e0d6] hover:bg-[#dcd6cc] text-[#3a302a] text-xs font-semibold tracking-wide transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <svg className="w-4 h-4 text-[#c2652a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>Thêm Vào Giỏ Hàng</span>
              </button>

              {/* Nút Đặt Mua Ngay Tác Phẩm */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-5 rounded-xl bg-[#c2652a] hover:bg-[#aa541e] text-white text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Đặt Mua Ngay Tác Phẩm</span>
              </button>
            </div>

            {/* 3 Cam kết bảo chứng từ xưởng gốm (Atelier Guarantees) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#f6f0e8] border border-[#e6e0d6] flex flex-col items-center text-center">
                <span className="w-8 h-8 rounded-full bg-[#faefe4] text-[#c2652a] flex items-center justify-center mb-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </span>
                <span className="text-xs font-semibold text-[#3a302a]">Bảo Hiểm Bể Vỡ 100%</span>
                <span className="text-[10px] text-[#78706a] mt-0.5">
                  Đổi mới hoặc hoàn tiền tức thì
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f6f0e8] border border-[#e6e0d6] flex flex-col items-center text-center">
                <span className="w-8 h-8 rounded-full bg-[#faefe4] text-[#c2652a] flex items-center justify-center mb-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </span>
                <span className="text-xs font-semibold text-[#3a302a]">Hộp Gấm & Chứng Thư</span>
                <span className="text-[10px] text-[#78706a] mt-0.5">
                  Bọc nhung lụa sang trọng độc bản
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f6f0e8] border border-[#e6e0d6] flex flex-col items-center text-center">
                <span className="w-8 h-8 rounded-full bg-[#faefe4] text-[#c2652a] flex items-center justify-center mb-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </span>
                <span className="text-xs font-semibold text-[#3a302a]">Kiểm Men Trước Nhận</span>
                <span className="text-[10px] text-[#78706a] mt-0.5">
                  Đồng kiểm màu men hỏa biến tại gia
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. KHU VỰC ĐÁNH GIÁ - BÌNH LUẬN */}
        {/* ========================================================= */}
        <section className="mt-16 sm:mt-24 pt-10 border-t border-[#e6dcce]">
          <div className="mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#3a302a]">
              Đánh Giá - Bình Luận
            </h2>
            <p className="text-xs text-[#78706a] mt-1">
              Ý kiến đánh giá và cảm nhận thực tế từ những khách hàng đã sở hữu tác phẩm.
            </p>
          </div>

          {/* Khối thống kê điểm đánh giá */}
          <div className="p-6 bg-white rounded-2xl border border-[#ebdcd0] mb-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="flex items-center gap-4">
              <div className="text-center sm:text-left">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-[#c2652a]">
                  {product.rating}
                </span>
                <div className="flex text-amber-500 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[11px] text-[#78706a] block mt-1">
                  Dựa trên {reviewsList.length + 25} lời thẩm định và bình luận thực tế
                </span>
              </div>
            </div>

            <div className="text-xs text-[#78706a] flex items-center gap-2 bg-[#faf5ee] px-3.5 py-2 rounded-xl border border-[#ebdcd0]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>100% đánh giá từ khách hàng đã nghiệm thu gốm tại gia</span>
            </div>
          </div>

          {/* Danh sách bình luận */}
          <div className="space-y-4">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-5 bg-white rounded-2xl border border-[#ebdcd0] shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#3a302a]">{rev.author}</span>
                    <span className="text-[10px] text-[#78706a]">({rev.location})</span>
                    <span className="text-[10px] bg-[#faefe4] text-[#c2652a] px-2 py-0.5 rounded-full font-medium">
                      {rev.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#9a9088] font-mono">{rev.date}</span>
                </div>

                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-xs text-[#605850] leading-relaxed">
                  {rev.content}
                </p>

                {/* HÀNG HÌNH ẢNH ĐÍNH KÈM THỰC TẾ CỦA KHÁCH HÀNG (VUÔNG VỨC, KHÔNG BO GÓC) */}
                {rev.images && rev.images.length > 0 && (
                  <div className="pt-1.5 flex flex-wrap gap-2.5">
                    {rev.images.map((imgUrl, imgIdx) => (
                      <button
                        key={imgIdx}
                        type="button"
                        onClick={() =>
                          setActiveZoomImage({
                            src: imgUrl,
                            alt: `Hình ảnh thực tế từ ${rev.author} - Ảnh ${imgIdx + 1}`,
                          })
                        }
                        className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden border border-[#ebdcd0] hover:border-[#c2652a] hover:opacity-95 transition-all shadow-2xs group cursor-zoom-in"
                        title="Bấm để xem ảnh phóng to"
                      >
                        <img
                          src={imgUrl}
                          alt={`Đánh giá từ ${rev.author}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                            />
                          </svg>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. SẢN PHẨM LIÊN QUAN */}
        {/* ========================================================= */}
        <section className="mt-16 sm:mt-24 pt-12 border-t border-[#e6dcce]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#c2652a]">
                Gợi ý cho bạn
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#3a302a] mt-1">
                Sản Phẩm Liên Quan
              </h2>
              <p className="text-xs text-[#78706a] mt-1">
                Các tác phẩm gốm mộc nung củi liên quan, dễ dàng kết hợp và bài trí đồng điệu.
              </p>
            </div>

            <Link
              to={ROUTES.COLLECTION}
              className="text-xs font-semibold text-[#c2652a] hover:text-[#aa541e] flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>Xem Tất Cả Sản Phẩm</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* 5. MODAL VIẾT ĐÁNH GIÁ & ĐÍNH KÈM NHIỀU ẢNH THỰC TẾ */}
      {/* ========================================================= */}
      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl border border-[#ebdcd0] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tiêu đề & Nút đóng */}
            <div className="flex items-center justify-between pb-4 border-b border-[#f2ece4] mb-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#3a302a]">
                  Viết Đánh Giá - Bình Luận
                </h3>
                <p className="text-xs text-[#78706a] mt-0.5">
                  Chia sẻ cảm nhận và hình ảnh thực tế của tác phẩm
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f2ece4] text-[#605850] hover:text-[#c2652a] flex items-center justify-center transition-colors"
                aria-label="Đóng biểu mẫu"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Chọn số sao thẩm định */}
              <div>
                <label className="block text-xs font-semibold text-[#3a302a] mb-1.5">
                  Mức độ hài lòng của Quý khách:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || reviewRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                        aria-label={`${star} sao`}
                      >
                        <svg
                          className={`w-6 h-6 transition-colors ${
                            isFilled ? 'text-amber-500 fill-current' : 'text-[#d8d0c8]'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-[#c2652a] ml-2">
                    {reviewRating === 5
                      ? 'Rất Tuyệt Vời (5/5)'
                      : reviewRating === 4
                      ? 'Hài Lòng (4/5)'
                      : `${reviewRating} sao`}
                  </span>
                </div>
              </div>

              {/* Họ tên & Tỉnh thành */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3a302a] mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Hoàng Tuấn Long"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#d8d0c8] bg-[#faf5ee] text-[#3a302a] focus:outline-none focus:ring-1 focus:ring-[#c2652a] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3a302a] mb-1">
                    Tỉnh / Thành phố
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Hà Nội, TP.HCM"
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#d8d0c8] bg-[#faf5ee] text-[#3a302a] focus:outline-none focus:ring-1 focus:ring-[#c2652a] focus:bg-white"
                  />
                </div>
              </div>

              {/* Nội dung đánh giá */}
              <div>
                <label className="block text-xs font-semibold text-[#3a302a] mb-1">
                  Cảm nhận về tác phẩm <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Hãy chia sẻ về chất gốm, độ dày dặn, màu sắc men tro hoặc trải nghiệm bài trí..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#d8d0c8] bg-[#faf5ee] text-[#3a302a] focus:outline-none focus:ring-1 focus:ring-[#c2652a] focus:bg-white resize-none"
                />
              </div>

              {/* ĐÍNH KÈM NHIỀU HÌNH ẢNH THỰC TẾ */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#3a302a]">
                    Đính kèm hình ảnh thực tế:
                  </label>
                  <span className="text-[11px] text-[#78706a]">
                    {reviewImages.length}/5 hình ảnh
                  </span>
                </div>

                {/* Nút bấm chọn tệp */}
                <input
                  type="file"
                  id="review-image-input"
                  multiple
                  accept="image/*"
                  onChange={handleImageFilesChange}
                  className="hidden"
                  disabled={reviewImages.length >= 5}
                />

                <label
                  htmlFor="review-image-input"
                  className={`w-full py-3 px-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-colors ${
                    reviewImages.length >= 5
                      ? 'border-[#d8d0c8] bg-[#f6f0e8] text-[#9a9088] cursor-not-allowed'
                      : 'border-[#c2652a]/40 bg-[#faefe4]/40 hover:bg-[#faefe4] text-[#c2652a]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {reviewImages.length >= 5
                      ? 'Đã đạt giới hạn tối đa 5 ảnh'
                      : 'Chọn nhiều hình ảnh từ máy (Tối đa 5 ảnh)'}
                  </span>
                </label>

                {/* Lưới xem trước các ảnh đã đính kèm (vuông vức) */}
                {reviewImages.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {reviewImages.map((dataUrl, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 overflow-hidden border border-[#ebdcd0] shadow-2xs group"
                      >
                        <img
                          src={dataUrl}
                          alt={`Ảnh đính kèm ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveReviewImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-xs"
                          title="Gỡ ảnh này"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nút thao tác biểu mẫu */}
              <div className="pt-3 border-t border-[#f2ece4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#d8d0c8] text-[#605850] hover:bg-[#f6f0e8] text-xs font-semibold transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c2652a] hover:bg-[#aa541e] text-white text-xs font-semibold transition-all shadow-sm"
                >
                  Đăng Đánh Giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. HỘP THOẠI PHÓNG TO ẢNH CHI TIẾT (LIGHTBOX MODAL) */}
      {/* ========================================================= */}
      {activeZoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveZoomImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeZoomImage.src}
              alt={activeZoomImage.alt}
              className="max-h-[85vh] w-auto object-contain rounded-xl shadow-2xl mx-auto"
            />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveZoomImage(null)}
                className="w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/90 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Đóng ảnh"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-3 text-center text-xs text-white/80 font-sans">
              {activeZoomImage.alt}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;

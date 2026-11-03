import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useToast } from '../../context';
import { ROUTES } from '../../constants';

// =========================================================
// DỮ LIỆU ĐƠN HÀNG MẪU CHUẨN KHỚP 100% GIAO DIỆN BẢN VẼ STITCH
// =========================================================
const INITIAL_ORDERS_DATA = [
  {
    id: 'ord-1',
    code: 'ORD-2025-0915',
    status: 'PENDING',
    statusLabel: 'Chờ xác nhận mẻ lò',
    statusColor: 'bg-[#fef3c7] text-[#b45309]',
    statusDotColor: 'bg-[#d97706]',
    time: '10:15 Hôm nay',
    deliveryType: 'Giao tận nơi (Bọc xơ dừa chống sốc)',
    paymentMethodText: 'PayOS QR • Chưa thanh toán',
    paymentBadgeColor: 'bg-error-container text-[#b91c1c]',
    noticeText:
      'Đơn hàng đang chờ xưởng xác nhận nhiệt độ mẻ nung. Quý khách có thể hủy hoặc thanh toán ngay.',
    canCancel: true,
    canPay: true,
    totalPrice: '680.000₫',
    totalPriceNumber: 680000,
    items: [
      {
        id: 'item-p1',
        title: 'Bộ Hũ Đựng Trà Men Hỏa Biến Sa Thạch',
        spec: 'Dung tích 250ml • Men tro nung củi nhiệt cao 1.300°C',
        image: '/images/product-4.jpg',
        price: '680.000₫',
        quantity: 1,
      },
    ],
  },
  {
    id: 'ord-2',
    code: 'ORD-2025-0912',
    status: 'PROCESSING',
    statusLabel: 'Đang chuẩn bị hàng',
    statusColor: 'bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]',
    statusIcon: 'inventory_2',
    time: 'Hôm qua, 16:40',
    deliveryType: 'Giao tận nơi',
    paymentMethodText: 'Đã thanh toán (PayOS)',
    paymentBadgeColor: 'bg-[#dcfce7] text-[#15803d]',
    workshopNote:
      'Quy trình tuyển gốm: Nghệ nhân đang kiểm tra men và bọc đệm rơm 5 lớp để bảo vệ cốt gốm khi luân chuyển.',
    footerNote: 'Dự kiến xuất xưởng và giao cho đơn vị vận chuyển chiều nay',
    canContact: true,
    totalPrice: '2.600.000₫',
    totalPriceNumber: 2600000,
    items: [
      {
        id: 'item-p2',
        title: 'Tác phẩm Khắc Họa Bọ Ngựa Cành Thu',
        spec: 'Đất sét thô sông Hồng • Nung củi 72h hỏa biến độc bản',
        image: '/images/hero-vase.jpg',
        price: '2.600.000₫',
        quantity: 1,
      },
    ],
  },
  {
    id: 'ord-3',
    code: 'ORD-2025-0888',
    status: 'SHIPPING',
    statusLabel: 'Đang giao hàng',
    statusColor: 'bg-[#ede9fe] text-[#6d28d9]',
    statusIcon: 'local_shipping',
    time: '29/08/2025',
    deliveryType: 'Giao tận nơi',
    paymentMethodText: 'PAID',
    paymentBadgeColor: 'bg-primary/10 text-primary',
    shippingProvider: 'Giao Hàng Tiết Kiệm (GHTK)',
    trackingCode: 'GHTK-882190',
    stepper: {
      progressPercent: '66%',
      step1: { title: '1. Đã xuất xưởng', sub: 'Xưởng lò Bát Tràng', active: true, done: true },
      step2: { title: '2. Đang luân chuyển', sub: 'Trạm Cầu Giấy', active: true, done: false },
      step3: { title: '3. Dự kiến giao hôm nay', sub: 'Trước 18h', active: false, done: false },
    },
    totalPrice: '450.000₫',
    totalPriceNumber: 450000,
    items: [
      {
        id: 'item-p3',
        title: 'Phễu Pha Cà Phê Gốm Mộc V60 Men Đá',
        spec: 'Cỡ 02 (Phù hợp 1-4 tách) • Gân rãnh xoắn ốc hướng dòng chảy',
        image: '/images/hero-cup.jpg',
        price: '450.000₫',
        quantity: 1,
      },
    ],
  },
  {
    id: 'ord-4',
    code: 'ORD-2025-0892',
    status: 'READY_FOR_PICKUP',
    statusLabel: 'Chờ nhận tại xưởng',
    statusColor: 'bg-[#fef3c7] text-[#b45309]',
    statusIcon: 'store',
    time: '27/08/2025',
    deliveryType: 'Phương thức: Nhận tại xưởng',
    paymentMethodText: 'COD • Thanh toán khi nhận gốm',
    paymentBadgeColor: 'bg-surface-container-high text-on-surface-variant',
    pickupAddress: {
      title: 'Lò Nung Củi Sa Thạch, Làng nghề truyền thống Bát Tràng',
      desc: 'Gia Lâm, Hà Nội • Giờ mở cửa: 08:00 - 18:00 hàng ngày',
      hotline: '0912 345 678',
    },
    totalPrice: '620.000₫',
    totalPriceNumber: 620000,
    items: [
      {
        id: 'item-p4',
        title: 'Bình Hoa Dáng Thon Men Tro Nâu',
        spec: 'Đường kính miệng 8cm • Men củi mộc đun lò rơm',
        image: '/images/cat-binh-hoa.jpg',
        price: '620.000₫',
        quantity: 1,
      },
    ],
  },
  {
    id: 'ord-5',
    code: 'ORD-2025-0879',
    status: 'COMPLETED',
    statusLabel: 'Giao thành công',
    statusColor: 'bg-[#dcfce7] text-[#15803d]',
    statusIcon: 'check_circle',
    time: 'Giao ngày 25/08/2025',
    paymentMethodText: 'Chuyển khoản VietQR',
    successNote: 'Đã nhận hàng thành công lúc 14:20, 25/08/2025',
    rewardText: '+50 điểm Mộc Viên khi đăng kèm ảnh feedback',
    totalPrice: '1.820.000₫',
    totalPriceNumber: 1820000,
    items: [
      {
        id: 'item-p5a',
        title: 'Bộ Ấm Trà Mộc Men Tro Củi',
        spec: 'Bộ gồm 1 ấm trà dung tích 380ml + 4 chén hạt cau nung củi mộc',
        image: '/images/product-1.jpg',
        price: '1.140.000₫',
        quantity: 1,
      },
      {
        id: 'item-p5b',
        title: 'Bình Hoa Gốm Men Chàm Lam Vũ',
        spec: 'Dáng chuông cổ điển • Men chàm tự nhiên bóng mờ',
        image: '/images/cat-tra-dao.jpg',
        price: '680.000₫',
        quantity: 1,
      },
    ],
  },
  {
    id: 'ord-6',
    code: 'ORD-2025-0865',
    status: 'CANCELLED',
    statusLabel: 'Đã hủy đơn',
    statusColor: 'bg-[#fee2e2] text-[#b91c1c]',
    statusIcon: 'cancel',
    time: '20/08/2025',
    paymentMethodText: 'COD (Thanh toán khi nhận hàng)',
    cancelReason: 'Khách hàng muốn đổi sang dáng bình tỳ bà khác.',
    footerNote: 'Sản phẩm đã được hoàn trả lại danh mục kho lò nung',
    totalPrice: '320.000₫',
    totalPriceNumber: 320000,
    items: [
      {
        id: 'item-p6',
        title: 'Đĩa Xông Trầm Men Khói Tam Hợp',
        spec: 'Đường kính 14cm • Men rạn khói củi mộc truyền thống',
        image: '/images/cat-bat-dia.jpg',
        price: '320.000₫',
        quantity: 1,
      },
    ],
  },
];

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS_DATA);
  const [activeStatus, setActiveStatus] = useState('all'); // all, pending, processing, shipping, ready_for_pickup, completed, cancelled
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [reviewModalData, setReviewModalData] = useState(null); // { title }
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewImages, setReviewImages] = useState([]);

  const [cancelModalOrder, setCancelModalOrder] = useState(null); // { code }
  const [cancelReason, setCancelReason] = useState('Tôi muốn thay đổi mẫu sản phẩm khác');

  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  // Đếm số lượng đơn cho từng trạng thái
  const counts = useMemo(() => {
    const res = {
      all: orders.length,
      pending: 0,
      processing: 0,
      shipping: 0,
      ready_for_pickup: 0,
      completed: 0,
      cancelled: 0,
    };
    orders.forEach((o) => {
      const key = o.status.toLowerCase();
      if (res[key] !== undefined) {
        res[key] += 1;
      }
    });
    return res;
  }, [orders]);

  // Lọc đơn hàng
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const statusMatch =
        activeStatus === 'all' || o.status.toLowerCase() === activeStatus.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const searchMatch =
        !query ||
        o.code.toLowerCase().includes(query) ||
        o.items.some((it) => it.title.toLowerCase().includes(query));
      return statusMatch && searchMatch;
    });
  }, [orders, activeStatus, searchQuery]);

  // Xử lý Hủy đơn
  const handleConfirmCancel = () => {
    if (!cancelModalOrder) return;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.code === cancelModalOrder.code) {
          return {
            ...o,
            status: 'CANCELLED',
            statusLabel: 'Đã hủy đơn',
            statusColor: 'bg-[#fee2e2] text-[#b91c1c]',
            statusIcon: 'cancel',
            cancelReason: cancelReason,
            footerNote: 'Sản phẩm đã được hoàn trả lại danh mục kho lò nung',
            canCancel: false,
            canPay: false,
          };
        }
        return o;
      })
    );
    toast.success(`Đã hủy đơn ${cancelModalOrder.code} thành công.`);
    setCancelModalOrder(null);
  };

  // Mua lại tác phẩm
  const handleReorder = (order) => {
    order.items.forEach((it) => {
      if (addToCart) {
        addToCart(it.id, it.quantity);
      }
    });
    toast.success(`Đã thêm lại các tác phẩm của đơn ${order.code} vào giỏ hàng!`);
    navigate(ROUTES.CART);
  };

  // Tải ảnh đánh giá từ máy
  const handleReviewImagesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (reviewImages.length + files.length > 5) {
      toast.warning('Tối đa 5 hình ảnh feedback.');
    }

    const slots = Math.max(0, 5 - reviewImages.length);
    files.slice(0, slots).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setReviewImages((prev) => [...prev, loadEvt.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Gửi đánh giá
  const handleSubmitReview = () => {
    if (reviewContent.trim().length < 10) {
      toast.warning('Vui lòng chia sẻ cảm nhận từ 10 ký tự trở lên.');
      return;
    }
    toast.success(
      'Đã gửi đánh giá thành công! Quý khách đã nhận được +50 điểm Mộc Viên vào tài khoản.'
    );
    setReviewModalData(null);
    setReviewContent('');
    setReviewImages([]);
    setReviewStars(5);
  };

  return (
    <div className="w-full bg-background font-body text-on-background min-h-screen pb-20">
      {/* Top Background Ambient Glow */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-gradient-to-b from-primary-fixed/40 via-surface-container/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-8 pb-16">
          
          {/* ========================================================= */}
          {/* PAGE HEADER WITH WARM EDITORIAL ACCENT */}
          {/* ========================================================= */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold tracking-widest text-primary uppercase font-label">
                <span className="inline-block w-6 h-[1.5px] bg-primary"></span>
                <span>Tủ Lưu Niệm &amp; Khách Thân Thiết</span>
              </div>
              <h1 className="font-headline text-4xl sm:text-5xl text-on-surface font-semibold tracking-tight">
                Đơn Hàng &amp; Đánh Giá Của Tôi
              </h1>
              <p className="text-sm sm:text-base text-on-surface-variant mt-2 font-body max-w-xl leading-relaxed">
                Theo dõi hành trình từng kiện gốm mộc nung củi và sẻ chia cảm nhận thưởng thức chất đất cùng nghệ nhân xưởng.
              </p>
            </div>

            {/* Search Bar with warm surface */}
            <div className="w-full md:w-80 relative">
              <label className="sr-only" htmlFor="order-search">
                Tìm mã đơn hàng
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">
                  search
                </span>
                <input
                  id="order-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo ORD-..."
                  className="w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest text-on-surface placeholder:text-outline text-sm rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-low transition-all font-body"
                />
                <span className="absolute right-3 text-[10px] text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded font-mono">
                  ⌘K
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STATUS FILTER TABS (PRISMA ORDER STATUS) */}
          {/* ========================================================= */}
          <div className="w-full overflow-x-auto pb-3 mb-8 scrollbar-none">
            <div className="inline-flex items-center gap-2 p-1.5 bg-surface-container-low rounded-xl">
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'pending', label: 'Chờ xác nhận' },
                { key: 'processing', label: 'Đang xử lý' },
                { key: 'shipping', label: 'Đang giao hàng' },
                { key: 'ready_for_pickup', label: 'Chờ nhận tại xưởng' },
                { key: 'completed', label: 'Hoàn thành' },
                { key: 'cancelled', label: 'Đã hủy' },
              ].map((tab) => {
                const isActive = activeStatus === tab.key;
                const count = counts[tab.key] || 0;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveStatus(tab.key)}
                    type="button"
                    className={`status-tab px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'font-semibold bg-surface-container-lowest text-primary shadow-sm'
                        : 'font-medium text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'bg-surface-variant text-on-surface-variant'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* ORDERS FEED */}
          {/* ========================================================= */}
          <div className="flex flex-col gap-8">
            {filteredOrders.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-12 text-center space-y-3 shadow-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-outline">
                  inventory_2
                </span>
                <h3 className="font-headline text-xl text-on-surface font-semibold">
                  Không tìm thấy đơn hàng nào
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Quý khách có thể chọn danh mục khác hoặc thưởng lãm thêm các tác phẩm mẻ lò mới.
                </p>
                <Link
                  to={ROUTES.COLLECTION}
                  className="inline-block mt-2 px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all"
                >
                  Khám Phá Bộ Sưu Tập
                </Link>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <article
                  key={order.id}
                  data-order-status={order.status}
                  className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 relative transition-all hover:shadow-md"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-5 bg-surface-container-low/40 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 px-6 sm:px-8 pt-6 sm:pt-7 rounded-t-2xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-bold text-on-surface tracking-wider bg-surface-container px-2.5 py-1 rounded">
                        {order.code}
                      </span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1 font-label">
                        <span className="material-symbols-outlined text-[15px]">schedule</span>{' '}
                        {order.time}
                      </span>
                      <span className="text-xs text-on-surface-variant/40">•</span>
                      <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-primary">
                          {order.status === 'READY_FOR_PICKUP' ? 'storefront' : 'local_shipping'}
                        </span>
                        {order.deliveryType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${order.statusColor}`}
                      >
                        {order.statusDotColor && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${order.statusDotColor} animate-pulse`}
                          />
                        )}
                        {order.statusIcon && (
                          <span className="material-symbols-outlined text-[14px]">
                            {order.statusIcon}
                          </span>
                        )}
                        {order.statusLabel}
                      </span>

                      {order.paymentMethodText && (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${order.paymentBadgeColor}`}
                        >
                          {order.paymentMethodText}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Processing / Workshop / Tracking / Cancel info banners */}
                  {order.workshopNote && (
                    <div className="bg-surface-container-low/70 rounded-xl p-4 flex items-center gap-3 text-xs text-on-surface">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      </div>
                      <p className="leading-relaxed">
                        <strong>Quy trình tuyển gốm:</strong> Nghệ nhân đang kiểm tra men và bọc đệm rơm 5 lớp để bảo vệ cốt gốm khi luân chuyển.
                      </p>
                    </div>
                  )}

                  {order.pickupAddress && (
                    <div className="bg-surface-container-low rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-on-surface-variant">
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                        </div>
                        <div>
                          <span className="font-semibold text-on-surface text-sm block">
                            {order.pickupAddress.title}
                          </span>
                          <span>{order.pickupAddress.desc}</span>
                          <div className="text-primary font-medium mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">call</span>
                            Hotline hỗ trợ: {order.pickupAddress.hotline}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => toast.info('Đang mở bản đồ chỉ đường đến xưởng Sa Thạch...')}
                          className="px-3.5 py-2 bg-surface-container-lowest text-on-surface hover:text-primary rounded-lg text-xs font-medium border border-outline-variant flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[15px]">map</span>
                          Xem chỉ đường lò nung
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.info('Kết nối hotline xưởng: 0912.345.678')}
                          className="px-3.5 py-2 bg-surface-container text-on-surface rounded-lg text-xs font-medium hover:bg-surface-container-high flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[15px]">support_agent</span>
                          Liên hệ xưởng
                        </button>
                      </div>
                    </div>
                  )}

                  {order.successNote && (
                    <div className="bg-[#f6f0e8] rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-[#15803d] font-medium">
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                      <span>{order.successNote}</span>
                    </div>
                  )}

                  {order.cancelReason && (
                    <div className="bg-surface-container-low/80 rounded-xl p-4 flex items-center gap-3 text-xs text-[#b91c1c]">
                      <span className="material-symbols-outlined text-[18px] shrink-0">info</span>
                      <span className="leading-relaxed">
                        Lý do hủy: {order.cancelReason}
                      </span>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="flex flex-col gap-5">
                    {order.items.map((item, itIdx) => (
                      <div
                        key={itIdx}
                        className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between py-1"
                      >
                        <div className="flex gap-4 items-center min-w-0">
                          {/* Khung ảnh vuông theo phong cách */}
                          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-container-high">
                            <img
                              alt={item.title}
                              src={item.image}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-1 min-w-0">
                            <h3 className="font-headline text-lg sm:text-xl text-on-surface font-semibold tracking-tight truncate">
                              {item.title}
                            </h3>
                            <p className="text-xs text-on-surface-variant font-body">{item.spec}</p>
                            <div className="flex items-center gap-2 text-xs text-on-surface mt-0.5">
                              <span className="font-semibold">{item.price}</span>
                              <span className="text-on-surface-variant/70">× {item.quantity}</span>
                            </div>
                          </div>
                        </div>

                        {order.items.length === 1 && (
                          <div className="text-right shrink-0 self-end sm:self-center">
                            <span className="text-xs text-on-surface-variant block">
                              {order.status === 'CANCELLED'
                                ? 'Giá trị đơn hủy'
                                : order.status === 'READY_FOR_PICKUP'
                                ? 'Tổng cần thanh toán'
                                : 'Tổng thanh toán'}
                            </span>
                            <span
                              className={`text-base font-semibold ${
                                order.status === 'CANCELLED'
                                  ? 'text-on-surface-variant/80'
                                  : 'text-primary'
                              }`}
                            >
                              {order.totalPrice}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Stepper Tracking Box (Cho đơn SHIPPING) */}
                  {order.stepper && (
                    <div className="bg-surface-container-low rounded-xl p-5 sm:p-6 flex flex-col gap-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-xs font-semibold text-on-surface">
                            Đơn vị vận chuyển: {order.shippingProvider}
                          </span>
                        </div>
                        <div className="text-xs text-on-surface-variant font-mono">
                          Mã vận đơn:{' '}
                          <span className="font-semibold text-primary">
                            {order.trackingCode}
                          </span>
                        </div>
                      </div>

                      <div className="relative pt-2 pb-1">
                        <div className="absolute top-5 left-4 right-4 h-1 bg-surface-container-highest rounded-full">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: order.stepper.progressPercent }}
                          />
                        </div>
                        <div className="relative flex justify-between">
                          <div className="flex flex-col items-center gap-2 text-center w-28">
                            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs shadow-sm z-10">
                              <span className="material-symbols-outlined text-[16px]">done</span>
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-on-surface block">
                                {order.stepper.step1.title}
                              </span>
                              <span className="text-[10px] text-on-surface-variant">
                                {order.stepper.step1.sub}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-2 text-center w-28">
                            <div className="w-8 h-8 rounded-full bg-primary text-on-primary ring-4 ring-primary-fixed flex items-center justify-center text-xs shadow-sm z-10 animate-bounce">
                              <span className="material-symbols-outlined text-[16px]">
                                local_shipping
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-primary block">
                                {order.stepper.step2.title}
                              </span>
                              <span className="text-[10px] text-on-surface-variant">
                                {order.stepper.step2.sub}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-2 text-center w-28">
                            <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-xs z-10">
                              <span className="material-symbols-outlined text-[16px]">home</span>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-on-surface-variant block">
                                {order.stepper.step3.title}
                              </span>
                              <span className="text-[10px] text-on-surface-variant/80">
                                {order.stepper.step3.sub}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => toast.info(`Tra cứu vận đơn ${order.trackingCode} trên hệ thống GHTK...`)}
                          className="px-4 py-2 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 border border-outline-variant cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            navigation
                          </span>
                          Theo dõi đơn
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOrders((prev) =>
                              prev.map((o) =>
                                o.id === order.id
                                  ? {
                                      ...o,
                                      status: 'COMPLETED',
                                      statusLabel: 'Giao thành công',
                                      statusColor: 'bg-[#dcfce7] text-[#15803d]',
                                      statusIcon: 'check_circle',
                                      stepper: null,
                                      successNote: 'Đã nhận hàng thành công lúc vừa xong',
                                    }
                                  : o
                              )
                            );
                            toast.success(`Cảm ơn Quý khách! Đơn hàng ${order.code} đã hoàn tất.`);
                          }}
                          className="px-5 py-2 bg-primary hover:bg-primary/90 text-on-primary text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">task_alt</span>
                          Đã nhận được hàng
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Card Bottom / Action Row */}
                  {order.status === 'PENDING' && (
                    <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-surface-container-high/60">
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-low px-3.5 py-2 rounded-lg">
                        <span className="material-symbols-outlined text-primary text-[17px] shrink-0">
                          info
                        </span>
                        <span>{order.noticeText}</span>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => setCancelModalOrder(order)}
                          className="px-4 py-2 rounded-lg text-xs font-medium text-error hover:bg-error-container/40 active:scale-95 transition-all flex items-center gap-1.5 bg-surface-container-low cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          Hủy đơn
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.info('Đang chuyển hướng sang cổng thanh toán QR PayOS...')}
                          className="px-5 py-2 rounded-lg text-xs font-semibold text-on-primary bg-primary hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                          Thanh toán ngay
                        </button>
                      </div>
                    </div>
                  )}

                  {order.status === 'PROCESSING' && (
                    <div className="pt-4 flex items-center justify-between border-t border-surface-container-high/60">
                      <span className="text-xs text-on-surface-variant">{order.footerNote}</span>
                      <button
                        type="button"
                        onClick={() => toast.info('Kết nối trực tuyến với nghệ nhân xưởng nung...')}
                        className="px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        Liên hệ hỗ trợ
                      </button>
                    </div>
                  )}

                  {order.status === 'COMPLETED' && (
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-container-high/60">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-primary font-medium">+50 điểm Mộc Viên</span>
                        <span className="text-xs text-on-surface-variant">khi đăng kèm ảnh feedback</span>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="px-4 py-2 border border-outline-variant hover:bg-surface-container text-on-surface text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">replay</span>
                          Mua lại tác phẩm
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setReviewModalData({
                              title: order.items.map((i) => i.title).join(' & '),
                            })
                          }
                          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-on-primary text-xs font-semibold rounded-lg shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">rate_review</span>
                          Viết đánh giá kèm ảnh
                        </button>
                      </div>
                    </div>
                  )}

                  {order.status === 'CANCELLED' && (
                    <div className="pt-4 flex items-center justify-between border-t border-surface-container-high/60">
                      <span className="text-xs text-on-surface-variant">{order.footerNote}</span>
                      <button
                        type="button"
                        onClick={() => handleReorder(order)}
                        className="px-4 py-2 border border-outline-variant hover:bg-surface-container text-on-surface text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          refresh
                        </span>
                        Đặt lại đơn hàng
                      </button>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* WRITE REVIEW MODAL (SAHARA WARM STYLE) */}
      {/* ========================================================= */}
      {reviewModalData && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setReviewModalData(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-xl flex flex-col gap-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold tracking-wider text-primary uppercase font-label">
                  Chia sẻ cảm nhận
                </span>
                <h3 className="font-headline text-2xl font-semibold text-on-surface mt-1 truncate max-w-xs sm:max-w-md">
                  {reviewModalData.title || 'Đánh Giá Sản Phẩm'}
                </h3>
              </div>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
                onClick={() => setReviewModalData(null)}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Rating Stars Selection */}
            <div className="flex flex-col items-center justify-center py-2 bg-surface-container-low/50 rounded-xl gap-2">
              <span className="text-xs text-on-surface-variant font-medium">
                Chất lượng tác phẩm gốm mộc:
              </span>
              <div className="flex items-center gap-1 text-surface-container-highest cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setReviewStars(star)}
                    className={`material-symbols-outlined text-[32px] cursor-pointer transition-colors ${
                      reviewStars >= star ? 'text-primary' : 'text-outline-variant'
                    }`}
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-xs font-semibold text-primary">
                {reviewStars}/5 -{' '}
                {reviewStars === 5
                  ? 'Rất ưng ý và tinh tế'
                  : reviewStars === 4
                  ? 'Hài lòng về chất men'
                  : `${reviewStars} sao`}
              </span>
            </div>

            {/* Textarea */}
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-semibold text-on-surface"
                htmlFor="modal-review-content"
              >
                Cảm nhận chi tiết (Chất men, độ đầm tay, âm gõ, vân nứt hỏa biến...)
              </label>
              <textarea
                id="modal-review-content"
                rows={4}
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Hãy kể về trải nghiệm khi thưởng gốm trong không gian của bạn..."
                className="w-full p-3.5 bg-surface-container-low text-on-surface placeholder:text-outline text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-primary transition-all font-body resize-none"
              />
              <span className="text-[11px] text-on-surface-variant/70 text-right">
                Tối thiểu 30 ký tự để nhận +50 điểm
              </span>
            </div>

            {/* Photo Upload Box */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-on-surface">Thêm ảnh thực tế</span>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="file"
                  id="modal-photo-upload"
                  multiple
                  accept="image/*"
                  onChange={handleReviewImagesUpload}
                  className="hidden"
                />
                <label
                  htmlFor="modal-photo-upload"
                  className="w-16 h-16 rounded-xl bg-surface-container-low hover:bg-surface-container flex flex-col items-center justify-center text-on-surface-variant gap-1 transition-all cursor-pointer border border-dashed border-outline-variant"
                >
                  <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                  <span className="text-[9px]">Tải ảnh</span>
                </label>

                {/* Previews */}
                {reviewImages.map((src, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-outline-variant">
                    <img src={src} alt="Feedback" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setReviewImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <div className="text-[11px] text-on-surface-variant leading-relaxed max-w-xs">
                  Khuyến khích góc chụp tự nhiên với ánh sáng ngày để cộng đồng thưởng lãm rõ nhất chất gốm.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer"
                onClick={() => setReviewModalData(null)}
              >
                Để sau
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                className="px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Gửi Đánh Giá &amp; Nhận Điểm</span>
                <span className="material-symbols-outlined text-[15px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CANCEL ORDER MODAL */}
      {/* ========================================================= */}
      {cancelModalOrder && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setCancelModalOrder(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-xl flex flex-col gap-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </div>
            <div>
              <h3 className="font-headline text-xl font-bold text-on-surface">
                Xác Nhận Hủy Đơn Hàng?
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Đơn hàng{' '}
                <span className="font-mono font-bold text-on-surface">
                  {cancelModalOrder.code}
                </span>{' '}
                sẽ bị hủy ngay lập tức trên hệ thống xưởng nung.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-semibold text-on-surface"
                htmlFor="modal-cancel-reason"
              >
                Lý do hủy đơn
              </label>
              <select
                id="modal-cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low text-xs rounded-lg text-on-surface focus:outline-none"
              >
                <option value="Tôi muốn thay đổi mẫu sản phẩm khác">
                  Tôi muốn thay đổi mẫu sản phẩm khác
                </option>
                <option value="Tôi muốn cập nhật lại địa chỉ nhận hàng">
                  Tôi muốn cập nhật lại địa chỉ nhận hàng
                </option>
                <option value="Đặt trùng lặp đơn hàng">Đặt trùng lặp đơn hàng</option>
                <option value="Thay đổi kế hoạch tài chính cá nhân">
                  Thay đổi kế hoạch tài chính cá nhân
                </option>
                <option value="Lý do khác">Lý do khác</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 text-xs font-medium text-on-surface-variant cursor-pointer"
                onClick={() => setCancelModalOrder(null)}
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Xác nhận Hủy Đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;

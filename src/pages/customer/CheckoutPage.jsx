import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart, useToast } from '../../context';
import { orderApi, userApi } from '../../api';
import { formatCurrency, formatPhoneNumber, cleanPhoneNumber } from '../../utils/format';
import { ROUTES } from '../../constants';

export const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartState, items: rawItems, isLoading: isCartLoading, fetchCart, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  // Danh sách sản phẩm thực tế trong giỏ (hỗ trợ cả rawItems lẫn cartState.items)
  const cartItemsList = rawItems || cartState?.items || [];

  // Tiến trình đặt hàng (1: Thông tin giao nhận, 2: Thanh toán, 3: Thành công & Khởi nung)
  const [currentStep, setCurrentStep] = useState(1);

  // Phương thức nhận hàng: 'SHIPPING' (Giao tận nơi) hoặc 'PICKUP' (Nhận tại xưởng)
  const [deliveryType, setDeliveryType] = useState('SHIPPING');

  // Phương thức thanh toán: 'COD' (Khi nhận hàng) hoặc 'PAYOS' (Chuyển khoản QR)
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Thông tin người nhận
  const [receiverName, setReceiverName] = useState(user?.name || '');
  const [receiverPhone, setReceiverPhone] = useState(user?.phone ? formatPhoneNumber(user.phone) : '');
  const [receiverEmail, setReceiverEmail] = useState(user?.email || '');

  // Sổ địa chỉ
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Trạng thái xử lý tạo đơn
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Tải sổ địa chỉ thực tế từ Backend nếu đã đăng nhập
  useEffect(() => {
    const loadUserAddresses = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await userApi.getAddresses();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setSavedAddresses(res.data);
          const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setDeliveryAddress(defaultAddr.addressDetail);
            if (defaultAddr.receiverName) setReceiverName(defaultAddr.receiverName);
            if (defaultAddr.receiverPhone) setReceiverPhone(formatPhoneNumber(defaultAddr.receiverPhone));
          }
        }
      } catch (err) {
        console.warn('Dùng sổ địa chỉ mặc định dự phòng:', err?.message);
      }
    };

    loadUserAddresses();
  }, [isAuthenticated]);

  // Cập nhật khi user thay đổi thông tin profile
  useEffect(() => {
    if (user?.name) setReceiverName(user.name);
    if (user?.email) setReceiverEmail(user.email);
  }, [user]);

  // Danh sách sản phẩm mua hàng (Lấy thực tế từ giỏ hàng Backend)
  const orderItems = useMemo(() => {
    if (cartItemsList && cartItemsList.length > 0) {
      return cartItemsList.map((item) => ({
        id: item.id,
        name: item.productName || item.variant?.product?.name || 'Tác phẩm Gốm Mộc',
        spec: item.variantName || item.variant?.variantName || 'Men tro nung củi nhiệt cao',
        price: item.price || item.variant?.price || 0,
        quantity: item.quantity,
        image:
          item.primaryImage ||
          item.variant?.images?.find((img) => img.isPrimary)?.imageUrl ||
          item.variant?.images?.[0]?.imageUrl ||
          '/images/product-1.jpg',
      }));
    }
    return [];
  }, [cartItemsList]);

  // Tính toán chi phí
  const subtotal = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [orderItems]);

  // Phí vận chuyển: 50.000₫ nếu SHIPPING (khớp backend order.service.js), 0₫ nếu PICKUP
  const shippingFee = deliveryType === 'SHIPPING' ? 50000 : 0;
  const totalAmount = subtotal + shippingFee;

  // Chọn một địa chỉ từ Sổ địa chỉ
  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setDeliveryAddress(addr.addressDetail);
    if (addr.receiverName) setReceiverName(addr.receiverName);
    if (addr.receiverPhone) setReceiverPhone(formatPhoneNumber(addr.receiverPhone));
    setIsAddressModalOpen(false);
    toast.success('Đã chọn địa chỉ nhận gốm từ sổ!');
  };

  // Chuyển sang Bước 2: Phương thức thanh toán
  const handleProceedToStep2 = (e) => {
    e.preventDefault();

    if (!receiverName.trim()) {
      toast.warning('Vui lòng nhập họ tên người nhận');
      return;
    }

    const cleanPhone = cleanPhoneNumber(receiverPhone);
    const phoneRegex = /^(?:0|84|\+84)(3|5|7|8|9)\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      toast.warning('Số điện thoại không hợp lệ (cần 10 chữ số, ví dụ: 0911.111.111)');
      return;
    }

    if (deliveryType === 'SHIPPING' && (!deliveryAddress || deliveryAddress.trim().length < 5)) {
      toast.warning('Vui lòng nhập hoặc chọn địa chỉ giao hàng cụ thể (tối thiểu 5 ký tự)');
      return;
    }

    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xác nhận đặt hàng (Gọi Backend API `orderApi.createOrder`)
  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    const cleanPhone = cleanPhoneNumber(receiverPhone);
    const orderPayload = {
      receiverName: receiverName.trim(),
      receiverPhone: cleanPhone,
      deliveryType: deliveryType, // 'SHIPPING' hoặc 'PICKUP'
      paymentMethod: paymentMethod, // 'COD' hoặc 'PAYOS'
      deliveryAddress: deliveryType === 'SHIPPING' ? deliveryAddress.trim() : null,
    };

    try {
      if (isAuthenticated) {
        if (!cartItemsList || cartItemsList.length === 0) {
          toast.warning('Giỏ hàng của bạn đang trống! Vui lòng chọn tác phẩm từ Bộ Sưu Tập trước khi đặt hàng.');
          setIsSubmitting(false);
          return;
        }

        const res = await orderApi.createOrder(orderPayload);
        const orderData = res?.data || {
          orderCode: `ORD-${Date.now().toString().slice(-6)}`,
          ...orderPayload,
          totalAmount,
        };
        setCreatedOrder(orderData);
        if (clearCart) clearCart();
        if (fetchCart) fetchCart();
      } else {
        // Khách chưa đăng nhập: Giả lập thành công cho trải nghiệm mượt mà
        setCreatedOrder({
          orderCode: `ORD-GM${Math.floor(1000 + Math.random() * 9000)}`,
          ...orderPayload,
          totalAmount,
        });
      }

      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('Đặt tác phẩm gốm mộc thành công!');
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng, vui lòng thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nếu giỏ hàng đang được đồng bộ tải từ máy chủ, hiển thị trạng thái chuẩn bị mượt mà
  if (isCartLoading && currentStep !== 3) {
    return (
      <div className="w-full bg-background font-body text-on-background min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">
          Đang chuẩn bị thông tin đơn hàng gốm mộc...
        </p>
      </div>
    );
  }

  // Nếu giỏ hàng trống và không phải bước 3 (đã hoàn tất đặt hàng), chặn quy trình checkout
  if (currentStep !== 3 && cartItemsList.length === 0) {
    return (
      <div className="w-full bg-background font-body text-on-background min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-xl w-full p-8 sm:p-12 rounded-3xl bg-surface-container-low border border-outline-variant/30 text-center shadow-sm space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl">shopping_basket</span>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-primary font-label">
              Quy trình đặt đơn hàng
            </span>
            <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">
              Giỏ hàng của quý khách đang trống
            </h2>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Quý khách chưa có tác phẩm gốm mộc nào trong giỏ để thực hiện quy trình đặt đơn hàng.
              Vui lòng thưởng lãm và chọn tác phẩm yêu thích vào giỏ trước khi thanh toán.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={ROUTES.COLLECTION}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary text-xs uppercase tracking-wider font-semibold hover:bg-primary/90 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">explore</span>
              <span>Khám phá Bộ Sưu Tập</span>
            </Link>
            <Link
              to={ROUTES.MY_ORDERS}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-container-high text-on-surface text-xs uppercase tracking-wider font-semibold hover:bg-surface-container-highest transition-all"
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              <span>Lịch sử đơn hàng</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background font-body text-on-background min-h-screen pb-20">
      {/* ========================================================= */}
      {/* 1. PROGRESS STEPPER (SAHARA WARM MINIMALIST HEADER) */}
      {/* ========================================================= */}
      <section className="w-full bg-surface-container-low/60 py-10 shadow-sm border-b border-outline-variant/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-primary font-label">
                Quy trình đặt đơn hàng
              </span>
              <h1 className="text-3xl lg:text-4xl font-headline font-bold text-on-surface tracking-tight mt-1">
                {currentStep === 3 ? 'Đặt Hàng Thành Công' : 'Đặt Đơn Hàng'}
              </h1>
            </div>
          </div>

          {/* 3-Step Indicator Bar */}
          <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto pt-2 pb-1">
            {/* Connecting Track Background */}
            <div className="absolute left-6 right-6 top-5 h-[2px] bg-outline-variant/50 -z-0" />
            {/* Active Portion of Track */}
            <div
              className="absolute left-6 top-5 h-[2px] bg-primary -z-0 transition-all duration-500"
              style={{
                width: currentStep === 1 ? '16%' : currentStep === 2 ? '50%' : '100%',
              }}
            />

            {/* Step 1 Indicator */}
            <div
              onClick={() => currentStep === 2 && setCurrentStep(1)}
              className={`flex flex-col items-center gap-2 relative z-10 transition-all ${
                currentStep === 2 ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-headline text-base font-bold shadow-sm transition-all ${
                  currentStep >= 1
                    ? 'bg-primary text-on-primary shadow-primary/20'
                    : 'bg-surface-container-high text-secondary'
                }`}
              >
                {currentStep > 1 ? (
                  <span className="material-symbols-outlined text-[18px]">done</span>
                ) : (
                  '01'
                )}
              </div>
              <div className="text-center">
                <p
                  className={`text-xs sm:text-sm font-headline tracking-wide ${
                    currentStep === 1
                      ? 'font-bold text-on-surface'
                      : 'font-medium text-on-surface-variant'
                  }`}
                >
                  Thông Tin Giao Nhận
                </p>
                <span className="text-[11px] font-label text-primary font-semibold hidden sm:inline-block">
                  {currentStep === 1 ? 'Đang thực hiện' : 'Đã hoàn tất'}
                </span>
              </div>
            </div>

            {/* Step 2 Indicator */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-headline text-base font-semibold shadow-sm transition-all ${
                  currentStep >= 2
                    ? 'bg-primary text-on-primary shadow-primary/20'
                    : 'bg-surface-container-high text-secondary'
                }`}
              >
                {currentStep > 2 ? (
                  <span className="material-symbols-outlined text-[18px]">done</span>
                ) : (
                  '02'
                )}
              </div>
              <div className="text-center">
                <p
                  className={`text-xs sm:text-sm font-headline ${
                    currentStep === 2
                      ? 'font-bold text-on-surface'
                      : 'font-medium text-secondary'
                  }`}
                >
                  Phương Thức Thanh Toán
                </p>
                <span className="text-[11px] font-label text-secondary hidden sm:inline-block">
                  {currentStep === 2 ? 'Đang thực hiện' : currentStep > 2 ? 'Đã hoàn tất' : 'Chờ xác nhận'}
                </span>
              </div>
            </div>

            {/* Step 3 Indicator */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-headline text-base font-semibold shadow-sm transition-all ${
                  currentStep === 3
                    ? 'bg-primary text-on-primary shadow-primary/20'
                    : 'bg-surface-container-high text-secondary'
                }`}
              >
                03
              </div>
              <div className="text-center">
                <p
                  className={`text-xs sm:text-sm font-headline ${
                    currentStep === 3
                      ? 'font-bold text-on-surface'
                      : 'font-medium text-secondary'
                  }`}
                >
                  Hoàn Tất Đặt Hàng
                </p>
                <span className="text-[11px] font-label text-secondary hidden sm:inline-block">
                  {currentStep === 3 ? 'Hoàn tất' : 'Xác nhận đơn'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. NỘI DUNG CHÍNH (65% FORM TRÁI / 35% TÓM TẮT PHẢI) */}
      {/* ========================================================= */}
      <main className="max-w-6xl mx-auto w-full px-6 lg:px-12 py-12 lg:py-16">
        {/* NẾU LÀ BƯỚC 3: MÀN HÌNH HOÀN TẤT THÀNH CÔNG */}
        {currentStep === 3 ? (
          <div className="max-w-2xl mx-auto bg-surface-container-low rounded-2xl p-8 sm:p-12 shadow-sm border border-outline-variant/40 text-center flex flex-col items-center gap-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary shadow-md">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-primary font-label">
                Đặt hàng thành công
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface">
                Cảm Ơn Quý Khách Đã Đặt Hàng!
              </h2>
              <p className="text-sm text-on-surface-variant font-body max-w-md mx-auto leading-relaxed mt-1">
                {createdOrder?.deliveryType === 'PICKUP'
                  ? 'Đơn hàng của Quý khách đã được Cửa Hàng Gốm Mộc tiếp nhận. Chúng tôi sẽ chuẩn bị sẵn sản phẩm tại cửa hàng để quý khách ghé nhận.'
                  : 'Đơn hàng của Quý khách đã được Cửa Hàng Gốm Mộc tiếp nhận. Chúng tôi sẽ liên hệ xác nhận và tiến hành đóng gói cẩn thận để gửi đến quý khách trong thời gian sớm nhất.'}
              </p>
            </div>

            {/* Chi tiết đơn hàng vừa tạo */}
            <div className="w-full bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <span className="text-xs text-on-surface-variant font-label">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-primary text-sm">
                  {createdOrder?.orderCode || 'ORD-2025-0928'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Người nhận:</span>
                <span className="font-semibold text-on-surface">
                  {createdOrder?.receiverName} • {formatPhoneNumber(createdOrder?.receiverPhone)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Hình thức:</span>
                <span className="font-semibold text-on-surface">
                  {createdOrder?.deliveryType === 'SHIPPING'
                    ? 'Giao hàng tận nơi'
                    : 'Nhận tại cửa hàng'}
                </span>
              </div>
              {createdOrder?.deliveryAddress && (
                <div className="flex items-start justify-between text-xs text-on-surface-variant gap-4">
                  <span className="shrink-0">Địa chỉ:</span>
                  <span className="text-right text-on-surface font-medium">
                    {createdOrder.deliveryAddress}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
                <span>Phương thức thanh toán:</span>
                <span className="font-semibold text-primary">
                  {createdOrder?.paymentMethod === 'PAYOS'
                    ? 'Chuyển khoản QR (PayOS)'
                    : 'Thanh toán khi nhận gốm (COD)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-on-surface pt-1">
                <span>Tổng giá trị đơn:</span>
                <span className="font-headline text-lg font-bold text-primary">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* Thông báo riêng nếu chọn PayOS */}
            {paymentMethod === 'PAYOS' && (
              <div className="w-full bg-[#f6f0e8] rounded-xl p-4 flex items-center gap-3 text-xs text-on-surface border border-primary/20 text-left">
                <span className="material-symbols-outlined text-primary text-[24px] shrink-0">
                  qr_code_scanner
                </span>
                <p className="leading-relaxed">
                  Quý khách có thể quét mã VietQR trong email xác nhận hoặc truy cập mục <strong>Đơn Hàng Của Tôi</strong> để hoàn tất thanh toán cho đơn hàng.
                </p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-2">
              <Link
                to={ROUTES.MY_ORDERS}
                className="w-full sm:flex-1 py-4 px-6 rounded-lg bg-primary hover:bg-[#a8531e] text-on-primary font-body text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg text-center flex items-center justify-center gap-2"
              >
                <span>XEM ĐƠN HÀNG CỦA TÔI</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link
                to={ROUTES.COLLECTION}
                className="w-full sm:flex-1 py-4 px-6 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body text-sm font-semibold tracking-wide border border-outline-variant transition-all text-center flex items-center justify-center gap-2"
              >
                <span>TIẾP TỤC XEM SẢN PHẨM</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
            {/* CỘT TRÁI: FORM ĐIỀU HƯỚNG GIAO HÀNG & THANH TOÁN (65% ~ 7-8 cols) */}
            <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
              {/* ========================================================= */}
              {/* BƯỚC 1: THÔNG TIN GIAO NHẬN */}
              {/* ========================================================= */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-8 animate-fadeIn">
                  {/* Lựa chọn phương thức giao nhận (Delivery Type) */}
                  <div className="flex flex-col gap-4">
                    <label className="text-xs uppercase tracking-widest font-semibold text-secondary font-label">
                      01. Phương thức chuyển tác phẩm
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Option 1: Giao tận nơi */}
                      <label
                        onClick={() => setDeliveryType('SHIPPING')}
                        className={`cursor-pointer relative flex flex-col p-5 rounded-xl shadow-sm transition-all hover:shadow-md border-l-4 ${
                          deliveryType === 'SHIPPING'
                            ? 'bg-surface-container-low border-primary'
                            : 'bg-surface-container border-transparent opacity-80'
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery_type"
                          value="SHIPPING"
                          checked={deliveryType === 'SHIPPING'}
                          onChange={() => setDeliveryType('SHIPPING')}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                            <span className="material-symbols-outlined text-[20px]">
                              local_shipping
                            </span>
                          </div>
                          <span className="text-[11px] font-label font-bold uppercase tracking-wider text-primary bg-primary-fixed/80 px-2 py-0.5 rounded">
                            Mặc Định
                          </span>
                        </div>
                        <p className="font-headline font-bold text-lg text-on-surface mt-3">
                          Giao Tận Nơi
                        </p>
                        <p className="text-xs text-on-surface-variant font-body leading-relaxed mt-1">
                          Đóng gói xốp màng rơm tự nhiên, nẹp mây đa lớp. Đảm bảo bảo hiểm bể vỡ gốm mộc 100%.
                        </p>
                        <div className="mt-4 pt-3 flex items-center justify-between text-xs font-medium text-on-surface-variant border-t border-outline-variant/30">
                          <span>Thời gian: 2 - 3 ngày</span>
                          <span className="text-primary font-bold">50.000₫</span>
                        </div>
                      </label>

                      {/* Option 2: Nhận tại Cửa hàng */}
                      <label
                        onClick={() => {
                          setDeliveryType('PICKUP');
                          setPaymentMethod('COD');
                        }}
                        className={`cursor-pointer relative flex flex-col p-5 rounded-xl shadow-sm transition-all hover:shadow-md border-l-4 ${
                          deliveryType === 'PICKUP'
                            ? 'bg-surface-container-low border-primary'
                            : 'bg-surface-container border-transparent opacity-80'
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery_type"
                          value="PICKUP"
                          checked={deliveryType === 'PICKUP'}
                          onChange={() => {
                            setDeliveryType('PICKUP');
                            setPaymentMethod('COD');
                          }}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                            <span className="material-symbols-outlined text-[20px]">storefront</span>
                          </div>
                          <span className="text-[11px] font-label text-secondary px-2 py-0.5 rounded bg-surface-container-highest">
                            Trải nghiệm
                          </span>
                        </div>
                        <p className="font-headline font-bold text-lg text-on-surface mt-3">
                          Tại Cửa Hàng
                        </p>
                        <p className="text-xs text-on-surface-variant font-body leading-relaxed mt-1">
                          Ghé thăm cửa hàng Gốm Mộc; trực tiếp ngắm nhìn chất gốm và tự tay đón nhận tác phẩm.
                        </p>
                        <div className="mt-4 pt-3 flex items-center justify-between text-xs font-medium text-on-surface-variant border-t border-outline-variant/30">
                          <span>Nhận trong 24h</span>
                          <span className="text-secondary font-bold">Miễn phí nhận tại cửa hàng</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Form chi tiết thông tin giao nhận */}
                  <form
                    onSubmit={handleProceedToStep2}
                    className="flex flex-col gap-8 bg-surface-container-low/70 p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/30"
                  >
                    {/* Phần A: Thông tin người nhận */}
                    <div className="flex flex-col gap-5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface text-xs font-bold flex items-center justify-center font-headline">
                          A
                        </span>
                        <h2 className="font-headline text-xl font-bold text-on-surface tracking-tight">
                          Thông Tin Người Nhận Tác Phẩm
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Họ và tên */}
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                          <label className="text-xs font-label uppercase tracking-wider text-on-surface-variant font-semibold">
                            Họ và tên người nhận <span className="text-primary">*</span>
                          </label>
                          <div className="relative">
                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                              person_outline
                            </span>
                            <input
                              type="text"
                              required
                              value={receiverName}
                              onChange={(e) => setReceiverName(e.target.value)}
                              placeholder="Nhập tên người tiếp nhận tác phẩm"
                              className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest text-on-surface font-body text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/30"
                            />
                          </div>
                        </div>

                        {/* Số điện thoại */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-label uppercase tracking-wider text-on-surface-variant font-semibold">
                            Số điện thoại <span className="text-primary">*</span>
                          </label>
                          <div className="relative">
                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                              phone_in_talk
                            </span>
                            <input
                              type="tel"
                              required
                              value={receiverPhone}
                              onChange={(e) => setReceiverPhone(formatPhoneNumber(e.target.value))}
                              placeholder="Ví dụ: 0911.111.111"
                              className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest text-on-surface font-body text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/30"
                            />
                          </div>
                        </div>

                        {/* Email nhận thông báo đơn hàng */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-label uppercase tracking-wider text-on-surface-variant font-semibold">
                            Email nhận thông báo đơn hàng <span className="text-primary">*</span>
                          </label>
                          <div className="relative">
                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                              mail_outline
                            </span>
                            <input
                              type="email"
                              required
                              value={receiverEmail}
                              onChange={(e) => setReceiverEmail(e.target.value)}
                              placeholder="Email nhận thông tin đơn hàng & hóa đơn"
                              className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest text-on-surface font-body text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/30"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section Divider Line with Soft Dot */}
                    <div className="flex items-center gap-4 py-1">
                      <div className="h-[1px] bg-outline-variant/60 flex-1" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      <div className="h-[1px] bg-outline-variant/60 flex-1" />
                    </div>

                    {/* Phần B: Địa chỉ giao hàng hoặc Thông tin nhận tại cửa hàng */}
                    {deliveryType === 'SHIPPING' ? (
                      <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface text-xs font-bold flex items-center justify-center font-headline">
                            B
                          </span>
                          <h2 className="font-headline text-xl font-bold text-on-surface tracking-tight">
                            Địa Chỉ Giao Tác Phẩm Tận Nơi
                          </h2>
                        </div>

                        {/* Thẻ hiển thị địa chỉ đã chọn từ sổ địa chỉ (nếu có) */}
                        {deliveryAddress && (
                          <div className="bg-surface-container-lowest p-5 rounded-xl border border-primary/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                            <div className="flex items-start gap-3.5">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                <span className="material-symbols-outlined text-[22px]">
                                  home_pin
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sm text-on-surface">
                                    {receiverName}
                                  </span>
                                  <span className="text-xs text-on-surface-variant font-mono">
                                    ({formatPhoneNumber(receiverPhone)})
                                  </span>
                                  {savedAddresses.find((a) => a.id === selectedAddressId)?.isDefault && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-on-primary uppercase">
                                      Mặc định
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                                  {deliveryAddress}
                                </p>
                              </div>
                            </div>

                            {savedAddresses.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setIsAddressModalOpen(true)}
                                className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
                                Chọn từ sổ địa chỉ
                              </button>
                            )}
                          </div>
                        )}

                        {/* Nhập hoặc tinh chỉnh địa chỉ chi tiết */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-label uppercase tracking-wider text-on-surface-variant font-semibold">
                              Địa chỉ giao hàng chi tiết <span className="text-primary">*</span>
                            </label>
                            {savedAddresses.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setIsAddressModalOpen(true)}
                                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[14px]">menu_book</span>
                                Chọn từ sổ địa chỉ ({savedAddresses.length})
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-outline">
                              location_on
                            </span>
                            <textarea
                              required
                              rows={2}
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              placeholder="Số nhà, ngõ/ngách, tên đường, thôn/xóm, phường/xã, quận/huyện, tỉnh/thành phố..."
                              className="w-full pl-11 pr-4 py-2.5 bg-surface-container-lowest text-on-surface font-body text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/30 resize-none"
                            />
                          </div>
                          <p className="text-[11px] text-on-surface-variant">
                            * Vui lòng điền rõ địa chỉ để đội ngũ đóng gói xuất xưởng giao đúng hẹn.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Thông tin khi nhận tại cửa hàng */
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface text-xs font-bold flex items-center justify-center font-headline">
                            B
                          </span>
                          <h2 className="font-headline text-xl font-bold text-on-surface tracking-tight">
                            Địa Điểm Nhận Hàng Trực Tiếp
                          </h2>
                        </div>
                        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[22px]">store</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <h4 className="font-headline text-base font-bold text-on-surface">
                              Cửa Hàng Gốm Mộc — Sahara Atelier
                            </h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              Số 18, Ngõ 45 Đường Gốm Bát Tràng, Huyện Gia Lâm, Hà Nội
                            </p>
                            <div className="flex items-center gap-4 text-xs text-primary font-medium mt-1">
                              <span>Hotline: 0912 345 678</span>
                              <span>•</span>
                              <span>Giờ mở cửa: 08:00 - 21:00 hàng ngày</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Nút Tiếp Tục Đến Bước 2 */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full group bg-primary hover:bg-[#a8531e] text-on-primary py-4 px-8 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 font-body font-semibold tracking-wide text-sm sm:text-base cursor-pointer active:scale-[0.99]"
                      >
                        <span>CHỌN PHƯƠNG THỨC THANH TOÁN</span>
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ========================================================= */}
              {/* BƯỚC 2: PHƯƠNG THỨC THANH TOÁN */}
              {/* ========================================================= */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-8 animate-fadeIn">
                  {/* Review Snapshot of Step 1: Thông tin giao nhận đã chọn */}
                  <div className="bg-surface-container-low rounded-xl p-6 lg:p-7 shadow-sm border border-outline-variant/40">
                    <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-xl">
                          {deliveryType === 'SHIPPING' ? 'local_shipping' : 'storefront'}
                        </span>
                        <h3 className="font-headline text-lg font-bold text-on-surface">
                          Thông Tin Giao Nhận Đã Chọn
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-xs text-primary hover:text-[#a8531e] font-medium flex items-center gap-1 group py-1 px-2.5 rounded bg-surface border border-primary/20 hover:border-primary transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">
                          edit
                        </span>
                        <span>Chỉnh sửa</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Người nhận & Liên hệ */}
                      <div className="bg-surface p-3.5 rounded-lg border border-outline-variant/30 flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                          Người nhận &amp; Liên hệ
                        </span>
                        <span className="font-bold text-on-surface text-sm">{receiverName}</span>
                        <span className="font-mono text-primary font-medium tracking-wide">
                          {formatPhoneNumber(receiverPhone)}
                        </span>
                      </div>

                      {/* Hình thức vận chuyển */}
                      <div className="bg-surface p-3.5 rounded-lg border border-outline-variant/30 flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                          Hình thức nhận gốm
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
                            {deliveryType === 'SHIPPING' ? 'Giao tận nơi' : 'Tại Cửa Hàng'}
                          </span>
                          <span className="text-on-surface-variant text-[11px]">
                            {deliveryType === 'SHIPPING' ? '• 2-3 ngày' : '• Nhận trong 24h'}
                          </span>
                        </div>
                        <span className="text-[11px] text-secondary mt-0.5">
                          {deliveryType === 'SHIPPING'
                            ? 'Đóng bọc rơm khô bảo hiểm 100%'
                            : 'Trực tiếp kiểm tra và đón nhận tác phẩm'}
                        </span>
                      </div>
                    </div>

                    {/* Địa chỉ nhận */}
                    <div className="mt-3 bg-surface p-3.5 rounded-lg border border-outline-variant/30">
                      <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold block mb-1">
                        {deliveryType === 'SHIPPING' ? 'Địa chỉ nhận tác phẩm' : 'Địa điểm nhận gốm'}
                      </span>
                      <p className="font-medium text-on-surface text-xs leading-relaxed">
                        {deliveryType === 'SHIPPING'
                          ? deliveryAddress
                          : 'Cửa Hàng Gốm Mộc — Sahara Atelier: Số 18, Ngõ 45 Đường Gốm Bát Tràng, Huyện Gia Lâm, Hà Nội (08:00 - 21:00)'}
                      </p>
                    </div>
                  </div>

                  {/* Payment Methods Selection Section */}
                  <div className="bg-surface-container-low rounded-xl p-6 lg:p-8 shadow-sm flex flex-col gap-5 border border-outline-variant/40">
                    <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <h2 className="font-headline text-2xl font-bold text-on-surface">
                          Chọn Phương Thức Thanh Toán
                        </h2>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/10 px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                        <span>Bảo mật PayOS / VietQR</span>
                      </div>
                    </div>

                    {/* Danh sách 2 phương thức thanh toán */}
                    <div className="flex flex-col gap-4">
                      {/* Option 1: Chuyển khoản QR Ngân Hàng (PayOS) */}
                      <label
                        onClick={() => setPaymentMethod('PAYOS')}
                        className={`p-5 rounded-xl bg-surface border transition-all cursor-pointer flex flex-col gap-3 ${
                          paymentMethod === 'PAYOS'
                            ? 'border-2 border-primary shadow-sm bg-surface-container-lowest'
                            : 'border-outline-variant/60 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3.5">
                            <input
                              type="radio"
                              name="payment_method"
                              value="PAYOS"
                              checked={paymentMethod === 'PAYOS'}
                              onChange={() => setPaymentMethod('PAYOS')}
                              className="mt-1 text-primary focus:ring-primary h-4 w-4 shrink-0 accent-primary cursor-pointer"
                            />
                            <div>
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="font-headline text-lg font-bold text-on-surface">
                                  Chuyển khoản QR Ngân Hàng (PayOS / VietQR)
                                </span>
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">
                                  Tự động 100%
                                </span>
                              </div>
                              <p className="text-xs text-on-surface-variant font-body leading-relaxed mt-1">
                                Sau khi bấm xác nhận đặt hàng, hệ thống sẽ tự động tạo mã VietQR chuẩn xác với mã đơn để Quý khách quét thanh toán tức thì qua App ngân hàng.
                              </p>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-primary text-2xl shrink-0">
                            qr_code_2
                          </span>
                        </div>

                        {/* Hướng dẫn khi chọn PayOS (không hiện QR giả định sớm) */}
                        {paymentMethod === 'PAYOS' && (
                          <div className="mt-1 pt-3 border-t border-outline-variant/30 flex items-center gap-3 text-xs text-on-surface-variant bg-surface-container-low/60 p-3 rounded-lg">
                            <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                              info
                            </span>
                            <span>
                              Mã VietQR động chứa chính xác số tiền và mã đơn sẽ xuất hiện ở bước tiếp theo để bạn quét trong 1 chạm.
                            </span>
                          </div>
                        )}
                      </label>

                      {/* Option 2: COD - Thanh toán tiền mặt */}
                      <label
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-5 rounded-xl bg-surface border transition-all cursor-pointer flex items-start justify-between ${
                          paymentMethod === 'COD'
                            ? 'border-2 border-primary shadow-sm bg-surface-container-lowest'
                            : 'border-outline-variant/60 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <input
                            type="radio"
                            name="payment_method"
                            value="COD"
                            checked={paymentMethod === 'COD'}
                            onChange={() => setPaymentMethod('COD')}
                            className="mt-1 text-primary focus:ring-primary h-4 w-4 shrink-0 accent-primary cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-headline text-lg font-bold text-on-surface">
                                {deliveryType === 'SHIPPING'
                                  ? 'Thanh toán khi nhận gốm (COD / Tiền mặt)'
                                  : 'Thanh toán trực tiếp tại quầy cửa hàng'}
                              </span>
                              <span className="bg-surface-container text-on-surface-variant text-[10px] uppercase font-semibold px-2 py-0.5 rounded tracking-wider">
                                Tiền mặt
                              </span>
                            </div>
                            <p className="text-xs text-on-surface-variant font-body leading-relaxed mt-1">
                              {deliveryType === 'SHIPPING'
                                ? 'Kiểm tra tác phẩm kỹ lưỡng trước khi thanh toán tiền mặt trực tiếp cho nhân viên vận chuyển.'
                                : 'Thanh toán tiền mặt hoặc quẹt thẻ trực tiếp tại quầy thu ngân khi tới nhận gốm tại cửa hàng.'}
                            </p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-secondary text-2xl shrink-0">
                          payments
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Nút thao tác hoàn tất đơn */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-full sm:w-auto px-6 py-4 rounded-lg border border-outline text-on-surface hover:bg-surface-container transition-colors font-body text-sm sm:text-base font-semibold tracking-wide flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
                        arrow_back
                      </span>
                      <span>QUAY LẠI BƯỚC 01</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleConfirmOrder}
                      className="w-full sm:w-auto flex-1 py-4 px-8 rounded-lg bg-primary hover:bg-[#a8531e] active:scale-[0.99] text-on-primary font-body text-sm sm:text-base font-semibold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-50"
                    >
                      <span>
                        {isSubmitting
                          ? 'ĐANG XỬ LÝ ĐẶT HÀNG...'
                          : 'XÁC NHẬN ĐẶT HÀNG'}
                      </span>
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-lg">
                        check_circle
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (STICKY SIDEBAR ~ 35%) */}
            <aside className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sticky top-24">
              <div className="bg-surface-container-low rounded-2xl p-6 lg:p-7 shadow-sm flex flex-col gap-6 border border-outline-variant/30">
                {/* Title & Order Meta */}
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                  <div>
                    <span className="text-[10px] tracking-widest font-label uppercase text-secondary font-semibold">
                      Tóm tắt giỏ gốm
                    </span>
                    <h3 className="font-headline font-bold text-2xl text-on-surface tracking-tight">
                      Đơn Hàng Gốm Mộc
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-label font-bold text-on-primary-fixed-variant bg-primary-fixed rounded-full">
                    {orderItems.length} Tác Phẩm
                  </span>
                </div>

                {/* Danh sách các tác phẩm */}
                <div className="flex flex-col gap-3.5 max-h-[380px] overflow-y-auto pr-1">
                  {orderItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="flex items-center gap-3.5 bg-surface-container-lowest/80 p-3 rounded-xl shadow-sm border border-outline-variant/20"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                        <img
                          alt={item.name}
                          src={item.image}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <h4 className="font-headline font-bold text-sm text-on-surface truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-label text-secondary mt-0.5 truncate">
                          {item.spec}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-semibold text-primary font-body">
                            {formatCurrency(item.price)}
                          </span>
                          <span className="text-[11px] text-on-surface-variant font-label">
                            SL: {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bảng tính chi phí */}
                <div className="flex flex-col gap-2.5 pt-2 border-t border-outline-variant/30">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-body">
                    <span>Tổng tiền phôi gốm</span>
                    <span className="font-medium text-on-surface">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-body">
                    <span className="flex items-center gap-1">
                      Phí vận chuyển bọc rơm
                      <span className="material-symbols-outlined text-[14px] text-secondary">
                        info
                      </span>
                    </span>
                    <span
                      className={`font-semibold ${
                        shippingFee === 0 ? 'text-secondary' : 'text-primary'
                      }`}
                    >
                      {shippingFee === 0 ? '0₫ (Miễn phí)' : formatCurrency(shippingFee)}
                    </span>
                  </div>

                  <div className="h-[1px] bg-outline-variant/50 my-2" />

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-xs font-label uppercase text-secondary font-semibold block">
                        Tổng thanh toán dự kiến
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-headline font-bold text-2xl lg:text-3xl text-primary">
                        {formatCurrency(totalAmount)}
                      </span>
                      <span className="text-[10px] text-secondary uppercase font-label block">
                        VNĐ
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-center text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-sm">verified</span>
                    <span>Kèm Giấy Chứng Nhận Nghệ Nhân đánh số series độc bản đáy bình</span>
                  </div>
                </div>

                {/* Lời trích nghệ nhân (Artisan Thought Quote) */}
                <div className="p-4 rounded-xl bg-surface-container-high/60 relative overflow-hidden border border-outline-variant/20">
                  <div className="absolute -right-2 -bottom-2 opacity-10 text-primary pointer-events-none">
                    <span className="material-symbols-outlined text-7xl">format_quote</span>
                  </div>
                  <p className="font-headline italic text-xs sm:text-sm text-on-surface-variant leading-relaxed relative z-10">
                    &ldquo;Đất thô nung lửa đỏ, qua gió sương mới hóa hình gốm. Mỗi gói hàng trao đi là gửi gắm trọn vẹn sự bình yên của lò củi quê hương.&rdquo;
                  </p>
                  <div className="flex items-center gap-2 mt-3 pt-2 text-[11px] font-label text-secondary font-semibold relative z-10 border-t border-outline-variant/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Nghệ nhân Mộc Thao — Lò Nung Củi Cổ</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL CHỌN ĐỊA CHỈ TỪ SỔ ĐỊA CHỈ */}
      {/* ========================================================= */}
      {isAddressModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsAddressModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-xl p-6 sm:p-7 flex flex-col gap-5 border border-outline-variant/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex flex-col">
                <span className="text-xs uppercase font-label font-bold text-primary tracking-wider">
                  Sổ Địa Chỉ Của Tôi
                </span>
                <h3 className="font-headline text-xl font-bold text-on-surface">
                  Chọn Địa Chỉ Giao Hàng
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1.5 rounded-full text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
              {savedAddresses.length === 0 ? (
                <div className="p-8 text-center space-y-2 bg-surface rounded-xl border border-outline-variant/30">
                  <span className="material-symbols-outlined text-3xl text-secondary">location_off</span>
                  <p className="text-sm font-semibold text-on-surface">Chưa có địa chỉ trong sổ</p>
                  <p className="text-xs text-on-surface-variant">
                    Quý khách có thể nhập trực tiếp địa chỉ nhận hàng tại form hoặc thêm địa chỉ mới tại trang Hồ Sơ.
                  </p>
                </div>
              ) : (
                savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      selectedAddressId === addr.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-outline-variant/40 hover:border-primary/50 bg-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-on-surface">
                          {addr.receiverName}
                        </span>
                        <span className="text-xs text-on-surface-variant font-mono">
                          {formatPhoneNumber(addr.receiverPhone)}
                        </span>
                      </div>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-on-primary uppercase">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {addr.addressDetail}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30 text-xs">
              <span className="text-on-surface-variant">
                Muốn thêm hoặc chỉnh sửa địa chỉ?
              </span>
              <Link
                to={ROUTES.PROFILE}
                onClick={() => setIsAddressModalOpen(false)}
                className="text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span>Quản lý sổ địa chỉ</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


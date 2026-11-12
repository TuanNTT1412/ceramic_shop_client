import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart, useAuth, useToast } from '../../context';
import { Modal } from '../../components/ui';
import { formatCurrency } from '../../utils/format';
import { ROUTES } from '../../constants';

export const CartPage = () => {
  const {
    items,
    totalItems,
    totalPrice,
    isLoading,
    updateQuantity,
    removeItem,
    clearCart,
    clearUnavailable,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [selectedIds, setSelectedIds] = useState([]);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Tự động đồng bộ danh sách món được chọn khi giỏ hàng cập nhật
  useEffect(() => {
    if (items && items.length > 0) {
      const availIds = items.filter((i) => i.isAvailable).map((i) => i.id);
      setSelectedIds((prev) => {
        if (prev.length === 0) return availIds;
        const preserved = availIds.filter((id) => prev.includes(id));
        return preserved.length > 0 ? preserved : availIds;
      });
    } else {
      setSelectedIds([]);
    }
  }, [items]);

  // Nhóm 1: Sản phẩm sẵn sàng xuất xưởng (Khả dụng)
  const availableItems = useMemo(() => {
    return (items || [])
      .filter((item) => item.isAvailable)
      .map((item) => ({
        id: item.id,
        variantId: item.variantId,
        productId: item.productId,
        name: item.productName || 'Tác phẩm Gốm Mộc',
        badge: 'Gốm Nung Củi',
        spec: item.variantName || 'Quy cách chuẩn nghệ nhân',
        price: item.price || 0,
        quantity: item.quantity,
        stockQuantity: item.stockQuantity,
        image: item.primaryImage || '/images/product-1.jpg',
        selected: selectedIds.includes(item.id),
      }));
  }, [items, selectedIds]);

  // Nhóm 2: Sản phẩm tạm thời không khả dụng (tồn kho / mẻ lò)
  const unavailableItems = useMemo(() => {
    return (items || [])
      .filter((item) => !item.isAvailable)
      .map((item) => {
        let typeBadge = 'Không khả dụng';
        let desc = 'Sản phẩm tạm thời không thể xuất xưởng';
        if (item.unavailableReason === 'OUT_OF_STOCK') {
          typeBadge = 'OUT_OF_STOCK • Hết hàng trong kho';
          desc = 'Nghệ nhân đang trong chu kỳ nung mẻ mới';
        } else if (item.unavailableReason === 'EXCEEDS_STOCK') {
          typeBadge = `EXCEEDS_STOCK • Vượt quá tồn kho (Còn ${item.stockQuantity})`;
          desc = `Bạn yêu cầu: ${item.quantity} chiếc — Xưởng hiện chỉ còn giữ: ${item.stockQuantity} chiếc`;
        } else if (item.unavailableReason === 'INACTIVE') {
          typeBadge = 'INACTIVE • Tạm ngừng kinh doanh';
          desc = 'Tác phẩm đã dừng lưu hành';
        }
        return {
          id: item.id,
          variantId: item.variantId,
          productId: item.productId,
          name: item.productName || 'Tác phẩm Gốm Mộc',
          type: item.unavailableReason,
          typeBadge,
          desc,
          note: 'Dự kiến nung xong sau 12 ngày',
          maxStock: item.stockQuantity || 0,
          price: item.price || 0,
          image: item.primaryImage || '/images/cat-tra-dao.jpg',
        };
      });
  }, [items]);

  const MEMBER_DISCOUNT = availableItems.length > 0 ? 200000 : 0;

  // Xử lý tăng / giảm số lượng
  const handleUpdateQuantity = async (id, delta) => {
    const item = (items || []).find((i) => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      await removeItem(id);
    } else {
      await updateQuantity(id, newQty);
    }
  };

  // Chọn / bỏ chọn từng món
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Xóa từng món khả dụng
  const handleRemoveAvailableItem = async (id, name) => {
    await removeItem(id);
    toast.info(`Đã bỏ "${name}" khỏi giỏ hàng.`);
  };

  // Xóa từng món không khả dụng
  const handleRemoveUnavailableItem = async (id, name) => {
    await removeItem(id);
    toast.info(`Đã gỡ "${name}".`);
  };

  // Xóa tất cả món không khả dụng
  const handleClearUnavailable = async () => {
    await clearUnavailable();
    toast.success('Đã xóa tất cả các món không khả dụng.');
  };

  // Nút "Về tối đa" chuyển món vượt quá tồn kho sang nhóm khả dụng
  const handleFixExceedsStock = async (unavailItem) => {
    if (unavailItem.maxStock > 0) {
      await updateQuantity(unavailItem.id, unavailItem.maxStock);
      toast.success(`Đã điều chỉnh "${unavailItem.name}" về ${unavailItem.maxStock} chiếc khả dụng.`);
    } else {
      await removeItem(unavailItem.id);
      toast.info(`Đã gỡ "${unavailItem.name}" do hết hàng.`);
    }
  };

  // Mở hộp thoại nổi (Modal) xác nhận xóa sạch giỏ hàng
  const handleOpenClearModal = () => {
    setIsClearModalOpen(true);
  };

  // Xác nhận làm rỗng giỏ hàng từ Modal
  const handleConfirmClearCart = async () => {
    setIsClearModalOpen(false);
    await clearCart();
    toast.success('Đã làm trống toàn bộ giỏ hàng.');
  };

  // Tính toán tổng tiền
  const selectedItems = useMemo(() => {
    return availableItems.filter((item) => item.selected);
  }, [availableItems]);

  const subtotal = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [selectedItems]);

  const total = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal - (subtotal >= MEMBER_DISCOUNT ? MEMBER_DISCOUNT : 0));
  }, [subtotal, MEMBER_DISCOUNT]);

  return (
    <div className="w-full bg-background font-body text-on-background min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-8 lg:py-14">
        {/* ========================================================= */}
        {/* 1. HEADER SECTION                                         */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-outline-variant/30 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
              <span className="material-symbols-outlined text-sm">shopping_basket</span>
              <span>Phiên Giỏ Hàng Gốm Mộc</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-on-surface font-normal tracking-tight">
              Giỏ Hàng Của Bạn
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-on-surface-variant font-body">
              <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Khả dụng xuất xưởng:{' '}
                <strong className="text-on-surface font-semibold">
                  {availableItems.length} món
                </strong>
              </span>
              <span className="text-outline-variant">•</span>
              <span className="inline-flex items-center gap-1.5 text-tertiary font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                Cần xử lý tồn kho:{' '}
                <strong className="text-on-surface font-semibold">
                  {unavailableItems.length} món
                </strong>
              </span>
            </div>
          </div>

          {(availableItems.length > 0 || unavailableItems.length > 0) && (
            <button
              onClick={handleOpenClearModal}
              type="button"
              className="group self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-error bg-surface-container hover:bg-error-container/40 rounded-lg transition-all"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">
                delete_sweep
              </span>
              <span>Xóa sạch giỏ hàng</span>
            </button>
          )}
        </div>

        {/* Thông báo đăng nhập nếu là khách vãng lai */}
        {!isAuthenticated && (
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20 text-on-surface">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">account_circle</span>
              <p className="text-xs sm:text-sm">
                Quý khách chưa đăng nhập. Vui lòng đăng nhập để lưu trữ và đồng bộ các tác phẩm trong giỏ hàng.
              </p>
            </div>
            <Link
              to={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CART)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm shrink-0"
            >
              <span>Đăng nhập ngay</span>
              <span className="material-symbols-outlined text-xs">login</span>
            </Link>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. MAIN GRID LAYOUT (12 CỘT)                              */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-10">
          {/* CỘT TRÁI (8 Cột): DANH SÁCH MÓN HÀNG */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Nhóm 1: Sản phẩm sẵn sàng xuất xưởng */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check_circle
                  </span>
                  <h2 className="font-headline text-xl text-on-surface font-medium">
                    Sản phẩm sẵn sàng xuất xưởng
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-fixed text-on-primary-fixed">
                    {availableItems.length}
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant hidden sm:inline-block">
                  Được kiểm định chất men nguyên bản
                </span>
              </div>

              {availableItems.length === 0 ? (
                <div className="p-8 rounded-xl bg-surface-container-low text-center space-y-3">
                  <p className="text-sm text-on-surface-variant font-medium">
                    Không có sản phẩm nào trong nhóm sẵn sàng xuất xưởng.
                  </p>
                  <Link
                    to={ROUTES.COLLECTION}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>Khám phá bộ sưu tập tác phẩm</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {availableItems.map((item) => (
                    <article
                      key={item.id}
                      className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-xl bg-surface-container-low shadow-xs gap-4 transition-all hover:bg-surface-container"
                    >
                      <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleToggleSelect(item.id)}
                          aria-label={`Chọn mua ${item.name}`}
                          className="mt-1 sm:mt-0 w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                            {item.badge}
                          </span>
                          <h3 className="font-headline text-lg sm:text-xl text-on-surface font-medium leading-snug line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                            {item.spec}
                          </p>
                          <p className="font-body text-sm font-semibold text-primary mt-1.5 sm:hidden">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t border-outline-variant/30 sm:border-0">
                        <span className="hidden sm:block font-body text-sm font-semibold text-on-surface text-right min-w-[100px]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>

                        {/* Bộ điều khiển số lượng */}
                        <div className="inline-flex items-center rounded-lg bg-surface-container-highest px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className={`w-7 h-7 flex items-center justify-center transition-colors ${
                              item.quantity <= 1
                                ? 'opacity-30 cursor-not-allowed'
                                : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                            aria-label="Giảm số lượng"
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-on-surface">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                            aria-label="Tăng số lượng"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>

                        {/* Nút xóa món */}
                        <button
                          type="button"
                          onClick={() => handleRemoveAvailableItem(item.id, item.name)}
                          className="p-2 text-on-surface-variant hover:text-error transition-colors"
                          title="Xóa món"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete_outline
                          </span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Nhóm 2: Sản phẩm tạm thời không khả dụng */}
            {unavailableItems.length > 0 && (
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-tertiary text-[20px]">
                      inventory_2
                    </span>
                    <h2 className="font-headline text-xl text-on-surface font-medium">
                      Sản phẩm tạm thời không khả dụng
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                      {unavailableItems.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearUnavailable}
                    className="text-xs font-semibold text-tertiary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Xóa tất cả món không khả dụng</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3.5">
                  {unavailableItems.map((item) => {
                    const isOutOfStock = item.type === 'OUT_OF_STOCK';

                    return (
                      <article
                        key={item.id}
                        className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-xl bg-surface-container-high/60 gap-4"
                      >
                        <div
                          className={`flex items-start sm:items-center gap-4 w-full sm:w-auto ${
                            isOutOfStock ? 'opacity-70' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled
                            aria-label="Món không thể chọn"
                            className="mt-1 sm:mt-0 w-4 h-4 accent-outline cursor-not-allowed"
                          />
                          <div
                            className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-surface-dim ${
                              isOutOfStock ? 'grayscale' : ''
                            }`}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div
                              className={`inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded text-[11px] font-semibold ${
                                isOutOfStock
                                  ? 'bg-error-container text-on-error-container'
                                  : 'bg-primary-fixed text-on-primary-fixed-variant'
                              }`}
                            >
                              {isOutOfStock ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                              ) : (
                                <span className="material-symbols-outlined text-[13px]">
                                  warning
                                </span>
                              )}
                              <span>{item.typeBadge}</span>
                            </div>

                            <h3 className="font-headline text-lg text-on-surface font-medium mt-1 leading-snug line-clamp-1">
                              {item.name}
                            </h3>
                            <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t border-outline-variant/30 sm:border-0">
                          {isOutOfStock ? (
                            <span className="text-xs font-medium text-on-surface-variant italic">
                              {item.note}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleFixExceedsStock(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-sm transition-colors"
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                auto_fix_high
                              </span>
                              <span>Về tối đa: {item.maxStock}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveUnavailableItem(item.id, item.name)}
                            className="p-2 text-on-surface-variant hover:text-error transition-colors"
                            title="Xóa món"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              delete_outline
                            </span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Banner Quy chuẩn đóng gói 5 lớp */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-xl bg-secondary-fixed/50 text-on-secondary-fixed">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[26px]">
                  verified
                </span>
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-sm font-semibold tracking-wide">
                  Quy chuẩn đóng gói gốm 5 lớp độc quyền
                </span>
                <p className="text-xs text-on-secondary-fixed-variant leading-relaxed mt-0.5">
                  Tất cả sản phẩm gốm mộc được chèn mút xốp đúc, bóng khí hữu cơ và thùng carton
                  nẹp góc gỗ. Bảo hiểm đền bù 100% không phiền hà nếu phát sinh nứt vỡ trong quá
                  trình vận chuyển.
                </p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (4 Cột): TÓM TẮT ĐƠN HÀNG (STICKY SIDEBAR) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-6 p-6 sm:p-7 rounded-2xl bg-surface-container-low shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
                <h2 className="font-headline text-2xl text-on-surface font-medium">
                  Tóm Tắt Đơn Hàng
                </h2>
                <span className="text-xs uppercase font-mono tracking-wider text-on-surface-variant">
                  Prisma Checkout
                </span>
              </div>

              {/* Bảng tính chi phí */}
              <div className="flex flex-col gap-3.5 text-sm">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Tạm tính ({selectedItems.length} món chọn mua)</span>
                  <span className="font-semibold text-on-surface">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {subtotal > 0 && (
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[17px]">
                        loyalty
                      </span>
                      <span>Ưu đãi hội viên Đất Mộc</span>
                    </span>
                    <span className="font-semibold text-primary">
                      -{formatCurrency(MEMBER_DISCOUNT)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Bảo hiểm vỡ mẻ gốm</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">
                    Miễn Phí
                  </span>
                </div>

                <div className="flex items-center justify-between text-on-surface-variant pb-3 border-b border-outline-variant/40">
                  <span>Phí vận chuyển</span>
                  <span className="text-xs italic text-on-surface-variant">
                    Tính tại bước kế tiếp
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline text-xl text-on-surface font-semibold">
                      Tổng Thanh Toán
                    </span>
                    <span className="font-headline text-2xl sm:text-3xl text-primary font-bold">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant text-right">
                    Đã bao gồm thuế giá trị gia tăng &amp; bảo hiểm rủi ro vận chuyển
                  </span>
                </div>
              </div>

              {/* Nút Đặt Hàng */}
              <div className="flex flex-col gap-3 pt-2">
                {selectedItems.length > 0 ? (
                  <Link
                    to={ROUTES.CHECKOUT}
                    className="group relative w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm uppercase tracking-wider transition-all shadow-md active:scale-[0.99] text-center"
                  >
                    <span>TIẾN HÀNH ĐẶT HÀNG</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-4 px-6 rounded-lg bg-surface-container-highest text-on-surface-variant opacity-60 font-semibold text-sm uppercase tracking-wider cursor-not-allowed text-center"
                  >
                    Chọn ít nhất 1 món để đặt
                  </button>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-on-surface-variant pt-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
                  <span>Giao dịch an toàn được mã hóa SSL 256-bit</span>
                </div>
              </div>

              {/* Thông tin vận chuyển hỏa tốc */}
              <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-2.5 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2 text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    local_shipping
                  </span>
                  <span>Chính sách giao nhận hỏa tốc</span>
                </div>
                <p className="leading-relaxed">
                  Thời gian bàn giao hàng thủ công: 24h - 48h đối với các thành phố lớn. Đội ngũ
                  bọc lót riêng biệt cho tác phẩm gốm mộc nung củi.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MODAL XÁC NHẬN LÀM RỖNG GIỎ HÀNG (HỘP THOẠI NỔI TÙY CHỈNH) */}
      {/* ========================================================= */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Làm Rỗng Giỏ Hàng"
        subtitle="Xác nhận gỡ bỏ toàn bộ tác phẩm khỏi phiên mua sắm"
        maxWidth="sm"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#faefe4] border border-[#e8d5c4] text-[#26201b]">
            <div className="w-10 h-10 rounded-full bg-[#fce8db] text-[#c2652a] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">delete_sweep</span>
            </div>
            <div className="text-xs sm:text-sm space-y-1">
              <p className="font-semibold text-[#c2652a]">Thao tác không thể hoàn tác</p>
              <p className="text-[#735e4d] leading-relaxed">
                Quý khách có chắc chắn muốn xóa toàn bộ tác phẩm trong giỏ hàng không? Tất cả sản phẩm sẽ bị loại bỏ khỏi danh sách đặt mua.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsClearModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#f0e7dc] hover:bg-[#e4d6c5] text-[#524337] text-xs font-semibold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleConfirmClearCart}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#c2652a] hover:bg-[#aa541e] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Xác nhận xóa</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartPage;


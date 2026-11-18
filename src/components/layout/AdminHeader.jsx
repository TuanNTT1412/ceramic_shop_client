import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast, useAdminFilter } from '../../context';
import { ROUTES } from '../../constants';
import { AdminDropdown } from './AdminDropdown';

export const AdminHeader = ({
  isCollapsed = false,
  onToggleCollapse,
  onOpenMobile,
}) => {
  const toast = useToast();

  const {
    activeSection,
    searchQuery,
    setSearchQuery,
    productFilters,
    setProductFilters,
    orderFilters,
    setOrderFilters,
    reviewFilters,
    setReviewFilters,
    userFilters,
    setUserFilters,
    categoriesList,
    activeFilterCount,
    resetCurrentFilters,
  } = useAdminFilter();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // State đóng mở Modal / Popover bộ lọc nhỏ
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Đóng notification dropdown & filter popover khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tiêu đề placeholder phù hợp từng trang
  const getSearchPlaceholder = () => {
    switch (activeSection) {
      case 'products':
        return 'Tìm tên tác phẩm, mã SKU, chất men nung...';
      case 'orders':
        return 'Tìm mã đơn (ORD-...), tên khách, SĐT...';
      case 'categories':
        return 'Tìm kiếm danh mục tác phẩm...';
      case 'reviews':
        return 'Tìm tên khách, nội dung đánh giá, tác phẩm...';
      case 'users':
        return 'Tìm họ tên, email, mã khách hàng...';
      default:
        return 'Tìm kiếm trong hệ thống gốm mộc...';
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'products':
        return 'Bộ Lọc Tác Phẩm';
      case 'orders':
        return 'Bộ Lọc Đơn Hàng';
      case 'categories':
        return 'Bộ Lọc Danh Mục';
      case 'reviews':
        return 'Bộ Lọc Đánh Giá';
      case 'users':
        return 'Bộ Lọc Khách Hàng';
      default:
        return 'Bộ Lọc Nâng Cao';
    }
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'Đơn hàng mới #ORD-9824',
      desc: 'Nguyễn Văn An vừa đặt bộ Tứ Chén Mộc (680.000đ)',
      time: '5 phút trước',
      unread: true,
      icon: 'shopping_bag',
    },
    {
      id: 2,
      title: 'Cảnh báo tồn kho',
      desc: 'Ấm Sa Thạch Vị Cố hiện chỉ còn 2 tác phẩm',
      time: '1 giờ trước',
      unread: true,
      icon: 'inventory',
    },
    {
      id: 3,
      title: 'Đánh giá mới',
      desc: 'Trần Thị Mai chấm 5 sao cho Bình Dáng Tỳ Bà',
      time: '3 giờ trước',
      unread: false,
      icon: 'star',
    },
  ];

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 shadow-[0_2px_16px_rgba(58,48,42,0.03)] ${
        isCollapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-64'
      }`}
    >
      {/* CỤM TRÁI: Toggle Button + Search Input + Filter Popover */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
        {/* Toggle Collapse (Desktop & Mobile) */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex w-9 h-9 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface items-center justify-center transition-colors cursor-pointer"
          title={isCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isCollapsed ? 'menu_open' : 'menu'}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenMobile}
          className="flex lg:hidden w-9 h-9 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface items-center justify-center transition-colors cursor-pointer"
          aria-label="Mở menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Cụm Tìm kiếm + Nút Icon Lọc Popover */}
        <div className="relative flex items-center flex-1 max-w-xs sm:max-w-sm" ref={filterRef}>
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getSearchPlaceholder()}
            className="w-full bg-surface-container-low pl-9 pr-14 py-1.5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container transition-all border border-outline-variant/30 focus:border-primary/40 font-body"
          />

          {/* Nút Xóa nhanh từ khóa */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-8 text-on-surface-variant hover:text-on-surface text-xs font-bold w-4 h-4 flex items-center justify-center cursor-pointer"
              title="Xóa từ khóa"
            >
              ×
            </button>
          )}

          {/* Nút Icon Bộ Lọc (Phễu lọc mở modal nhỏ) */}
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`absolute right-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isFilterOpen || activeFilterCount > 0
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
            title="Mở bộ lọc nâng cao"
          >
            <span className="material-symbols-outlined text-[16px]">
              tune
            </span>
            {activeFilterCount > 0 && !isFilterOpen && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-on-primary text-[8px] font-bold flex items-center justify-center ring-2 ring-surface">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* MODAL / POPOVER BỘ LỌC NHỎ */}
          {isFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xl z-50 p-3.5 animate-scaleUp font-body text-on-surface">
              {/* Header của Modal Lọc */}
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[17px]">
                    tune
                  </span>
                  <span className="font-semibold text-xs text-on-surface">
                    {getSectionTitle()}
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-bold">
                      {activeFilterCount} đang áp dụng
                    </span>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetCurrentFilters}
                    className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                  >
                    Đặt lại
                  </button>
                )}
              </div>

              {/* Nội dung bộ lọc theo từng trang */}
              <div className="space-y-3 text-xs">
                {/* 1. Bộ lọc TRANG SẢN PHẨM */}
                {activeSection === 'products' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Danh Mục Tác Phẩm
                      </label>
                      <select
                        value={productFilters.category}
                        onChange={(e) =>
                          setProductFilters((prev) => ({ ...prev, category: e.target.value }))
                        }
                        className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="ALL">Tất cả danh mục</option>
                        {categoriesList.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Trạng Thái Mở Bán
                      </label>
                      <select
                        value={productFilters.status}
                        onChange={(e) =>
                          setProductFilters((prev) => ({ ...prev, status: e.target.value }))
                        }
                        className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang mở bán (Active)</option>
                        <option value="DRAFT">Tạm ẩn (Draft)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Cốt Đất &amp; Men Nung
                      </label>
                      <select
                        value={productFilters.glaze}
                        onChange={(e) =>
                          setProductFilters((prev) => ({ ...prev, glaze: e.target.value }))
                        }
                        className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="ALL">Tất cả cốt đất &amp; men</option>
                        <option value="Men tro củi tự nhiên">Men tro củi tự nhiên</option>
                        <option value="Men rêu cổ phù sa">Men rêu cổ phù sa</option>
                        <option value="Sa thạch hỏa biến">Sa thạch hỏa biến</option>
                      </select>
                    </div>
                  </>
                )}

                {/* 2. Bộ lọc TRANG ĐƠN HÀNG */}
                {activeSection === 'orders' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Hình Thức Nhận Hàng
                      </label>
                      <select
                        value={orderFilters.delivery}
                        onChange={(e) =>
                          setOrderFilters((prev) => ({ ...prev, delivery: e.target.value }))
                        }
                        className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="ALL">Tất cả hình thức</option>
                        <option value="SHIPPING">Giao tận nơi (SHIPPING)</option>
                        <option value="PICKUP">Nhận tại xưởng (PICKUP)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Trạng Thái Thanh Toán
                      </label>
                      <select
                        value={orderFilters.payment}
                        onChange={(e) =>
                          setOrderFilters((prev) => ({ ...prev, payment: e.target.value }))
                        }
                        className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PAID">Đã thanh toán (PAID)</option>
                        <option value="PENDING">Chờ thanh toán (PENDING)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Thứ Tự Sắp Xếp
                      </label>
                      <select
                        value={orderFilters.sort}
                        onChange={(e) =>
                          setOrderFilters((prev) => ({ ...prev, sort: e.target.value }))
                        }
                        className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="NEWEST">Đơn mới nhất trước</option>
                        <option value="OLDEST">Đơn cũ nhất trước</option>
                        <option value="AMOUNT_DESC">Giá trị cao nhất</option>
                        <option value="AMOUNT_ASC">Giá trị thấp nhất</option>
                      </select>
                    </div>
                  </>
                )}

                {/* 3. Bộ lọc TRANG ĐÁNH GIÁ */}
                {activeSection === 'reviews' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Số Sao Đánh Giá
                      </label>
                      <select
                        value={reviewFilters.star}
                        onChange={(e) =>
                          setReviewFilters((prev) => ({ ...prev, star: e.target.value }))
                        }
                        className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="all">Tất cả số sao</option>
                        <option value="5">5 Sao (Tuyệt hảo)</option>
                        <option value="4">4 Sao (Hài lòng)</option>
                        <option value="3">3 Sao (Bình thường)</option>
                        <option value="2">2 Sao (Chưa ưng ý)</option>
                        <option value="1">1 Sao (Kém)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Trạng Thái Phản Hồi
                      </label>
                      <select
                        value={reviewFilters.status}
                        onChange={(e) =>
                          setReviewFilters((prev) => ({ ...prev, status: e.target.value }))
                        }
                        className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="replied">Đã phản hồi</option>
                        <option value="pending">Chờ phản hồi</option>
                        <option value="hidden">Đã tạm ẩn</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reviewFilters.onlyPhotos}
                        onChange={(e) =>
                          setReviewFilters((prev) => ({ ...prev, onlyPhotos: e.target.checked }))
                        }
                        className="rounded text-primary focus:ring-primary accent-[#c2652a]"
                      />
                      <span className="text-[11px] text-on-surface font-medium">
                        Chỉ hiện đánh giá có ảnh chụp nung
                      </span>
                    </label>
                  </>
                )}

                {/* 4. Bộ lọc TRANG KHÁCH HÀNG / TÀI KHOẢN */}
                {activeSection === 'users' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Vai Trò Tài Khoản
                      </label>
                      <select
                        value={userFilters.role}
                        onChange={(e) =>
                          setUserFilters((prev) => ({ ...prev, role: e.target.value }))
                        }
                        className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="">Tất cả vai trò</option>
                        <option value="CUSTOMER">Khách Hàng (Hội Viên)</option>
                        <option value="STAFF">Nghệ Nhân / Nhân Viên</option>
                        <option value="ADMIN">Quản Trị Viên (Admin)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Trạng Thái Hoạt Động
                      </label>
                      <select
                        value={userFilters.status}
                        onChange={(e) =>
                          setUserFilters((prev) => ({ ...prev, status: e.target.value }))
                        }
                        className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 text-xs text-on-surface outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang hoạt động</option>
                        <option value="LOCKED">Tạm khóa tài khoản</option>
                      </select>
                    </div>
                  </>
                )}

                {/* 5. Bộ lọc TRANG DANH MỤC & DASHBOARD */}
                {(activeSection === 'categories' || activeSection === 'dashboard' || activeSection === 'other') && (
                  <p className="text-[11px] text-on-surface-variant text-center py-2">
                    Lọc theo từ khóa trực tiếp từ thanh tìm kiếm ở trên.
                  </p>
                )}
              </div>

              {/* Nút Đóng Modal */}
              <div className="pt-2.5 mt-3 border-t border-outline-variant/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CỤM PHẢI: Xem Cửa Hàng + Chuông Thông Báo + Admin Dropdown (Đồng nhất với Khách hàng) */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Nút Xem Cửa Hàng (Storefront Link) */}
        <Link
          to={ROUTES.HOME}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-label font-medium border border-outline-variant/30 hover:border-primary/30 transition-all group"
          title="Xem trang bán hàng"
        >
          <span className="material-symbols-outlined text-[16px] text-primary group-hover:scale-110 transition-transform">
            storefront
          </span>
          <span>Xem Cửa Hàng</span>
        </Link>

        {/* Chuông Thông Báo */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative w-9 h-9 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Thông báo hệ thống"
          >
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-surface animate-pulse" />
          </button>

          {/* Notification Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xl z-50 p-3 flex flex-col gap-2 animate-scaleUp">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 px-1">
                <span className="font-headline font-bold text-sm text-on-surface">
                  Thông Báo Xưởng Gốm
                </span>
                <span className="text-[10px] font-label font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  2 mới
                </span>
              </div>

              <div className="space-y-1 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl transition-colors cursor-pointer flex items-start gap-3 ${
                      item.unread
                        ? 'bg-surface-container-low/80 hover:bg-surface-container'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-on-surface leading-snug">
                        {item.title}
                      </p>
                      <p className="text-on-surface-variant text-[11px] leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                      <span className="text-[10px] text-secondary mt-1 block">
                        {item.time}
                      </span>
                    </div>
                    {item.unread && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  toast.info('Đã đánh dấu đã đọc tất cả thông báo.');
                  setIsNotifOpen(false);
                }}
                className="w-full text-center py-2 text-[11px] font-label font-semibold text-primary hover:bg-surface-container-low rounded-lg transition-colors border-t border-outline-variant/20 mt-1 cursor-pointer"
              >
                Đánh dấu đã đọc tất cả
              </button>
            </div>
          )}
        </div>

        {/* Dropdown Tài Khoản Admin */}
        <AdminDropdown />
      </div>
    </header>
  );
};

export default AdminHeader;

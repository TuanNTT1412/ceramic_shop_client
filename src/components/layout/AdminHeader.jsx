import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context';
import { ROUTES } from '../../constants';
import { AdminDropdown } from './AdminDropdown';

export const AdminHeader = ({
  isCollapsed = false,
  onToggleCollapse,
  onOpenMobile,
}) => {
  const toast = useToast();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      {/* CỤM TRÁI: Toggle Button + Search Input */}
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

        {/* Global Quick Search */}
        <div className="relative flex items-center flex-1 max-w-xs sm:max-w-sm">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, đơn hàng, men gốm..."
            className="w-full bg-surface-container-low pl-9 pr-4 py-1.5 rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container transition-all border border-transparent focus:border-primary/30"
          />
        </div>
      </div>

      {/* CỤM PHẢI: Xem Cửa Hàng + Chuông Thông Báo + Admin Dropdown (Đồng nhất với Khách hàng) */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Nút Xem Cửa Hàng (Storefront Link) */}
        <Link
          to={ROUTES.HOME}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-label font-medium border border-outline-variant/30 hover:border-primary/30 transition-all group"
          title="Mở trang bán hàng khách xem trong tab mới"
        >
          <span className="material-symbols-outlined text-[16px] text-primary group-hover:scale-110 transition-transform">
            storefront
          </span>
          <span>Xem Cửa Hàng</span>
          <span className="material-symbols-outlined text-[14px] text-secondary opacity-70">
            open_in_new
          </span>
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

        {/* Dropdown Tài Khoản Admin (Component đồng nhất 100% với bên Khách hàng) */}
        <AdminDropdown />
      </div>
    </header>
  );
};

export default AdminHeader;

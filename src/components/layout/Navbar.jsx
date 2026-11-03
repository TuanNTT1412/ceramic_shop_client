import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth, useCart } from '../../context';
import { MemberDropdown } from './MemberDropdown';
import { ROUTES } from '../../constants';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();

  // Nhận diện active: Bộ Sưu Tập Tác Phẩm sẽ active cả khi xem chi tiết tác phẩm (/product, /products/:id, /collection)
  const isCollectionActive =
    location.pathname.startsWith('/collection') ||
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/product');

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'px-3.5 py-1.5 rounded-full bg-[#c2652a] text-white shadow-sm font-semibold transition-colors'
      : 'px-3 py-1.5 rounded-full text-[#524337] hover:text-[#c2652a] hover:bg-[#faefe4] transition-colors';

  const collectionLinkClass = isCollectionActive
    ? 'px-3.5 py-1.5 rounded-full bg-[#c2652a] text-white shadow-sm font-semibold transition-colors'
    : 'px-3 py-1.5 rounded-full text-[#524337] hover:text-[#c2652a] hover:bg-[#faefe4] transition-colors';

  return (
    <header className="sticky top-0 z-50 bg-[#faf6f0]/95 backdrop-blur-md border-b border-[#e6dcce] transition-all">
      {/* 1. Dải Top Banner thông báo */}
      <div className="bg-[#f0e7dc] border-b border-[#e2d6c5] text-[#78614e] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-6 mx-auto md:mx-0 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c2652a]"></span>
              Cam kết mộc bản thủ công
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Miễn phí vận chuyển toàn quốc</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">
              Bảo hiểm bể vỡ 100% trong 5 lớp đóng gói an toàn
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-xs font-mono ml-auto">
            <span>Hotline: 0982.388.xxx</span>
            <span>|</span>
            <a href="#xuong" className="hover:text-[#c2652a] transition-colors">
              Xưởng nung Bát Tràng
            </a>
          </div>
        </div>
      </div>

      {/* 2. Thanh Navigation chính */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo Thương Hiệu Gốm Mộc Sahara */}
        <Link to={ROUTES.HOME} className="flex items-center space-x-3 shrink-0 group">
          <div className="w-10 h-10 rounded-full bg-[#faefe4] border border-[#e8d5c4] flex items-center justify-center text-[#c2652a] transition-transform duration-300 group-hover:scale-105">
            {/* SVG Biểu Tượng Bình Gốm */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3h8a2 2 0 0 1 2 2v2a6 6 0 0 1-2 4.47V19a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-7.53A6 6 0 0 1 6 7V5a2 2 0 0 1 2-2Z" />
              <path d="M9 7h6" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-wider text-[#26201b] uppercase block leading-tight">
              Gốm Mộc
            </span>
            <span className="text-[9px] tracking-[0.2em] font-sans font-semibold text-[#8a705b] uppercase block">
              Sahara Atelier
            </span>
          </div>
        </Link>

        {/* Danh Mục Điều Hướng Giữa (Navigation Links: Trang Chủ, Bộ Sưu Tập, Lịch Sử Đơn Hàng, Thanh Toán) */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-medium">
          <NavLink to={ROUTES.HOME} end className={navLinkClass}>
            Trang Chủ
          </NavLink>
          <NavLink to={ROUTES.COLLECTION} className={collectionLinkClass}>
            Bộ Sưu Tập Tác Phẩm
          </NavLink>
          <NavLink to={ROUTES.MY_ORDERS} className={navLinkClass}>
            Lịch Sử Đơn Hàng
          </NavLink>
          <NavLink to={ROUTES.CHECKOUT} className={navLinkClass}>
            Thanh Toán
          </NavLink>
        </nav>

        {/* Cụm Thao Tác Phải (Giỏ hàng, Hội viên, Mobile Toggle) */}
        <div className="flex items-center space-x-2.5">
          {/* Nút Giỏ Hàng (Badge đếm động từ CartContext) */}
          <Link
            to={ROUTES.CART}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#c2652a] text-white hover:bg-[#aa541e] transition-colors text-xs font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="hidden sm:inline">Giỏ Hàng</span>
            <span className="w-4 h-4 rounded-full bg-white text-[#c2652a] text-[10px] font-bold flex items-center justify-center leading-none">
              {totalItems || 3}
            </span>
          </Link>

          {/* Dropdown Hội Viên */}
          <MemberDropdown />

          {/* Nút Hamburger Menu trên Mobile */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-full border border-[#ded0c0] bg-white text-[#524337] hover:text-[#c2652a] transition-colors"
            aria-label="Mở Menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 3. Menu Điều Hướng Thả Xuống Trên Mobile (Mobile Drawer) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#e6dcce] bg-[#faf6f0] px-4 py-4 space-y-3 font-sans">
          <nav className="flex flex-col gap-1 text-xs">
            <NavLink
              to={ROUTES.HOME}
              end
              onClick={() => setIsMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Trang Chủ
            </NavLink>
            <NavLink
              to={ROUTES.COLLECTION}
              onClick={() => setIsMobileMenuOpen(false)}
              className={collectionLinkClass}
            >
              Bộ Sưu Tập Tác Phẩm
            </NavLink>
            <NavLink
              to={ROUTES.MY_ORDERS}
              onClick={() => setIsMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Lịch Sử Đơn Hàng
            </NavLink>
            <NavLink
              to={ROUTES.CHECKOUT}
              onClick={() => setIsMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Thanh Toán
            </NavLink>

            {isAuthenticated ? (
              <div className="pt-2 border-t border-[#e8d5c4] mt-2 space-y-1">
                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3.5 py-2 rounded-md text-[#524337] hover:bg-[#faefe4]"
                >
                  Hồ Sơ Cá Nhân
                </Link>
                <Link
                  to={ROUTES.MY_ORDERS}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3.5 py-2 rounded-md text-[#524337] hover:bg-[#faefe4]"
                >
                  Đơn Mua Của Tôi
                </Link>
                {isAdmin && (
                  <Link
                    to={ROUTES.ADMIN.DASHBOARD}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3.5 py-2 rounded-md font-semibold text-[#c2652a] bg-[#faefe4]"
                  >
                    Trang Quản Trị Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-md"
                >
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 block text-center px-3.5 py-2 rounded-full font-semibold text-[#c2652a] border border-[#c2652a]/30 hover:bg-[#faefe4]"
              >
                Đăng Nhập / Đăng Ký
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export const Header = Navbar;
export default Navbar;

import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../../context';
import { MemberDropdown } from './MemberDropdown';
import { ROUTES } from '../../constants';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();

  // Nhận diện active: Bộ Sưu Tập Tác Phẩm sẽ active cả khi xem chi tiết tác phẩm (/product, /products/:id, /collection)
  const isCollectionActive =
    location.pathname.startsWith('/collection') ||
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/product');

  // Gạch chân màu cam dưới chữ khi active, không dùng viên thuốc cam nền
  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'relative py-2 px-3 text-[#26201b] font-semibold border-b-2 border-[#c2652a] transition-all'
      : 'relative py-2 px-3 text-[#524337] hover:text-[#26201b] border-b-2 border-transparent hover:border-[#c2652a]/40 transition-all font-medium';

  const collectionLinkClass = isCollectionActive
    ? 'relative py-2 px-3 text-[#26201b] font-semibold border-b-2 border-[#c2652a] transition-all'
    : 'relative py-2 px-3 text-[#524337] hover:text-[#26201b] border-b-2 border-transparent hover:border-[#c2652a]/40 transition-all font-medium';

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? 'py-2 px-3 text-[#26201b] font-semibold border-l-2 border-[#c2652a] bg-[#f0e7dc]/40 transition-all'
      : 'py-2 px-3 text-[#524337] hover:text-[#26201b] transition-all font-medium';

  const mobileCollectionLinkClass = isCollectionActive
    ? 'py-2 px-3 text-[#26201b] font-semibold border-l-2 border-[#c2652a] bg-[#f0e7dc]/40 transition-all'
    : 'py-2 px-3 text-[#524337] hover:text-[#26201b] transition-all font-medium';

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

        {/* Danh Mục Điều Hướng Giữa (Navigation Links: Trang Chủ, Bộ Sưu Tập, Lịch Sử Đơn Hàng, Đặt Đơn Hàng) */}
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
            Đặt Đơn Hàng
          </NavLink>
        </nav>

        {/* Cụm Thao Tác Phải (Giỏ hàng, Hội viên, Mobile Toggle) */}
        <div className="flex items-center space-x-2.5">
          {/* Nút Giỏ Hàng (chỉ icon và số đếm, không để chữ Giỏ Hàng) */}
          <Link
            to={ROUTES.CART}
            title="Giỏ hàng"
            aria-label="Giỏ hàng"
            className="relative flex items-center justify-center w-9 h-9 rounded-full border border-[#ded0c0] bg-white text-[#26201b] hover:border-[#c2652a] hover:text-[#c2652a] transition-all shadow-xs group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#c2652a] text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-xs">
              {totalItems || 0}
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
              className={mobileNavLinkClass}
            >
              Trang Chủ
            </NavLink>
            <NavLink
              to={ROUTES.COLLECTION}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileCollectionLinkClass}
            >
              Bộ Sưu Tập Tác Phẩm
            </NavLink>
            <NavLink
              to={ROUTES.MY_ORDERS}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Lịch Sử Đơn Hàng
            </NavLink>
            <NavLink
              to={ROUTES.CHECKOUT}
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Đặt Đơn Hàng
            </NavLink>

            {isAuthenticated ? (
              <div className="pt-2 border-t border-[#e8d5c4] mt-2 space-y-1">
                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3.5 py-2 rounded-md text-[#524337] hover:bg-[#faefe4]"
                >
                  Quản Lý Hồ Sơ Cá Nhân
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
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await logout();
                    navigate(ROUTES.LOGIN);
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

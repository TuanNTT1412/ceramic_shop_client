import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../../context';
import { ROUTES } from '../../constants';

export const AdminDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Đóng dropdown khi click ra ngoài vùng hiển thị
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    toast.success('Đã đăng xuất khỏi phiên quản trị.');
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 1. NÚT KÍCH HOẠT (ĐỒNG NHẤT 100% KIỂU DÁNG VỚI BÊN KHÁCH HÀNG) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 text-xs font-medium cursor-pointer ${
          isOpen
            ? 'border-[#c2652a] bg-[#faefe4] text-[#c2652a] shadow-sm'
            : 'border-[#ded0c0] bg-white text-[#26201b] hover:border-[#c2652a]/50 hover:bg-[#faf6f0]'
        }`}
        aria-expanded={isOpen}
      >
        {/* Avatar tròn nhỏ */}
        <div className="w-5 h-5 rounded-full bg-[#faefe4] border border-[#ebd8c8] flex items-center justify-center text-[#c2652a] text-[10px] font-bold">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
        </div>

        {/* Tên quản trị viên */}
        <span className="font-sans font-medium max-w-[110px] truncate">
          {user?.name || 'Quản Trị Viên'}
        </span>

        {/* Mũi tên xổ xuống */}
        <svg
          className={`w-3.5 h-3.5 text-[#8a705b] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#c2652a]' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 2. MENU DROPDOWN PANEL (ĐỒNG NHẤT KHUNG & PHONG CÁCH) */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-[#faf6f0]/95 backdrop-blur-xl border border-[#e6dcce] shadow-[0_12px_36px_rgba(90,60,40,0.14)] z-50 p-2 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right animate-scaleUp">
          {/* Thông tin tài khoản ngắn gọn */}
          <div className="px-3 py-2 border-b border-[#ebdcd0] mb-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-xs text-[#26201b] truncate">
                {user?.name || 'Quản Trị Viên'}
              </p>
              <span className="text-[9px] bg-[#c2652a]/10 text-[#c2652a] px-1.5 py-0.5 rounded font-mono font-bold">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-[#8a705b] truncate">
              {user?.email || 'admin@gommoc.vn'}
            </p>
          </div>

          {/* DANH SÁCH MENU ĐIỀU HƯỚNG QUẢN TRỊ */}
          <div className="space-y-1 text-xs">
            {/* Mục 1: Hồ sơ cá nhân */}
            <Link
              to={ROUTES.PROFILE}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#26201b] hover:bg-white hover:text-[#c2652a] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#f0e5d8] group-hover:bg-[#faefe4] flex items-center justify-center text-[#735e4d] group-hover:text-[#c2652a] transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold leading-tight">Quản Lý Hồ Sơ Cá Nhân</div>
                <div className="text-[10px] text-[#8a705b] mt-0.5">Thông tin tài khoản & mật khẩu</div>
              </div>
              <svg
                className="w-3.5 h-3.5 text-[#b09b8b] group-hover:text-[#c2652a] group-hover:translate-x-0.5 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Mục 2: Xem cửa hàng bán lẻ */}
            <Link
              to={ROUTES.HOME}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#26201b] hover:bg-white hover:text-[#c2652a] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#f0e5d8] group-hover:bg-[#faefe4] flex items-center justify-center text-[#735e4d] group-hover:text-[#c2652a] transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold leading-tight">Xem Cửa Hàng Bán Lẻ</div>
                <div className="text-[10px] text-[#8a705b] mt-0.5">Mở trang khách hàng trong tab mới</div>
              </div>
              <span className="material-symbols-outlined text-[15px] text-[#8a705b] group-hover:text-[#c2652a]">
                open_in_new
              </span>
            </Link>

            {/* Mục 3: Đăng xuất */}
            <div className="pt-1 border-t border-[#ebdcd0]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors group cursor-pointer text-left font-medium"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center text-rose-600 transition-colors shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold leading-tight">Đăng Xuất Quản Trị</div>
                  <div className="text-[10px] text-rose-400 mt-0.5">Kết thúc phiên làm việc an toàn</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDropdown;


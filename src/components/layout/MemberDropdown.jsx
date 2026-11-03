import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useToast } from '../../context';
import { ROUTES } from '../../constants';

export const MemberDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const toast = useToast();

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

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    toast.success('Đã đăng xuất tài khoản thành công.');
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 1. NÚT KÍCH HOẠT HỘI VIÊN */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 text-xs font-medium ${
          isOpen
            ? 'border-[#c2652a] bg-[#faefe4] text-[#c2652a] shadow-sm'
            : 'border-[#ded0c0] bg-white text-[#26201b] hover:border-[#c2652a]/50 hover:bg-[#faf6f0]'
        }`}
        aria-expanded={isOpen}
      >
        <div className="w-5 h-5 rounded-full bg-[#faefe4] border border-[#ebd8c8] flex items-center justify-center text-[#c2652a]">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <span className="font-sans font-medium max-w-[85px] truncate">
          {isAuthenticated ? user?.name || 'Hội Viên' : 'Hội Viên'}
        </span>
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

      {/* 2. MENU DROPDOWN PANEL (TINH GIẢN, GỌN GÀNG) */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-[#faf6f0]/95 backdrop-blur-xl border border-[#e6dcce] shadow-[0_12px_36px_rgba(90,60,40,0.14)] z-50 p-2 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right animate-scaleUp">
          {/* Thông tin tài khoản ngắn gọn (khi đã đăng nhập) */}
          {isAuthenticated && (
            <div className="px-3 py-2 border-b border-[#ebdcd0] mb-1">
              <p className="font-semibold text-xs text-[#26201b] truncate">{user?.name}</p>
              <p className="text-[10px] text-[#8a705b] truncate">{user?.email}</p>
            </div>
          )}

          {/* DANH SÁCH MENU ĐIỀU HƯỚNG */}
          <div className="space-y-1 text-xs">
            {/* Nếu chưa đăng nhập: Mục Đăng Nhập */}
            {!isAuthenticated && (
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#c2652a] font-semibold hover:bg-[#faefe4] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#faefe4] flex items-center justify-center text-[#c2652a] shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="leading-tight">Đăng Nhập</div>
                  <div className="text-[10px] text-[#8a705b] font-normal mt-0.5">Truy cập hồ sơ & đơn mua</div>
                </div>
                <svg
                  className="w-3.5 h-3.5 text-[#c2652a] group-hover:translate-x-0.5 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            {/* Mục 1: Quản lý hồ sơ cá nhân */}
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
                <div className="font-semibold leading-tight">Hồ Sơ & Bộ Sưu Tập</div>
                <div className="text-[10px] text-[#8a705b] mt-0.5">Tác phẩm yêu thích & sổ địa chỉ</div>
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

            {/* Mục 2: Lịch sử đơn hàng & Chứng thư */}
            <Link
              to={ROUTES.MY_ORDERS}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#26201b] hover:bg-white hover:text-[#c2652a] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#f0e5d8] group-hover:bg-[#faefe4] flex items-center justify-center text-[#735e4d] group-hover:text-[#c2652a] transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold leading-tight">Đơn Hàng Của Tôi</div>
                <div className="text-[10px] text-[#8a705b] mt-0.5">Tiến độ xuất lò & mã ấn triện</div>
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

            {/* Mục 3: Cổng Quản Trị Xưởng Gốm (Admin Portal) */}
            {isAdmin && (
              <div className="pt-1 border-t border-[#ebdcd0]">
                <Link
                  to={ROUTES.ADMIN.DASHBOARD}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#faefe4] text-[#c2652a] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#ebdcd0] group-hover:bg-white flex items-center justify-center text-[#c2652a] transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-xs text-[#26201b] group-hover:text-[#c2652a]">
                      Cổng Quản Trị Xưởng
                    </div>
                    <div className="text-[10px] text-[#8a705b]">
                      Dành cho Quản trị viên
                    </div>
                  </div>
                  <span className="text-[9px] bg-[#c2652a]/10 text-[#c2652a] px-1.5 py-0.5 rounded font-mono font-semibold">
                    ADMIN
                  </span>
                </Link>
              </div>
            )}

            {/* Mục 4: Đăng Xuất (khi đã đăng nhập) */}
            {isAuthenticated && (
              <div className="pt-1 border-t border-[#ebdcd0]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                  <div className="font-semibold text-xs">Đăng Xuất Tài Khoản</div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDropdown;

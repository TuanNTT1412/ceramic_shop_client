import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const AdminSidebar = ({
  isCollapsed = false,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    {
      to: ROUTES.ADMIN.DASHBOARD,
      label: 'Tổng Quan Hệ Thống',
      icon: 'dashboard',
      badge: null,
      end: true,
    },
    {
      to: ROUTES.ADMIN.PRODUCTS,
      label: 'Quản Lý Sản Phẩm',
      icon: 'inventory_2',
      badge: null,
    },
    {
      to: ROUTES.ADMIN.CATEGORIES,
      label: 'Quản Lý Danh Mục',
      icon: 'category',
      badge: null,
    },
    {
      to: ROUTES.ADMIN.ORDERS,
      label: 'Quản Lý Đơn Hàng',
      icon: 'receipt_long',
      badge: 'Mới',
    },
    {
      to: ROUTES.ADMIN.USERS,
      label: 'Khách Hàng & Tài Khoản',
      icon: 'group',
      badge: null,
    },
    {
      to: ROUTES.ADMIN.REVIEWS,
      label: 'Đánh Giá & Phản Hồi',
      icon: 'rate_review',
      badge: '08',
    },
  ];

  const getNavLinkClass = ({ isActive }) => {
    const base =
      'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-label font-medium transition-all group relative ';
    if (isActive) {
      return (
        base +
        'bg-primary-container text-on-primary-container font-semibold shadow-xs'
      );
    }
    return (
      base +
      'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-full bg-surface-container-low z-50 flex flex-col justify-between py-5 border-r border-outline-variant/30 transition-all duration-300 shadow-[0_2px_16px_rgba(58,48,42,0.04)] ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Logo / Brand Header */}
          <div className="px-5 flex items-center gap-3">
            <Link
              to={ROUTES.ADMIN.DASHBOARD}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline text-2xl font-bold shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                M
              </div>
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="font-headline text-lg font-bold tracking-tight text-on-surface leading-tight">
                    GỐM MỘC
                  </span>
                  <span className="text-[10px] font-label tracking-wider uppercase text-on-surface-variant">
                    Hệ Thống Quản Trị
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col px-3 space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onCloseMobile}
                className={getNavLinkClass}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary shrink-0">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;


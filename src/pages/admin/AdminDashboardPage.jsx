import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const AdminDashboardPage = () => {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* Top Greeting & Quick Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-primary font-label">
            Bảng điều khiển quản trị
          </span>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight mt-1">
            Tổng Quan Hệ Thống Gốm Mộc
          </h1>
          <p className="text-xs text-on-surface-variant font-body mt-1">
            Chào mừng trở lại! Theo dõi lưu lượng đơn hàng, sản phẩm và danh mục xưởng nung.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.ADMIN.CATEGORIES}
            className="px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-label font-semibold transition-colors"
          >
            <span>Xem Danh Mục</span>
          </Link>
          <Link
            to={ROUTES.ADMIN.ORDERS}
            className="px-4 py-2.5 rounded-lg bg-primary hover:bg-[#a8531e] text-on-primary text-xs font-label font-semibold transition-all shadow-sm"
          >
            <span>Quản Lý Đơn Hàng</span>
          </Link>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-surface-container-low rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-label uppercase tracking-wider text-on-surface-variant">
              Tổng Đơn Hôm Nay
            </span>
            <span className="font-sans text-3xl font-bold text-on-surface mt-1">
              12
            </span>
            <span className="text-[10px] text-emerald-600 font-medium mt-1">
              ↑ +20% so với hôm qua
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-label uppercase tracking-wider text-on-surface-variant">
              Tác Phẩm Đang Bán
            </span>
            <span className="font-sans text-3xl font-bold text-on-surface mt-1">
              48
            </span>
            <span className="text-[10px] text-on-surface-variant mt-1">
              Trong 6 nhóm danh mục
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-label uppercase tracking-wider text-on-surface-variant">
              Danh Mục Hoạt Động
            </span>
            <span className="font-sans text-3xl font-bold text-on-surface mt-1">
              06
            </span>
            <span className="text-[10px] text-primary font-medium mt-1">
              Đồng bộ 100% storefront
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-label uppercase tracking-wider text-on-surface-variant">
              Doanh Thu Ước Tính
            </span>
            <span className="font-sans text-2xl font-bold text-primary mt-1">
              18.450.000đ
            </span>
            <span className="text-[10px] text-emerald-600 font-medium mt-1">
              Tuần này
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;


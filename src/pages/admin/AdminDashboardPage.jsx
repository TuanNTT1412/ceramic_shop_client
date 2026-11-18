import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const AdminDashboardPage = () => {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn pb-16">
      {/* ========================================================= */}
      {/* 0. HEADER CONTEXT                                         */}
      {/* ========================================================= */}
      <div className="pb-6 border-b border-outline-variant/30">
        <div>
          <h1 className="text-3xl lg:text-4xl font-headline font-bold text-on-surface tracking-tight">
            Tổng Quan Hệ Thống Gốm Mộc
          </h1>
          <p className="max-w-2xl text-xs md:text-sm text-on-surface-variant font-body mt-1 leading-relaxed">
            Tổng hợp toàn diện chỉ số kinh doanh, kho tác phẩm, điều vận đơn hàng và thẩm định từ trà hữu.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. KHU VỰC: DOANH THU & VẬN HÀNH ĐƠN HÀNG                  */}
      {/* ========================================================= */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-primary rounded-full"></span>
            <h2 className="text-base font-headline font-bold text-on-surface">
              Chỉ Số Đơn Hàng &amp; Doanh Thu
            </h2>
          </div>
          <Link
            to={ROUTES.ADMIN.ORDERS}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
          >
            <span>Chi tiết đơn hàng</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Doanh thu */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-label font-semibold uppercase tracking-wider text-on-surface-variant">
                  Doanh thu tuần này
                </span>
                <div className="text-xl font-headline font-bold text-primary mt-1">
                  18.450.000 đ
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[19px]">payments</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-emerald-700 font-medium flex items-center gap-1 border-t border-outline-variant/20 pt-2">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+14.2% so với kỳ trước</span>
            </div>
          </div>

          {/* Tổng đơn hàng */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-label font-semibold uppercase tracking-wider text-on-surface-variant">
                  Tổng đơn hàng
                </span>
                <div className="text-2xl font-headline font-bold text-on-surface mt-1">
                  18 <span className="text-xs font-normal text-on-surface-variant">đơn</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[19px]">receipt_long</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-on-surface-variant flex items-center justify-between border-t border-outline-variant/20 pt-2">
              <span>Đã hoàn thành:</span>
              <span className="font-bold text-emerald-800">14 đơn</span>
            </div>
          </div>

          {/* Chờ xác nhận */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-label font-semibold uppercase tracking-wider text-primary">
                  Chờ duyệt (PENDING)
                </span>
                <div className="text-2xl font-headline font-bold text-primary mt-1">
                  03 <span className="text-xs font-normal text-on-surface-variant">đơn</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
                <span className="material-symbols-outlined text-[19px]">pending_actions</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-on-surface-variant flex items-center justify-between border-t border-outline-variant/20 pt-2">
              <span className="text-tertiary font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span> Cần xử lý
              </span>
              <span className="font-semibold text-on-surface">03 đơn mới</span>
            </div>
          </div>

          {/* Đang giao */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-label font-semibold uppercase tracking-wider text-on-surface-variant">
                  Đang giao (SHIPPING)
                </span>
                <div className="text-2xl font-headline font-bold text-on-surface mt-1">
                  04 <span className="text-xs font-normal text-on-surface-variant">kiện</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[19px]">local_shipping</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-on-surface-variant flex items-center justify-between border-t border-outline-variant/20 pt-2">
              <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                94% đúng hạn
              </span>
              <span className="font-medium text-secondary">GHTK, Viettel</span>
            </div>
          </div>

          {/* Nhận tại xưởng */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-label font-semibold uppercase tracking-wider text-on-surface-variant">
                  Tại Showroom (PICKUP)
                </span>
                <div className="text-2xl font-headline font-bold text-on-surface mt-1">
                  02 <span className="text-xs font-normal text-on-surface-variant">khách</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[19px]">storefront</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-on-surface-variant flex items-center justify-between border-t border-outline-variant/20 pt-2">
              <span>Kệ trả gốm VIP:</span>
              <span className="font-semibold text-primary">Showroom HN</span>
            </div>
          </div>
        </div>

        {/* 3 Thẻ Nhật ký Showroom, Đối tác vận chuyển & Chất lượng xuất xưởng */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-1">
          {/* Card 1: Showroom */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  Nhật Ký Nhận Tại Showroom
                </h3>
                <span className="material-symbols-outlined text-primary text-[20px]">store</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Khách ghé trải nghiệm gốm &amp; lấy đơn chuẩn bị sẵn.
              </p>
              <div className="mt-3.5 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface-container-low">
                  <div className="flex justify-between items-center text-on-surface">
                    <span className="font-mono font-semibold">ORD-241028-0865</span>
                    <span className="text-[10px] text-emerald-800 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                      Đã nhận 10:05
                    </span>
                  </div>
                  <div className="text-on-surface-variant text-[11px] mt-0.5">
                    Khách: Phạm Minh Châu • NV: Mai Anh
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-low">
                  <div className="flex justify-between items-center text-on-surface">
                    <span className="font-mono font-semibold">ORD-241028-0861</span>
                    <span className="text-[10px] text-emerald-800 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                      Đã nhận 08:30
                    </span>
                  </div>
                  <div className="text-on-surface-variant text-[11px] mt-0.5">
                    Khách: Hoàng Đức Hải • NV: Quốc Huy
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Lượt khách nhận hôm nay:</span>
              <span className="font-bold text-primary">08 lượt hoàn tất</span>
            </div>
          </div>

          {/* Card 2: Vận chuyển */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  Đối Tác Vận Chuyển Gốm
                </h3>
                <span className="material-symbols-outlined text-primary text-[20px]">
                  local_shipping
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Bảo hiểm bể vỡ gốm mộc đạt tiêu chuẩn 100%.
              </p>
              <div className="mt-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
                  <span className="font-semibold text-on-surface">Giao Hàng Tiết Kiệm (GHTK)</span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    98.5% an toàn
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
                  <span className="font-semibold text-on-surface">Viettel Post (VTP)</span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    97.8% an toàn
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Tỷ lệ hoàn hàng:</span>
              <span className="font-bold text-emerald-800">&lt; 0.8%</span>
            </div>
          </div>

          {/* Card 3: Chất lượng xuất xưởng */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  Chất Lượng Xuất Xưởng
                </h3>
                <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Quy chuẩn đóng gói 5 lớp rơm phong hóa tự nhiên.
              </p>
              <div className="mt-3.5 space-y-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700 text-[16px]">check</span>
                  <span>Kiểm tra triện son &amp; chứng thư giấy dó đáy bình</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700 text-[16px]">check</span>
                  <span>Bọc nẹp mây đa lớp chống va đập góc cạnh</span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Trạng thái lò nung:</span>
              <span className="font-bold text-primary">Nung liên tục 1.300°C</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. KHU VỰC: KHO TÁC PHẨM & BIẾN THỂ SKU                    */}
      {/* ========================================================= */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-primary rounded-full"></span>
            <h2 className="text-base font-headline font-bold text-on-surface">
              Kho Tác Phẩm &amp; Tồn Kho Men Nung
            </h2>
          </div>
          <Link
            to={ROUTES.ADMIN.PRODUCTS}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
          >
            <span>Quản lý tác phẩm</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Tổng tác phẩm */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary font-label">
                Tổng tác phẩm gốc
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-3xl font-sans font-bold text-on-surface tracking-tight">
                17
              </span>
              <span className="text-xs text-secondary font-body">mã tác phẩm</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
              <span>Tăng <strong className="text-primary font-bold">+4 mẫu</strong> tuần này</span>
            </div>
          </div>

          {/* Card 2: Đang mở bán */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary font-label">
                Đang mở bán
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-3xl font-sans font-bold text-primary tracking-tight">
                17
              </span>
              <span className="text-xs text-secondary font-body">tác phẩm kích hoạt</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center gap-1.5 text-xs text-secondary font-medium">
              <span><strong className="text-on-surface font-bold">100.0%</strong> tỷ lệ hiển thị storefront</span>
            </div>
          </div>

          {/* Card 3: Tổng biến thể SKU */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary font-label">
                Tổng biến thể SKU
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-3xl font-sans font-bold text-on-surface tracking-tight">
                27
              </span>
              <span className="text-xs text-secondary font-body">quy cách men / size</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
              <span>Đồng bộ chuẩn 4 góc &amp; video 360°</span>
            </div>
          </div>

          {/* Card 4: Cảnh báo tồn kho */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary font-label">
                Cảnh báo tồn kho
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-3xl font-sans font-bold text-tertiary tracking-tight">
                02
              </span>
              <span className="text-xs text-secondary font-body">SKU cạn kho đất nung</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center gap-1.5 text-xs text-tertiary font-medium">
              <span>Cần lên lịch nung mẻ bổ sung</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. KHU VỰC: DANH MỤC & ĐÁNH GIÁ & KHÁCH HÀNG              */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nhóm Danh Mục */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[19px]">category</span>
                <h3 className="font-headline font-bold text-sm text-on-surface">Phân Loại Danh Mục</h3>
              </div>
              <Link to={ROUTES.ADMIN.CATEGORIES} className="text-xs text-primary font-semibold hover:underline">
                Xem tất cả
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Tổng số nhóm danh mục:</span>
                <span className="font-bold text-on-surface text-base">07 nhóm</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Nhóm nhiều tác phẩm nhất:</span>
                <span className="font-bold text-primary truncate max-w-[140px]">Bình Hoa Dáng Cổ</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Dòng men nung chủ lực:</span>
                <span className="font-semibold text-on-surface">Men Tro Củi, Sa Thạch</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
            Đồng bộ 100% với cây phân cấp trên cửa hàng
          </div>
        </div>

        {/* Nhóm Đánh Giá & Thẩm Định */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[19px]">star</span>
                <h3 className="font-headline font-bold text-sm text-on-surface">Thẩm Định &amp; Đánh Giá</h3>
              </div>
              <Link to={ROUTES.ADMIN.REVIEWS} className="text-xs text-primary font-semibold hover:underline">
                Xem đánh giá
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Điểm trung bình toàn xưởng:</span>
                <div className="flex items-center gap-1 font-bold text-amber-600 text-base">
                  <span>4.8</span>
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Tổng số lời thẩm định:</span>
                <span className="font-bold text-on-surface">48 đánh giá</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Chờ nghệ nhân phản hồi:</span>
                <span className="font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">03 đánh giá</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/20 text-[11px] text-emerald-700 font-medium">
            36 đánh giá có kèm ảnh chụp nung thực tế
          </div>
        </div>

        {/* Nhóm Khách Hàng & Nhân Sự */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[19px]">group</span>
                <h3 className="font-headline font-bold text-sm text-on-surface">Khách Hàng &amp; Nhân Sự</h3>
              </div>
              <Link to={ROUTES.ADMIN.USERS} className="text-xs text-primary font-semibold hover:underline">
                Xem tài khoản
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Tổng tài khoản hệ thống:</span>
                <span className="font-bold text-on-surface text-base">342 người</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Hội viên trà hữu mua hàng:</span>
                <span className="font-bold text-emerald-800">328 khách</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Thợ gốm &amp; Ban quản trị:</span>
                <span className="font-semibold text-on-surface">14 tài khoản</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
            Tất cả tài khoản đang kích hoạt và bảo mật JWT
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
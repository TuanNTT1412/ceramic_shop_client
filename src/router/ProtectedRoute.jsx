import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useToast } from '../context';
import { ROUTES } from '../constants';

/**
 * Route Guard bảo vệ các trang yêu cầu đăng nhập hoặc quyền Admin
 * Theo chuẩn thực tế: Toast thông báo + Điều hướng đến /login kèm query redirect để sau khi đăng nhập sẽ quay lại đúng vị trí
 *
 * @param {React.ReactNode} children - Giao diện trang được bảo vệ
 * @param {boolean} requireAdmin - Bắt buộc tài khoản có quyền ADMIN
 * @param {string} customRedirect - Đường dẫn trang xác thực (mặc định ROUTES.LOGIN)
 */
export const ProtectedRoute = ({
  children,
  requireAdmin = false,
  customRedirect = ROUTES.LOGIN,
}) => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const toast = useToast();
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      toast.warning('Vui lòng đăng nhập để tiếp tục truy cập tính năng này');
    } else if (isAuthenticated && requireAdmin && !isAdmin && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      toast.error('Bạn không có quyền truy cập khu vực Quản trị viên');
    }
  }, [isLoading, isAuthenticated, requireAdmin, isAdmin, toast]);

  // Đang kiểm tra token / tải profile từ server
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-background font-body">
        <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">
          Đang xác thực phiên làm việc...
        </p>
      </div>
    );
  }

  // 1. Trường hợp chưa đăng nhập: chuyển hướng về Auth kèm redirect query param
  if (!isAuthenticated) {
    const currentPath = location.pathname + location.search;
    const redirectParam = encodeURIComponent(currentPath);
    return (
      <Navigate
        to={`${customRedirect}?redirect=${redirectParam}`}
        replace
        state={{ from: location }}
      />
    );
  }

  // 2. Trường hợp trang Admin nhưng tài khoản không có quyền Admin: điều hướng về Trang Chủ
  if (requireAdmin && !isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // 3. Đã xác thực đầy đủ quyền hạn
  return children;
};

export default ProtectedRoute;


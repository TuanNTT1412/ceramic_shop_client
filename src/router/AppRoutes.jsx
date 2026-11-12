import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CustomerLayout, AdminLayout } from '../components/layout';
import { HomePage } from '../pages/customer/HomePage';
import { CollectionPage } from '../pages/customer/CollectionPage';
import { CartPage } from '../pages/customer/CartPage';
import { CheckoutPage } from '../pages/customer/CheckoutPage';
import { ProductDetailPage } from '../pages/customer/ProductDetailPage';
import { MyOrdersPage } from '../pages/customer/MyOrdersPage';
import { ProfilePage } from '../pages/customer/ProfilePage';
import { AuthPage } from '../pages/auth/AuthPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminReviewsPage } from '../pages/admin/AdminReviewsPage';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from '../constants';

/**
 * Quản lý tập trung toàn bộ hệ thống định tuyến (Routing) của ứng dụng
 * Tách biệt rõ ràng giữa Tuyến đường Công khai (Public), Bảo vệ Khách hàng (Protected), và Bảo vệ Quản trị (Admin Guard)
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* ======================================================== */}
      {/* 1. PUBLIC ROUTES (DÀNH CHO TẤT CẢ KHÁCH THƯỞNG LÃM)      */}
      {/* ======================================================== */}
      <Route
        path={ROUTES.HOME}
        element={
          <CustomerLayout>
            <HomePage />
          </CustomerLayout>
        }
      />

      {/* Bộ sưu tập tác phẩm gốm mộc */}
      <Route
        path={ROUTES.PRODUCTS}
        element={
          <CustomerLayout>
            <CollectionPage />
          </CustomerLayout>
        }
      />
      <Route
        path={ROUTES.COLLECTION}
        element={
          <CustomerLayout>
            <CollectionPage />
          </CustomerLayout>
        }
      />

      {/* Chi tiết từng tác phẩm */}
      <Route
        path={ROUTES.PRODUCT_DETAIL}
        element={
          <CustomerLayout>
            <ProductDetailPage />
          </CustomerLayout>
        }
      />
      <Route
        path="/product/:id"
        element={
          <CustomerLayout>
            <ProductDetailPage />
          </CustomerLayout>
        }
      />
      <Route
        path={ROUTES.PRODUCT}
        element={
          <CustomerLayout>
            <ProductDetailPage />
          </CustomerLayout>
        }
      />

      {/* Giỏ hàng tác phẩm */}
      <Route
        path={ROUTES.CART}
        element={
          <CustomerLayout>
            <CartPage />
          </CustomerLayout>
        }
      />

      {/* Đăng nhập & Đăng ký tài khoản */}
      <Route path={ROUTES.LOGIN} element={<AuthPage initialTab="login" />} />
      <Route path="/auth" element={<AuthPage initialTab="login" />} />
      <Route path={ROUTES.REGISTER} element={<AuthPage initialTab="register" />} />

      {/* ======================================================== */}
      {/* 2. PROTECTED CUSTOMER ROUTES (BẮT BUỘC ĐĂNG NHẬP)        */}
      {/* ======================================================== */}
      {/* Tiến trình Đặt hàng & Thanh toán (Checkout) */}
      <Route
        path={ROUTES.CHECKOUT}
        element={
          <ProtectedRoute>
            <CustomerLayout>
              <CheckoutPage />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      {/* Lịch sử đơn hàng của tôi */}
      <Route
        path={ROUTES.MY_ORDERS}
        element={
          <ProtectedRoute>
            <CustomerLayout>
              <MyOrdersPage />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <CustomerLayout>
              <MyOrdersPage />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/story"
        element={
          <ProtectedRoute>
            <CustomerLayout>
              <MyOrdersPage />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      {/* Hồ sơ cá nhân & Sổ địa chỉ giao nhận */}
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <CustomerLayout>
              <ProfilePage />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      {/* ======================================================== */}
      {/* 3. PROTECTED ADMIN ROUTES (BẮT BUỘC ĐĂNG NHẬP + ROLE ADMIN)*/}
      {/* ======================================================== */}
      <Route
        path={ROUTES.ADMIN.DASHBOARD}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN.CATEGORIES}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminCategoriesPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN.PRODUCTS}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminProductsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN.ORDERS}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminOrdersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN.USERS}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN.REVIEWS}
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminReviewsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminReviewsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/danh-gia"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminReviewsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ======================================================== */}
      {/* 4. CATCH-ALL ROUTE (TUYẾN ĐƯỜNG DỰ PHÒNG 404)           */}
      {/* ======================================================== */}
      <Route
        path="*"
        element={
          <CustomerLayout>
            <HomePage />
          </CustomerLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;


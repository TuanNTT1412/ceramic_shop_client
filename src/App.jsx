import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider, AuthProvider, CartProvider } from './context';
import { CustomerLayout } from './components/layout';
import { HomePage } from './pages/customer/HomePage';
import { CollectionPage } from './pages/customer/CollectionPage';
import { CartPage } from './pages/customer/CartPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { MyOrdersPage } from './pages/customer/MyOrdersPage';
import { AuthPage } from './pages/auth/AuthPage';
import { ROUTES } from './constants';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Trang chủ khách hàng */}
              <Route
                path={ROUTES.HOME}
                element={
                  <CustomerLayout>
                    <HomePage />
                  </CustomerLayout>
                }
              />

              {/* Bộ sưu tập tác phẩm */}
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

              {/* Chi tiết tác phẩm gốm mộc */}
              <Route
                path={ROUTES.PRODUCT_DETAIL}
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

              {/* Giỏ hàng */}
              <Route
                path={ROUTES.CART}
                element={
                  <CustomerLayout>
                    <CartPage />
                  </CustomerLayout>
                }
              />

              {/* Lịch sử đơn hàng */}
              <Route
                path={ROUTES.MY_ORDERS}
                element={
                  <CustomerLayout>
                    <MyOrdersPage />
                  </CustomerLayout>
                }
              />
              <Route
                path="/orders"
                element={
                  <CustomerLayout>
                    <MyOrdersPage />
                  </CustomerLayout>
                }
              />
              <Route
                path="/story"
                element={
                  <CustomerLayout>
                    <MyOrdersPage />
                  </CustomerLayout>
                }
              />

              {/* Đăng nhập & Đăng ký tài khoản */}
              <Route path={ROUTES.LOGIN} element={<AuthPage initialTab="login" />} />
              <Route path={ROUTES.REGISTER} element={<AuthPage initialTab="register" />} />

              {/* Tuyến đường dự phòng */}
              <Route
                path="*"
                element={
                  <CustomerLayout>
                    <HomePage />
                  </CustomerLayout>
                }
              />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

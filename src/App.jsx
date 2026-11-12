import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider, AuthProvider, CartProvider } from './context';
import { AppRoutes } from './router';

/**
 * Ứng dụng Gốm Mộc Sahara - Cấu trúc tầng Providers & Routing chuẩn mực Clean Code
 */
export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

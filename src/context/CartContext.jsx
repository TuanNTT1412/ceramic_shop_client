import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { getErrorMessage } from '../utils/format';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [cartState, setCartState] = useState({
    cartId: null,
    items: [],
    totalItems: 0,
    totalAvailableItems: 0,
    totalPrice: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Tải lại toàn bộ giỏ hàng từ máy chủ
   */
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartState({
        cartId: null,
        items: [],
        totalItems: 0,
        totalAvailableItems: 0,
        totalPrice: 0,
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await cartApi.getMyCart();
      if (res?.data) {
        setCartState({
          cartId: res.data.cartId,
          items: res.data.items || [],
          totalItems: res.data.totalItems || 0,
          totalAvailableItems: res.data.totalAvailableItems || 0,
          totalPrice: res.data.totalPrice || 0,
        });
      }
    } catch (err) {
      console.warn('Lỗi tải giỏ hàng:', err?.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Tự động tải giỏ hàng khi người dùng đăng nhập hoặc làm mới trang
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /**
   * Thêm sản phẩm (biến thể gốm) vào giỏ hàng
   * @param {string} variantId
   * @param {number} quantity
   */
  const addToCart = useCallback(
    async (variantId, quantity = 1) => {
      if (!isAuthenticated) {
        toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        return false;
      }

      setIsLoading(true);
      try {
        await cartApi.addToCart({ variantId, quantity });
        await fetchCart();
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        return true;
      } catch (err) {
        toast.error(getErrorMessage(err, 'Không thể thêm vào giỏ hàng'));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, fetchCart, toast]
  );

  /**
   * Cập nhật số lượng của một mục trong giỏ
   * @param {string} itemId
   * @param {number} quantity
   */
  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      if (quantity <= 0) {
        return removeItem(itemId);
      }

      setIsLoading(true);
      try {
        await cartApi.updateCartItem(itemId, quantity);
        await fetchCart();
        return true;
      } catch (err) {
        toast.error(getErrorMessage(err, 'Lỗi cập nhật số lượng'));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCart, toast]
  );

  /**
   * Xóa một mục khỏi giỏ hàng
   * @param {string} itemId
   */
  const removeItem = useCallback(
    async (itemId) => {
      setIsLoading(true);
      try {
        await cartApi.removeCartItem(itemId);
        await fetchCart();
        toast.info('Đã xóa sản phẩm khỏi giỏ hàng');
        return true;
      } catch (err) {
        toast.error(getErrorMessage(err, 'Lỗi xóa sản phẩm'));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCart, toast]
  );

  /**
   * Xóa tất cả sản phẩm hết hàng hoặc ngừng kinh doanh
   */
  const clearUnavailable = useCallback(async () => {
    setIsLoading(true);
    try {
      await cartApi.clearUnavailableItems();
      await fetchCart();
      toast.info('Đã dọn dẹp các sản phẩm không khả dụng');
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Lỗi dọn giỏ hàng'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart, toast]);

  /**
   * Xóa sạch toàn bộ giỏ hàng
   */
  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      await cartApi.clearCart();
      setCartState({
        cartId: null,
        items: [],
        totalItems: 0,
        totalAvailableItems: 0,
        totalPrice: 0,
      });
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Lỗi làm rỗng giỏ hàng'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const value = {
    cartState,
    cartId: cartState.cartId,
    items: cartState.items,
    totalItems: cartState.totalItems,
    totalAvailableItems: cartState.totalAvailableItems,
    totalPrice: cartState.totalPrice,
    isLoading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearUnavailable,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;

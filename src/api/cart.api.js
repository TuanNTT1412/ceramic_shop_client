import client from './client';

export const cartApi = {
  /**
   * Lấy giỏ hàng của tài khoản đang đăng nhập
   */
  getMyCart: () => client.get('/cart'),

  /**
   * Thêm biến thể gốm sứ vào giỏ hàng
   * @param {{ variantId: string, quantity: number }} data
   */
  addToCart: (data) => client.post('/cart/items', data),

  /**
   * Cập nhật số lượng của một mục trong giỏ
   * @param {string} itemId
   * @param {number} quantity
   */
  updateCartItem: (itemId, quantity) => client.patch(`/cart/items/${itemId}`, { quantity }),

  /**
   * Xóa một mục khỏi giỏ hàng
   * @param {string} itemId
   */
  removeCartItem: (itemId) => client.delete(`/cart/items/${itemId}`),

  /**
   * Xóa toàn bộ sản phẩm không còn khả dụng / hết hàng
   */
  clearUnavailableItems: () => client.delete('/cart/unavailable'),

  /**
   * Dọn sạch toàn bộ giỏ hàng
   */
  clearCart: () => client.delete('/cart'),
};

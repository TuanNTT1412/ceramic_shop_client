import client from './client';

export const productApi = {
  // ==========================================
  // PUBLIC - KHÁCH HÀNG & DU KHÁCH
  // ==========================================
  /**
   * Lấy danh sách sản phẩm đang bán kèm bộ lọc
   * @param {{ page?, limit?, categoryId?, minPrice?, maxPrice?, search?, sortBy?, sortOrder? }} params
   */
  getProducts: (params) => client.get('/products', { params }),

  /**
   * Xem chi tiết sản phẩm kèm các biến thể (variants), ảnh và review tóm tắt
   * @param {string} id
   */
  getProductDetail: (id) => client.get(`/products/${id}`),

  // ==========================================
  // ADMIN & STAFF - QUẢN LÝ SẢN PHẨM & BIẾN THỂ
  // ==========================================
  adminGetProducts: (params) => client.get('/products/admin', { params }),
  adminCreateProduct: (data) => client.post('/products', data),
  adminUpdateProduct: (id, data) => client.patch(`/products/${id}`, data),

  // Biến thể (Variants)
  adminCreateVariant: (productId, data) => client.post(`/products/${productId}/variants`, data),
  adminUpdateVariant: (variantId, data) => client.patch(`/products/variants/${variantId}`, data),

  // Hình ảnh biến thể
  adminCreateImage: (variantId, data) => client.post(`/products/variants/${variantId}/images`, data),
  adminUpdateImage: (imageId, data) => client.patch(`/products/images/${imageId}`, data),
};

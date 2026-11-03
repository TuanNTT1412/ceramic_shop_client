import client from './client';

export const orderApi = {
  // ==========================================
  // CUSTOMER - ĐẶT HÀNG & QUẢN LÝ ĐƠN CỦA MÌNH
  // ==========================================
  /**
   * Tạo đơn hàng mới
   * @param {{ receiverName, receiverPhone, deliveryType, deliveryAddress?, paymentMethod, items }} data
   */
  createOrder: (data) => client.post('/orders', data),

  /**
   * Danh sách đơn hàng của tôi
   * @param {{ page?, limit?, status? }} params
   */
  getMyOrders: (params) => client.get('/orders', { params }),

  /**
   * Chi tiết một đơn hàng của tôi
   * @param {string} id
   */
  getMyOrderDetail: (id) => client.get(`/orders/${id}`),

  /**
   * Khách hàng tự hủy đơn hàng
   * @param {string} id
   * @param {{ cancelReason: string }} data
   */
  cancelMyOrder: (id, data) => client.patch(`/orders/${id}/cancel`, data),

  // ==========================================
  // ADMIN & STAFF - QUẢN LÝ ĐƠN TOÀN HỆ THỐNG
  // ==========================================
  adminGetAllOrders: (params) => client.get('/orders/admin', { params }),
  adminGetOrderDetail: (id) => client.get(`/orders/admin/${id}`),
  adminUpdateOrderStatus: (id, data) => client.patch(`/orders/admin/${id}/status`, data),
  adminUpdatePaymentStatus: (id, data) => client.patch(`/orders/admin/${id}/payment`, data),
};

import client from './client';

export const reviewApi = {
  /**
   * Lấy danh sách đánh giá của sản phẩm
   * @param {string} productId
   * @param {{ page?, limit? }} params
   */
  getReviewsByProduct: (productId, params) =>
    client.get(`/products/${productId}/reviews`, { params }),

  /**
   * Khách hàng gửi đánh giá sau khi nhận hàng
   * @param {{ orderDetailId: string, rating: number, comment?: string, images?: string[] }} data
   */
  createReview: (data) => client.post('/reviews', data),

  /**
   * Admin / Staff gửi phản hồi đánh giá của khách
   * @param {string} reviewId
   * @param {{ adminReply: string }} data
   */
  adminReplyReview: (reviewId, data) => client.post(`/reviews/${reviewId}/reply`, data),
};

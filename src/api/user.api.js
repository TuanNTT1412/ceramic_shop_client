import client from './client';

export const userApi = {
  // ==========================================
  // CUSTOMER - HỒ SƠ & SỔ ĐỊA CHỈ
  // ==========================================
  getProfile: () => client.get('/users/profile'),
  updateProfile: (data) => client.put('/users/profile', data),
  changePassword: (data) => client.put('/users/change-password', data),

  getAddresses: () => client.get('/users/addresses'),
  createAddress: (data) => client.post('/users/addresses', data),
  updateAddress: (id, data) => client.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => client.delete(`/users/addresses/${id}`),
  setDefaultAddress: (id) => client.patch(`/users/addresses/${id}/default`),

  // ==========================================
  // ADMIN - QUẢN LÝ NGƯỜI DÙNG
  // ==========================================
  adminGetUsers: (params) => client.get('/users/admin', { params }),
  adminUpdateUserStatus: (id, isActive) => client.patch(`/users/admin/${id}/status`, { isActive }),
};

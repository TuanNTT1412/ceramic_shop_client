import client from './client';

export const authApi = {
  /**
   * Đăng ký tài khoản khách hàng mới
   * @param {{ email, password, name, phone? }} data
   */
  register: (data) => client.post('/auth/register', data),

  /**
   * Đăng nhập lấy access & refresh token
   * @param {{ email, password }} data
   */
  login: (data) => client.post('/auth/login', data),

  /**
   * Làm mới Access Token
   * @param {string} refreshToken
   */
  refresh: (refreshToken) => client.post('/auth/refresh', { refreshToken }),

  /**
   * Đăng xuất và thu hồi Refresh Token
   * @param {string} refreshToken
   */
  logout: (refreshToken) => client.post('/auth/logout', { refreshToken }),
};

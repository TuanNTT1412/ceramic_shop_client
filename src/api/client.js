import axios from 'axios';
import { STORAGE_KEYS } from '../constants';

const client = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Tự động đính kèm JWT Bearer Token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Trích xuất response.data và bắt lỗi xác thực
client.interceptors.response.use(
  (response) => {
    // Trả trực tiếp payload data từ backend { success: true, data: ... }
    return response.data;
  },
  (error) => {
    // Nếu token hết hạn hoặc không hợp lệ (401), tự động dọn auth storage
    if (error.response?.status === 401 && !error.config.url?.includes('/auth/login')) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    }
    return Promise.reject(error);
  }
);

export default client;

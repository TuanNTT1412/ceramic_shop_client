import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, userApi } from '../api';
import { STORAGE_KEYS, ROLES } from '../constants';
import { storage } from '../utils/format';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.get(STORAGE_KEYS.USER_INFO, null));
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null);
  const [isLoading, setIsLoading] = useState(true);

  // Khởi tạo: kiểm tra token và đồng bộ profile mới nhất từ server
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const savedUser = storage.get(STORAGE_KEYS.USER_INFO, null);

      if (savedToken && savedUser) {
        try {
          // Lấy profile mới nhất từ BE để đảm bảo quyền hạn & trạng thái tài khoản
          const res = await userApi.getProfile();
          if (res?.data) {
            const updatedUser = { ...savedUser, ...res.data };
            setUser(updatedUser);
            storage.set(STORAGE_KEYS.USER_INFO, updatedUser);
          }
        } catch (err) {
          console.warn('Phiên đăng nhập không thể làm mới:', err?.message);
          // Nếu token không hợp lệ (401), client.js đã tự dọn localStorage
          if (err.response?.status === 401) {
            setUser(null);
            setToken(null);
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Đăng nhập người dùng
   */
  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { user: userData, accessToken, refreshToken } = res.data;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      storage.set(STORAGE_KEYS.USER_INFO, userData);

      setToken(accessToken);
      setUser(userData);
      return userData;
    } catch (err) {
      // Khi Backend chưa chạy hoặc lỗi mạng, tự động kích hoạt phiên demo cho dev/xem trước
      const isOffline =
        !err.response ||
        [404, 500, 502, 503, 504].includes(err.response?.status) ||
        err.code === 'ERR_NETWORK' ||
        err.message?.includes('Network Error') ||
        err.message?.includes('502');

      if (isOffline) {
        const role = email.toLowerCase().includes('admin')
          ? ROLES.ADMIN
          : email.toLowerCase().includes('staff')
          ? ROLES.STAFF
          : ROLES.CUSTOMER;

        const mockUserData = {
          id: 'mock-admin-id',
          name:
            role === ROLES.ADMIN
              ? 'Quản Trị Viên'
              : role === ROLES.STAFF
              ? 'Nghệ Nhân'
              : 'Khách Hàng',
          email,
          role,
          isActive: true,
        };
        const mockAccessToken = 'mock_jwt_token_for_dev_mode';
        const mockRefreshToken = 'mock_refresh_token_for_dev_mode';

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, mockAccessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, mockRefreshToken);
        storage.set(STORAGE_KEYS.USER_INFO, mockUserData);

        setToken(mockAccessToken);
        setUser(mockUserData);
        return mockUserData;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Đăng ký tài khoản khách hàng mới
   */
  const register = useCallback(async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      const res = await authApi.register({ name, email, password });
      return res.data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Đăng xuất khỏi hệ thống
   */
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch (err) {
        console.warn('Lỗi thu hồi refresh token phía server:', err?.message);
      }
    }

    storage.clearAuth();
    setUser(null);
    setToken(null);
  }, []);

  /**
   * Cập nhật thông tin profile khi người dùng đổi tên/avatar
   */
  const updateProfile = useCallback(async (data) => {
    const res = await userApi.updateProfile(data);
    if (res?.data) {
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      storage.set(STORAGE_KEYS.USER_INFO, updatedUser);
      return updatedUser;
    }
  }, [user]);

  /**
   * Đồng bộ lại thông tin profile
   */
  const refreshProfile = useCallback(async () => {
    try {
      const res = await userApi.getProfile();
      if (res?.data) {
        const updatedUser = { ...user, ...res.data };
        setUser(updatedUser);
        storage.set(STORAGE_KEYS.USER_INFO, updatedUser);
        return updatedUser;
      }
    } catch (e) {
      console.error('refreshProfile error:', e);
    }
  }, [user]);

  // Các cờ tiện ích kiểm tra phân quyền
  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === ROLES.ADMIN;
  const isStaff = user?.role === ROLES.STAFF;
  const isCustomer = user?.role === ROLES.CUSTOMER;

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    isAdmin,
    isStaff,
    isCustomer,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

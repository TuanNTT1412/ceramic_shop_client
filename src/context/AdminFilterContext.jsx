import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { categoryApi } from '../api';
import { ROUTES } from '../constants';

const AdminFilterContext = createContext(null);

export const AdminFilterProvider = ({ children }) => {
  const location = useLocation();

  // Xác định trang quản trị hiện tại từ URL
  const activeSection = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith(ROUTES.ADMIN.PRODUCTS)) return 'products';
    if (path.startsWith(ROUTES.ADMIN.CATEGORIES)) return 'categories';
    if (path.startsWith(ROUTES.ADMIN.ORDERS)) return 'orders';
    if (path.startsWith(ROUTES.ADMIN.REVIEWS)) return 'reviews';
    if (path.startsWith(ROUTES.ADMIN.USERS)) return 'users';
    if (path === ROUTES.ADMIN.DASHBOARD) return 'dashboard';
    return 'other';
  }, [location.pathname]);

  // Từ khóa tìm kiếm trên Top Header
  const [searchQuery, setSearchQuery] = useState('');

  // Tự động xóa từ khóa khi chuyển đổi giữa các trang quản trị
  useEffect(() => {
    setSearchQuery('');
  }, [location.pathname]);

  // 1. Bộ lọc Trang Sản Phẩm
  const [productFilters, setProductFilters] = useState({
    category: 'ALL',
    status: 'ALL',
    glaze: 'ALL',
  });

  // 2. Bộ lọc Trang Đơn Hàng
  const [orderFilters, setOrderFilters] = useState({
    delivery: 'ALL',
    payment: 'ALL',
    sort: 'NEWEST',
  });

  // 3. Bộ lọc Trang Đánh Giá
  const [reviewFilters, setReviewFilters] = useState({
    star: 'all',
    status: 'all',
    onlyPhotos: false,
  });

  // 4. Bộ lọc Trang Khách Hàng / Tài Khoản
  const [userFilters, setUserFilters] = useState({
    role: '',
    status: '',
  });

  // Tải danh mục cho dropdown bộ lọc sản phẩm
  const [categoriesList, setCategoriesList] = useState([]);
  useEffect(() => {
    categoryApi
      .getCategories()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          setCategoriesList(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Đếm số lượng bộ lọc đang được kích hoạt (khác mặc định)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeSection === 'products') {
      if (productFilters.category !== 'ALL') count++;
      if (productFilters.status !== 'ALL') count++;
      if (productFilters.glaze !== 'ALL') count++;
    } else if (activeSection === 'orders') {
      if (orderFilters.delivery !== 'ALL') count++;
      if (orderFilters.payment !== 'ALL') count++;
      if (orderFilters.sort !== 'NEWEST') count++;
    } else if (activeSection === 'reviews') {
      if (reviewFilters.star !== 'all') count++;
      if (reviewFilters.status !== 'all') count++;
      if (reviewFilters.onlyPhotos) count++;
    } else if (activeSection === 'users') {
      if (userFilters.role !== '') count++;
      if (userFilters.status !== '') count++;
    }
    return count;
  }, [activeSection, productFilters, orderFilters, reviewFilters, userFilters]);

  // Đặt lại toàn bộ bộ lọc của trang hiện tại về mặc định
  const resetCurrentFilters = () => {
    if (activeSection === 'products') {
      setProductFilters({ category: 'ALL', status: 'ALL', glaze: 'ALL' });
    } else if (activeSection === 'orders') {
      setOrderFilters({ delivery: 'ALL', payment: 'ALL', sort: 'NEWEST' });
    } else if (activeSection === 'reviews') {
      setReviewFilters({ star: 'all', status: 'all', onlyPhotos: false });
    } else if (activeSection === 'users') {
      setUserFilters({ role: '', status: '' });
    }
    setSearchQuery('');
  };

  return (
    <AdminFilterContext.Provider
      value={{
        activeSection,
        searchQuery,
        setSearchQuery,
        productFilters,
        setProductFilters,
        orderFilters,
        setOrderFilters,
        reviewFilters,
        setReviewFilters,
        userFilters,
        setUserFilters,
        categoriesList,
        activeFilterCount,
        resetCurrentFilters,
      }}
    >
      {children}
    </AdminFilterContext.Provider>
  );
};

export const useAdminFilter = () => {
  const context = useContext(AdminFilterContext);
  if (!context) {
    throw new Error('useAdminFilter must be used within an AdminFilterProvider');
  }
  return context;
};

export default AdminFilterContext;

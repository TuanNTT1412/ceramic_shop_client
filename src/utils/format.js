import { STORAGE_KEYS } from '../constants';

/**
 * Định dạng số thành chuỗi tiền tệ VND (VD: 250000 -> "250.000 ₫")
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Định dạng ngày giờ chuẩn Việt Nam (VD: "31/10/2026, 14:30")
 */
export function formatDate(dateString, withTime = true) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(withTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  return new Intl.DateTimeFormat('vi-VN', options).format(date);
}

/**
 * Định dạng số điện thoại chuẩn Việt Nam dạng chấm: 0911.111.111 (4-3-3 số)
 * Giúp người dùng dễ nhìn, đếm đủ 10 chữ số
 * @param {string|number} phone
 * @returns {string}
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/\D/g, '');

  // Xử lý tiền tố quốc tế 84
  if (cleaned.startsWith('84') && cleaned.length > 9) {
    cleaned = '0' + cleaned.slice(2);
  }

  // Tối đa 10 chữ số chuẩn di động VN
  if (cleaned.length <= 4) {
    return cleaned;
  }
  if (cleaned.length <= 7) {
    return `${cleaned.slice(0, 4)}.${cleaned.slice(4)}`;
  }
  return `${cleaned.slice(0, 4)}.${cleaned.slice(4, 7)}.${cleaned.slice(7, 10)}`;
}

/**
 * Làm sạch số điện thoại chỉ còn chữ số để lưu vào database
 * @param {string|number} phone
 * @returns {string}
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.startsWith('84') && cleaned.length > 9) {
    cleaned = '0' + cleaned.slice(2);
  }
  return cleaned;
}

/**
 * Rút trích thông điệp lỗi thân thiện từ phản hồi Axios / BE
 */
export function getErrorMessage(error, defaultMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.') {
  if (!error) return defaultMessage;

  // Lỗi từ backend trả về cấu trúc chuẩn { success: false, message: "..." }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Lỗi validation mảng errors
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map(e => e.message || e).join(', ');
  }

  if (error.message) {
    if (error.message.includes('Network Error')) {
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.';
    }
    return error.message;
  }

  return defaultMessage;
}

/**
 * Tiện ích truy xuất LocalStorage an toàn (chống crash khi JSON parse lỗi)
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return localStorage.getItem(key) || defaultValue;
    }
  },
  set: (key, value) => {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (e) {
      console.error('Storage set error:', e);
    }
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  },
};

// ==========================================
// 1. VAI TRÒ NGƯỜI DÙNG (ROLES)
// ==========================================
export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
};

// ==========================================
// 2. TRẠNG THÁI ĐƠN HÀNG (ORDER STATUS)
// ==========================================
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPING: 'SHIPPING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
};

export const ORDER_STATUS_MAP = {
  [ORDER_STATUS.PENDING]: {
    label: 'Chờ xác nhận',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500',
  },
  [ORDER_STATUS.PROCESSING]: {
    label: 'Đang chuẩn bị hàng',
    color: 'bg-blue-50 text-blue-800 border-blue-200',
    dotColor: 'bg-blue-500',
  },
  [ORDER_STATUS.SHIPPING]: {
    label: 'Đang giao hàng',
    color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    dotColor: 'bg-indigo-500',
  },
  [ORDER_STATUS.READY_FOR_PICKUP]: {
    label: 'Chờ nhận tại xưởng',
    color: 'bg-purple-50 text-purple-800 border-purple-200',
    dotColor: 'bg-purple-500',
  },
  [ORDER_STATUS.COMPLETED]: {
    label: 'Giao thành công',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  [ORDER_STATUS.CANCELED]: {
    label: 'Đã hủy',
    color: 'bg-rose-50 text-rose-800 border-rose-200',
    dotColor: 'bg-rose-500',
  },
};

// ==========================================
// 3. PHƯƠNG THỨC & TRẠNG THÁI THANH TOÁN
// ==========================================
export const PAYMENT_METHOD = {
  COD: 'COD',
  PAYOS: 'PAYOS',
};

export const PAYMENT_METHOD_LABEL = {
  [PAYMENT_METHOD.COD]: 'Thanh toán khi nhận hàng (COD)',
  [PAYMENT_METHOD.PAYOS]: 'Chuyển khoản QR (PayOS)',
};

export const PAYMENT_STATUS = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
};

export const PAYMENT_STATUS_MAP = {
  [PAYMENT_STATUS.UNPAID]: {
    label: 'Chưa thanh toán',
    color: 'bg-stone-100 text-stone-700 border-stone-200',
  },
  [PAYMENT_STATUS.PAID]: {
    label: 'Đã thanh toán',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};

// ==========================================
// 4. HÌNH THỨC NHẬN HÀNG & ĐƠN VỊ VẬN CHUYỂN
// ==========================================
export const DELIVERY_TYPE = {
  PICKUP: 'PICKUP',
  SHIPPING: 'SHIPPING',
};

export const DELIVERY_TYPE_LABEL = {
  [DELIVERY_TYPE.PICKUP]: 'Nhận trực tiếp tại xưởng gốm',
  [DELIVERY_TYPE.SHIPPING]: 'Giao hàng tận nơi',
};

export const SHIPPING_PROVIDER = {
  GHTK: 'GHTK',
  VTP: 'VTP',
  VNPOST: 'VNPOST',
  AHAMOVE: 'AHAMOVE',
};

// ==========================================
// 5. LOCAL STORAGE KEYS
// ==========================================
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ceramic_access_token',
  REFRESH_TOKEN: 'ceramic_refresh_token',
  USER_INFO: 'ceramic_user_info',
  CART_LOCAL: 'ceramic_cart_local',
};

// ==========================================
// 6. ROUTE PATH CONSTANTS
// ==========================================
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  COLLECTION: '/collection',
  PRODUCT: '/product',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  MY_ORDERS: '/my-orders',
  MY_ORDER_DETAIL: '/my-orders/:id',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',

  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
  },
};

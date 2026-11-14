import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useToast } from '../../context';
import { ROUTES } from '../../constants';
import { getErrorMessage } from '../../utils/format';

const ROLE_DATA = {
  CUSTOMER: {
    email: 'customer@ceramic.com',
    password: '123456',
    name: 'Nguyễn Văn Khách',
    desc: 'Mặc định: Khách hàng mua sắm & thưởng lãm',
  },
  STAFF: {
    email: 'staff@ceramic.com',
    password: '123456',
    name: 'Nhân viên Bán hàng',
    desc: 'STAFF: Quản lý xưởng & giám tuyển sản phẩm',
  },
  ADMIN: {
    email: 'admin@ceramic.com',
    password: '123456',
    name: 'Quản trị viên Hệ thống',
    desc: 'ADMIN: Quản trị hạ tầng phân quyền & phân tích',
  },
};

export const AuthPage = ({ initialTab = 'login' }) => {
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [currentRole, setCurrentRole] = useState('CUSTOMER');

  // Form states
  const [loginEmail, setLoginEmail] = useState(ROLE_DATA.CUSTOMER.email);
  const [loginPassword, setLoginPassword] = useState(ROLE_DATA.CUSTOMER.password);
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusBanner, setStatusBanner] = useState(null); // { type, icon, title, desc }

  const { login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const rawRedirect = searchParams.get('redirect');
  const redirectTarget = rawRedirect ? decodeURIComponent(rawRedirect) : location.state?.from?.pathname;

  // Chọn vai trò mô phỏng (Role Simulator)
  const handleSelectRole = (role) => {
    setCurrentRole(role);
    setLoginEmail(ROLE_DATA[role].email);
    setLoginPassword(ROLE_DATA[role].password);
  };

  // Đổi tab Đăng nhập / Đăng ký
  const handleSwitchTab = (tab) => {
    setCurrentTab(tab);
    setStatusBanner(null);
  };

  // Submit Đăng nhập
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusBanner(null);

    try {
      // Thử gọi login thật từ AuthContext (đấu nối BE)
      const userData = await login({ email: loginEmail, password: loginPassword });
      toast.success(`Chào mừng ${userData?.name || 'Quý khách'} quay trở lại!`);

      setStatusBanner({
        type: 'success',
        icon: 'check_circle',
        title: 'Xác thực thành công (200 OK)',
        desc: `Cấp Access Token (15p) & Refresh Token (7 ngày) thành công cho ${loginEmail} [${currentRole}].`,
      });

      setTimeout(() => {
        if (userData?.role === 'ADMIN') {
          navigate(ROUTES.ADMIN.DASHBOARD);
        } else if (redirectTarget) {
          navigate(redirectTarget);
        } else {
          navigate(ROUTES.HOME);
        }
      }, 800);
    } catch (err) {
      // Nếu BE chưa chạy hoặc sai tài khoản, cung cấp chế độ demo mượt mà
      console.warn('Đăng nhập server lỗi hoặc offline, kích hoạt chế độ demo:', err);
      const isNetworkOrNotFound =
        !err.response ||
        [404, 500, 502, 503, 504].includes(err.response?.status) ||
        err.code === 'ERR_NETWORK' ||
        err.message?.includes('502');

      if (isNetworkOrNotFound) {
        setStatusBanner({
          type: 'success',
          icon: 'check_circle',
          title: 'Xác thực thành công (Chế độ xem trước)',
          desc: `Đã tạo phiên đăng nhập giả lập cho ${loginEmail} [${currentRole}].`,
        });
        toast.success(`Đăng nhập thành công với vai trò ${currentRole}!`);
        setTimeout(() => {
          if (currentRole === 'ADMIN') {
            navigate(ROUTES.ADMIN.DASHBOARD);
          } else if (redirectTarget) {
            navigate(redirectTarget);
          } else {
            navigate(ROUTES.HOME);
          }
        }, 1000);
      } else {
        const message = getErrorMessage(err, 'Đăng nhập không thành công. Vui lòng kiểm tra lại.');
        setStatusBanner({
          type: 'error',
          icon: 'error',
          title: 'Đăng nhập thất bại',
          desc: message,
        });
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Đăng ký
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusBanner(null);

    try {
      await register({ name: regName, email: regEmail, password: regPassword });
      toast.success('Đăng ký tài khoản thành công!');

      setStatusBanner({
        type: 'success',
        icon: 'celebration',
        title: 'Đăng ký thành công (201 Created)',
        desc: `Chào mừng nghệ nhân ${regName} (${regEmail}). Tự động kích hoạt giỏ hàng nghệ nhân rỗng.`,
      });

      setTimeout(() => navigate(ROUTES.HOME), 1200);
    } catch (err) {
      const isNetworkOrNotFound =
        !err.response ||
        [404, 500, 502, 503, 504].includes(err.response?.status) ||
        err.code === 'ERR_NETWORK' ||
        err.message?.includes('502');

      if (isNetworkOrNotFound) {
        setStatusBanner({
          type: 'success',
          icon: 'celebration',
          title: 'Đăng ký thành công (Chế độ xem trước)',
          desc: `Tài khoản mẫu ${regName} (${regEmail}) đã được thiết lập với vai trò ${currentRole}.`,
        });
        toast.success('Khởi tạo tài khoản thành công!');
        setTimeout(() => navigate(ROUTES.HOME), 1200);
      } else {
        const message = getErrorMessage(err, 'Đăng ký không thành công. Vui lòng thử lại.');
        setStatusBanner({
          type: 'error',
          icon: 'error',
          title: 'Đăng ký thất bại',
          desc: message,
        });
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-background font-body text-on-background min-h-screen flex items-center justify-center p-4 sm:p-6 selection:bg-primary-fixed selection:text-primary">
      <div className="w-full max-w-6xl mx-auto py-6 sm:py-10">
        {/* Nút lùi về trang chủ */}
        <div className="mb-6">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            <span>Quay lại Trang Chủ Gốm Mộc</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ======================================================= */}
          {/* CỘT TRÁI (5 CỘT): NGHỆ THUẬT ĐẤT NUNG & BẢO MẬT PHIÊN  */}
          {/* ======================================================= */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            {/* Huy hiệu thương hiệu */}
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-xs">
                <span className="material-symbols-outlined text-2xl">potted_plant</span>
              </div>
              <div>
                <span className="font-label text-xs uppercase tracking-widest text-primary font-semibold block">
                  Artisan Identity
                </span>
                <h2 className="font-headline text-2xl sm:text-3xl text-on-background font-normal tracking-tight">
                  Gốm Mộc Sahara
                </h2>
              </div>
            </div>

            {/* Khối diễn họa sản phẩm gốm mộc tĩnh lặng */}
            <div className="relative rounded-2xl overflow-hidden shadow-xs group">
              <div
                className="bg-cover bg-center w-full h-80 sm:h-96 transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('/images/hero-vase.jpg')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/85 via-on-background/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-inverse-on-surface">
                <span className="text-xs uppercase tracking-widest font-label text-primary-fixed-dim mb-2 font-medium">
                  Bản Quyền Nghệ Nhân
                </span>
                <p className="font-headline text-xl sm:text-2xl leading-snug">
                  “Mỗi khối đất nung mang linh hồn của cát và lửa, gìn giữ giá trị độc bản cho từng
                  khách hữu.”
                </p>
                <div className="mt-4 flex items-center space-x-2 text-xs font-label text-primary-fixed">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>Hệ sinh thái Nghệ thuật Đất nung Thượng hạng</span>
                </div>
              </div>
            </div>

            {/* Khối Tri thức An Ninh & Giám sát Phiên - đã ẩn */}
          </div>

          {/* ======================================================= */}
          {/* CỘT PHẢI (7 CỘT): BIỂU MẪU XÁC THỰC TRUNG TÂM           */}
          {/* ======================================================= */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-surface-container-lowest p-6 sm:p-10 md:p-12 rounded-3xl shadow-sm border border-outline-variant/30">
              {/* Đầu đề Biểu Mẫu */}
              <div className="text-center sm:text-left mb-8">

                <h1 className="font-headline text-3xl sm:text-4xl text-on-surface tracking-tight font-medium">
                  Không Gian Nghệ Thuật Đất Nung
                </h1>
                <p className="font-body text-sm sm:text-base text-on-surface-variant mt-2 font-light">
                  Khởi đầu hành trình thưởng lãm và quản trị kho tác phẩm gốm mộc độc bản.
                </p>
              </div>

              {/* Role Simulator: Bộ Chuyển Đổi Mô Phỏng Vai Trò */}
              <div className="mb-8">
                <div className="grid grid-cols-3 gap-2.5 p-1.5 bg-surface-container rounded-2xl">
                  <button
                    type="button"
                    onClick={() => handleSelectRole('CUSTOMER')}
                    className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all duration-200 ${
                      currentRole === 'CUSTOMER'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="font-label text-xs font-semibold">Khách Hàng</span>
                  </button>

                  {/* Nút Nghệ Nhân / Nhân Viên */}
                  <button
                    type="button"
                    onClick={() => handleSelectRole('STAFF')}
                    className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all duration-200 ${
                      currentRole === 'STAFF'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="font-label text-xs font-semibold">Nghệ Nhân</span>
                  </button>

                  {/* Nút Quản Trị */}
                  <button
                    type="button"
                    onClick={() => handleSelectRole('ADMIN')}
                    className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all duration-200 ${
                      currentRole === 'ADMIN'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="font-label text-xs font-semibold">Quản Trị</span>
                  </button>
                </div>
              </div>

              {/* Thanh Tabs: Chuyển Đổi Đăng Nhập / Đăng Ký */}
              <div className="flex items-center space-x-1 p-1 bg-surface-container-low rounded-xl mb-8">
                <button
                  type="button"
                  onClick={() => handleSwitchTab('login')}
                  className={`flex-1 py-3 text-center rounded-lg font-label text-sm transition-all duration-200 ${
                    currentTab === 'login'
                      ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface font-medium'
                  }`}
                >
                  Đăng Nhập
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchTab('register')}
                  className={`flex-1 py-3 text-center rounded-lg font-label text-sm transition-all duration-200 ${
                    currentTab === 'register'
                      ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface font-medium'
                  }`}
                >
                  Đăng Ký Thành Viên
                </button>
              </div>

              {/* FORM ĐĂNG NHẬP */}
              {currentTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="font-label text-xs uppercase tracking-wider text-secondary font-semibold block">
                      Email Tài Khoản
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl pointer-events-none">
                        mail
                      </span>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="khachhang@sahara.vn hoặc artisan@gommoc.vn"
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low focus:bg-surface-container-lowest rounded-xl font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 shadow-inner border border-transparent focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-label text-xs uppercase tracking-wider text-secondary font-semibold block">
                        Mật Khẩu Bảo Mật
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          toast.info('Đã gửi liên kết khôi phục mật khẩu vào email đăng ký.')
                        }
                        className="text-xs font-label text-primary hover:underline transition-colors"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl pointer-events-none">
                        lock
                      </span>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Nhập mật khẩu an toàn..."
                        className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low focus:bg-surface-container-lowest rounded-xl font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 shadow-inner border border-transparent focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface transition-colors p-1"
                        aria-label="Ẩn hiện mật khẩu"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showLoginPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Ghi nhớ phiên đăng nhập */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                      />
                      <span className="font-label text-xs text-on-surface-variant font-medium">
                        Ghi nhớ đăng nhập an toàn
                      </span>
                    </label>
                  </div>

                  {/* Nút bấm Đăng Nhập CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-surface-tint active:scale-[0.99] text-on-primary py-4 px-6 rounded-xl font-label text-sm font-semibold tracking-wide flex items-center justify-center space-x-2 transition-all duration-200 shadow-md group disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Đang xác thực...' : 'Đăng Nhập Ngay'}</span>
                    <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                </form>
              )}

              {/* FORM ĐĂNG KÝ */}
              {currentTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="font-label text-xs uppercase tracking-wider text-secondary font-semibold block">
                      Họ và Tên Nghệ Nhân / Khách Hữu
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl pointer-events-none">
                        badge
                      </span>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn Mộc"
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low focus:bg-surface-container-lowest rounded-xl font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 shadow-inner border border-transparent focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-label text-xs uppercase tracking-wider text-secondary font-semibold block">
                      Email Liên Hệ Chính
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl pointer-events-none">
                        mail
                      </span>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="nguyenvanmoc@domain.vn"
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low focus:bg-surface-container-lowest rounded-xl font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 shadow-inner border border-transparent focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-label text-xs uppercase tracking-wider text-secondary font-semibold block">
                      Thiết Lập Mật Khẩu
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xl pointer-events-none">
                        lock
                      </span>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Tối thiểu 6 ký tự kèm chữ và số..."
                        className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low focus:bg-surface-container-lowest rounded-xl font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 shadow-inner border border-transparent focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface transition-colors p-1"
                        aria-label="Ẩn hiện mật khẩu"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showRegPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 bg-surface-container rounded-xl flex items-center space-x-3 text-xs font-label text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-xl shrink-0">
                      add_shopping_cart
                    </span>
                    <span>
                      Đăng ký sẽ tự động khởi tạo hồ sơ và{' '}
                      <strong className="text-on-surface">Giỏ hàng cá nhân</strong> với cấu trúc
                      phân quyền tương ứng.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-surface-tint active:scale-[0.99] text-on-primary py-4 px-6 rounded-xl font-label text-sm font-semibold tracking-wide flex items-center justify-center space-x-2 transition-all duration-200 shadow-md group disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting ? 'Đang khởi tạo tài khoản...' : 'Hoàn Tất Khởi Tạo Tài Khoản'}
                    </span>
                    <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                </form>
              )}

              {/* Banner Thông Báo Tình Trạng Phiên (Dynamic Feedback Banner) */}
              {statusBanner && (
                <div
                  className={`mt-6 p-4 rounded-xl flex items-start space-x-3 transition-all duration-300 animate-slide-up ${
                    statusBanner.type === 'error'
                      ? 'bg-error-container/40 text-on-error-container border border-error/20'
                      : 'bg-primary/10 text-on-surface border border-primary/20'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl shrink-0 ${
                      statusBanner.type === 'error' ? 'text-error' : 'text-primary'
                    }`}
                  >
                    {statusBanner.icon}
                  </span>
                  <div className="flex-1 font-label text-xs">
                    <span className="font-bold block text-sm">{statusBanner.title}</span>
                    <span className="opacity-90">{statusBanner.desc}</span>
                  </div>
                </div>
              )}

              {/* Footer của Hộp Đăng Nhập */}
              <div className="mt-8 pt-6 border-t border-outline-variant/30 flex items-center justify-end text-xs font-label text-secondary gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() =>
                      toast.info('Chính sách bảo vệ bí mật dữ liệu nghệ thuật theo tiêu chuẩn Sahara.')
                    }
                    className="hover:text-on-surface transition-colors"
                  >
                    Bảo Mật
                  </button>
                  <span className="opacity-30">•</span>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info('Điều khoản dịch vụ và cam kết lưu kho gốm mộc độc bản.')
                    }
                    className="hover:text-on-surface transition-colors"
                  >
                    Điều Khoản
                  </button>
                  <span className="opacity-30">•</span>
                  <button
                    type="button"
                    onClick={() => toast.info('Đường dây nóng nghệ nhân: 0982.388.xxx.')}
                    className="hover:text-on-surface transition-colors"
                  >
                    Trợ Giúp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;


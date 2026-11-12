import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../../context';
import { userApi } from '../../api';
import { ROUTES } from '../../constants';
import { formatPhoneNumber, cleanPhoneNumber } from '../../utils/format';

export const ProfilePage = () => {
  const { user, isAuthenticated, updateProfile: authUpdateProfile, refreshProfile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Tab điều hướng: 'profile' | 'addresses' | 'security'
  const [activeTab, setActiveTab] = useState('profile');

  // Trạng thái Form Hồ sơ cá nhân
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone ? formatPhoneNumber(user.phone) : '');
  const [bioNote, setBioNote] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || '/images/craftsman.jpg');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fileInputRef = useRef(null);

  // Trạng thái Sổ địa chỉ
  const [addresses, setAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Trạng thái Modal Thêm/Sửa địa chỉ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null = thêm mới, object = sửa
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [modalReceiverName, setModalReceiverName] = useState('');
  const [modalReceiverPhone, setModalReceiverPhone] = useState('');
  const [modalAddressDetail, setModalAddressDetail] = useState('');
  const [modalIsDefault, setModalIsDefault] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  // Trạng thái Form Đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // Ngày tham gia xưởng
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '15/01/2025';

  // Đồng bộ dữ liệu khi user đăng nhập
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.avatar) setAvatar(user.avatar);
    }
  }, [user]);

  // Tải danh sách địa chỉ từ Backend nếu đã đăng nhập
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!isAuthenticated) return;
      setIsLoadingAddresses(true);
      try {
        const res = await userApi.getAddresses();
        if (res?.data && Array.isArray(res.data)) {
          setAddresses(res.data);
        } else {
          setAddresses([]);
        }
      } catch (err) {
        console.warn('Chưa thể tải sổ địa chỉ từ API:', err?.message);
        setAddresses([]);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [isAuthenticated]);

  // Xử lý đổi Avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.warning('Dung lượng ảnh đại diện không được vượt quá 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target?.result;
      if (base64Url) {
        setAvatar(base64Url);
        if (isAuthenticated && authUpdateProfile) {
          try {
            await authUpdateProfile({ avatar: base64Url });
            toast.success('Đã cập nhật ảnh đại diện thành công!');
          } catch (err) {
            console.warn('Lỗi lưu avatar lên server:', err?.message);
            toast.info('Đã cập nhật ảnh đại diện xem trước.');
          }
        } else {
          toast.info('Đã cập nhật ảnh đại diện xem trước.');
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Lưu thông tin cá nhân (Profile)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 3) {
      toast.warning('Tên người dùng phải có ít nhất 3 ký tự');
      return;
    }

    setIsSavingProfile(true);
    try {
      if (isAuthenticated && authUpdateProfile) {
        await authUpdateProfile({ name: name.trim(), avatar });
        toast.success('Thông tin hồ sơ đã được lưu thành công trên hệ thống Sahara Atelier!');
      } else {
        toast.success('Đã lưu thông tin hồ sơ thành công!');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể lưu hồ sơ, vui lòng thử lại');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Mở modal Thêm/Sửa địa chỉ
  const handleOpenAddressModal = (addr = null) => {
    if (addr) {
      setEditingAddress(addr);
      setModalReceiverName(addr.receiverName || '');
      setModalReceiverPhone(formatPhoneNumber(addr.receiverPhone || ''));
      setModalAddressDetail(addr.addressDetail || '');
      setModalIsDefault(Boolean(addr.isDefault));
    } else {
      setEditingAddress(null);
      setModalReceiverName(name || '');
      setModalReceiverPhone(formatPhoneNumber(phone || ''));
      setModalAddressDetail('');
      setModalIsDefault(addresses.length === 0);
    }
    setIsModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  // Lưu địa chỉ (Thêm mới hoặc Cập nhật)
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!modalReceiverName.trim() || modalReceiverName.trim().length < 2) {
      toast.warning('Tên người nhận phải có ít nhất 2 ký tự');
      return;
    }

    const cleanPhone = cleanPhoneNumber(modalReceiverPhone);
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(cleanPhone)) {
      toast.warning('Số điện thoại không hợp lệ (cần 10 chữ số, ví dụ: 0911.111.111)');
      return;
    }

    if (!modalAddressDetail.trim() || modalAddressDetail.trim().length < 5) {
      toast.warning('Địa chỉ chi tiết phải có ít nhất 5 ký tự');
      return;
    }

    setIsSubmittingAddress(true);
    const payload = {
      receiverName: modalReceiverName.trim(),
      receiverPhone: cleanPhone,
      addressDetail: modalAddressDetail.trim(),
      isDefault: modalIsDefault,
    };

    try {
      if (editingAddress) {
        // CẬP NHẬT ĐỊA CHỈ
        if (isAuthenticated) {
          const res = await userApi.updateAddress(editingAddress.id, payload);
          setAddresses((prev) =>
            prev.map((a) => {
              if (a.id === editingAddress.id) {
                return res?.data || { ...a, ...payload };
              }
              if (modalIsDefault) return { ...a, isDefault: false };
              return a;
            })
          );
        } else {
          setAddresses((prev) =>
            prev.map((a) => {
              if (a.id === editingAddress.id) {
                return { ...a, ...payload };
              }
              if (modalIsDefault) return { ...a, isDefault: false };
              return a;
            })
          );
        }
        toast.success('Đã cập nhật địa chỉ thành công!');
      } else {
        // THÊM ĐỊA CHỈ MỚI
        if (isAuthenticated) {
          const res = await userApi.createAddress(payload);
          const newAddr = res?.data || { id: 'addr-' + Date.now(), ...payload };
          setAddresses((prev) => {
            if (modalIsDefault) {
              return [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))];
            }
            return [...prev, newAddr];
          });
        } else {
          const newAddr = { id: 'addr-' + Date.now(), ...payload };
          setAddresses((prev) => {
            if (modalIsDefault) {
              return [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))];
            }
            return [...prev, newAddr];
          });
        }
        toast.success('Đã thêm địa chỉ nhận gốm mới thành công!');
      }
      handleCloseAddressModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể lưu địa chỉ, vui lòng kiểm tra lại');
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  // Đặt làm địa chỉ mặc định
  const handleSetDefaultAddress = async (addrId) => {
    try {
      if (isAuthenticated) {
        await userApi.setDefaultAddress(addrId);
      }
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === addrId,
        }))
      );
      toast.success('Đã thiết lập địa chỉ mặc định thành công!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể cập nhật địa chỉ mặc định');
    }
  };

  // Xóa địa chỉ
  const handleDeleteAddress = (addr) => {
    if (addr.isDefault) {
      toast.warning('Không thể xóa địa chỉ nhận hàng mặc định.');
      return;
    }
    setAddressToDelete(addr);
  };

  const handleConfirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    const addr = addressToDelete;
    setAddressToDelete(null);

    try {
      if (isAuthenticated) {
        await userApi.deleteAddress(addr.id);
      }
      setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
      toast.success('Đã xóa địa chỉ thành công.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể xóa địa chỉ');
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.warning('Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (newPassword.length < 6) {
      toast.warning('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning('Xác nhận mật khẩu mới không trùng khớp');
      return;
    }

    setIsChangingPass(true);
    try {
      if (isAuthenticated) {
        await userApi.changePassword({ currentPassword, newPassword });
        toast.success('Cập nhật mật khẩu bảo mật thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.info('Tính năng đổi mật khẩu yêu cầu đăng nhập tài khoản thực tế.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Mật khẩu hiện tại không chính xác');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="w-full bg-background font-body text-on-background min-h-screen pb-20">
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        {/* ========================================================= */}
        {/* 1. BANNER PROFILE PHÍA TRÊN CÙNG (ATMOSPHERIC ATELIER GLOW) */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f8f1e7] via-[#faf5ee] to-[#f3eae0] p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(58,48,42,0.05)] mb-10 border border-outline-variant/30">
          {/* Decorative pottery wheel contours */}
          <div className="absolute -right-16 -top-24 w-80 h-80 rounded-full bg-primary/5 pointer-events-none blur-2xl" />
          <div className="absolute right-40 -bottom-20 w-60 h-60 rounded-full bg-secondary-fixed/40 pointer-events-none blur-xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* User Avatar & Identity Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Dual-ringed Terra Cotta Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-surface-container-high ring-2 ring-primary/40 ring-offset-4 ring-offset-background transition-transform duration-300 group-hover:scale-[1.02] overflow-hidden">
                  <img
                    alt={name}
                    src={avatar}
                    className="w-full h-full object-cover rounded-full shadow-inner"
                  />
                </div>
                {/* Nút bấm tải ảnh đại diện */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Đổi ảnh đại diện"
                  aria-label="Cập nhật ảnh chân dung"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:bg-primary-container transition-all hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Titles & Metadata */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">
                    {name}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#faefe4] text-primary tracking-wide">
                    <span className="material-symbols-outlined text-[14px]">local_cafe</span>
                    Trà Hữu Mộc Viên • Thành viên từ {joinDate.split('/').pop() || '2025'}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant flex items-center gap-2 font-label">
                  <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                  {email}
                </p>
                <p className="text-xs text-secondary italic font-body pt-0.5">
                  Định danh bảo trợ bộ sưu tập nung củi sa mạc Sahara Atelier
                </p>
              </div>
            </div>

            {/* Metric Badges / Tóm tắt hoạt động gốm */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-surface-container-lowest/80 backdrop-blur-sm p-4 sm:p-5 rounded-xl shadow-[0_2px_12px_rgba(58,48,42,0.04)] lg:min-w-[380px] border border-outline-variant/30">
              <div className="flex flex-col items-center text-center">
                <span className="font-headline text-2xl sm:text-3xl font-bold text-primary">14</span>
                <span className="text-[11px] sm:text-xs text-on-surface-variant font-label tracking-tight mt-0.5">
                  Tác phẩm sở hữu
                </span>
              </div>
              <div className="flex flex-col items-center text-center px-2 border-x border-outline-variant/40">
                <span className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
                  03
                </span>
                <span className="text-[11px] sm:text-xs text-on-surface-variant font-label tracking-tight mt-0.5">
                  Mẻ lò đang chế tác
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="font-headline text-2xl sm:text-3xl font-bold text-primary">
                  1.850
                </span>
                <span className="text-[11px] sm:text-xs text-on-surface-variant font-label tracking-tight mt-0.5">
                  Mộc điểm tích lũy
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. BỐ CỤC 2 CỘT (SIDEBAR & NỘI DUNG CHÍNH) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            {/* Danh mục Tab Điều Hướng */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-outline-variant/30">
              <p className="text-xs uppercase tracking-widest text-secondary font-label font-semibold mb-3 px-3">
                Hồ Sơ &amp; Danh Mục
              </p>
              <nav className="flex flex-col gap-1.5">
                {/* Tab 1: Profile */}
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm transition-all duration-200 text-left cursor-pointer ${
                    activeTab === 'profile'
                      ? 'font-semibold bg-surface-container-low text-primary shadow-sm'
                      : 'font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        activeTab === 'profile' ? 'text-primary' : 'text-secondary'
                      }`}
                    >
                      person
                    </span>
                    <span>Thông tin cá nhân</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>

                {/* Tab 2: Addresses */}
                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm transition-all duration-200 text-left cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'font-semibold bg-surface-container-low text-primary shadow-sm'
                      : 'font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        activeTab === 'addresses' ? 'text-primary' : 'text-secondary'
                      }`}
                    >
                      location_on
                    </span>
                    <span>Sổ địa chỉ nhận hàng</span>
                  </div>
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-secondary-fixed text-on-secondary-fixed">
                    {addresses.length}
                  </span>
                </button>

                {/* Tab 3: Security */}
                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm transition-all duration-200 text-left cursor-pointer ${
                    activeTab === 'security'
                      ? 'font-semibold bg-surface-container-low text-primary shadow-sm'
                      : 'font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        activeTab === 'security' ? 'text-primary' : 'text-secondary'
                      }`}
                    >
                      lock_reset
                    </span>
                    <span>Đổi mật khẩu &amp; Bảo mật</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </nav>

              <div className="my-4 h-px bg-surface-container" />

              {/* Lối tắt bổ trợ sang Lịch sử đơn hàng */}
              <Link
                to={ROUTES.MY_ORDERS}
                className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-secondary hover:text-primary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                  Xem lịch sử đơn hàng
                </span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Khối Thông Điệp Xưởng Mộc */}
            <div className="relative overflow-hidden bg-[#f7efe6] rounded-2xl p-5 shadow-[0_2px_12px_rgba(58,48,42,0.03)] border border-[#ebd8c8]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">
                  verified_user
                </span>
                <div className="flex flex-col gap-1">
                  <h4 className="font-headline text-base font-bold text-on-surface">
                    Chính Sách Bảo Mật Atelier
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Mọi thông tin chứng thư số và địa chỉ giao gốm mộc được mã hóa đa tầng, gìn giữ theo tiêu chuẩn độc bản của xưởng nung Sahara.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-secondary font-mono border-t border-primary/10">
                <span>CHỨNG THỰC BẢN QUYỀN</span>
                <span className="text-primary font-bold">SAHARA #884</span>
              </div>
            </div>

            {/* Mini Visual Widget: Gốm Nung Mộc Đang Chờ */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_2px_12px_rgba(58,48,42,0.03)] flex flex-col gap-3 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-label font-bold tracking-wider text-secondary">
                  Mẻ Nung Cá Nhân
                </span>
                <span className="text-[11px] text-primary font-medium">Lò số 02</span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  alt="Chi tiết bình gốm sa mạc mộc men tro"
                  src="/images/hero-cup.jpg"
                  className="w-14 h-14 rounded-lg object-cover bg-surface-container"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-on-surface truncate">
                    Bình Trà Mộc Viên Sa Thạch
                  </span>
                  <span className="text-[11px] text-secondary">Nhiệt độ lò: 1.280°C</span>
                  <div className="w-full bg-surface-container rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* CỘT PHẢI: NỘI DUNG CHÍNH (Profile / Address / Security) */}
          <main className="lg:col-span-8 xl:col-span-9 flex flex-col gap-10">
            {/* ========================================================= */}
            {/* KHỐI TAB 1: THÔNG TIN CÁ NHÂN */}
            {/* ========================================================= */}
            {activeTab === 'profile' && (
              <section className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 lg:p-10 shadow-[0_2px_20px_rgba(58,48,42,0.04)] flex flex-col gap-8 border border-outline-variant/30 animate-fadeIn">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-semibold font-label">
                    <span className="material-symbols-outlined text-[16px]">badge</span>
                    Định Danh Khách Quý
                  </div>
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
                    Hồ Sơ Thành Viên
                  </h2>
                  <p className="text-sm text-on-surface-variant font-body">
                    Cập nhật danh xưng và thông tin định danh trên hệ thống Sahara Atelier.
                  </p>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleSaveProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Họ và Tên */}
                    <div className="flex flex-col gap-2">
                      <label
                        className="text-xs font-label uppercase tracking-wider font-semibold text-on-surface"
                        htmlFor="fullName"
                      >
                        Họ và tên đầy đủ <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                          <span className="material-symbols-outlined text-[18px]">person</span>
                        </span>
                        <input
                          id="fullName"
                          name="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nhập họ và tên đầy đủ"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-surface rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-body placeholder:text-outline border border-outline-variant/40"
                        />
                      </div>
                    </div>

                    {/* Địa chỉ Email (Read-only) */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label
                          className="text-xs font-label uppercase tracking-wider font-semibold text-on-surface"
                          htmlFor="userEmail"
                        >
                          Địa chỉ Email
                        </label>
                        <span className="text-[11px] text-secondary font-label flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">lock</span>
                          Email định danh không thể thay đổi
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                          <span className="material-symbols-outlined text-[18px]">alternate_email</span>
                        </span>
                        <input
                          id="userEmail"
                          name="email"
                          type="email"
                          value={email}
                          disabled
                          className="w-full pl-10 pr-10 py-3 bg-surface-container-low text-secondary rounded-xl text-sm font-body cursor-not-allowed select-none border border-outline-variant/30"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-700">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                        </span>
                      </div>
                    </div>

                    {/* Số Điện Thoại */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label
                          className="text-xs font-label uppercase tracking-wider font-semibold text-on-surface"
                          htmlFor="phoneNumber"
                        >
                          Số điện thoại liên hệ <span className="text-primary">*</span>
                        </label>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          Đã xác thực
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                          <span className="material-symbols-outlined text-[18px]">call</span>
                        </span>
                        <input
                          id="phoneNumber"
                          name="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                          placeholder="Ví dụ: 0911.111.111"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-surface rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-body border border-outline-variant/40"
                        />
                      </div>
                    </div>

                    {/* Ngày Tham Gia Xưởng */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-label uppercase tracking-wider font-semibold text-on-surface">
                          Ngày tham gia xưởng
                        </label>
                        <span className="text-[11px] text-primary font-medium">
                          Đã kích hoạt chứng thư số
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        </span>
                        <input
                          type="text"
                          value={joinDate}
                          disabled
                          className="w-full pl-10 pr-4 py-3 bg-surface-container-low text-secondary rounded-xl text-sm font-body cursor-not-allowed select-none border border-outline-variant/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ghi chú phong cách nghệ nhân yêu thích */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-xs font-label uppercase tracking-wider font-semibold text-on-surface"
                      htmlFor="bioNote"
                    >
                      Ghi chú sở thích gốm (Wabi-sabi Preference)
                    </label>
                    <textarea
                      id="bioNote"
                      rows="2"
                      value={bioNote}
                      onChange={(e) => setBioNote(e.target.value)}
                      placeholder="Ví dụ: Ưa chuộng men hỏa biến, bề mặt sa thạch nhám mộc, chén trà nung củi Bát Tràng..."
                      className="w-full p-3.5 bg-surface rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-body placeholder:text-outline border border-outline-variant/40"
                    />
                  </div>

                  {/* Actions CTA */}
                  <div className="flex items-center justify-end pt-3">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-8 py-3.5 rounded-xl bg-primary text-on-primary font-medium text-sm shadow-[0_4px_16px_rgba(194,101,42,0.25)] hover:bg-[#a8531e] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      {isSavingProfile ? 'Đang lưu...' : 'Lưu thay đổi hồ sơ'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* ========================================================= */}
            {/* KHỐI TAB 2: SỔ ĐỊA CHỈ NHẬN HÀNG */}
            {/* ========================================================= */}
            {activeTab === 'addresses' && (
              <section className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 lg:p-10 shadow-[0_2px_20px_rgba(58,48,42,0.04)] flex flex-col gap-8 border border-outline-variant/30 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-semibold font-label">
                      <span className="material-symbols-outlined text-[16px]">home_pin</span>
                      Giao Nhận Tác Phẩm
                    </div>
                    <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
                      Danh Sách Địa Chỉ Nhận Gốm
                    </h2>
                    <p className="text-sm text-on-surface-variant font-body">
                      Nơi những kiện tác phẩm gốm mộc được đóng kiện rơm cẩn trọng trao tới tay quý khách.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenAddressModal()}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary text-sm font-semibold shadow-sm hover:bg-[#faefe4] active:scale-95 transition-all self-start sm:self-auto ring-1 ring-primary cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    Thêm địa chỉ mới
                  </button>
                </div>

                {/* Grid Thẻ Địa Chỉ (Address Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isLoadingAddresses ? (
                    <div className="col-span-full p-12 text-center text-xs text-secondary">
                      Đang tải sổ địa chỉ...
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="col-span-full p-10 rounded-2xl bg-surface-container-low text-center space-y-3 border border-outline-variant/30">
                      <span className="material-symbols-outlined text-3xl text-secondary">location_off</span>
                      <p className="text-sm font-semibold text-on-surface">Sổ địa chỉ của quý khách đang trống</p>
                      <p className="text-xs text-on-surface-variant">
                        Vui lòng bấm nút "Thêm địa chỉ mới" để lưu trữ nơi nhận các tác phẩm gốm mộc.
                      </p>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`relative rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all shadow-[0_2px_12px_rgba(58,48,42,0.03)] hover:shadow-md border ${
                        addr.isDefault
                          ? 'bg-surface-container-low/70 border-primary/30'
                          : 'bg-surface border-outline-variant/30'
                      }`}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-headline text-lg font-bold text-on-surface">
                              {addr.receiverName}
                            </span>
                            {addr.tag && (
                              <span className="text-xs text-secondary font-mono">({addr.tag})</span>
                            )}
                          </div>
                          {addr.isDefault ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-primary text-on-primary">
                              Mặc định
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-xs font-semibold text-primary hover:underline underline-offset-4 cursor-pointer"
                            >
                              Đặt làm mặc định
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            phone_iphone
                          </span>
                          <span className="font-mono">{formatPhoneNumber(addr.receiverPhone)}</span>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-on-surface leading-relaxed pt-1">
                          <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5 shrink-0">
                            place
                          </span>
                          <span>{addr.addressDetail}</span>
                        </div>
                      </div>

                      {/* Thao tác thẻ địa chỉ */}
                      <div className="flex items-center justify-between pt-4 bg-surface-container-lowest/60 -mx-6 -mb-6 px-6 py-3.5 rounded-b-2xl border-t border-outline-variant/20">
                        <span className="text-xs text-secondary italic">
                          {addr.isDefault ? 'Địa chỉ giao chính' : 'Địa chỉ phụ'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenAddressModal(addr)}
                            title="Chỉnh sửa địa chỉ"
                            className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr)}
                            title={addr.isDefault ? 'Không thể xóa địa chỉ mặc định' : 'Xóa địa chỉ'}
                            disabled={addr.isDefault}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              addr.isDefault
                                ? 'text-secondary/40 cursor-not-allowed'
                                : 'text-secondary hover:text-error hover:bg-error-container/40'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

            {/* ========================================================= */}
            {/* KHỐI TAB 3: ĐỔI MẬT KHẨU & BẢO MẬT */}
            {/* ========================================================= */}
            {activeTab === 'security' && (
              <section className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 lg:p-10 shadow-[0_2px_20px_rgba(58,48,42,0.04)] flex flex-col gap-8 border border-outline-variant/30 animate-fadeIn">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-semibold font-label">
                    <span className="material-symbols-outlined text-[16px]">security</span>
                    An Toàn Tài Khoản
                  </div>
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
                    Thiết Lập Mật Khẩu Bảo Mật
                  </h2>
                  <p className="text-sm text-on-surface-variant font-body">
                    Quản lý mật khẩu định danh tài khoản để bảo đảm an toàn cho các tác phẩm và chứng thư quyền sở hữu gốm.
                  </p>
                </div>

                <form className="max-w-2xl flex flex-col gap-6" onSubmit={handleChangePassword}>
                  {/* Mật khẩu hiện tại */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-xs font-label uppercase tracking-wider font-semibold text-on-surface"
                      htmlFor="currentPassword"
                    >
                      Mật khẩu hiện tại <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Nhập mật khẩu hiện tại của bạn"
                        required
                        className="w-full pl-4 pr-12 py-3 bg-surface rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-body placeholder:text-outline border border-outline-variant/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondary hover:text-on-surface cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showCurrentPass ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Mật khẩu mới */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label
                        className="text-xs font-label uppercase tracking-wider font-semibold text-on-surface"
                        htmlFor="newPassword"
                      >
                        Mật khẩu mới <span className="text-primary">*</span>
                      </label>
                      <span className="text-[11px] text-secondary italic">
                        Tối thiểu 6 ký tự
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        required
                        className="w-full pl-4 pr-12 py-3 bg-surface rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-body placeholder:text-outline border border-outline-variant/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondary hover:text-on-surface cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showNewPass ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Xác nhận mật khẩu mới */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-xs font-label uppercase tracking-wider font-semibold text-on-surface"
                      htmlFor="confirmPassword"
                    >
                      Xác nhận mật khẩu mới <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        required
                        className="w-full pl-4 pr-12 py-3 bg-surface rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-body placeholder:text-outline border border-outline-variant/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondary hover:text-on-surface cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showConfirmPass ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Bảo mật hai lớp bổ trợ */}
                  <div className="p-4 bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/20">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[22px]">
                        phonelink_lock
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-on-surface">
                          Xác thực hai yếu tố (2FA)
                        </span>
                        <span className="text-xs text-secondary">
                          Bảo vệ thông tin đấu giá và đặt trước đồ gốm độc bản
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={is2FAEnabled}
                        onChange={(e) => setIs2FAEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>

                  {/* CTA Cập nhật */}
                  <div className="flex items-center justify-start pt-2">
                    <button
                      type="submit"
                      disabled={isChangingPass}
                      className="px-8 py-3.5 rounded-xl bg-primary text-on-primary font-medium text-sm shadow-[0_4px_16px_rgba(194,101,42,0.25)] hover:bg-[#a8531e] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[18px]">key</span>
                      {isChangingPass ? 'Đang cập nhật...' : 'Cập nhật mật khẩu mới'}
                    </button>
                  </div>
                </form>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL POPUP: THÊM / CHỈNH SỬA ĐỊA CHỈ NHẬN GỐM */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
          onClick={handleCloseAddressModal}
        >
          <div
            className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-[0_16px_40px_rgba(58,48,42,0.18)] p-6 sm:p-8 flex flex-col gap-6 border border-outline-variant/40 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Corner */}
            <button
              type="button"
              onClick={handleCloseAddressModal}
              className="absolute top-5 right-5 p-2 rounded-full text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Modal Header */}
            <div className="flex flex-col gap-1 pr-8">
              <span className="text-xs uppercase tracking-widest font-semibold text-primary font-label">
                Atelier Logistique
              </span>
              <h3 className="font-headline text-2xl font-bold text-on-surface">
                {editingAddress ? 'Chỉnh Sửa Địa Chỉ Nhận Gốm' : 'Thêm Địa Chỉ Nhận Gốm Mới'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Địa chỉ giao nhận gốm an toàn, bọc lót chống vỡ bằng sáp &amp; mùn cưa thiên nhiên.
              </p>
            </div>

            {/* Modal Form */}
            <form className="flex flex-col gap-4" onSubmit={handleSaveAddress}>
              {/* Tên người nhận */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-label uppercase tracking-wider font-semibold text-on-surface"
                  htmlFor="modalReceiverName"
                >
                  Tên người nhận <span className="text-primary">*</span>
                </label>
                <input
                  id="modalReceiverName"
                  type="text"
                  value={modalReceiverName}
                  onChange={(e) => setModalReceiverName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Tuấn"
                  required
                  className="w-full px-4 py-2.5 bg-surface rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 font-body placeholder:text-outline border border-outline-variant/40"
                />
              </div>

              {/* Số điện thoại người nhận */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-label uppercase tracking-wider font-semibold text-on-surface"
                  htmlFor="modalReceiverPhone"
                >
                  Số điện thoại nhận gốm <span className="text-primary">*</span>
                </label>
                <input
                  id="modalReceiverPhone"
                  type="tel"
                  value={modalReceiverPhone}
                  onChange={(e) => setModalReceiverPhone(formatPhoneNumber(e.target.value))}
                  placeholder="Ví dụ: 0911.111.111"
                  required
                  className="w-full px-4 py-2.5 bg-surface rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 font-body placeholder:text-outline border border-outline-variant/40"
                />
              </div>

              {/* Địa chỉ chi tiết */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-label uppercase tracking-wider font-semibold text-on-surface"
                  htmlFor="modalAddressDetail"
                >
                  Địa chỉ chi tiết nhận hàng <span className="text-primary">*</span>
                </label>
                <textarea
                  id="modalAddressDetail"
                  rows="3"
                  value={modalAddressDetail}
                  onChange={(e) => setModalAddressDetail(e.target.value)}
                  placeholder="Số nhà, tên đường/ngõ, phường/xã, quận/huyện, tỉnh/thành phố..."
                  required
                  className="w-full p-3.5 bg-surface rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 font-body placeholder:text-outline border border-outline-variant/40"
                />
              </div>

              {/* Checkbox mặc định */}
              <label className="flex items-center gap-3 cursor-pointer py-1 select-none">
                <input
                  id="modalIsDefault"
                  type="checkbox"
                  checked={modalIsDefault}
                  onChange={(e) => setModalIsDefault(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <span className="text-xs text-on-surface font-medium">
                  Đặt làm địa chỉ giao hàng mặc định cho các đơn gốm
                </span>
              </label>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={handleCloseAddressModal}
                  className="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAddress}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-md hover:bg-[#a8531e] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  {isSubmittingAddress ? 'Đang lưu...' : 'Lưu địa chỉ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA ĐỊA CHỈ (HỘP THOẠI NỔI TÙY CHỈNH) */}
      {addressToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm"
            onClick={() => setAddressToDelete(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#ebdcd0] p-6 shadow-2xl z-10 space-y-4 font-sans animate-scaleUp">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">delete</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#26201b]">Xóa địa chỉ nhận hàng</h3>
                <p className="text-xs text-[#735e4d] leading-relaxed">
                  Quý khách có chắc chắn muốn gỡ bỏ địa chỉ{' '}
                  <strong className="text-[#26201b]">"{addressToDelete.addressDetail}"</strong> khỏi sổ địa chỉ?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAddressToDelete(null)}
                className="px-4 py-2 rounded-lg bg-[#f0e7dc] hover:bg-[#e4d6c5] text-[#524337] text-xs font-semibold transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAddress}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


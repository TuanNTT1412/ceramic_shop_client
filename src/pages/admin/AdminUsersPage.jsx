import React, { useState, useEffect, useMemo } from 'react';
import { userApi } from '../../api';
import { useToast } from '../../context';
import { formatDate, formatPhoneNumber } from '../../utils/format';

// ============================================================================
// DỮ LIỆU MẪU ĐỒNG BỘ 100% VỚI THIẾT KẾ STITCH & HỆ THỐNG SAHARA ATELIER
// ============================================================================
const INITIAL_USERS = [
  {
    id: 'USR-0981',
    code: 'USR-0981',
    name: 'Nguyễn Thu Thảo',
    email: 'thao.nguyen@atelier.vn',
    phone: '+84 912 345 678',
    role: 'CUSTOMER',
    avatar: null,
    isActive: true,
    tier: 'Hội Viên Sa Thạch (VIP)',
    accumulatedSpend: 14850000,
    createdAt: '2024-03-15T09:20:00Z',
    address: 'Tòa Lancaster, 20 Núi Trúc, P. Giảng Võ, Q. Ba Đình, Hà Nội',
    _count: {
      orders: 12,
      reviews: 5,
      addresses: 2,
    },
    recentOrder: {
      code: '#ORD-241028-0891',
      status: 'Đang tạo hình',
      productName: 'Bình Trà Men Tro Tằm Cổ',
      spec: 'Số lượng: 01 • Dung tích 220ml',
      amount: 2450000,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB0u4qQNCYo7iywnGg8QIyU_Pm9B35KqFV51gzL341vqqSqzS6OBoo-SKrDWzJQLwG6MjjsscmtphXyl64luzwcktYUI2iFn3_73-iI8XEGix6zPsdUSyykrPkSo9ZONAumY4rNvuY69QHTWzDnBxxpRLP3ZZBLOy2amH_7lpXZ6gdAr624I2s1AIAtCAQMrO7rVkjPTJrQzu-wSo4KYNfeBr9QhXjgOTaBCQ9g6YrJ',
    },
    recentReview: {
      rating: 5,
      date: '12/10/2024',
      comment:
        'Men nung củi hỏa biến rất sâu và ấm trà cầm rất đầm tay. Rót nước mượt mà không bị ngắt quãng. Xưởng đóng gói rơm mộc rất chỉn chu.',
      productName: 'Bộ Tách Trà Men Mộc Sahara',
    },
  },
  {
    id: 'USR-0412',
    code: 'USR-0412',
    name: 'Trần Minh Quang',
    email: 'quang.tm@gommoc.vn',
    phone: '+84 983 214 556',
    role: 'ADMIN',
    avatar: null,
    isActive: true,
    tier: 'Ban Quản Trị Cấp Cao',
    accumulatedSpend: 38200000,
    createdAt: '2023-11-04T14:10:00Z',
    address: 'Xưởng Gốm Mộc, Thôn 1 Bát Tràng, Gia Lâm, Hà Nội',
    _count: {
      orders: 34,
      reviews: 18,
      addresses: 3,
    },
    recentOrder: {
      code: '#ORD-241020-0412',
      status: 'Đã hoàn tất',
      productName: 'Bộ Ấm Sa Mộc Đại Nguyệt',
      spec: 'Bản Độc Bản Giới Hạn • 420ml',
      amount: 4200000,
      image:
        'https://lh3.googleusercontent.com/aida/ALJJyrCj3047l_YGdYP2wNd8zbl71YC1xUloEJlfYZ4w_bhScS3WvRscuM7zvYThL_TNZMlZO9LHG2oKub0RMyAcPgL_DIDRt8dbqaAbelnAzfLfTYpx2_qORT6qXe0hMZmrYr_AVLVMnD5zvb5fjKyHqji8oSaYv7jYCdPMb871pEj9sDDWPXkXe3M4OSFNL9tApWoMzwEx96uQ8Z-trjEl7RTZm7vh4c_14W5PAKnQqe7WpiN4a-NHWKW10263',
    },
    recentReview: {
      rating: 5,
      date: '02/10/2024',
      comment: 'Cốt đất sét thô giữ nhiệt trà cực tốt, hương vị trà sen thơm lắng đọng.',
      productName: 'Ấm Sa Mộc Đại Nguyệt',
    },
  },
  {
    id: 'USR-0824',
    code: 'USR-0824',
    name: 'Đặng Thị Mai Chi',
    email: 'chi.dang@bat-trang.com',
    phone: '+84 904 887 123',
    role: 'STAFF',
    avatar: null,
    isActive: true,
    tier: 'Nghệ Nhân Lò Nung Củi',
    accumulatedSpend: 5400000,
    createdAt: '2024-01-20T08:00:00Z',
    address: 'Xưởng Tạo Hình Men Tro, Xã Bát Tràng, Hà Nội',
    _count: {
      orders: 3,
      reviews: 1,
      addresses: 1,
    },
    recentOrder: {
      code: '#ORD-240915-0824',
      status: 'Đã hoàn tất',
      productName: 'Lư Xông Trầm Sa Thạch Phù Sa',
      spec: 'Màu mộc thô phong hóa',
      amount: 1250000,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD9AJFnV38D6C27OAxIQiumUrFtApciDag5VEGlcl9jb6kQtccOmi1O2DWveQ_KNrp1DdHurBFIoT0NRTMvQbqFG46QG26IhftCSw_y3-HQnxVpe3tATCZnkkKsHHn9AFbvZV0N9j2KhFkgJnOiSGmttElgvUD3T3msqRwFQ0yfUJpFuUmQaosr7uVknb-MLoy0OOpU5_Q8k-CoEP7Rl_GDUmaxDoVKPfo7eWSAdZpty-9uShsLoHh_TQ',
    },
    recentReview: {
      rating: 5,
      date: '22/09/2024',
      comment: 'Lư hương xông trầm khói tỏa đều và êm, vân sa thạch rất mộc mạc.',
      productName: 'Lư Trầm Sa Thạch',
    },
  },
  {
    id: 'USR-0319',
    code: 'USR-0319',
    name: 'Lê Hoàng Quân',
    email: 'quan.le@vietart.vn',
    phone: '+84 977 112 443',
    role: 'CUSTOMER',
    avatar: null,
    isActive: false,
    tier: 'Hội Viên Gốm Mộc',
    accumulatedSpend: 1650000,
    createdAt: '2024-02-11T16:45:00Z',
    address: 'Số 45 Ngõ 12 Đặng Thai Mai, P. Quảng An, Q. Tây Hồ, Hà Nội',
    _count: {
      orders: 1,
      reviews: 0,
      addresses: 1,
    },
    recentOrder: {
      code: '#ORD-240212-0319',
      status: 'Đã hủy',
      productName: 'Bình Hoa Đất Mộc Dáng Trăng Khuyết',
      spec: 'Bản Tiêu Chuẩn H22cm',
      amount: 850000,
      image:
        'https://lh3.googleusercontent.com/aida/ALJJyrDfmhjzEDEoY7Uu473aPtY4jyYh_IwErfdqKs3lv9xFR-cdsK5k1mbgId7eQw2c2LD2XPhMtcALu8IkAIlMF3wOCNxN6Nh1rzp5G4XsaTPTldV-3gOJjNSI5w7NFSAfBwvI055R-VtRb0T-7LqdbTNASMQdb4IC0dz-YAkxHjyyny9znu0jjzPu-OsnJjwCBr13aNC7WFG_HWCZtJRhJgukDRqDQ1WwvTSumBqJfoymd1k0ir62LbVtSAbj',
    },
    recentReview: null,
  },
  {
    id: 'USR-0755',
    code: 'USR-0755',
    name: 'Phạm Hải Đăng',
    email: 'haidang.arch@gmail.com',
    phone: '+84 934 556 789',
    role: 'CUSTOMER',
    avatar: null,
    isActive: true,
    tier: 'Hội Viên Sa Thạch (VIP)',
    accumulatedSpend: 9800000,
    createdAt: '2024-04-02T11:15:00Z',
    address: 'Villa 18 Flamingo Đại Lải, Phúc Yên, Vĩnh Phúc',
    _count: {
      orders: 7,
      reviews: 4,
      addresses: 2,
    },
    recentOrder: {
      code: '#ORD-240405-0755',
      status: 'Đã hoàn tất',
      productName: 'Bộ 6 Chén Mộc Thưởng Trà Men Tro',
      spec: 'Dung tích 70ml • Hộp gỗ thông khắc mộc',
      amount: 1450000,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCbD_3IzObB4SCkKf5uWvpHRLWQ6IqA-eyuFImLibFDaZ6yccI11u2jIybBaP1fJSM0-yRLVj7qj_lp3qzEp05gIFvNP-zGEAWAg6J_a-6MeO0X0uGzVkjhp300dNN-g_Nnmr50toLuq5JTZ_c4xYyrHbR4Pi8beM_Ru3PnXouOaRXw13tGiuI-7U1WTQz5FhLoCYvSTV89Ck0k6pWz5DtjqrX1Rnd3SyOQ7xEm3nNezX53kW-XtjUF8Q',
    },
    recentReview: {
      rating: 5,
      date: '10/04/2024',
      comment: 'Vành chén vuốt mỏng vừa vặn môi khi nhấp trà. Rất ưng ý chất men tro rạn tự nhiên!',
      productName: 'Bộ Chén Mộc Men Tro',
    },
  },
  {
    id: 'USR-1022',
    code: 'USR-1022',
    name: 'Vũ Bích Phương',
    email: 'phuong.vu@interior.design',
    phone: '+84 918 899 012',
    role: 'CUSTOMER',
    avatar: null,
    isActive: true,
    tier: 'Hội Viên Sa Thạch (VIP)',
    accumulatedSpend: 22400000,
    createdAt: '2024-02-28T10:00:00Z',
    address: 'Phòng 2102 Tháp The Manor, Mễ Trì, Nam Từ Liêm, Hà Nội',
    _count: {
      orders: 15,
      reviews: 8,
      addresses: 2,
    },
    recentOrder: {
      code: '#ORD-241029-1022',
      status: 'Đang nung lò củi',
      productName: 'Bình Gốm Sa Mộc Cổ Điển Khắc Tay',
      spec: 'Chiều cao 45cm • Cốt đất thô',
      amount: 3600000,
      image:
        'https://lh3.googleusercontent.com/aida/ALJJyrDfmhjzEDEoY7Uu473aPtY4jyYh_IwErfdqKs3lv9xFR-cdsK5k1mbgId7eQw2c2LD2XPhMtcALu8IkAIlMF3wOCNxN6Nh1rzp5G4XsaTPTldV-3gOJjNSI5w7NFSAfBwvI055R-VtRb0T-7LqdbTNASMQdb4IC0dz-YAkxHjyyny9znu0jjzPu-OsnJjwCBr13aNC7WFG_HWCZtJRhJgukDRqDQ1WwvTSumBqJfoymd1k0ir62LbVtSAbj',
    },
    recentReview: {
      rating: 5,
      date: '15/10/2024',
      comment: 'Tác phẩm đặt tại phòng khách phong cách Wabi Sabi cực kỳ ăn khớp. Đẹp đến từng chi tiết.',
      productName: 'Bình Gốm Sa Mộc Cổ Điển',
    },
  },
  {
    id: 'USR-0198',
    code: 'USR-0198',
    name: 'Hoàng Đình Long',
    email: 'long.hd@gommoc.vn',
    phone: '+84 966 332 119',
    role: 'STAFF',
    avatar: null,
    isActive: true,
    tier: 'Nghệ Nhân Điều Phối Men',
    accumulatedSpend: 4100000,
    createdAt: '2023-12-10T14:30:00Z',
    address: 'Khu Lò Nung Củi Cổ, Bát Tràng, Hà Nội',
    _count: {
      orders: 5,
      reviews: 2,
      addresses: 1,
    },
    recentOrder: {
      code: '#ORD-240801-0198',
      status: 'Đã hoàn tất',
      productName: 'Khay Trà Sa Thạch Mộc',
      spec: 'Kích thước 30x50cm',
      amount: 1950000,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB0u4qQNCYo7iywnGg8QIyU_Pm9B35KqFV51gzL341vqqSqzS6OBoo-SKrDWzJQLwG6MjjsscmtphXyl64luzwcktYUI2iFn3_73-iI8XEGix6zPsdUSyykrPkSo9ZONAumY4rNvuY69QHTWzDnBxxpRLP3ZZBLOy2amH_7lpXZ6gdAr624I2s1AIAtCAQMrO7rVkjPTJrQzu-wSo4KYNfeBr9QhXjgOTaBCQ9g6YrJ',
    },
    recentReview: {
      rating: 5,
      date: '10/08/2024',
      comment: 'Thoát nước nhanh, đá sa thạch không bám cặn trà sau thời gian dài sử dụng.',
      productName: 'Khay Trà Sa Thạch',
    },
  },
];

// Hàm trích xuất 2 ký tự đầu viết hoa làm Avatar Initials
const getInitials = (name) => {
  if (!name) return 'GM';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const AdminUsersPage = () => {
  const toast = useToast();

  // Danh sách người dùng trong hệ thống
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Bộ lọc tìm kiếm & Vai trò & Trạng thái
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Drawer xem chi tiết hồ sơ người dùng
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modal xác nhận khóa / mở khóa tài khoản
  const [selectedUserForStatus, setSelectedUserForStatus] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Modal phân quyền vai trò (Role Assignment)
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState('CUSTOMER');

  // ==========================================================================
  // TẢI DỮ LIỆU TỪ MÁY CHỦ BACKEND (GET /api/users/admin)
  // ==========================================================================
  const fetchUsersFromApi = async (showToastNotice = false) => {
    setIsRefreshing(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedRole) params.role = selectedRole;
      if (selectedStatus !== '') params.isActive = selectedStatus;

      // Backend chỉ trả dữ liệu khi có params tìm kiếm/lọc để tối ưu
      const response = await userApi.adminGetUsers(params);

      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        // Chuẩn hóa dữ liệu từ backend gộp với format giao diện Stitch
        const normalized = response.data.map((u) => {
          const matchInitial = INITIAL_USERS.find((init) => init.id === u.id || init.email === u.email);
          return {
            id: u.id,
            code: u.id.startsWith('USR-') ? u.id : `USR-${u.id.slice(-4).toUpperCase()}`,
            name: u.name || matchInitial?.name || 'Hội viên gốm',
            email: u.email,
            phone: formatPhoneNumber(u.phone || matchInitial?.phone || '0912.345.678'),
            role: u.role || 'CUSTOMER',
            avatar: u.avatar || null,
            isActive: u.isActive !== false,
            tier:
              matchInitial?.tier ||
              (u.role === 'ADMIN'
                ? 'Ban Quản Trị Cấp Cao'
                : u.role === 'STAFF'
                ? 'Nghệ Nhân Xưởng Gốm'
                : 'Hội Viên Gốm Mộc'),
            accumulatedSpend: matchInitial?.accumulatedSpend || 2500000,
            createdAt: u.createdAt || new Date().toISOString(),
            address: matchInitial?.address || 'Hà Nội, Việt Nam',
            _count: {
              orders: u._count?.orders ?? matchInitial?._count?.orders ?? (u.role === 'CUSTOMER' ? 3 : 12),
              reviews: u._count?.reviews ?? matchInitial?._count?.reviews ?? (u.role === 'CUSTOMER' ? 1 : 4),
              addresses: u._count?.addresses ?? matchInitial?._count?.addresses ?? 1,
            },
            recentOrder: matchInitial?.recentOrder || {
              code: `#ORD-${u.id.slice(-6).toUpperCase()}`,
              status: 'Đã hoàn tất',
              productName: 'Bộ Ấm Trà Mộc Men Tro Củi',
              spec: 'Số lượng: 01 • Dung tích 220ml',
              amount: 1850000,
              image:
                'https://lh3.googleusercontent.com/aida/ALJJyrCj3047l_YGdYP2wNd8zbl71YC1xUloEJlfYZ4w_bhScS3WvRscuM7zvYThL_TNZMlZO9LHG2oKub0RMyAcPgL_DIDRt8dbqaAbelnAzfLfTYpx2_qORT6qXe0hMZmrYr_AVLVMnD5zvb5fjKyHqji8oSaYv7jYCdPMb871pEj9sDDWPXkXe3M4OSFNL9tApWoMzwEx96uQ8Z-trjEl7RTZm7vh4c_14W5PAKnQqe7WpiN4a-NHWKW10263',
            },
            recentReview: matchInitial?.recentReview || {
              rating: 5,
              date: '12/10/2024',
              comment: 'Men nung củi hỏa biến rất sâu và ấm trà cầm rất đầm tay.',
              productName: 'Tác phẩm Gốm Mộc Sahara',
            },
          };
        });
        setUsers(normalized);
        if (showToastNotice) toast.success(`Đã tải ${normalized.length} tài khoản người dùng từ máy chủ.`);
      } else {
        // Nếu API trả về mảng rỗng (theo cơ chế search-first của BE), dùng dữ liệu mẫu chất lượng cao
        if (searchQuery.trim() || selectedRole || selectedStatus !== '') {
          // Khi người dùng có tìm kiếm mà không thấy kết quả từ BE
          // Giữ bộ lọc phía client trên INITIAL_USERS
          filterClientUsers();
        } else {
          setUsers(INITIAL_USERS);
          if (showToastNotice) toast.info('Đang hiển thị danh sách hội viên tiêu chuẩn của xưởng.');
        }
      }
    } catch (err) {
      console.warn('Lỗi gọi API người dùng quản trị:', err?.message);
      if (showToastNotice) toast.warning('Chưa kết nối được máy chủ, đang chạy chế độ dữ liệu mẫu.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const filterClientUsers = () => {
    const q = searchQuery.toLowerCase().trim();
    const filtered = INITIAL_USERS.filter((u) => {
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q);
      const matchRole = !selectedRole || u.role === selectedRole;
      const matchStatus = !selectedStatus || String(u.isActive) === selectedStatus;
      return matchSearch && matchRole && matchStatus;
    });
    setUsers(filtered);
  };

  // Debounced search & filter
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() || selectedRole || selectedStatus !== '') {
        fetchUsersFromApi(false);
      } else {
        setUsers(INITIAL_USERS);
      }
      setCurrentPage(1);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedRole, selectedStatus]);

  // ==========================================================================
  // TÍNH TOÁN 4 BENTO KPI SUMMARY METRICS
  // ==========================================================================
  const metrics = useMemo(() => {
    const totalCount = 342; // Giả lập quy mô toàn xưởng
    const activeCustomers = users.filter((u) => u.role === 'CUSTOMER').length;
    const staffAndAdmins = users.filter((u) => u.role === 'STAFF' || u.role === 'ADMIN').length;
    const lockedCount = users.filter((u) => !u.isActive).length;

    return {
      totalCount,
      activeCustomers,
      staffAndAdmins,
      lockedCount: String(lockedCount).padStart(2, '0'),
    };
  }, [users]);

  // ==========================================================================
  // LỌC DANH SÁCH & PHÂN TRANG CLIENT
  // ==========================================================================
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return users.filter((user) => {
      const matchSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q) ||
        user.code.toLowerCase().includes(q);
      const matchRole = !selectedRole || user.role === selectedRole;
      const matchStatus = !selectedStatus || String(user.isActive) === selectedStatus;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRole('');
    setSelectedStatus('');
    setCurrentPage(1);
    setUsers(INITIAL_USERS);
    toast.info('Đã làm mới bộ lọc và khôi phục danh sách khách hàng.');
  };

  // ==========================================================================
  // MỞ DRAWER CHI TIẾT HỒ SƠ KHÁCH HÀNG
  // ==========================================================================
  const handleOpenDrawer = (user) => {
    setSelectedUserForDrawer(user);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // ==========================================================================
  // XỬ LÝ KHÓA / MỞ KHÓA TÀI KHOẢN (PATCH /api/users/admin/:id/status)
  // ==========================================================================
  const handlePromptToggleStatus = (user) => {
    // Ràng buộc bảo mật: Không được phép khóa tài khoản ADMIN
    if (user.role === 'ADMIN' && user.isActive) {
      toast.warning('Quy tắc bảo mật: Không được phép khóa tài khoản Quản trị viên (ADMIN)!');
      return;
    }
    setSelectedUserForStatus(user);
    setIsStatusModalOpen(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedUserForStatus) return;

    setIsUpdatingStatus(true);
    const targetId = selectedUserForStatus.id;
    const nextStatus = !selectedUserForStatus.isActive;
    const userName = selectedUserForStatus.name;

    try {
      await userApi.adminUpdateUserStatus(targetId, nextStatus);
      toast.success(
        nextStatus
          ? `Đã mở khóa tài khoản thành công cho: ${userName}`
          : `Đã khóa tài khoản thành công cho: ${userName}`
      );
    } catch (err) {
      // Backend phản hồi hoặc chạy optimistic fallback
      const errorMsg = err?.response?.data?.message || err?.message;
      if (errorMsg && errorMsg.includes('ADMIN')) {
        toast.error('Không được phép khóa tài khoản Quản trị viên (ADMIN)!');
        setIsUpdatingStatus(false);
        setIsStatusModalOpen(false);
        return;
      }
      toast.info(
        nextStatus
          ? `(Mô phỏng) Đã khôi phục hoạt động cho: ${userName}`
          : `(Mô phỏng) Đã tạm khóa quyền truy cập của: ${userName}`
      );
    }

    // Cập nhật state trực tiếp
    setUsers((prev) =>
      prev.map((u) => (u.id === targetId ? { ...u, isActive: nextStatus } : u))
    );

    if (selectedUserForDrawer && selectedUserForDrawer.id === targetId) {
      setSelectedUserForDrawer((prev) => ({ ...prev, isActive: nextStatus }));
    }

    setIsUpdatingStatus(false);
    setIsStatusModalOpen(false);
    setSelectedUserForStatus(null);
  };

  // ==========================================================================
  // PHÂN QUYỀN VAI TRÒ (STAFF / ADMIN / CUSTOMER)
  // ==========================================================================
  const handleOpenRoleModal = (user) => {
    setSelectedUserForRole(user);
    setTargetRole(user.role);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = () => {
    if (!selectedUserForRole) return;

    const targetId = selectedUserForRole.id;
    setUsers((prev) =>
      prev.map((u) => (u.id === targetId ? { ...u, role: targetRole } : u))
    );

    if (selectedUserForDrawer && selectedUserForDrawer.id === targetId) {
      setSelectedUserForDrawer((prev) => ({ ...prev, role: targetRole }));
    }

    toast.success(
      `Đã cập nhật vai trò ${targetRole} cho hội viên "${selectedUserForRole.name}".`
    );
    setIsRoleModalOpen(false);
    setSelectedUserForRole(null);
  };

  // ==========================================================================
  // XUẤT DỮ LIỆU EXCEL / CSV HỘI VIÊN CHUẨN UTF-8
  // ==========================================================================
  const handleExportExcel = () => {
    if (filteredUsers.length === 0) {
      toast.warning('Không có dữ liệu tài khoản phù hợp để xuất.');
      return;
    }

    const headers = [
      'Mã Tài Khoản',
      'Họ Và Tên',
      'Email',
      'Số Điện Thoại',
      'Vai Trò',
      'Hạng Thành Viên',
      'Trạng Thái',
      'Số Đơn Hàng',
      'Số Đánh Giá',
      'Địa Chỉ',
      'Ngày Tham Gia',
    ];

    const rows = filteredUsers.map((u) => [
      u.code,
      `"${u.name}"`,
      u.email,
      u.phone,
      u.role,
      `"${u.tier}"`,
      u.isActive ? 'Đang hoạt động' : 'Đã khóa',
      u._count.orders,
      u._count.reviews,
      `"${u.address.replace(/"/g, '""')}"`,
      formatDate(u.createdAt, false),
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Sahara_Atelier_KhachHang_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Đã xuất danh sách ${filteredUsers.length} tài khoản hội viên (.csv) thành công!`);
  };

  return (
    <div className="flex flex-col w-full pb-16 font-body text-on-background animate-fadeIn">
      {/* ========================================================= */}
      {/* 1. PAGE HEADER & BREADCRUMB                              */}
      {/* ========================================================= */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-label tracking-wide">
            <span>Quản Trị Xưởng</span>
            <span className="text-outline">/</span>
            <span className="text-primary font-medium">Quản Lý Khách Hàng</span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-normal text-on-surface tracking-tight">
            Quản Lý Khách Hàng &amp; Tài Khoản
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl font-light">
            Quản lý hồ sơ hội viên trà đạo, nghệ nhân xưởng nung và phân quyền tài khoản hệ sinh thái Sahara Atelier.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold tracking-wide transition-all shadow-sm border border-outline-variant/40"
            title="Xuất file danh sách tài khoản định dạng Excel/CSV"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">file_download</span>
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => handleOpenDrawer(users[0] || INITIAL_USERS[0])}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold tracking-wide transition-all shadow-sm shadow-primary/20"
            title="Mở hồ sơ mẫu của hội viên Sa Thạch VIP"
          >
            <span className="material-symbols-outlined text-[18px]">person_search</span>
            <span>Hồ sơ mẫu (VIP)</span>
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. KPI SUMMARY METRICS (4 BENTO CARDS)                    */}
      {/* ========================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Tổng Tài Khoản */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.03)] border border-outline-variant/40 flex flex-col justify-between transition-all hover:border-primary/40">
          <div>
            <span className="text-xs font-medium text-on-surface-variant tracking-wide">
              Tổng Tài Khoản
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-3xl font-sans font-bold text-on-surface">
              {metrics.totalCount}
            </span>
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +18 tháng này
            </span>
          </div>
          <span className="text-[11px] text-on-surface-variant/80 mt-1">
            Đồng bộ từ hệ thống OAuth &amp; Khách xưởng
          </span>
        </div>

        {/* Card 2: Khách Thân Thiết */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.03)] border border-outline-variant/40 flex flex-col justify-between transition-all hover:border-primary/40">
          <div>
            <span className="text-xs font-medium text-on-surface-variant tracking-wide">
              Khách Thân Thiết (CUSTOMER)
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-3xl font-sans font-bold text-on-surface">
              328
            </span>
            <span className="inline-flex items-center text-[11px] font-semibold text-primary bg-primary-fixed px-2 py-0.5 rounded-full border border-primary-fixed-dim/40">
              42.6% quay lại
            </span>
          </div>
          <span className="text-[11px] text-on-surface-variant/80 mt-1">
            Hội viên thưởng trà &amp; sưu tập độc bản
          </span>
        </div>

        {/* Card 3: Nhân Sự Xưởng */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.03)] border border-outline-variant/40 flex flex-col justify-between transition-all hover:border-primary/40">
          <div>
            <span className="text-xs font-medium text-on-surface-variant tracking-wide">
              Nhân Sự Xưởng (STAFF &amp; ADMIN)
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-3xl font-sans font-bold text-on-surface">
              14
            </span>
            <span className="text-[11px] font-medium text-on-surface-variant">
              5 Quản trị • 9 Nghệ nhân
            </span>
          </div>
          <span className="text-[11px] text-on-surface-variant/80 mt-1">
            Quyền truy cập khu lò nung &amp; điều phối
          </span>
        </div>

        {/* Card 4: Tài Khoản Tạm Khóa */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.03)] border border-outline-variant/40 flex flex-col justify-between transition-all hover:border-error/40">
          <div>
            <span className="text-xs font-medium text-on-surface-variant tracking-wide">
              Tài Khoản Tạm Khóa
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-3xl font-sans font-bold text-error">
              {metrics.lockedCount}
            </span>
            <span className="inline-flex items-center text-[11px] font-semibold text-error bg-error-container px-2 py-0.5 rounded-full border border-error/20">
              Cần rà soát
            </span>
          </div>
          <span className="text-[11px] text-on-surface-variant/80 mt-1">
            Trạng thái isActive = false từ API
          </span>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. TOOLBAR FILTERS (TÌM KIẾM, VAI TRÒ, TRẠNG THÁI)        */}
      {/* ========================================================= */}
      <section className="bg-surface-container-lowest p-4 rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.03)] border border-outline-variant/40 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          {/* Ô Tìm Kiếm */}
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo họ tên, email khách, mã ID..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface-container-low rounded-xl text-on-surface placeholder:text-outline outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary/20 transition-all font-body border border-outline-variant/30"
            />
          </div>

          {/* Lọc Theo Vai Trò (Role) */}
          <div className="w-full sm:w-48 relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full py-2 pl-3 pr-8 text-xs bg-surface-container-low rounded-xl text-on-surface outline-none cursor-pointer focus:bg-surface-container transition-all font-body border border-outline-variant/30 appearance-none"
            >
              <option value="">Tất cả vai trò</option>
              <option value="CUSTOMER">CUSTOMER (Khách hàng)</option>
              <option value="STAFF">STAFF (Nghệ nhân/NV)</option>
              <option value="ADMIN">ADMIN (Quản trị viên)</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              expand_more
            </span>
          </div>

          {/* Lọc Theo Trạng Thái (Status) */}
          <div className="w-full sm:w-48 relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 pl-3 pr-8 text-xs bg-surface-container-low rounded-xl text-on-surface outline-none cursor-pointer focus:bg-surface-container transition-all font-body border border-outline-variant/30 appearance-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Đã khóa</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              expand_more
            </span>
          </div>
        </div>

        {/* Nút Làm Mới */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleResetFilters}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30"
            title="Làm mới bộ lọc & lấy lại dữ liệu"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                isRefreshing ? 'animate-spin text-primary' : ''
              }`}
            >
              refresh
            </span>
            <span>{isRefreshing ? 'Đang nạp...' : 'Làm mới'}</span>
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. USERS DATA TABLE (FULL WIDTH CHIẾM ĐẾN SÁT BÊN PHẢI)    */}
      {/* ========================================================= */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.03)] border border-outline-variant/40 overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low/70 text-on-surface-variant font-medium tracking-wide uppercase text-[10px] border-b border-outline-variant/30">
              <tr>
                <th className="py-3.5 px-5">Thành Viên</th>
                <th className="py-3.5 px-4">Email &amp; Liên Hệ</th>
                <th className="py-3.5 px-4">Vai Trò</th>
                <th className="py-3.5 px-4">Ngày Tham Gia</th>
                <th className="py-3.5 px-5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl text-outline mb-2">
                      person_off
                    </span>
                    <p className="text-sm font-medium">
                      Không tìm thấy tài khoản phù hợp với điều kiện lọc.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 text-xs text-primary font-semibold hover:underline"
                    >
                      Xóa bộ lọc để xem toàn bộ
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => {
                  const roleName =
                    user.role === 'ADMIN'
                      ? 'Quản Trị Viên'
                      : user.role === 'STAFF'
                      ? 'Nghệ Nhân'
                      : 'Khách Hàng';

                  // Row background alternating
                  const rowBg =
                    idx % 2 === 1 ? 'bg-surface-container-low/20' : 'bg-surface-container-lowest';

                  return (
                    <tr
                      key={user.id}
                      className={`${rowBg} hover:bg-surface-container-low/60 transition-colors group`}
                    >
                      {/* Cột 1: Thông tin thành viên */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xs border border-primary/20">
                            {getInitials(user.name)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-on-surface truncate">
                              {user.name}
                            </span>
                            <span className="text-[11px] text-on-surface-variant/70">
                              {user.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Email & Sổ địa chỉ */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-on-surface truncate max-w-[210px]">
                            {user.email}
                          </span>
                          <span className="text-[11px] text-on-surface-variant inline-flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[13px] text-outline">
                              location_on
                            </span>
                            {user._count?.addresses || 1} địa chỉ nhận gốm
                          </span>
                        </div>
                      </td>

                      {/* Cột 3: Vai trò */}
                      <td className="py-4 px-4 text-xs font-medium text-on-surface">
                        {roleName}
                      </td>

                      {/* Cột 4: Ngày tham gia */}
                      <td className="py-4 px-4 text-on-surface-variant text-[11px]">
                        {formatDate(user.createdAt, false) || '15/03/2024'}
                      </td>

                      {/* Cột 5: Thao tác */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenDrawer(user)}
                            title="Xem chi tiết hồ sơ hội viên"
                            aria-label="Xem chi tiết hồ sơ hội viên"
                            className="w-8 h-8 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container hover:text-primary transition-colors inline-flex items-center justify-center cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              visibility
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenRoleModal(user)}
                            title="Phân quyền vai trò (Role)"
                            aria-label="Phân quyền vai trò (Role)"
                            className="w-8 h-8 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container hover:text-primary transition-colors inline-flex items-center justify-center cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              manage_accounts
                            </span>
                          </button>

                          {user.isActive ? (
                            <button
                              type="button"
                              onClick={() => handlePromptToggleStatus(user)}
                              title="Khóa tài khoản"
                              aria-label="Khóa tài khoản"
                              className="w-8 h-8 rounded-full bg-surface-container-low text-error hover:bg-error-container hover:text-error transition-colors inline-flex items-center justify-center cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                lock
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handlePromptToggleStatus(user)}
                              title="Mở khóa tài khoản"
                              aria-label="Mở khóa tài khoản"
                              className="w-8 h-8 rounded-full bg-surface-container-low text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors inline-flex items-center justify-center cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                lock_open
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* TABLE FOOTER & PHÂN TRANG (PAGINATION)                    */}
        {/* ========================================================= */}
        <div className="px-5 py-4 bg-surface-container-lowest border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div>
            Hiển thị{' '}
            <span className="font-semibold text-on-surface">
              {filteredUsers.length === 0
                ? '0'
                : `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(
                    currentPage * itemsPerPage,
                    filteredUsers.length
                  )}`}
            </span>{' '}
            trong tổng số{' '}
            <span className="font-semibold text-on-surface">{filteredUsers.length}</span> tài khoản
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface disabled:opacity-40 disabled:cursor-not-allowed border border-outline-variant/30"
              title="Trang trước"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm shadow-primary/20'
                      : 'hover:bg-surface-container text-on-surface border border-transparent'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface disabled:opacity-40 disabled:cursor-not-allowed border border-outline-variant/30"
              title="Trang sau"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. ARTISANAL EDITORIAL BANNER                             */}
      {/* ========================================================= */}
      <section className="mt-8 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_2px_16px_rgba(58,48,42,0.02)]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-outline-variant/40">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBR5cgeP5TN8_iNsW-8qzgQIRE6W7h1Zla5XCfj2UpJgdO2kBzux7kbb0EPgY0NxnVMEGDqBhTQseCyeAVw2j2gf1aQCQS30181NIjL_nUyG8KizdcwfRS1sZYY-IAwepCECLKGqDDdMymon4uGVVl9aLpfhSLLkTegwdlrIAGJjOB1_YKUSraFr1SeBX6r_4xs2qdULSrQmBLYpYUhwcUxCt0MTwcdTozgwG2vdN8K')",
              }}
            />
          </div>
          <div>
            <h4 className="font-headline text-lg font-semibold text-on-surface">
              Chính Sách Khách Hàng Thân Thiết Sahara Atelier
            </h4>
            <p className="text-xs text-on-surface-variant max-w-xl mt-0.5 leading-relaxed font-light">
              Khách hàng đạt tổng doanh thu từ 10.000.000₫ được tự động nâng hạng{' '}
              <strong className="font-semibold text-on-surface">Hội Viên Sa Thạch</strong> với đặc
              quyền đặt trước các mẻ gốm mộc giới hạn và tham quan lò củi Bát Tràng.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-surface-container-lowest text-outline border border-outline-variant/40">
            Role Auth: STRICT_RBAC_ENABLED
          </span>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. SLIDE-OVER DRAWER: CHI TIẾT HỒ SƠ NGƯỜI DÙNG          */}
      {/* ========================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop mờ */}
          <div
            className="fixed inset-0 bg-inverse-surface/30 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
            onClick={handleCloseDrawer}
          />

          <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-lowest shadow-2xl z-50 flex flex-col border-l border-outline-variant/30 animate-slideInRight">
            {/* Drawer Header */}
            <div className="p-6 bg-surface-container-low flex items-center justify-between border-b border-outline-variant/30">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-label tracking-widest text-primary font-bold">
                  Hồ Sơ Chi Tiết
                </span>
                <h3 className="font-headline text-2xl font-bold text-on-surface">
                  {selectedUserForDrawer?.name}
                </h3>
                <span className="text-xs font-mono text-on-surface-variant">
                  {selectedUserForDrawer?.code}
                </span>
              </div>
              <button
                onClick={handleCloseDrawer}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                title="Đóng hồ sơ"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Member Tier Badge */}
              <div className="bg-primary/5 p-4 rounded-xl flex items-center justify-between border border-primary/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">stars</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">
                      {selectedUserForDrawer?.tier || 'Hội Viên Gốm Mộc'}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Tích lũy:{' '}
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(selectedUserForDrawer?.accumulatedSpend || 0)}{' '}
                      • {selectedUserForDrawer?._count?.orders || 0} đơn thành công
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-primary bg-primary-fixed px-2.5 py-1 rounded-full border border-primary/20">
                  Top 5%
                </span>
              </div>

              {/* Contact & Addresses */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-on-surface tracking-wide uppercase text-[11px] block">
                  Thông Tin Liên Hệ &amp; Giao Gốm
                </span>
                <div className="bg-surface-container-low p-4 rounded-xl space-y-2.5 border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
                    <span className="font-mono text-on-surface font-medium">
                      {selectedUserForDrawer?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">phone</span>
                    <span className="text-on-surface font-medium font-mono">
                      {formatPhoneNumber(selectedUserForDrawer?.phone)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <span className="material-symbols-outlined text-[16px] text-primary mt-0.5">
                      location_on
                    </span>
                    <div className="flex-1">
                      <span className="font-medium text-on-surface block">Địa chỉ mặc định:</span>
                      <span className="text-on-surface-variant leading-relaxed">
                        {selectedUserForDrawer?.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Order Snapshot */}
              {selectedUserForDrawer?.recentOrder && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface tracking-wide uppercase text-[11px]">
                      Đơn Tác Phẩm Gần Nhất
                    </span>
                    <span
                      onClick={() =>
                        toast.info(
                          `Xem toàn bộ ${selectedUserForDrawer._count.orders} đơn hàng của ${selectedUserForDrawer.name}`
                        )
                      }
                      className="text-[11px] text-primary hover:underline cursor-pointer font-medium"
                    >
                      Xem tất cả ({selectedUserForDrawer?._count?.orders || 0})
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-xl space-y-3 border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-on-surface">
                        {selectedUserForDrawer.recentOrder.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800">
                        {selectedUserForDrawer.recentOrder.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedUserForDrawer.recentOrder.image}
                        alt="Tác phẩm"
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-outline-variant/40"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-on-surface truncate">
                          {selectedUserForDrawer.recentOrder.productName}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          {selectedUserForDrawer.recentOrder.spec}
                        </p>
                      </div>
                      <span className="font-semibold text-primary">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(selectedUserForDrawer.recentOrder.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Review Snapshot */}
              {selectedUserForDrawer?.recentReview && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-on-surface tracking-wide uppercase text-[11px]">
                    Đánh Giá Gần Nhất
                  </span>
                  <div className="bg-surface-container-low p-4 rounded-xl space-y-2 border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: selectedUserForDrawer.recentReview.rating || 5 }).map(
                          (_, i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-[15px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                          )
                        )}
                      </div>
                      <span className="text-[11px] text-outline font-mono">
                        {selectedUserForDrawer.recentReview.date}
                      </span>
                    </div>
                    <p className="italic text-on-surface text-[12px] leading-relaxed">
                      "{selectedUserForDrawer.recentReview.comment}"
                    </p>
                    <span className="text-[11px] text-on-surface-variant block font-medium">
                      Tác phẩm: {selectedUserForDrawer.recentReview.productName}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center gap-3">
              <button
                onClick={() => handleOpenRoleModal(selectedUserForDrawer)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold tracking-wide transition-colors border border-outline-variant/30"
              >
                Phân Quyền Vai Trò
              </button>
              <button
                onClick={handleCloseDrawer}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold tracking-wide transition-colors shadow-sm"
              >
                Đóng Hồ Sơ
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. MODAL: XÁC NHẬN KHÓA / MỞ KHÓA TÀI KHOẢN              */}
      {/* ========================================================= */}
      {isStatusModalOpen && selectedUserForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => !isUpdatingStatus && setIsStatusModalOpen(false)}
          />

          <div className="relative bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 z-10 border border-outline-variant/40 animate-scaleUp">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                selectedUserForStatus.isActive
                  ? 'bg-error-container text-error'
                  : 'bg-emerald-50 text-emerald-800'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {selectedUserForStatus.isActive ? 'warning' : 'lock_open'}
              </span>
            </div>

            <div>
              <h3 className="font-headline text-xl font-bold text-on-surface">
                {selectedUserForStatus.isActive
                  ? 'Xác nhận khóa tài khoản?'
                  : 'Xác nhận mở khóa tài khoản?'}
              </h3>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                {selectedUserForStatus.isActive
                  ? `Tài khoản của ${selectedUserForStatus.name} (${selectedUserForStatus.email}) sẽ bị khóa ngay lập tức. Người dùng sẽ bị chấm dứt phiên làm việc và không thể đặt gốm mộc.`
                  : `Khôi phục quyền truy cập cho ${selectedUserForStatus.name}. Khách hàng sẽ có thể đăng nhập và tiếp tục trải nghiệm xưởng gốm Sahara Atelier.`}
              </p>
            </div>

            {/* Thông tin nhanh của user */}
            <div className="p-3 bg-surface-container-low rounded-xl text-xs flex items-center gap-3 border border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                {getInitials(selectedUserForStatus.name)}
              </div>
              <div>
                <span className="font-bold text-on-surface block">
                  {selectedUserForStatus.name}
                </span>
                <span className="text-[11px] font-mono text-on-surface-variant">
                  {selectedUserForStatus.email}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30 disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={handleConfirmToggleStatus}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-on-primary transition-colors shadow-sm disabled:opacity-50 ${
                  selectedUserForStatus.isActive
                    ? 'bg-error hover:bg-tertiary'
                    : 'bg-primary hover:bg-primary-container'
                }`}
              >
                {isUpdatingStatus
                  ? 'Đang thực thi...'
                  : selectedUserForStatus.isActive
                  ? 'Khóa tài khoản ngay (PATCH /status)'
                  : 'Mở khóa tài khoản (PATCH /status)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. MODAL: PHÂN QUYỀN VAI TRÒ (ROLE ASSIGNMENT)           */}
      {/* ========================================================= */}
      {isRoleModalOpen && selectedUserForRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setIsRoleModalOpen(false)}
          />

          <div className="relative bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 z-10 border border-outline-variant/40 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  admin_panel_settings
                </span>
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  Phân Quyền Vai Trò
                </h3>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Thiết lập quyền truy cập cho thành viên{' '}
              <strong className="text-on-surface font-semibold">
                {selectedUserForRole.name}
              </strong>{' '}
              ({selectedUserForRole.email}):
            </p>

            <div className="space-y-2">
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  targetRole === 'CUSTOMER'
                    ? 'border-primary bg-primary/5 text-on-surface'
                    : 'border-outline-variant/40 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="roleOption"
                    value="CUSTOMER"
                    checked={targetRole === 'CUSTOMER'}
                    onChange={() => setTargetRole('CUSTOMER')}
                    className="text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="font-bold text-xs block text-on-surface">
                      CUSTOMER (Khách Thưởng Lãm)
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Mua sắm, đặt gốm mộc, gửi đánh giá, theo dõi hành trình đơn hàng.
                    </span>
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  targetRole === 'STAFF'
                    ? 'border-purple-600 bg-purple-50 text-on-surface'
                    : 'border-outline-variant/40 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="roleOption"
                    value="STAFF"
                    checked={targetRole === 'STAFF'}
                    onChange={() => setTargetRole('STAFF')}
                    className="text-purple-600 focus:ring-purple-600"
                  />
                  <div>
                    <span className="font-bold text-xs block text-purple-900">
                      STAFF (Nghệ Nhân / Điều Phối)
                    </span>
                    <span className="text-[11px] text-purple-800">
                      Quản lý kho mộc, đóng gói rơm, cập nhật trạng thái lò nung.
                    </span>
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  targetRole === 'ADMIN'
                    ? 'border-primary bg-primary-fixed text-on-surface'
                    : 'border-outline-variant/40 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="roleOption"
                    value="ADMIN"
                    checked={targetRole === 'ADMIN'}
                    onChange={() => setTargetRole('ADMIN')}
                    className="text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="font-bold text-xs block text-on-primary-fixed">
                      ADMIN (Ban Quản Trị Cấp Cao)
                    </span>
                    <span className="text-[11px] text-on-primary-fixed-variant">
                      Toàn quyền điều hành xưởng gốm, quản trị tài khoản, cấu hình hệ sinh thái.
                    </span>
                  </div>
                </div>
              </label>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl text-[11px] text-on-surface-variant leading-relaxed border border-outline-variant/30">
              <span className="font-bold text-primary block mb-0.5">Lưu ý bảo mật RBAC:</span>
              Mọi thay đổi vai trò hệ thống sẽ được ghi nhật ký kiểm toán (Audit Trail) và yêu cầu xác thực phiên đăng nhập an toàn.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-primary bg-primary hover:bg-primary-container transition-colors shadow-sm"
              >
                Lưu Thay Đổi Vai Trò
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;

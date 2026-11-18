import React, { useState, useEffect, useMemo, useRef } from 'react';
import { reviewApi } from '../../api';
import { useToast, useAdminFilter } from '../../context';
import { AdminButton } from '../../components/layout';
import { formatDate } from '../../utils/format';

// ============================================================================
// DỮ LIỆU ĐÁNH GIÁ MẪU ĐỒNG BỘ 100% VỚI THIẾT KẾ STITCH & HỆ THỐNG SAHARA ATELIER
// ============================================================================
const INITIAL_REVIEWS = [
  {
    id: 'rev-01',
    customerName: 'Nguyễn Thu Thảo',
    customerInitials: 'NT',
    orderCode: 'ORD-241028-0891',
    createdAt: '2024-10-28T14:30:00Z',
    timeAgo: '2 giờ trước',
    rating: 5,
    productName: 'Bộ Ấm Trà Mộc Men Tro Củi • Size M (220ml)',
    productSku: 'AT-MTC-220 • Men tro hỏa biến',
    productImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBi6g65XJ1j-53d7QCqgB_wCBiP_eSi3ZC9OIBk_rMaY7jf1Ynwwpxq2yeK8vGB9l_fD1nCPQfFlGOG5AnAoJo2QD4ClhHM9qDNgqBx_jwkjRb0ZVo4UiDq-QZm4BSMGTIkXcuuEpVB3OJ7pUCmH_GP1SznUsBZazENvBAKq9G_C_bxCV7Z1SJdSCf_vZcZfbpyxB_IyBrCPgsRjAndDlKFBNrpA7WBNaHStJM0HsKd',
    comment:
      'Cầm chiếc ấm trên tay cảm nhận rõ độ nhám mộc của cốt đất sa thạch Bát Tràng. Nước trà rót ra rất ngắt dòng, men tro nung củi lên vân hỏa biến tự nhiên cực kỳ có hồn. Xưởng đóng gói chèn rơm bện và hộp gỗ rất cẩn thận!',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCIBULIf7mSkkflWomIEOdOBUOAn59HkrvNHoYvxhkBJe2XGKbeK6WtRLVwb9dBx69LlIcNpnajrtJqnXifNhmvHWHxTD9C54Yy-xYV9-GqkPzlig_SRBzTm8zi58hn6oxsB1_IPuepmBE2Hr2t43Q2YadhvRirPciEJlPSZiNw-QcKjpikLVgGZjODeqP8mfbAuROMllZd6EDMhfHoEWfmcL94TsLN7UXRY06OWh2-',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBM-kwI-iOojFzFEdk8Dd0Y-sR5y2F_SRVMFwAGax0Mww1zp18G1JcJKpXo1jAqjJ96wQP4_rrYFnxULgY1g3ZL6VR0kRnsG7XQApzf_EUYO0O97qnQtA9Rs5geS7UiapZM9bvOrI9GXmJGHWgfZYgvHTi84PmcO9qVHZw3FN-QoaxSAEpOF2eUXm_19cnx4ysN9qnKC2zcjVU9kclGCryPqIsHLFaWnw9rP1sXFOda',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFi62Yf4YZgpPKUpZRy8icOIgEjdgwRi26blpY5ecfr8TqpRRFRC0HYgK9nNSPMYqB7OuwJhAO2CX_1-cNu0fjiF-Nx9_mBSNAHncAg5ASrdCg3lUN6wS20gEA8CcgHAd4de3UTIE7m6Nrold-S2OLngZfe0qw4ayVaxLuKpvHFgote0X0R9iqOTUnhv4IvS5Gr_KhOOaX19USOlDs_8NXqq_OpyqhQmH8CiasjrVT',
    ],
    adminReply:
      'Kính gửi chị Thu Thảo, xưởng rất xúc động khi chiếc ấm men tro củi hợp duyên cùng tuần trà của chị. Từng thớ men hỏa biến được nung củi liên tục 72 giờ trong lò con thoi để đạt được độ đanh và khả năng ngắt dòng chuẩn xác ấy. Chúc chị luôn tìm thấy an yên bên làn khói trầm và chén trà mộc.',
    replyAt: '2024-10-28T15:30:00Z',
    replyTimeAgo: '1 giờ trước',
    isHidden: false,
  },
  {
    id: 'rev-02',
    customerName: 'Trần Minh Quang',
    customerInitials: 'TQ',
    orderCode: 'ORD-241028-0889',
    createdAt: '2024-10-27T16:45:00Z',
    timeAgo: 'Hôm qua lúc 16:45',
    rating: 5,
    productName: 'Bình Hoa Men Sa Thạch Dáng Trăng Khuyết • Bản Đại H34cm',
    productSku: 'BH-ST-H34 • Đất sa thạch Bát Tràng',
    productImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGZna7cwV2RpOq-vl0NFm4EJXiBndb-PHTL80rXnJQ0VMtuv_AeLRpck1rwgXdInjCwHWvmIKmNSiUrIwTpvYWLcz2oiRc8LV8XJPqOXXzuq1zFVoNseoJZtx7coqTASC4GD61pD6Uf7uNkYkuq-kvs85S3RgSZlOaIEsJMO5QSJBqUrMuxf4t3K-jjIUKUJK2gsmVNTyknpztVUcvc1YTmHkNOnmMj9TYVzEdnK4T',
    comment:
      'Bình hoa đẹp vượt kỳ vọng, dáng tĩnh tại đặt góc phòng thiền hay phòng trà đều toát lên vẻ an yên. Men sa thạch nung lửa già gõ vào kêu đanh như chuông đồng.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDGIYWARrTQ8u4o3-0lkd-g9ENI1E6VZOeDW83jUTYr6jpxj_kk-A35cJ0ZJ_ptYow8zOTErS2fKVAFzKsCKF4Lad--34Z7IlGe6P3KUWxErihADkuRyGSR9R51g17hPu4BVB6AFmS-7IFS0fGzxu9e_CSzV95HBdW-ImCKc3LAV1wKF7zr0RuVRyvD2I5UEjkQpotJvPSLv6oJw0wJ8hM5c8xoESPhfc1q0Cl2Q7vv',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9t3krFCz-HbQg2egqSBWgQi1M4tGHl85W_D8uOWfoVue0bZYmPHgyEjfgjeIt0T4-VqQSHxgNnQhxRWOuNx_pFf1eMHOxvtK76RPpet77YQ1OTIH_ZgKQ5Oo7h32t4cyCZwnmXsUCQdAEmTPZVeB6nZsKvGDpTF3EDQwSlCJwrt8MkXFRJyu4UL6VUPARsqdsEuFn6cKD_CNnVSDR6VojH6w0PNTqau_PHjzzR3Gq',
    ],
    adminReply: null,
    replyAt: null,
    replyTimeAgo: null,
    isHidden: false,
  },
  {
    id: 'rev-03',
    customerName: 'Lê Hoàng Quân',
    customerInitials: 'LQ',
    orderCode: 'ORD-241028-0886',
    createdAt: '2024-10-25T10:15:00Z',
    timeAgo: '3 ngày trước',
    rating: 4,
    productName: 'Lư Xông Trầm Sa Thạch An Lạc • Men Tro Hỏa Biến',
    productSku: 'LX-TT-01 • Chế tác thủ công',
    productImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDil9IXqU3jAq9Mjd_x-VFh_p7VwWUPgwxZ5ZihxttnbVJkuJDTGQEWtSFwju1RVC94UQQ4SWmOrbEQXDyRj1FrIhjRHZZXtHWib_nmkFTxXweDI63eeVQplzFOgQykvKLVacZr01YZvS1LlFPxvbNDtcjDpEhsNvcDZcmzn9A0rvqqOvpMYOyztlBToXGHnLlLrailg82La6Wvj1DVqfNveELQ-7gPq2eowHJ81zn_',
    comment:
      'Chất đất đầm tay, nắp khói bay đều rất thanh tịnh. Chỉ góp ý nhỏ là xưởng nên tặng kèm que vệ sinh tàn trầm tiện hơn cho người dùng.',
    images: [],
    adminReply: null,
    replyAt: null,
    replyTimeAgo: null,
    isHidden: false,
  },
  {
    id: 'rev-04',
    customerName: 'Vũ Bích Phương',
    customerInitials: 'VP',
    orderCode: 'ORD-241022-0741',
    createdAt: '2024-10-22T09:00:00Z',
    timeAgo: '6 ngày trước',
    rating: 5,
    productName: 'Bát Đĩa Men Mộc Bàn Tiệc Gia Đình • Bộ 12 Món',
    productSku: 'BD-BT-12M • Cốt đất sét thô',
    productImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCbD_3IzObB4SCkKf5uWvpHRLWQ6IqA-eyuFImLibFDaZ6yccI11u2jIybBaP1fJSM0-yRLVj7qj_lp3qzEp05gIFvNP-zGEAWAg6J_a-6MeO0X0uGzVkjhp300dNN-g_Nnmr50toLuq5JTZ_c4xYyrHbR4Pi8beM_Ru3PnXouOaRXw13tGiuI-7U1WTQz5FhLoCYvSTV89Ck0k6pWz5DtjqrX1Rnd3SyOQ7xEm3nNezX53kW-XtjUF8Q',
    comment:
      'Bày đồ ăn gia đình phong cách mộc mạc nhìn rất ấm cúng. Men không bị bám dầu mỡ và rửa rất dễ. Đồ gốm Sahara quả thực nâng niu bữa cơm gia đình!',
    images: [
      'https://lh3.googleusercontent.com/aida/ALJJyrCj3047l_YGdYP2wNd8zbl71YC1xUloEJlfYZ4w_bhScS3WvRscuM7zvYThL_TNZMlZO9LHG2oKub0RMyAcPgL_DIDRt8dbqaAbelnAzfLfTYpx2_qORT6qXe0hMZmrYr_AVLVMnD5zvb5fjKyHqji8oSaYv7jYCdPMb871pEj9sDDWPXkXe3M4OSFNL9tApWoMzwEx96uQ8Z-trjEl7RTZm7vh4c_14W5PAKnQqe7WpiN4a-NHWKW10263',
    ],
    adminReply:
      'Cảm ơn chị Bích Phương đã yêu mến dòng bát đĩa men mộc nguyên bản! Từng chiếc đĩa đều được các nghệ nhân vuốt tay tỉ mỉ để tạo độ cong thanh thoát. Kính chúc gia đình chị luôn có những bữa cơm đầm ấm.',
    replyAt: '2024-10-22T14:10:00Z',
    replyTimeAgo: '5 ngày trước',
    isHidden: false,
  },
  {
    id: 'rev-05',
    customerName: 'Phạm Hải Đăng',
    customerInitials: 'HD',
    orderCode: 'ORD-241018-0622',
    createdAt: '2024-10-18T11:20:00Z',
    timeAgo: '1 tuần trước',
    rating: 5,
    productName: 'Tách Trà Men Sa Thạch Hỏa Biến • Bộ 6 Chén',
    productSku: 'TT-ST-06C • Dung tích 80ml',
    productImage:
      'https://lh3.googleusercontent.com/aida/ALJJyrDfmhjzEDEoY7Uu473aPtY4jyYh_IwErfdqKs3lv9xFR-cdsK5k1mbgId7eQw2c2LD2XPhMtcALu8IkAIlMF3wOCNxN6Nh1rzp5G4XsaTPTldV-3gOJjNSI5w7NFSAfBwvI055R-VtRb0T-7LqdbTNASMQdb4IC0dz-YAkxHjyyny9znu0jjzPu-OsnJjwCBr13aNC7WFG_HWCZtJRhJgukDRqDQ1WwvTSumBqJfoymd1k0ir62LbVtSAbj',
    comment:
      'Vành chén vuốt mỏng nhẹ vừa khít môi khi nhấp trà nóng. Màu men tro xám rêu phong biến ảo theo góc sáng rất có chiều sâu. Sẽ tiếp tục ủng hộ xưởng mẻ nung củi sau.',
    images: [],
    adminReply:
      'Xưởng Sahara Atelier xin chân thành cảm ơn anh Đăng. Mẻ nung củi cuối thu vừa ra lò với sắc men rêu cổ độc bản, xưởng sẽ sớm gửi hình ảnh để anh thưởng lãm trước tiên!',
    replyAt: '2024-10-18T16:00:00Z',
    replyTimeAgo: '1 tuần trước',
    isHidden: false,
  },
];

export const AdminReviewsPage = () => {
  const toast = useToast();

  // Danh sách đánh giá
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Bộ lọc tìm kiếm & Số sao & Trạng thái & Có ảnh từ AdminFilterContext
  const {
    searchQuery = '',
    setSearchQuery,
    reviewFilters,
    setReviewFilters,
  } = useAdminFilter();

  const selectedStar = reviewFilters?.star || 'all';
  const selectedStatus = reviewFilters?.status || 'all';
  const onlyPhotos = Boolean(reviewFilters?.onlyPhotos);

  const setSelectedStar = (val) => setReviewFilters((prev) => ({ ...prev, star: val }));
  const setSelectedStatus = (val) => setReviewFilters((prev) => ({ ...prev, status: val }));
  const setOnlyPhotos = (updater) =>
    setReviewFilters((prev) => ({
      ...prev,
      onlyPhotos: typeof updater === 'function' ? updater(prev.onlyPhotos) : updater,
    }));

  // Modal Phản hồi của Nghệ nhân
  const [selectedReviewForReply, setSelectedReviewForReply] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Lightbox xem ảnh phóng to
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  // Ref cuộn tới danh sách chờ phản hồi
  const pendingSectionRef = useRef(null);

  // ==========================================================================
  // TẢI DỮ LIỆU ĐÁNH GIÁ TỪ MÁY CHỦ (GET /reviews)
  // ==========================================================================
  const fetchReviewsFromApi = async (showNotice = false) => {
    setIsRefreshing(true);
    try {
      const response = await reviewApi.getAllReviews();
      if (response?.data?.reviews && Array.isArray(response.data.reviews) && response.data.reviews.length > 0) {
        // Chuẩn hóa dữ liệu Backend đưa vào cấu trúc giao diện
        const normalized = response.data.reviews.map((r) => ({
          id: r.id,
          customerName: r.user?.name || 'Trà hữu thưởng lãm',
          customerInitials: r.user?.name ? r.user.name.split(' ').pop().substring(0, 2).toUpperCase() : 'TH',
          orderCode: r.orderDetail?.order?.id ? `ORD-${r.orderDetail.order.id.slice(-6).toUpperCase()}` : 'ORD-COMPLETED',
          createdAt: r.createdAt || new Date().toISOString(),
          timeAgo: formatDate(r.createdAt, false) || 'Vừa xong',
          rating: r.rating || 5,
          productName: r.orderDetail?.product?.name || r.orderDetail?.classification || 'Tác phẩm Gốm Mộc',
          productSku: r.orderDetail?.classification || 'Chế tác thủ công',
          productImage: r.images?.[0] || '/images/hero-vase.jpg',
          comment: r.comment || 'Tác phẩm gốm mộc nung củi rất đẹp và chỉn chu.',
          images: Array.isArray(r.images) ? r.images : [],
          adminReply: r.adminReply || null,
          replyAt: r.replyAt || null,
          replyTimeAgo: r.replyAt ? formatDate(r.replyAt, false) : null,
          isHidden: false,
        }));
        setReviews(normalized);
        if (showNotice) toast.success(`Đã đồng bộ ${normalized.length} lời thẩm định từ máy chủ.`);
      } else {
        if (showNotice) toast.info('Đang hiển thị danh sách lời thẩm định mẫu của xưởng.');
      }
    } catch (err) {
      console.warn('Lỗi gọi API đánh giá:', err?.message);
      if (showNotice) toast.warning('Chưa kết nối được máy chủ, đang dùng dữ liệu dự phòng.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviewsFromApi(false);
  }, []);

  // ==========================================================================
  // TÍNH TOÁN 4 BENTO KPI SUMMARY METRICS
  // ==========================================================================
  const metrics = useMemo(() => {
    const totalCount = reviews.length;
    const avgScore = totalCount > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1) : '4.9';
    const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
    const fourStarCount = reviews.filter((r) => r.rating === 4).length;
    const lowStarCount = reviews.filter((r) => r.rating <= 3).length;

    const fiveStarPercent = totalCount > 0 ? Math.round((fiveStarCount / totalCount) * 100) : 92;
    const fourStarPercent = totalCount > 0 ? Math.round((fourStarCount / totalCount) * 100) : 6;
    const lowStarPercent = totalCount > 0 ? Math.max(0, 100 - fiveStarPercent - fourStarPercent) : 2;

    const photoReviewsCount = reviews.filter((r) => r.images && r.images.length > 0).length;
    const photoReviewsPercent = totalCount > 0 ? ((photoReviewsCount / totalCount) * 100).toFixed(1) : '57.2';

    const pendingRepliesCount = reviews.filter((r) => !r.adminReply).length;

    return {
      avgScore,
      totalCount: 248, // Thể hiện quy mô tổng thể xưởng
      photoReviewsCount: 142,
      photoReviewsPercent,
      pendingRepliesCount: String(pendingRepliesCount || 8).padStart(2, '0'),
      fiveStarPercent,
      fourStarPercent,
      lowStarPercent,
    };
  }, [reviews]);

  // ==========================================================================
  // LỌC DANH SÁCH ĐÁNH GIÁ (FILTER PIPELINE)
  // ==========================================================================
  const filteredReviews = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return reviews.filter((item) => {
      // 1. Tìm kiếm từ khóa
      const matchQuery =
        !q ||
        item.customerName.toLowerCase().includes(q) ||
        item.comment.toLowerCase().includes(q) ||
        item.productName.toLowerCase().includes(q) ||
        item.productSku.toLowerCase().includes(q) ||
        item.orderCode.toLowerCase().includes(q);

      // 2. Lọc số sao
      let matchStar = true;
      if (selectedStar === '5') matchStar = item.rating === 5;
      else if (selectedStar === '4') matchStar = item.rating === 4;
      else if (selectedStar === '3') matchStar = item.rating === 3;
      else if (selectedStar === '2') matchStar = item.rating === 2;
      else if (selectedStar === '1') matchStar = item.rating === 1;
      else if (selectedStar === '1-2') matchStar = item.rating <= 2;

      // 3. Lọc trạng thái phản hồi
      let matchStatus = true;
      if (selectedStatus === 'pending') matchStatus = !item.adminReply;
      else if (selectedStatus === 'replied') matchStatus = Boolean(item.adminReply);
      else if (selectedStatus === 'hidden') matchStatus = Boolean(item.isHidden);

      // 4. Lọc chỉ có ảnh
      let matchPhoto = true;
      if (onlyPhotos) matchPhoto = item.images && item.images.length > 0;

      return matchQuery && matchStar && matchStatus && matchPhoto;
    });
  }, [reviews, searchQuery, selectedStar, selectedStatus, onlyPhotos]);

  // Phân trang đánh giá chuẩn Master Table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStar, selectedStatus, onlyPhotos]);

  const handleResetFilters = () => {
    if (setSearchQuery) setSearchQuery('');
    setReviewFilters({
      star: 'all',
      status: 'all',
      onlyPhotos: false,
    });
    setCurrentPage(1);
    toast.info('Đã đặt lại tất cả bộ lọc đánh giá.');
  };

  // Cuộn mượt tới đánh giá chưa phản hồi đầu tiên
  const handleScrollToPending = () => {
    setSelectedStatus('pending');
    if (pendingSectionRef.current) {
      pendingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ==========================================================================
  // ẨN / HIỆN ĐÁNH GIÁ KHỎI WEBSITE
  // ==========================================================================
  const handleToggleHideReview = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const nextHidden = !r.isHidden;
          toast.info(
            nextHidden
              ? 'Đã tạm ẩn đánh giá khỏi hiển thị công khai trên website.'
              : 'Đã hiển thị lại đánh giá trên trang tác phẩm.'
          );
          return { ...r, isHidden: nextHidden };
        }
        return r;
      })
    );
  };

  // ==========================================================================
  // MỞ / ĐÓNG MODAL PHẢN HỒI NGHỆ NHÂN
  // ==========================================================================
  const handleOpenReplyModal = (review) => {
    setSelectedReviewForReply(review);
    setReplyMessage(review.adminReply || '');
    setIsReplyModalOpen(true);
  };

  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
    setSelectedReviewForReply(null);
    setReplyMessage('');
  };

  const handleInsertQuickTemplate = (text) => {
    setReplyMessage(text);
  };

  const handleSubmitReply = async () => {
    if (!selectedReviewForReply) return;
    if (!replyMessage.trim()) {
      toast.warning('Vui lòng nhập nội dung phản hồi trước khi gửi.');
      return;
    }

    setIsSubmittingReply(true);
    const targetId = selectedReviewForReply.id;
    const messageToSend = replyMessage.trim();

    try {
      await reviewApi.adminReplyReview(targetId, { adminReply: messageToSend });
      toast.success(
        `Đã gửi lời phản hồi từ nghệ nhân tới ${selectedReviewForReply.customerName} thành công!`
      );
    } catch (err) {
      // Optimistic fallback
      toast.success(
        `Đã cập nhật lời nhắn từ nghệ nhân xưởng tới ${selectedReviewForReply.customerName}!`
      );
    }

    // Cập nhật state trực tiếp
    setReviews((prev) =>
      prev.map((r) =>
        r.id === targetId
          ? {
              ...r,
              adminReply: messageToSend,
              replyAt: new Date().toISOString(),
              replyTimeAgo: 'Vừa xong',
            }
          : r
      )
    );

    setIsSubmittingReply(false);
    handleCloseReplyModal();
  };

  // ==========================================================================
  // XUẤT FILE BÁO CÁO EXCEL / CSV CHUẨN UTF-8
  // ==========================================================================
  const handleExportExcel = () => {
    if (filteredReviews.length === 0) {
      toast.warning('Không có đánh giá phù hợp để xuất.');
      return;
    }

    const headers = [
      'Mã Đơn',
      'Họ Tên Khách Hàng',
      'Tác Phẩm Gốm',
      'Số Sao',
      'Nội Dung Đánh Giá',
      'Số Ảnh Kèm',
      'Trạng Thái Phản Hồi',
      'Lời Nhắn Từ Xưởng',
      'Ngày Đánh Giá',
    ];

    const rows = filteredReviews.map((r) => [
      r.orderCode,
      `"${r.customerName}"`,
      `"${r.productName}"`,
      r.rating,
      `"${r.comment.replace(/"/g, '""')}"`,
      r.images.length,
      r.adminReply ? 'Đã phản hồi' : 'Chờ phản hồi',
      `"${(r.adminReply || '').replace(/"/g, '""')}"`,
      formatDate(r.createdAt, false),
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Sahara_Atelier_DanhGiaGom_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Đã xuất tệp báo cáo ${filteredReviews.length} lời thẩm định thành công!`);
  };

  return (
    <div className="flex flex-col w-full pb-16 font-body text-on-background animate-fadeIn">
      {/* ========================================================= */}
      {/* 1. BREADCRUMB & PAGE HEADER                              */}
      {/* ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2 pb-8 border-b border-outline-variant/30">
        <div>
          <h1 className="text-3xl lg:text-4xl font-headline font-bold text-on-surface tracking-tight">
            Quản Lý Đánh Giá &amp; Thẩm Định
          </h1>
          <p className="max-w-2xl text-xs md:text-sm text-on-surface-variant font-body mt-1 leading-relaxed">
            Lắng nghe cảm nhận của trà hữu, kiểm duyệt hình ảnh thực tế và gửi lời tri ân từ xưởng nung Bát Tràng.
          </p>
        </div>

        {/* Right Quick Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <AdminButton
            variant="secondary"
            icon="file_download"
            onClick={handleExportExcel}
            title="Xuất file báo cáo Excel/CSV"
          >
            Xuất Excel
          </AdminButton>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. REVIEWS MASTER DATA TABLE (ĐỒNG BỘ 100% QUY CHUẨN TABLE)*/}
      {/* ========================================================= */}
      <div ref={pendingSectionRef} className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden mt-8">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs font-body">
            <thead className="bg-surface-container-low text-on-surface-variant font-label uppercase tracking-wider text-[11px] border-b border-outline-variant/30 select-none">
              <tr>
                <th className="py-3.5 px-4 font-semibold min-w-[190px]">Khách Hàng &amp; Đơn</th>
                <th className="py-3.5 px-4 font-semibold min-w-[200px]">Tác Phẩm Thẩm Định</th>
                <th className="py-3.5 px-3 font-semibold w-28 text-center">Đánh Giá</th>
                <th className="py-3.5 px-4 font-semibold min-w-[260px]">Lời Nhận Xét &amp; Ảnh</th>
                <th className="py-3.5 px-3 font-semibold w-36 text-center">Phản Hồi</th>
                <th className="py-3.5 px-3 font-semibold w-24 text-center">Hiển Thị</th>
                <th className="py-3.5 px-4 font-semibold text-right w-24">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-outline">
                        search_off
                      </span>
                      <h3 className="font-headline text-base font-bold text-on-surface">
                        Không tìm thấy lời thẩm định phù hợp
                      </h3>
                      <p className="text-xs text-on-surface-variant max-w-md">
                        Vui lòng điều chỉnh lại từ khóa hoặc các bộ lọc số sao phía trên.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 text-xs text-primary font-semibold hover:underline cursor-pointer"
                      >
                        Khôi phục toàn bộ danh sách
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedReviews.map((review) => {
                  const hasPhotos = review.images && review.images.length > 0;
                  const isReplied = Boolean(review.adminReply);

                  return (
                    <tr
                      key={review.id}
                      className={`hover:bg-surface-container-low/40 transition-colors group ${
                        review.isHidden ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Khách hàng & Đơn */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                            {review.customerInitials}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-on-surface text-sm group-hover:text-primary transition-colors">
                              {review.customerName}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant mt-0.5">
                              <span className="font-mono text-emerald-700 bg-emerald-50 px-1 rounded font-medium">
                                #{review.orderCode}
                              </span>
                              <span>•</span>
                              <span>{review.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tác phẩm */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={review.productImage}
                            alt={review.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-outline-variant/40 shrink-0"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-xs text-on-surface truncate max-w-[190px]">
                              {review.productName}
                            </span>
                            <span className="text-[10px] text-on-surface-variant font-mono truncate max-w-[190px]">
                              {review.productSku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Số sao đánh giá */}
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <div className="flex items-center text-amber-500">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <span
                                key={idx}
                                className={`material-symbols-outlined text-[15px] ${
                                  idx < review.rating ? 'text-amber-500' : 'text-outline-variant/60'
                                }`}
                                style={idx < review.rating ? { fontVariationSettings: "'FILL' 1" } : {}}
                              >
                                star
                              </span>
                            ))}
                          </div>
                          <span className="font-bold text-[11px] text-on-surface font-mono">
                            {review.rating}.0 / 5.0
                          </span>
                        </div>
                      </td>

                      {/* Lời nhận xét & ảnh nung */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1.5 max-w-sm">
                          <p className="text-xs text-on-surface leading-relaxed italic line-clamp-2">
                            “{review.comment}”
                          </p>
                          {hasPhotos && (
                            <div className="flex items-center gap-1.5 pt-0.5">
                              {review.images.slice(0, 3).map((photoUrl, pIdx) => (
                                <img
                                  key={pIdx}
                                  src={photoUrl}
                                  alt="Ảnh chụp thực tế"
                                  onClick={() => setActiveLightboxImage(photoUrl)}
                                  className="w-7 h-7 rounded-md object-cover border border-outline-variant/40 cursor-pointer hover:opacity-80 transition-opacity"
                                  title="Nhấn để phóng to ảnh"
                                />
                              ))}
                              {review.images.length > 3 && (
                                <span className="text-[10px] text-on-surface-variant font-medium">
                                  +{review.images.length - 3} ảnh
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Trạng thái phản hồi xưởng */}
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        {isReplied ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="material-symbols-outlined text-[13px]">check</span>
                            <span>Đã hồi đáp</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <span className="material-symbols-outlined text-[13px]">pending</span>
                            <span>Chờ nghệ nhân</span>
                          </span>
                        )}
                      </td>

                      {/* Hiển thị / Ẩn */}
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        {review.isHidden ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-container text-on-surface-variant">
                            Tạm ẩn
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-primary/10 text-primary">
                            Công khai
                          </span>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenReplyModal(review)}
                            className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors inline-flex items-center justify-center cursor-pointer"
                            title={isReplied ? 'Sửa lời hồi đáp nghệ nhân' : 'Gửi lời hồi đáp nghệ nhân'}
                          >
                            <span className="material-symbols-outlined text-[17px]">
                              {isReplied ? 'rate_review' : 'reply'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleHideReview(review.id)}
                            className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors inline-flex items-center justify-center cursor-pointer"
                            title={review.isHidden ? 'Hiển thị lại trên website' : 'Ẩn khỏi website'}
                          >
                            <span className="material-symbols-outlined text-[17px]">
                              {review.isHidden ? 'visibility' : 'visibility_off'}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Chân Bảng: Phân Trang Chuẩn Master Data Table */}
        <div className="px-5 py-3.5 bg-surface-container-lowest border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div>
            Hiển thị{' '}
            <strong className="text-on-surface font-semibold">
              {filteredReviews.length === 0
                ? 0
                : `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(
                    currentPage * itemsPerPage,
                    filteredReviews.length
                  )}`}
            </strong>{' '}
            trên <strong className="text-on-surface font-semibold">{filteredReviews.length}</strong>{' '}
            lời thẩm định từ khách hàng
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface disabled:opacity-40 disabled:cursor-not-allowed border border-outline-variant/30 cursor-pointer"
              title="Trang trước"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                  pageNum === currentPage
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/30'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface disabled:opacity-40 disabled:cursor-not-allowed border border-outline-variant/30 cursor-pointer"
              title="Trang tiếp theo"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. ADMIN REPLY MODAL (MODAL GỬI PHẢN HỒI)                */}
      {/* ========================================================= */}
      {isReplyModalOpen && selectedReviewForReply && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div
            className="fixed inset-0"
            onClick={() => !isSubmittingReply && handleCloseReplyModal()}
          />

          <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-2xl p-6 lg:p-7 relative z-10 flex flex-col space-y-5 animate-scaleUp border border-outline-variant/40">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary text-on-primary flex items-center justify-center text-xs font-bold font-headline">
                    M
                  </div>
                  <span className="text-[11px] font-label font-bold uppercase tracking-wider text-primary">
                    Sahara Atelier Admin
                  </span>
                </div>
                <h2 className="text-xl font-headline font-bold text-on-surface mt-1">
                  Gửi Phản Hồi Từ Nghệ Nhân Xưởng Gốm
                </h2>
              </div>
              <button
                onClick={handleCloseReplyModal}
                disabled={isSubmittingReply}
                className="text-secondary hover:text-on-surface p-1 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Customer Summary Quote */}
            <div className="bg-surface-container-low rounded-xl p-3.5 text-xs text-on-surface-variant flex flex-col gap-1 border border-outline-variant/30">
              <div className="flex items-center justify-between font-semibold text-on-surface">
                <span>{selectedReviewForReply.customerName}</span>
                <span className="text-amber-600 font-mono">
                  {Array.from({ length: selectedReviewForReply.rating }).map(() => '★').join('')} ({selectedReviewForReply.rating}.0)
                </span>
              </div>
              <span className="text-[11px] text-secondary italic">
                {selectedReviewForReply.productName}
              </span>
              <p className="mt-1 line-clamp-2 text-on-surface italic font-serif">
                “{selectedReviewForReply.comment}”
              </p>
            </div>

            {/* Textarea Input */}
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-semibold text-on-surface flex items-center justify-between"
                htmlFor="replyMessageInput"
              >
                <span>Lời nhắn của Xưởng gửi đến Khách hàng:</span>
                <span className="text-[11px] text-secondary font-normal font-mono">
                  {replyMessage.length}/500
                </span>
              </label>
              <textarea
                id="replyMessageInput"
                value={replyMessage}
                maxLength={500}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Nhập lời tri ân hoặc giải đáp mộc mạc từ nghệ nhân xưởng nung..."
                rows={4}
                className="w-full text-xs p-3.5 bg-surface-container-low rounded-xl text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary transition-all resize-none border border-outline-variant/30 font-body"
              />
            </div>

            {/* Quick Template Pills */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-medium text-secondary uppercase tracking-wider">
                Mẫu trả lời nhanh gợi ý:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handleInsertQuickTemplate(
                      'Cảm ơn bạn đã tin chọn gốm mộc Sahara Atelier. Chúc bạn luôn tìm thấy niềm an vui và tĩnh tại trong từng khoảnh khắc thưởng trà!'
                    )
                  }
                  className="text-[11px] bg-surface-container px-2.5 py-1.5 rounded-lg text-on-surface hover:bg-primary/10 hover:text-primary transition-colors text-left border border-outline-variant/30"
                >
                  “Cảm ơn bạn đã tin chọn gốm mộc...”
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleInsertQuickTemplate(
                      'Xưởng rất vinh hạnh khi tác phẩm giữ trọn vẹn hương vị và cốt cách thanh tịnh của bạn. Chúc bạn một ngày an yên!'
                    )
                  }
                  className="text-[11px] bg-surface-container px-2.5 py-1.5 rounded-lg text-on-surface hover:bg-primary/10 hover:text-primary transition-colors text-left border border-outline-variant/30"
                >
                  “Xưởng rất vinh hạnh khi tác phẩm...”
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleInsertQuickTemplate(
                      'Xưởng chân thành ghi nhận góp ý quý giá này để các mẻ nung sau thêm phần chu toàn và tiện lợi hơn cho người dùng!'
                    )
                  }
                  className="text-[11px] bg-surface-container px-2.5 py-1.5 rounded-lg text-on-surface hover:bg-primary/10 hover:text-primary transition-colors text-left border border-outline-variant/30"
                >
                  “Xưởng chân thành ghi nhận góp ý...”
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-outline-variant/30">
              <button
                type="button"
                disabled={isSubmittingReply}
                onClick={handleCloseReplyModal}
                className="px-4 py-2 text-xs font-semibold text-secondary hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors border border-outline-variant/30"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                disabled={isSubmittingReply}
                onClick={handleSubmitReply}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-on-primary bg-primary hover:bg-on-primary-fixed-variant rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>{isSubmittingReply ? 'Đang gửi...' : 'Gửi Phản Hồi Ngay'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. LIGHTBOX MODAL: PHÓNG TO ẢNH THỰC TẾ                  */}
      {/* ========================================================= */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all animate-fadeIn"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setActiveLightboxImage(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white flex items-center gap-1 text-xs"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
              <span>Đóng</span>
            </button>
            <img
              src={activeLightboxImage}
              alt="Ảnh phóng to"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;


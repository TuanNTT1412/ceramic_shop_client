import React, { useState, useEffect, useMemo } from 'react';
import { categoryApi } from '../../api';
import { useToast, useAdminFilter } from '../../context';
import { AdminButton } from '../../components/layout';

// Dữ liệu danh mục mẫu đồng bộ thiết kế Stitch & database
const INITIAL_CATEGORIES = [
  {
    id: 'am-chen-tra-dao',
    name: 'Ấm Chén Trà Đạo',
    description:
      'Bộ sưu tập ấm chén hỏa biến & dưỡng trà men tro củi nung nhiệt độ cao',
    productsCount: 38,
    updatedAt: '24/10/2025',
  },
  {
    id: 'binh-hoa-dang-co',
    name: 'Bình Hoa Dáng Cổ',
    description:
      'Kiến trúc hình khối dáng cổ, men rạn Sa Thạch và men tro tự nhiên',
    productsCount: 52,
    updatedAt: '22/10/2025',
  },
  {
    id: 'bat-dia-ban-tiec-moc',
    name: 'Bát Đĩa Bàn Tiệc Mộc',
    description:
      'Dòng bát đĩa men mộc phục vụ bày tiệc gia đình thuần khiết',
    productsCount: 45,
    updatedAt: '18/10/2025',
  },
  {
    id: 'tac-pham-doc-ban',
    name: 'Tác Phẩm Độc Bản',
    description:
      'Những tác phẩm tuyển chọn mẻ nung đặc biệt mang dấu ấn độc bản',
    productsCount: 18,
    updatedAt: '15/10/2025',
  },
  {
    id: 'dung-cu-xong-tram',
    name: 'Dụng Cụ Xông Trầm',
    description: 'Lư đốt trầm, đĩa xông trầm hương men tro cổ truyền',
    productsCount: 15,
    updatedAt: '10/10/2025',
  },
  {
    id: 'phu-kien-tra-huu',
    name: 'Phụ Kiện Trà Hữu',
    description: 'Dụng cụ gắp trà, chén tống và khay gốm thô mộc',
    productsCount: 18,
    updatedAt: '05/10/2025',
  },
];

export const AdminCategoriesPage = () => {
  const { searchQuery } = useAdminFilter();
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);

  // Modal State (Trung tâm màn hình)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Xóa
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  const toast = useToast();

  // Tải danh mục từ Backend (nếu có)
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await categoryApi.getCategories();
      if (res?.data && Array.isArray(res.data)) {
        if (res.data.length > 0) {
          const formatted = res.data.map((cat) => ({
            id: cat.id,
            name: cat.name,
            description: cat.description || 'Chưa có mô tả chi tiết',
            productsCount:
              typeof cat._count?.products === 'number'
                ? cat._count.products
                : cat.products?.length || 0,
            updatedAt: cat.updatedAt
              ? new Date(cat.updatedAt).toLocaleDateString('vi-VN')
              : 'Mới tạo',
          }));
          setCategories(formatted);
        } else {
          setCategories([]);
        }
      }
    } catch (err) {
      console.warn('Backend chưa chạy hoặc có lỗi, dùng dữ liệu mẫu:', err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Lọc theo tìm kiếm
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const totalCategories = categories.length;
    let maxItem = categories[0] || { name: 'Chưa có', productsCount: 0 };
    let totalProducts = 0;

    categories.forEach((c) => {
      totalProducts += c.productsCount || 0;
      if ((c.productsCount || 0) > (maxItem.productsCount || 0)) {
        maxItem = c;
      }
    });

    return {
      totalCategories,
      maxCategoryName: maxItem.name,
      maxCategoryCount: maxItem.productsCount || 0,
      totalProducts,
    };
  }, [categories]);

  // Mở modal Thêm mới
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  // Mở modal Chỉnh sửa
  const handleOpenEditModal = (category) => {
    setModalMode('edit');
    setEditingId(category.id);
    setFormData({
      name: category.name || '',
      description: category.description || '',
    });
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', description: '' });
    setEditingId(null);
  };

  // Xử lý Submit Form (Tạo mới hoặc Sửa)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning('Vui lòng nhập tên danh mục tác phẩm');
      return;
    }

    setIsSubmitting(true);
    const currentDate = new Date().toLocaleDateString('vi-VN');

    try {
      if (modalMode === 'create') {
        let createdCategory = null;
        try {
          const res = await categoryApi.adminCreateCategory({
            name: formData.name.trim(),
            description: formData.description.trim(),
          });
          createdCategory = res?.data;
        } catch (apiErr) {
          const errMsg = apiErr.response?.data?.message || apiErr.message;
          toast.error(errMsg || 'Lỗi khi tạo danh mục trên máy chủ');
          return;
        }

        const newCategory = {
          id: createdCategory?.id || `cat-${Date.now()}`,
          name: createdCategory?.name || formData.name.trim(),
          description: createdCategory?.description || formData.description.trim() || 'Chưa có mô tả chi tiết',
          productsCount: 0,
          updatedAt: currentDate,
        };
        setCategories((prev) => [newCategory, ...prev]);
        toast.success(`Đã tạo mới danh mục "${formData.name.trim()}" thành công!`);
      } else {
        try {
          await categoryApi.adminUpdateCategory(editingId, {
            name: formData.name.trim(),
            description: formData.description.trim(),
          });
        } catch (apiErr) {
          const errMsg = apiErr.response?.data?.message || apiErr.message;
          toast.error(errMsg || 'Lỗi khi cập nhật danh mục trên máy chủ');
          return;
        }

        setCategories((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  name: formData.name.trim(),
                  description:
                    formData.description.trim() || 'Chưa có mô tả chi tiết',
                  updatedAt: currentDate,
                }
              : item
          )
        );
        toast.success(`Đã cập nhật danh mục "${formData.name.trim()}" thành công!`);
      }

      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý Xóa danh mục
  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;

    try {
      try {
        await categoryApi.adminDeleteCategory(deleteConfirmItem.id);
      } catch (apiErr) {
        const errMsg = apiErr.response?.data?.message || apiErr.message;
        toast.error(errMsg || 'Lỗi khi xóa danh mục trên máy chủ');
        return;
      }

      setCategories((prev) =>
        prev.filter((cat) => cat.id !== deleteConfirmItem.id)
      );
      toast.success(`Đã xóa danh mục "${deleteConfirmItem.name}" thành công!`);
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  return (
    <div className="relative w-full flex flex-col pb-16 animate-fadeIn">
      {/* Top Ambient Glow Hiệu ứng Saharan Warmth */}
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-primary-fixed/30 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* 1. Header Trang & Nút Thao Tác Chính */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2 pb-8 border-b border-outline-variant/30">
        <div>
          <h1 className="text-3xl lg:text-4xl font-headline font-bold text-on-surface tracking-tight">
            Quản Lý Danh Mục Tác Phẩm
          </h1>
          <p className="max-w-2xl text-xs md:text-sm text-on-surface-variant font-body mt-1 leading-relaxed">
            Tổ chức và chuẩn hóa nhóm tác phẩm gốm mộc, đặc tính cốt đất và các dòng men tự nhiên của xưởng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AdminButton
            icon="add"
            onClick={handleOpenCreateModal}
            title="Tạo danh mục tác phẩm mới"
          >
            Tạo Danh Mục Mới
          </AdminButton>
        </div>
      </div>

      {/* 4. Bảng Danh Sách Danh Mục Master (ĐỒNG BỘ 100% QUY CHUẨN DATA TABLE) */}
      <div className="w-full bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-xs overflow-hidden mt-8">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs font-body">
            <thead className="bg-surface-container-low text-on-surface-variant font-label uppercase tracking-wider text-[11px] border-b border-outline-variant/30 select-none">
              <tr>
                <th className="py-3.5 px-4 font-semibold w-16 text-center">
                  STT
                </th>
                <th className="py-3.5 px-4 font-semibold min-w-[200px]">
                  Tên Danh Mục
                </th>
                <th className="py-3.5 px-4 font-semibold">Mô Tả Danh Mục</th>
                <th className="py-3.5 px-3 font-semibold text-center whitespace-nowrap">
                  Số Lượng Sản Phẩm
                </th>
                <th className="py-3.5 px-3 font-semibold text-center whitespace-nowrap">
                  Ngày Cập Nhật
                </th>
                <th className="py-3.5 px-4 font-semibold text-right whitespace-nowrap">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-outline">
                        category
                      </span>
                      <p className="text-xs">
                        Không tìm thấy danh mục nào phù hợp với từ khóa "
                        {searchQuery}"
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, index) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-surface-container-low/40 transition-colors group"
                  >
                    {/* STT */}
                    <td className="py-4 px-4 text-center font-label text-on-surface-variant font-medium">
                      {String(index + 1).padStart(2, '0')}
                    </td>

                    {/* Tên Danh Mục */}
                    <td className="py-4 px-4">
                      <span className="font-sans text-sm font-semibold text-on-surface group-hover:text-primary transition-colors block">
                        {cat.name}
                      </span>
                    </td>

                    {/* Mô Tả Danh Mục */}
                    <td className="py-4 px-4 text-on-surface-variant text-[11px] leading-relaxed max-w-md">
                      {cat.description}
                    </td>

                    {/* Số Lượng Sản Phẩm */}
                    <td className="py-4 px-3 text-center whitespace-nowrap text-xs font-semibold text-on-surface">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                        cat.productsCount > 0
                          ? 'bg-primary/10 text-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {cat.productsCount || 0} mẫu
                      </span>
                    </td>

                    {/* Ngày Cập Nhật */}
                    <td className="py-4 px-3 text-center text-[11px] text-on-surface-variant whitespace-nowrap font-mono">
                      {cat.updatedAt}
                    </td>

                    {/* Cột Thao Tác (Sửa & Xóa) */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Nút Sửa */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(cat)}
                          className="w-8 h-8 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors inline-flex items-center justify-center cursor-pointer"
                          title="Chỉnh sửa danh mục"
                          aria-label="Chỉnh sửa danh mục"
                        >
                          <span className="material-symbols-outlined text-[17px]">
                            edit
                          </span>
                        </button>

                        {/* Nút Xóa (Ràng buộc toàn vẹn) */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmItem(cat)}
                          className={`w-8 h-8 rounded-md transition-colors inline-flex items-center justify-center ${
                            cat.productsCount > 0
                              ? 'text-outline/40 cursor-not-allowed hover:bg-transparent'
                              : 'hover:bg-error-container text-on-surface-variant hover:text-error cursor-pointer'
                          }`}
                          title={
                            cat.productsCount > 0
                              ? `Không thể xóa vì danh mục đang có ${cat.productsCount} sản phẩm liên kết`
                              : 'Xóa danh mục'
                          }
                          aria-label="Xóa danh mục"
                        >
                          <span className="material-symbols-outlined text-[17px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Chân Bảng: Thống Kê & Phân Trang Chuẩn */}
        <div className="px-5 py-3.5 bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant border-t border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span>
              Hiển thị <strong className="text-on-surface font-semibold">{filteredCategories.length}</strong> trên{' '}
              <strong className="text-on-surface font-semibold">{categories.length}</strong> danh mục tác phẩm
            </span>
            <span className="text-outline-variant">•</span>
            <span>
              Tổng <strong className="text-primary font-semibold">{stats.totalProducts}</strong> tác phẩm phân loại
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-medium border border-outline-variant/30">
              Trang 1 / 1
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. FORM MODAL Ở TRUNG TÂM (CENTER DIALOG WITH BACKDROP) */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Lớp phủ làm tối xung quanh (Dark Backdrop) */}
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
          />

          {/* Khung Form Modal Trung Tâm */}
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-lg shadow-2xl p-6 sm:p-7 border border-outline-variant/50 z-10 animate-scaleUp">
            {/* Header Modal */}
            <div className="flex items-start justify-between pb-4 border-b border-outline-variant/30">
              <div className="flex flex-col">
                <span className="text-[10px] font-label uppercase tracking-widest text-primary font-bold">
                  {modalMode === 'create'
                    ? 'Thêm Mới Danh Mục'
                    : 'Biên Tập & Thiết Lập'}
                </span>
                <h2 className="font-headline text-xl font-bold text-on-surface mt-0.5">
                  {modalMode === 'create'
                    ? 'Tạo Danh Mục Tác Phẩm'
                    : 'Chỉnh Sửa Danh Mục'}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                title="Đóng cửa sổ"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            {/* Nội Dung Form */}
            <form onSubmit={handleSubmitForm} className="space-y-4 pt-4">
              {/* Tên Danh Mục */}
              <div>
                <label className="block font-label text-[11px] text-on-surface-variant uppercase tracking-wider mb-1.5 font-semibold">
                  Tên Danh Mục <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Ấm Chén Trà Đạo"
                  className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-md text-on-surface text-xs font-medium focus:outline-none focus:bg-surface-container focus:border-primary transition-colors border border-outline-variant/60"
                />
              </div>

              {/* Mô Tả Danh Mục */}
              <div>
                <label className="block font-label text-[11px] text-on-surface-variant uppercase tracking-wider mb-1.5 font-semibold">
                  Mô Tả Danh Mục
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả chất liệu men tro, đất nung, nhiệt độ hoặc phong cách tạo tác..."
                  className="w-full bg-surface-container-low p-3 rounded-md text-on-surface text-xs focus:outline-none focus:bg-surface-container focus:border-primary resize-none leading-relaxed border border-outline-variant/60"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-label font-medium transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-md bg-primary hover:bg-[#a8531e] text-on-primary text-xs font-label font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    check
                  </span>
                  <span>
                    {isSubmitting
                      ? 'Đang lưu...'
                      : modalMode === 'create'
                      ? 'Tạo Danh Mục'
                      : 'Lưu Cập Nhật'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL XÁC NHẬN XÓA (DELETE CONFIRM DIALOG - CÓ RÀNG BUỘC) */}
      {/* ========================================================= */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setDeleteConfirmItem(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
          />

          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-lg shadow-2xl p-6 border border-outline-variant/50 z-10 animate-scaleUp">
            <div className="flex items-center gap-3 text-error mb-3">
              <div className="w-9 h-9 rounded-md bg-error-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px] text-error">
                  warning
                </span>
              </div>
              <h3 className="font-headline text-base font-bold text-on-surface">
                {deleteConfirmItem.productsCount > 0
                  ? 'Không Thể Xóa Danh Mục Này'
                  : 'Xác Nhận Xóa Danh Mục'}
              </h3>
            </div>

            {deleteConfirmItem.productsCount > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-error font-medium leading-relaxed bg-error/10 p-3 rounded-md border border-error/20">
                  Danh mục <strong>"{deleteConfirmItem.name}"</strong> hiện đang liên kết với{' '}
                  <strong>{deleteConfirmItem.productsCount} tác phẩm</strong> trong kho gốm.
                </p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Để bảo vệ toàn vẹn dữ liệu đơn hàng và hiển thị, hệ thống không cho phép xóa danh mục đang có sản phẩm. Vui lòng chuyển các sản phẩm sang danh mục khác trước khi xóa.
                </p>
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Quý khách có chắc chắn muốn xóa danh mục{' '}
                <strong className="text-on-surface font-semibold">
                  "{deleteConfirmItem.name}"
                </strong>{' '}
                (0 tác phẩm) không? Thao tác này sẽ xóa vĩnh viễn danh mục khỏi cơ sở dữ liệu.
              </p>
            )}

            <div className="pt-5 flex items-center justify-end gap-3 border-t border-outline-variant/20 mt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-label font-medium transition-colors cursor-pointer"
              >
                {deleteConfirmItem.productsCount > 0 ? 'Đã Hiểu' : 'Hủy Bỏ'}
              </button>
              {deleteConfirmItem.productsCount === 0 && (
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-md bg-error hover:bg-[#a82d22] text-white text-xs font-label font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Xác Nhận Xóa
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;

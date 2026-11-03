import React from 'react';

/**
 * Sahara Pagination Component (Phân trang Gốm Mộc)
 * Tái sử dụng cho trang Bộ sưu tập, Danh mục tác phẩm, Quản lý đơn hàng, Admin
 */
export const Pagination = ({
  currentPage = 1,
  totalPages = 6,
  onPageChange = () => {},
  className = '',
}) => {
  if (totalPages <= 1) return null;

  // Tính toán dải trang cần hiển thị (bao gồm dấu ...)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn có trang 1
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Luôn có trang cuối
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className={`flex items-center justify-center gap-2 pt-8 ${className}`}
      aria-label="Phân trang"
    >
      {/* Nút Trang Trước */}
      <button
        type="button"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`w-8 h-8 rounded-full border border-[#ebdcd0] flex items-center justify-center text-xs transition-colors ${
          currentPage <= 1
            ? 'opacity-40 cursor-not-allowed text-[#a69280]'
            : 'text-[#735e4d] hover:bg-white hover:text-[#c2652a]'
        }`}
        aria-label="Trang trước"
      >
        ‹
      </button>

      {/* Danh Sách Số Trang */}
      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span key={`dots-${idx}`} className="text-xs text-[#9c8472] px-1 select-none">
              ...
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center transition-all ${
              isCurrent
                ? 'bg-[#c2652a] text-white font-bold shadow-xs'
                : 'border border-[#ebdcd0] text-[#735e4d] hover:bg-white hover:text-[#c2652a]'
            }`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {p}
          </button>
        );
      })}

      {/* Nút Trang Sau */}
      <button
        type="button"
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`w-8 h-8 rounded-full border border-[#ebdcd0] flex items-center justify-center text-xs transition-colors ${
          currentPage >= totalPages
            ? 'opacity-40 cursor-not-allowed text-[#a69280]'
            : 'text-[#735e4d] hover:bg-white hover:text-[#c2652a]'
        }`}
        aria-label="Trang sau"
      >
        ›
      </button>
    </nav>
  );
};

export default Pagination;


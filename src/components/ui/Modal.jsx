import React, { useEffect } from 'react';

/**
 * Sahara Modal Primitive
 * Props: isOpen, onClose, title, subtitle, children, maxWidth ('sm' | 'md' | 'lg' | 'xl')
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
  className = '',
}) => {
  // Khóa cuộn trang khi mở modal và bấm ESC để đóng
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* 1. Lớp nền mờ phía sau (Backdrop) */}
      <div
        className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Khung Dialog màu trắng ấm bo góc rounded-xl, đổ bóng ấm sa thạch */}
      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-white rounded-xl border border-sahara-border shadow-[0_20px_60px_-15px_rgba(90,60,40,0.22)] overflow-hidden z-10 transition-all transform animate-scaleUp font-sans ${className}`}
      >
        {/* Header với tiêu đề serif & nút X */}
        <div className="px-6 py-5 border-b border-sahara-border/60 flex items-start justify-between bg-sahara-surface-warm/40">
          <div>
            {title && (
              <h3 className="font-serif text-xl font-bold text-text-main">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-text-muted mt-1">{subtitle}</p>
            )}
          </div>

          {/* Nút đóng (Icon X) */}
          <button
            onClick={onClose}
            className="group p-2 -mr-2 -mt-2 rounded-full text-text-muted hover:text-sahara-primary hover:bg-sahara-primary-light transition-all duration-200 focus:outline-none"
            aria-label="Đóng"
          >
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Nội dung bên trong Modal */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

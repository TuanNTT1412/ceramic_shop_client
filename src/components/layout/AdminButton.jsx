import React from 'react';

/**
 * Nút bấm chuẩn hóa đồng bộ cho toàn bộ giao diện quản trị (Admin)
 * Variants:
 * - 'primary': Nút cam đất nung (#c2652a), viền bo 12px, shadow ấm, dùng cho hành động chính (+ Tạo mới, + Khai hỏa...)
 * - 'secondary': Nút xám nhạt có viền, icon cam, dùng cho hành động phụ (Xuất Excel, Tải về...)
 */
export const AdminButton = ({
  children,
  variant = 'primary',
  icon,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  title,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none font-body';

  const variantStyles = {
    primary:
      'bg-primary hover:bg-[#a8531e] text-on-primary shadow-primary/20 border border-transparent',
    secondary:
      'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/40',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {icon && (
        <span
          className={`material-symbols-outlined text-[18px] ${
            variant === 'secondary' ? 'text-primary' : ''
          }`}
        >
          {icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
};

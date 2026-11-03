import React from 'react';

/**
 * Sahara Button Primitive
 * Variants: 'primary' | 'outline' | 'ghost' | 'danger'
 * Sizes: 'sm' | 'md' | 'lg'
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  icon: Icon,
  ...props
}) => {
  // Base styles cho tất cả nút
  const baseStyles =
    'inline-flex items-center justify-center font-medium font-sans transition-all duration-200 ease-out select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sahara-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  // Biến thể màu sắc & trạng thái hover/active
  const variantStyles = {
    // Nút chính: Cam đất nung (#c2652a), bóng ấm tự nhiên, hover sáng nâu đỏ sang trọng
    primary:
      'bg-sahara-primary text-white shadow-[0_4px_14px_rgba(194,101,42,0.28)] hover:bg-sahara-primary-hover hover:shadow-[0_6px_20px_rgba(194,101,42,0.36)] hover:-translate-y-0.5 active:translate-y-0 border border-transparent',

    // Nút phụ viền mảnh: Nền trong/trắng, viền sa thạch mộc mạc, hover lên nền cam nhạt
    outline:
      'bg-white/80 backdrop-blur-sm text-sahara-primary border border-sahara-primary/60 hover:bg-sahara-primary-light hover:border-sahara-primary hover:text-sahara-primary-hover hover:-translate-y-0.5 active:translate-y-0 shadow-sm',

    // Ghost: Không viền, lướt chuột tạo nền men sứ mờ tinh tế
    ghost:
      'bg-transparent text-text-body hover:bg-sahara-primary-light/60 hover:text-sahara-primary active:bg-sahara-primary-light',

    // Danger: Dùng cho nút Hủy đơn / Xóa giỏ hàng
    danger:
      'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300',
  };

  // Kích thước & Khoảng đệm (Padding, Font-size, Bo góc)
  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-sm gap-1.5', // Bo góc 8px (rounded-sm)
    md: 'text-sm px-5 py-2.5 rounded-sm gap-2', // Chuẩn e-commerce (rounded-sm)
    lg: 'text-base px-7 py-3.5 rounded-md gap-2.5 font-semibold', // CTA Hero / Checkout (rounded-md)
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;

import React from 'react';

/**
 * Sahara Badge / Tag Primitive
 * Variants: 'primary' | 'sand' | 'success' | 'warning' | 'danger' | 'outline'
 * Shape: 'pill' (rounded-full) | 'soft' (rounded-sm)
 * Sizes: 'sm' | 'md'
 */
export const Badge = ({
  children,
  variant = 'primary',
  shape = 'pill',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  // Kiểu bo góc
  const shapeStyles = {
    pill: 'rounded-full', // Hình viên thuốc
    soft: 'rounded-sm', // Vuông mềm (8px)
  };

  // Kích thước đệm và chữ
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider font-semibold',
    md: 'text-xs px-2.5 py-1 tracking-wide font-medium',
  };

  // Bảng màu Pastel nhạt & Viền mảnh chuẩn sa thạch Sahara
  const variantStyles = {
    // Cam đất nung nhạt (Độc bản, nổi bật)
    primary: 'bg-sahara-primary-light text-sahara-primary border border-sahara-primary/20',

    // Cát ấm pastel (Men tro, gốm thô, metadata)
    sand: 'bg-[#f4eee7] text-text-body border border-[#e8ded2]',

    // Xanh men ngọc (Đã thanh toán, hoàn tất đơn)
    success: 'bg-[#edf7f0] text-[#3f784c] border border-[#d2edd7]',

    // Vàng hoàng thổ (Chờ xử lý, mẻ lò đang nung)
    warning: 'bg-[#fff8eb] text-[#c27d14] border border-[#fde8c2]',

    // Đỏ gạch nhạt (Hết hàng, hủy đơn)
    danger: 'bg-[#fdf2f2] text-[#b33939] border border-[#fadad9]',

    // Nền trắng viền mảnh tối giản
    outline: 'bg-white/90 text-text-muted border border-sahara-border backdrop-blur-xs',
  };

  // Màu chấm tròn báo trạng thái (status dot)
  const dotColor = {
    primary: 'bg-sahara-primary',
    sand: 'bg-[#857567]',
    success: 'bg-[#3f784c]',
    warning: 'bg-[#c27d14]',
    danger: 'bg-[#b33939]',
    outline: 'bg-text-muted',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans uppercase select-none transition-colors ${shapeStyles[shape]} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor[variant] || 'bg-current'}`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;

import React from 'react';

/**
 * Sahara Skeleton Loader Primitive
 * Dùng tông màu cát ấm: bg-[#e8ded2]/65 hoặc bg-sahara-sand/50
 */
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-[#e8ded2]/65 rounded-sm ${className}`}
      {...props}
    />
  );
};

/**
 * Skeleton mẫu sẵn cho Thẻ sản phẩm bình gốm (CeramicCard Skeleton)
 * Đúng chuẩn tỉ lệ ảnh 4:5 + tiêu đề + giá tiền
 */
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border border-sahara-border rounded-md overflow-hidden p-3.5 space-y-3 shadow-warm-sm">
      {/* Khung ảnh bình gốm tỉ lệ 4:5 */}
      <Skeleton className="w-full aspect-[4/5] rounded-sm bg-[#e8ded2]/60" />

      {/* Tag thể loại */}
      <Skeleton className="w-1/3 h-4 rounded-full" />

      {/* Tên sản phẩm gốm */}
      <Skeleton className="w-4/5 h-5 rounded-sm" />

      {/* Giá tiền */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="w-1/3 h-5 rounded-sm" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
};

export default Skeleton;

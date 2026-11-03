import React from 'react';

/**
 * Sahara Rating Stars Primitive
 * Hiển thị điểm số đánh giá bằng hệ thống sao vàng gốm sứ
 */
export const RatingStars = ({
  rating = 5,
  max = 5,
  className = '',
}) => {
  return (
    <div className={`flex text-primary items-center gap-0.5 ${className}`}>
      {Array.from({ length: max }).map((_, index) => {
        const isFilled = index < Math.round(rating);
        return (
          <span
            key={index}
            className="material-symbols-outlined text-[18px] select-none"
          >
            {isFilled ? 'star' : 'star_border'}
          </span>
        );
      })}
    </div>
  );
};

export default RatingStars;

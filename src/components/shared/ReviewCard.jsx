import React from 'react';
import { RatingStars } from './RatingStars';

/**
 * Sahara Review Card (Lời Bình & Chiêm Nghiệm)
 * Thẻ nhận xét từ nghệ nhân trà đạo, kiến trúc sư và người yêu gốm
 */
export const ReviewCard = ({
  review,
  className = '',
}) => {
  if (!review) return null;

  const {
    name,
    role,
    quote,
    rating = 5,
    avatarLetter = name ? name.charAt(0) : 'T',
  } = review;

  return (
    <div
      className={`p-8 rounded-2xl bg-surface-container-lowest flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-300 border border-outline-variant/30 ${className}`}
    >
      <div>
        {/* Số sao đánh giá */}
        <RatingStars rating={rating} className="mb-4" />

        {/* Lời trích dẫn nghệ thuật */}
        <p className="font-headline italic text-base text-on-surface leading-relaxed mb-6">
          “{quote}”
        </p>
      </div>

      {/* Thông tin người đánh giá */}
      <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-headline font-semibold text-primary uppercase select-none">
          {avatarLetter}
        </div>
        <div>
          <p className="text-xs font-semibold text-on-surface">{name}</p>
          <p className="text-[11px] text-on-surface-variant">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;

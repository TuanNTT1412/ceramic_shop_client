import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

/**
 * Sahara Category Card (Thẻ Danh Mục Gốm Tuyển Chọn)
 * Hiển thị theo tỉ lệ 4:5 chuẩn nghệ thuật gốm sứ
 */
export const CategoryCard = ({
  category,
  className = '',
}) => {
  if (!category) return null;

  const {
    title,
    subtitle,
    description,
    image,
    link = ROUTES.PRODUCTS,
  } = category;

  return (
    <Link
      to={link}
      className={`group flex flex-col rounded-2xl overflow-hidden bg-surface-container-low hover:bg-surface-container-high transition-all duration-300 shadow-xs hover:shadow-md border border-outline-variant/30 ${className}`}
    >
      {/* Khung Ảnh Tỉ Lệ 4:5 */}
      <div className="aspect-[4/5] w-full overflow-hidden bg-surface-container">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          alt={title}
          src={image}
          loading="lazy"
        />
      </div>

      {/* Phần Nội Dung */}
      <div className="p-6 flex flex-col flex-1">
        {subtitle && (
          <span className="text-[11px] font-label text-primary font-semibold uppercase tracking-wider mb-1">
            {subtitle}
          </span>
        )}

        <h3 className="font-headline text-xl text-on-surface font-medium mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {description && (
          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;

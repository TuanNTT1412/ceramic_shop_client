import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui';
import { useCart, useToast } from '../../context';
import { formatCurrency } from '../../utils/format';
import { ROUTES } from '../../constants';

/**
 * Sahara Product Card (Thẻ Sản Phẩm Gốm Nghệ Thuật)
 * Tái sử dụng linh hoạt giữa HomePage, ProductListPage và Related Products
 */
export const ProductCard = ({
  product,
  onQuickAdd,
  className = '',
}) => {
  const { addToCart } = useCart();
  const toast = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) return null;

  const {
    id,
    code = `ML-${product.id?.slice(0, 4) || '2401'}`,
    name,
    spec,
    price,
    image,
    primaryImage,
    badge = 'Độc bản nung củi',
    badgeVariant = 'primary',
  } = product;

  const displayImage = primaryImage || image;
  const displayPrice = typeof price === 'number' ? formatCurrency(price) : price;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isFavorite;
    setIsFavorite(next);
    if (next) {
      toast.success(`Đã thêm "${name}" vào danh sách yêu thích!`);
    } else {
      toast.info(`Đã bỏ "${name}" khỏi danh sách yêu thích.`);
    }
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product);
    } else {
      toast.success(`Đã thêm "${name}" vào giỏ hàng!`);
    }
  };

  const detailUrl = `${ROUTES.PRODUCTS}/${id}`;

  return (
    <div
      className={`group flex flex-col rounded-2xl bg-surface-container-lowest p-4 shadow-xs hover:shadow-xl transition-all duration-300 border border-outline-variant/30 ${className}`}
    >
      {/* Khung Ảnh Tác Phẩm */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-4">
        <Link to={detailUrl} className="block w-full h-full">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            alt={name}
            src={displayImage}
            loading="lazy"
          />
        </Link>

        {/* Badge phân loại tác phẩm */}
        {badge && (
          <div className="absolute top-3 left-3 pointer-events-none">
            <Badge variant={badgeVariant} shape="pill" size="sm">
              {badge}
            </Badge>
          </div>
        )}

        {/* Nút yêu thích (Wishlist Heart) */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 shadow-xs active:scale-90 ${
            isFavorite
              ? 'bg-red-50 text-red-600'
              : 'bg-surface/80 text-on-surface hover:text-primary hover:bg-white'
          }`}
          aria-label="Yêu thích"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>

      {/* Thông Tin Tác Phẩm */}
      <div className="flex flex-col flex-1">
        {code && (
          <span className="text-[11px] font-mono text-outline uppercase tracking-wider mb-1">
            MÃ: {code}
          </span>
        )}

        <Link
          to={detailUrl}
          className="font-headline text-lg font-medium text-on-surface hover:text-primary transition-colors mb-1 line-clamp-1"
        >
          {name}
        </Link>

        {spec && (
          <p className="text-xs text-on-surface-variant mb-4 line-clamp-1">
            {spec}
          </p>
        )}

        {/* Thanh Giá Tiền & Nút Thêm Giỏ Hàng */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-outline-variant/20">
          <span className="font-headline text-lg font-bold text-primary">
            {displayPrice}
          </span>

          <button
            onClick={handleAddToCartClick}
            className="w-9 h-9 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-all duration-200 shadow-xs active:scale-95"
            title="Thêm vào giỏ hàng"
            aria-label="Thêm vào giỏ hàng"
          >
            <span className="material-symbols-outlined text-[18px]">
              add_shopping_cart
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

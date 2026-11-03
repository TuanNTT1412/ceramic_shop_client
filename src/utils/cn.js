/**
 * Ghép các class Tailwind có điều kiện gọn gàng
 * Ví dụ: cn('p-4', isActive && 'bg-sahara-primary', className)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

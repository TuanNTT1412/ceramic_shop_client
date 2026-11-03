import React, { forwardRef } from 'react';

/**
 * Sahara Input Primitive
 * Hỗ trợ Label, Helper text, Validation Error, Icon đầu/cuối
 */
export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  required,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left font-sans">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-text-body flex items-center gap-1"
        >
          {label}
          {required && <span className="text-sahara-primary font-bold">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-text-muted pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`
            w-full bg-white text-text-main text-sm font-sans placeholder:text-text-muted/70
            px-4 py-2.5 rounded-sm transition-all duration-150 outline-none
            ${Icon ? 'pl-10' : 'pl-4'}
            ${
              error
                ? 'border border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border border-sahara-border-card hover:border-sahara-primary/40 focus:border-sahara-primary focus:ring-3 focus:ring-sahara-primary/15'
            }
            ${className}
          `}
          {...props}
        />
      </div>

      {/* Báo lỗi đỏ (Error Message) */}
      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5 animate-fade-in">
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}

      {/* Chú thích thông thường (nếu không có lỗi) */}
      {!error && helperText && (
        <p className="text-xs text-text-muted mt-0.5">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

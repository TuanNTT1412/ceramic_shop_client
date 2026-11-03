import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, type = 'info', duration = 3500 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  // Helper shortcuts: toast.success('...'), toast.error('...')
  const toast = {
    success: (msg, duration) => addToast({ message: msg, type: 'success', duration }),
    error: (msg, duration) => addToast({ message: msg, type: 'error', duration }),
    warning: (msg, duration) => addToast({ message: msg, type: 'warning', duration }),
    info: (msg, duration) => addToast({ message: msg, type: 'info', duration }),
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-white border-[#d2edd7] text-[#2e5a38]',
          badge: 'bg-[#edf7f0] text-[#3f784c]',
          icon: (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      case 'error':
        return {
          container: 'bg-white border-[#fadad9] text-[#8e2929]',
          badge: 'bg-[#fdf2f2] text-[#b33939]',
          icon: (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      case 'warning':
        return {
          container: 'bg-white border-[#fde8c2] text-[#8c5a0e]',
          badge: 'bg-[#fff8eb] text-[#c27d14]',
          icon: (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      case 'info':
      default:
        return {
          container: 'bg-white border-sahara-border text-text-main',
          badge: 'bg-sahara-primary-light text-sahara-primary',
          icon: (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
    }
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}

      {/* Toast Notification Container (Góc trên bên phải) */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(({ id, message, type }) => {
          const styles = getToastStyles(type);
          return (
            <div
              key={id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-md border shadow-warm-md animate-slide-up transition-all font-sans ${styles.container}`}
              role="alert"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-full shrink-0 ${styles.badge}`}>
                  {styles.icon}
                </div>
                <p className="text-xs font-medium leading-relaxed truncate-2-lines">
                  {message}
                </p>
              </div>

              <button
                onClick={() => removeToast(id)}
                className="p-1 text-text-muted hover:text-text-main rounded-sm transition-colors shrink-0"
                aria-label="Đóng"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};

export default ToastContext;

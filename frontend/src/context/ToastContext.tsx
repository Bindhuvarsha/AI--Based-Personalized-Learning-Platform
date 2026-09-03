import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  timestamp: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const trimmedMsg = (message || '').trim();
    if (!trimmedMsg) return;

    setToasts((prev) => {
      // Prevent spam loop: deduplicate if the identical message is already showing
      const isDuplicate = prev.some((t) => t.message === trimmedMsg && t.type === type);
      if (isDuplicate) {
        return prev;
      }

      const id = Math.random().toString(36).substring(2, 9);
      // Keep maximum 3 toasts active at any time to prevent viewport clutter
      const capped = prev.length >= 3 ? prev.slice(prev.length - 2) : prev;
      return [...capped, { id, type, message: trimmedMsg, timestamp: Date.now() }];
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Auto-dismiss after 4 seconds
  React.useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container with fixed spacing, accessible polite live region, and non-overlapping flex column */}
      <div 
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2.5 max-w-sm w-[calc(100vw-2rem)] sm:w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const badgeColors = {
            success: 'border-emerald-200/90 text-emerald-900 bg-emerald-50/90',
            error: 'border-rose-200/90 text-rose-900 bg-rose-50/90',
            warning: 'border-amber-200/90 text-amber-900 bg-amber-50/90',
            info: 'border-indigo-200/90 text-indigo-900 bg-indigo-50/90',
          }[toast.type];

          const iconColor = {
            success: 'text-emerald-600',
            error: 'text-rose-600',
            warning: 'text-amber-600',
            info: 'text-indigo-600',
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start justify-between p-3.5 rounded-2xl shadow-xl backdrop-blur-xl border font-medium text-xs sm:text-sm transition-all duration-200 ${badgeColors}`}
              style={{
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                <span className={`mt-0.5 flex-shrink-0 ${iconColor}`}>
                  {toast.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                  {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
                  {toast.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                  {toast.type === 'info' && <Info className="w-4 h-4" />}
                </span>
                <p className="min-w-0 flex-1 break-words font-medium leading-snug">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                className="ml-2.5 -mr-1 -mt-1 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
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
  return context;
};

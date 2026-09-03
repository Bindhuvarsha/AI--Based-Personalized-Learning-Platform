import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* GlassCard                                                                   */
/* -------------------------------------------------------------------------- */
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'elevated';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'glass-panel',
    subtle: 'glass-panel-subtle',
    elevated: 'glass-panel shadow-2xl border-white/90',
  }[variant];

  const interactiveStyles = interactive ? 'glass-card-hover cursor-pointer' : '';

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl ${variantStyles} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* GlassButton                                                                */
/* -------------------------------------------------------------------------- */
export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'student' | 'admin' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  children,
  ...props
}, ref) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3.5 text-base rounded-xl font-bold',
  }[size];

  const variantStyles = {
    primary: 'glass-btn-primary font-semibold',
    secondary: 'bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-white hover:text-indigo-600 shadow-xs font-semibold',
    student: 'glass-btn-student font-semibold',
    admin: 'glass-btn-admin font-semibold',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium',
  }[variant];

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center space-x-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
});

GlassButton.displayName = 'GlassButton';

/* -------------------------------------------------------------------------- */
/* GlassInput                                                                 */
/* -------------------------------------------------------------------------- */
export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rightElement?: React.ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(({
  label,
  error,
  helperText,
  id,
  rightElement,
  className = '',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`glass-input w-full px-4 py-2.5 sm:py-3 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none disabled:opacity-50 ${rightElement ? 'pr-11' : ''} ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : ''} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-rose-600 font-medium break-words">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-xs text-slate-500 font-normal break-words">
          {helperText}
        </p>
      )}
    </div>
  );
});

GlassInput.displayName = 'GlassInput';

/* -------------------------------------------------------------------------- */
/* GlassAlert                                                                 */
/* -------------------------------------------------------------------------- */
export interface GlassAlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const GlassAlert: React.FC<GlassAlertProps> = ({
  type = 'info',
  message,
  onDismiss,
  className = '',
}) => {
  const styles = {
    info: 'bg-indigo-50/90 border-indigo-200 text-indigo-900',
    success: 'bg-emerald-50/90 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50/90 border-amber-200 text-amber-900',
    error: 'bg-rose-50/90 border-rose-200 text-rose-900',
  }[type];

  return (
    <div
      role="alert"
      className={`flex items-start justify-between p-3.5 rounded-xl border backdrop-blur-md shadow-sm text-xs sm:text-sm font-medium ${styles} ${className}`}
    >
      <div className="min-w-0 flex-1 break-words leading-relaxed">
        {message}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="ml-3 text-current opacity-70 hover:opacity-100 rounded-md focus-visible:ring-2 focus-visible:ring-current outline-none"
        >
          ×
        </button>
      )}
    </div>
  );
};

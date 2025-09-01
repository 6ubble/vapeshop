import React, { type ButtonHTMLAttributes, type InputHTMLAttributes } from 'react';

// Utility функция для классов
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Button компонент
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-95';
  
  const variants = {
    primary: 'bg-tg-button text-tg-button-text hover:opacity-90 disabled:opacity-50',
    secondary: 'bg-tg-secondary-bg text-tg-text hover:bg-gray-200 disabled:opacity-50',
    ghost: 'text-tg-button hover:bg-tg-secondary-bg disabled:opacity-50',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-50'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
      )}
      {children}
    </button>
  );
};

// Input компонент
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  onChange: (value: string) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  onChange,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-tg-text">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tg-hint">
            {icon}
          </div>
        )}
        
        <input
          className={cn(
            'w-full px-3 py-2.5 bg-tg-secondary-bg border border-transparent rounded-lg text-tg-text placeholder-tg-hint',
            'focus:outline-none focus:ring-2 focus:ring-tg-button focus:border-transparent',
            'transition-all duration-200',
            icon ? 'pl-10' : '',
            error ? 'border-red-500' : '',
            className
          )}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Card компонент
interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  className,
  onClick
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      className={cn(
        'bg-white rounded-xl border border-gray-100 shadow-sm',
        onClick && 'hover:shadow-md active:scale-[0.99] transition-all duration-200',
        paddingStyles[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

// Badge компонент
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm'
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800', 
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full',
      variants[variant],
      sizes[size]
    )}>
      {children}
    </span>
  );
};

// EmptyState компонент
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action
}) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mb-4 text-tg-hint">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-tg-text mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-tg-hint mb-4 max-w-sm mx-auto">
          {description}
        </p>
      )}
      
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

// SectionHeader компонент
interface SectionHeaderProps {
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  children,
  action
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-bold text-tg-text">
        {children}
      </h2>
      {action}
    </div>
  );
};

// Divider компонент
export const Divider: React.FC = () => (
  <hr className="border-gray-200" />
);

// LoadingSpinner компонент
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };
  
  return (
    <div className={cn(
      'animate-spin border-2 border-tg-button border-t-transparent rounded-full',
      sizes[size]
    )} />
  );
};

// BottomSheet для модальных окон (важно для mobile UX)
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl animate-slide-up">
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold">{title}</h3>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
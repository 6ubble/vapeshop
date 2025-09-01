import React from 'react';

// Компонент загрузки
export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-tg-bg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tg-button mx-auto mb-4"></div>
        <p className="text-tg-hint">Загрузка...</p>
      </div>
    </div>
  );
};

// Кнопка
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = ''
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'btn-tg',
    secondary: 'btn-tg-secondary',
    outline: 'border border-tg-button text-tg-button bg-transparent hover:bg-tg-button hover:text-tg-button-text',
    ghost: 'text-tg-button bg-transparent hover:bg-tg-secondary-bg'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[48px]'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      )}
      {children}
    </button>
  );
};

// Карточка
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md',
  clickable = false,
  onClick
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const clickableClasses = clickable ? 'cursor-pointer hover:bg-opacity-80 active:scale-[0.98]' : '';
  
  return (
    <div 
      className={`card-tg ${paddingClasses[padding]} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Заголовок секции
interface SectionHeaderProps {
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ children, action }) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="section-header">
        {children}
      </h3>
      {action}
    </div>
  );
};

// Инпут
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  error,
  label,
  disabled = false,
  icon
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
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
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-tg-secondary-bg text-tg-text border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-tg-button ${error ? 'ring-2 ring-red-500' : ''} ${disabled ? 'opacity-50' : ''}`}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Badge
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
  const variantClasses = {
    default: 'bg-tg-secondary-bg text-tg-text',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
};

// Текстовая область
interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 3,
  className = '',
  error,
  label,
  disabled = false
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-tg-text">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-tg-secondary-bg text-tg-text border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-tg-button resize-none ${error ? 'ring-2 ring-red-500' : ''} ${disabled ? 'opacity-50' : ''}`}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Разделитель
export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`border-t border-tg-hint border-opacity-20 ${className}`} />;
};

// Пустое состояние
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
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
        <div className="flex justify-center mb-4 text-tg-hint">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-tg-text mb-2">{title}</h3>
      {description && (
        <p className="text-tg-hint mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action}
    </div>
  );
};
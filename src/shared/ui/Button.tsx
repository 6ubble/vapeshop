import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success';
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
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-1',
    secondary: 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:-translate-y-1 border border-gray-200',
    outline: 'border-2 border-indigo-500 text-indigo-600 bg-transparent hover:bg-indigo-500 hover:text-white',
    ghost: 'text-gray-600 bg-transparent hover:bg-gray-100',
    success: 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
      )}
      {children}
    </button>
  );
};

import React from 'react';

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
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const clickableClasses = clickable ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300' : '';
  
  return (
    <div 
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 ${paddingClasses[padding]} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

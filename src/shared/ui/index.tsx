import React from 'react'

const cn = (...classes: (string | undefined | null | false)[]): string => 
  classes.filter(Boolean).join(' ')

// === BUTTON ===
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        // Кнопка без анимаций и масштабирования
        'inline-flex items-center justify-center font-medium rounded-lg',
        // Variants
        variant === 'primary' && 'bg-tg-button text-tg-button-text',
        variant === 'secondary' && 'bg-tg-secondary-bg text-tg-text',
        variant === 'ghost' && 'text-tg-text',
        // Монохромный вариант danger
        variant === 'danger' && 'bg-[#111111] text-white opacity-80',
        // Sizes
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-3.5 py-2',
        size === 'lg' && 'px-5 py-2.5 text-base',
        // States
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        // Статичный индикатор загрузки без анимации
        <span className="h-3 w-3 rounded-full bg-current opacity-40 mr-2" />
      )}
      {children}
    </button>
  )
}

// === CARD ===
interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  const Component = onClick ? 'button' : 'div'
  
  return (
    <Component
      className={cn(
        // Карточка без теней и анимаций
        'bg-white rounded-lg border border-gray-200 p-3.5',
        onClick && 'cursor-pointer text-left',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

// === INPUT ===
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  icon?: React.ReactNode
  onChange: (value: string) => void
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-tg-hint">
            {icon}
          </div>
        )}
        
        <input
          className={cn(
            'w-full px-3 py-2.5 bg-tg-secondary-bg rounded-lg text-tg-text placeholder-tg-hint',
            'focus:outline-none focus:ring-2 focus:ring-tg-button',
            icon ? 'pl-10' : 'pl-3',
            error && 'border border-red-500',
            className
          )}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
      </div>
      
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// === BADGE ===
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
      // Монохромные варианты бейджей
      variant === 'default' && 'bg-gray-100 text-gray-800',
      variant === 'success' && 'bg-gray-200 text-gray-900',
      variant === 'warning' && 'bg-gray-300 text-gray-900',
      variant === 'error' && 'bg-gray-800 text-white',
      variant === 'info' && 'bg-gray-400 text-white'
    )}>
      {children}
    </span>
  )
}

// === LOADING SPINNER ===
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  return (
    // Статичный индикатор без анимации
    <div className={cn(
      'rounded-full bg-gray-300',
      size === 'sm' && 'h-4 w-4',
      size === 'md' && 'h-6 w-6',
      size === 'lg' && 'h-8 w-8'
    )} />
  )
}

// === EMPTY STATE ===
interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action
}) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="mb-4 text-tg-hint">{icon}</div>}
      
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
  )
}
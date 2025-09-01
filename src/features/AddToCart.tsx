import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '../shared/Ui';
import { useCart } from '../entities/cart';
import { useTelegram } from '../shared/Telegram';
import type { Product } from '../shared/types';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'default',
  className
}) => {
  const { items, add, updateQuantity, remove } = useCart();
  const { haptic } = useTelegram();
  const [isAdding, setIsAdding] = useState(false);
  
  // Находим товар в корзине
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  
  const handleAdd = async () => {
    if (!product.inStock) {
      window.Telegram?.WebApp?.showAlert?.('Товар временно отсутствует');
      return;
    }
    
    setIsAdding(true);
    haptic.light();
    
    // Симуляция загрузки для UX
    setTimeout(() => {
      add(product);
      setIsAdding(false);
    }, 200);
  };
  
  const handleIncrease = () => {
    haptic.light();
    updateQuantity(product.id, quantity + 1);
  };
  
  const handleDecrease = () => {
    haptic.light();
    
    if (quantity === 1) {
      remove(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };
  
  // Компактный вариант для карточек товаров
  if (variant === 'compact') {
    if (quantity === 0) {
      return (
        <button
          onClick={handleAdd}
          disabled={!product.inStock || isAdding}
          className="p-2 bg-tg-button text-tg-button-text rounded-full hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
        >
          <ShoppingCart size={16} />
        </button>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 bg-tg-secondary-bg text-tg-text rounded-full flex items-center justify-center hover:opacity-80 transition-all active:scale-95"
        >
          <Minus size={14} />
        </button>
        
        <span className="w-8 text-center font-medium">
          {quantity}
        </span>
        
        <button
          onClick={handleIncrease}
          className="w-8 h-8 bg-tg-button text-tg-button-text rounded-full flex items-center justify-center hover:opacity-90 transition-all active:scale-95"
        >
          <Plus size={14} />
        </button>
      </div>
    );
  }
  
  // Инлайн вариант для списков
  if (variant === 'inline') {
    if (quantity === 0) {
      return (
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={!product.inStock || isAdding}
          loading={isAdding}
          className={className}
        >
          <ShoppingCart size={16} className="mr-1" />
          {product.inStock ? 'В корзину' : 'Нет в наличии'}
        </Button>
      );
    }
    
    return (
      <div className="flex items-center gap-3 bg-tg-secondary-bg rounded-lg p-2">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow transition-all active:scale-95"
        >
          <Minus size={14} />
        </button>
        
        <span className="font-medium text-center min-w-[2rem]">
          {quantity}
        </span>
        
        <button
          onClick={handleIncrease}
          className="w-8 h-8 bg-tg-button text-tg-button-text rounded-full flex items-center justify-center hover:opacity-90 transition-all active:scale-95"
        >
          <Plus size={14} />
        </button>
      </div>
    );
  }
  
  // Дефолтный вариант для страницы товара
  if (quantity === 0) {
    return (
      <Button
        onClick={handleAdd}
        disabled={!product.inStock || isAdding}
        loading={isAdding}
        fullWidth
        size="lg"
        className={className}
      >
        <ShoppingCart size={20} className="mr-2" />
        {product.inStock ? `Добавить в корзину • ${formatPrice(product.price)}` : 'Нет в наличии'}
      </Button>
    );
  }
  
  return (
    <div className="space-y-3">
      {/* Счетчик */}
      <div className="flex items-center justify-center gap-4 bg-tg-secondary-bg rounded-lg p-3">
        <button
          onClick={handleDecrease}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Minus size={20} />
        </button>
        
        <div className="text-center">
          <div className="text-2xl font-bold">{quantity}</div>
          <div className="text-sm text-tg-hint">в корзине</div>
        </div>
        
        <button
          onClick={handleIncrease}
          className="w-12 h-12 bg-tg-button text-tg-button-text rounded-full flex items-center justify-center hover:opacity-90 transition-all active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>
      
      {/* Итого */}
      <div className="text-center">
        <div className="text-lg font-bold text-tg-text">
          Итого: {formatPrice(product.price * quantity)}
        </div>
      </div>
    </div>
  );
};

// Утилита форматирования цены
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(price);
};
import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';

import { useTelegram } from '../../app/telegram/TelegramProvider';
import { Button } from '../../shared/ui';
import type { Product } from '../../entities/product/types';
import { useCartStore } from '../../entities/cart/store';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'icon' | 'compact';
  className?: string;
  disabled?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'default',
  className = '',
  disabled = false
}) => {
  const { haptic } = useTelegram();
  const { addItem } = useCartStore();

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (!product.inStock || disabled) return;
    
    haptic.medium();
    
    addItem({
      productId: product.id,
      product
    });
    
    // Можно добавить уведомление
    console.log('Товар добавлен в корзину:', product.name);
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={handleAddToCart}
        disabled={!product.inStock || disabled}
        className={`p-2 ${className}`}
      >
        <Plus size={16} />
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={handleAddToCart}
        disabled={!product.inStock || disabled}
        className={className}
      >
        <ShoppingCart size={14} />
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      onClick={handleAddToCart}
      disabled={!product.inStock || disabled}
      className={className}
      fullWidth
    >
      {product.inStock ? (
        <>
          <ShoppingCart size={16} />
          В корзину
        </>
      ) : (
        'Нет в наличии'
      )}
    </Button>
  );
};
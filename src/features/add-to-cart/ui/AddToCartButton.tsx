import React from 'react';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { Button } from '../../../shared/ui';
import { useCartStore } from '../../../entities/cart/store';
import { useTelegram } from '../../../app/telegram/TelegramProvider';
import type { Product } from '../../../entities/product/api';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'icon' | 'mini';
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'default',
  className = ''
}) => {
  const { haptic } = useTelegram();
  const { addItem, hasItem, getItem } = useCartStore();
  
  const isInCart = hasItem(product.id);
  const cartItem = getItem(product.id);

  const handleClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (!product.inStock) return;
    
    haptic('medium');
    addItem(product);
  };

  if (variant === 'icon') {
    return (
      <Button
        size="sm"
        onClick={handleClick}
        disabled={!product.inStock}
        className={`p-2 ${className}`}
        variant={isInCart ? 'success' : 'primary'}
      >
        {isInCart ? <Check size={16} /> : <Plus size={16} />}
      </Button>
    );
  }

  if (variant === 'mini') {
    return (
      <Button
        size="sm"
        onClick={handleClick}
        disabled={!product.inStock}
        className={className}
        variant={isInCart ? 'success' : 'primary'}
      >
        {isInCart ? (
          <span className="text-xs">{cartItem?.quantity}</span>
        ) : (
          <ShoppingCart size={12} />
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={!product.inStock}
      className={className}
      variant={isInCart ? 'success' : 'primary'}
      fullWidth
    >
      {isInCart ? (
        <>
          <Check size={16} />
          В корзине ({cartItem?.quantity})
        </>
      ) : product.inStock ? (
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
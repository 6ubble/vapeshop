import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';

import { Product } from '../../shared/types';
import { Card, Badge, Button } from '../../shared/ui';
import { useTelegram } from '../../app/telegram/TelegramProvider';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  variant?: 'vertical' | 'horizontal';
  showAddToCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  variant = 'vertical',
  showAddToCart = true
}) => {
  const { haptic } = useTelegram();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.medium();
    console.log('Add to cart:', product.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.light();
    console.log('Toggle favorite:', product.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (variant === 'horizontal') {
    return (
      <Card clickable onClick={onClick} padding="sm">
        <div className="flex gap-3">
          {/* Изображение */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-medium">Нет в наличии</span>
              </div>
            )}
            {product.originalPrice && (
              <Badge 
                variant="error" 
                size="sm" 
                className="absolute -top-1 -right-1"
              >
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Контент */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm leading-tight truncate pr-2">
                {product.name}
              </h3>
              <button
                onClick={handleToggleFavorite}
                className="p-1 -mt-1 -mr-1 text-tg-hint hover:text-red-500 transition-colors"
              >
                <Heart size={16} />
              </button>
            </div>

            <div className="text-xs text-tg-hint mb-2">{product.brand}</div>

            <div className="flex items-center gap-1 mb-2">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-xs text-tg-hint">
                {product.rating} ({product.reviewsCount})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-tg-button">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-tg-hint line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              {showAddToCart && product.inStock && (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="px-3 py-1"
                >
                  <ShoppingCart size={14} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Vertical variant
  return (
    <Card clickable onClick={onClick} padding="sm" className="h-full">
      <div className="space-y-3">
        {/* Изображение */}
        <div className="relative aspect-square">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
          
          {/* Бейджи */}
          <div className="absolute top-2 left-2 space-y-1">
            {product.isNew && (
              <Badge variant="info" size="sm">
                Новинка
              </Badge>
            )}
            {product.isPopular && (
              <Badge variant="warning" size="sm">
                Хит
              </Badge>
            )}
            {product.originalPrice && (
              <Badge variant="error" size="sm">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Избранное */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full text-tg-hint hover:text-red-500 transition-colors"
          >
            <Heart size={16} />
          </button>

          {/* Статус наличия */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-medium">Нет в наличии</span>
            </div>
          )}
        </div>

        {/* Информация */}
        <div className="space-y-2">
          <div className="text-xs text-tg-hint">{product.brand}</div>
          
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-current" />
            <span className="text-xs text-tg-hint">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>

          {/* Теги */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} size="sm" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Цена и кнопка */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-tg-button">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-tg-hint line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {showAddToCart && (
            <Button
              fullWidth
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="text-sm"
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
          )}
        </div>
      </div>
    </Card>
  );
};
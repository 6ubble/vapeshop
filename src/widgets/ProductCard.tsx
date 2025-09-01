import React from 'react';
import { Star, Heart } from 'lucide-react';
import { Card, Badge } from '../shared/Ui';
import { AddToCartButton } from '../features/AddToCart';
import { useFavorites } from '../entities/user';
import { formatPrice } from '../shared/api';
import type { Product } from '../shared/types';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
  onClick?: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'grid',
  onClick,
  className
}) => {
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const isProductFavorite = isFavorite(product.id);
  
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  // Grid вариант для главной страницы
  if (variant === 'grid') {
    return (
      <Card 
        onClick={onClick}
        className={`relative overflow-hidden ${className}`}
      >
        {/* Избранное */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all active:scale-95"
        >
          <Heart 
            size={16} 
            className={isProductFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}
          />
        </button>

        {/* Скидка */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="error" size="md">-{discount}%</Badge>
          </div>
        )}

        {/* Изображение */}
        <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Информация */}
        <div className="space-y-2">
          <div className="text-xs text-tg-hint uppercase tracking-wide">
            {product.brand}
          </div>
          
          <h3 className="font-medium text-tg-text line-clamp-2 leading-tight">
            {product.name}
          </h3>
          
          {/* Рейтинг */}
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          
          {/* Цена */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-tg-button">
                {formatPrice(product.price)}
              </span>
              
              {product.originalPrice && (
                <span className="text-sm text-tg-hint line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Статус */}
            {product.inStock ? (
              <div className="text-xs text-green-600">В наличии</div>
            ) : (
              <div className="text-xs text-red-500">Нет в наличии</div>
            )}
          </div>
          
          {/* Кнопка добавления */}
          <AddToCartButton 
            product={product} 
            variant="compact"
          />
        </div>
      </Card>
    );
  }

  // List вариант для каталога
  return (
    <Card 
      onClick={onClick}
      className={`flex gap-4 relative ${className}`}
    >
      {/* Избранное */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all active:scale-95"
      >
        <Heart 
          size={16} 
          className={isProductFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}
        />
      </button>

      {/* Изображение */}
      <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative">
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="error" size="sm">-{discount}%</Badge>
          </div>
        )}
        
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Контент */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="text-xs text-tg-hint uppercase tracking-wide mb-1">
            {product.brand}
          </div>
          
          <h3 className="font-medium text-tg-text line-clamp-2 leading-tight mb-2">
            {product.name}
          </h3>
          
          {/* Рейтинг и бейджи */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-sm">{product.rating}</span>
            </div>
            
            {product.isNew && <Badge variant="info" size="sm">Новинка</Badge>}
            {product.isPopular && <Badge variant="warning" size="sm">Хит</Badge>}
          </div>
        </div>
        
        {/* Нижняя часть */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-tg-button">
                {formatPrice(product.price)}
              </span>
              
              {product.originalPrice && (
                <span className="text-sm text-tg-hint line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Статус наличия */}
            <div className="text-xs">
              {product.inStock ? (
                <span className="text-green-600">В наличии</span>
              ) : (
                <span className="text-red-500">Нет в наличии</span>
              )}
            </div>
          </div>
          
          {/* Кнопка добавления */}
          <AddToCartButton 
            product={product} 
            variant="inline"
          />
        </div>
      </div>
    </Card>
  );
};

// Skeleton загрузка для карточки
export const ProductCardSkeleton: React.FC<{ variant?: 'grid' | 'list' }> = ({
  variant = 'grid'
}) => {
  if (variant === 'grid') {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card>
      <div className="flex gap-4 animate-pulse">
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="flex justify-between items-end">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
};
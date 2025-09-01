import { Star } from 'lucide-react';
import React from 'react';
import type { Product } from '../../../entities/product/types';
import { formatPrice } from '../../../shared/lib/formatters';
import { Badge, Card } from '../../../shared/ui/index';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  variant?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  variant = 'list'
}) => {
  if (variant === 'grid') {
    return (
      <Card clickable onClick={onClick} padding="sm" className="h-full">
        <div className="space-y-3">
          <div className="relative aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
            {product.originalPrice && (
              <Badge variant="error" className="absolute top-2 left-2">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs text-tg-hint">{product.brand}</div>
            <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
            
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-xs text-tg-hint">{product.rating}</span>
            </div>

            <div className="space-y-2">
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
              
              <button className="btn-tg text-xs px-3 py-2">В корзину</button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // List variant (более компактный для каталога)
  return (
    <Card clickable onClick={onClick} padding="sm">
      <div className="flex gap-3">
        <div className="w-20 h-20 flex-shrink-0 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{product.name}</h3>
              <div className="text-xs text-tg-hint">{product.brand}</div>
            </div>
            <button className="btn-tg text-xs p-2 rounded-full">+</button>
          </div>

          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="text-yellow-400 fill-current" />
            <span className="text-xs text-tg-hint">{product.rating}</span>
          </div>

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
        </div>
      </div>
    </Card>
  );
};
import React, { memo } from 'react'
import { Star } from 'lucide-react'
import { Card, Badge } from '../shared/ui'
import { AddToCartButton } from '../features/add_cart/AddCart'
import { formatPrice, getDiscount } from '../shared/lib/utils'
import type { Product } from '../shared/types/types'

interface ProductCardProps {
  product: Product
  variant?: 'grid' | 'list'
  onClick?: () => void
}

export const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  variant = 'grid',
  onClick
}) => {
  const discount = getDiscount(product.price, product.originalPrice)

  if (variant === 'grid') {
    return (
      <Card className="relative overflow-hidden">
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="error">-{discount}%</Badge>
          </div>
        )}

        <div 
          className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden cursor-pointer"
          onClick={onClick}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs text-tg-hint uppercase">
            {product.brand}
          </div>
          
          <h3 
            className="font-medium text-tg-text line-clamp-2 leading-tight cursor-pointer"
            onClick={onClick}
          >
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          
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
            
            <div className="text-xs">
              {product.inStock ? (
                <span className="text-green-600">В наличии</span>
              ) : (
                <span className="text-red-500">Нет в наличии</span>
              )}
            </div>
          </div>
          
          <AddToCartButton product={product} variant="compact" />
        </div>
      </Card>
    )
  }

  // List variant
  return (
    <Card className="flex gap-4 relative">
      <div 
        className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
        onClick={onClick}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs text-tg-hint uppercase mb-1">
            {product.brand}
          </div>
          
          <h3 
            className="font-medium text-tg-text line-clamp-2 mb-2 cursor-pointer"
            onClick={onClick}
          >
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-sm">{product.rating}</span>
            </div>
            
            {product.isNew && <Badge variant="info">Новинка</Badge>}
            {product.isPopular && <Badge variant="warning">Хит</Badge>}
            {discount > 0 && <Badge variant="error">-{discount}%</Badge>}
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
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
            
            <div className="text-xs">
              {product.inStock ? (
                <span className="text-green-600">В наличии</span>
              ) : (
                <span className="text-red-500">Нет в наличии</span>
              )}
            </div>
          </div>
          
          <AddToCartButton product={product} variant="compact" />
        </div>
      </div>
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'
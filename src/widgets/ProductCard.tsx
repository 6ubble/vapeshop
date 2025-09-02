import React, { memo } from 'react'
import { Card } from '../shared/ui'
import { formatPrice } from '../shared/lib/utils'
import type { Product } from '../shared/types/types'

interface ProductCardProps {
  product: Product
  onClick?: () => void
  showAddButton?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  onClick,
  showAddButton = false
}) => {
  return (
    <Card className="relative overflow-hidden w-full">
      <div 
        className="aspect-square bg-gray-100 rounded-md mb-3 overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="space-y-2 text-center">
        <h3 
          className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 leading-tight cursor-pointer"
          onClick={onClick}
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-center">
          <span className="text-sm sm:text-base font-bold text-black">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'
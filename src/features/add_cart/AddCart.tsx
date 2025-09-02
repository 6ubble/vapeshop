import React from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '../../shared/ui'
import { useCartStore } from '../../shared/lib/stores'
import { formatPrice } from '../../shared/lib/utils'
import type { Product } from '../../shared/types/types'

interface AddToCartButtonProps {
  product: Product
  variant?: 'default' | 'compact'
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'default'
}) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore()
  
  const cartItem = items.find(item => item.product.id === product.id)
  const quantity = cartItem?.quantity || 0
  
  // Compact версия для карточек
  if (variant === 'compact') {
    if (quantity === 0) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            addItem(product)
          }}
          disabled={!product.inStock}
          className="p-2 bg-tg-button text-tg-button-text rounded-full hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
        >
          <ShoppingCart size={16} />
        </button>
      )
    }
    
    return (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => {
            quantity === 1 ? removeItem(product.id) : updateQuantity(product.id, quantity - 1)
          }}
          className="w-8 h-8 bg-tg-secondary-bg text-tg-text rounded-full flex items-center justify-center hover:opacity-80 transition-all active:scale-95"
        >
          <Minus size={14} />
        </button>
        
        <span className="w-8 text-center font-medium">
          {quantity}
        </span>
        
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="w-8 h-8 bg-tg-button text-tg-button-text rounded-full flex items-center justify-center hover:opacity-90 transition-all active:scale-95"
        >
          <Plus size={14} />
        </button>
      </div>
    )
  }
  
  // Default версия для страницы товара
  if (quantity === 0) {
    return (
      <Button
        onClick={() => addItem(product)}
        disabled={!product.inStock}
        fullWidth
        size="lg"
      >
        <ShoppingCart size={20} className="mr-2" />
        {product.inStock ? `Добавить • ${formatPrice(product.price)}` : 'Нет в наличии'}
      </Button>
    )
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-4 bg-tg-secondary-bg rounded-lg p-3">
        <button
          onClick={() => quantity === 1 ? removeItem(product.id) : updateQuantity(product.id, quantity - 1)}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Minus size={20} />
        </button>
        
        <div className="text-center">
          <div className="text-2xl font-bold">{quantity}</div>
          <div className="text-sm text-tg-hint">в корзине</div>
        </div>
        
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="w-12 h-12 bg-tg-button text-tg-button-text rounded-full flex items-center justify-center hover:opacity-90 transition-all active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>
      
      <div className="text-center">
        <div className="text-lg font-bold text-tg-text">
          Итого: {formatPrice(product.price * quantity)}
        </div>
      </div>
    </div>
  )
}
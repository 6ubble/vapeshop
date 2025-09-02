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
  
  if (variant === 'compact') {
    if (quantity === 0) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            addItem(product)
          }}
          className="p-2 bg-black text-white rounded-full"
        >
          <ShoppingCart size={16} />
        </button>
      )
    }
    
    return (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => quantity === 1 ? removeItem(product.id) : updateQuantity(product.id, quantity - 1)}
          className="w-8 h-8 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center"
        >
          <Minus size={14} />
        </button>
        
        <span className="w-8 text-center font-medium">
          {quantity}
        </span>
        
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center"
        >
          <Plus size={14} />
        </button>
      </div>
    )
  }
  
  if (quantity === 0) {
    return (
      <Button
        onClick={() => addItem(product)}
        fullWidth
        size="lg"
      >
        <ShoppingCart size={20} className="mr-2" />
        Добавить • {formatPrice(product.price)}
      </Button>
    )
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-4 bg-gray-100 rounded-lg p-3">
        <button
          onClick={() => quantity === 1 ? removeItem(product.id) : updateQuantity(product.id, quantity - 1)}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
        >
          <Minus size={20} />
        </button>
        
        <div className="text-center">
          <div className="text-2xl font-bold">{quantity}</div>
          <div className="text-sm text-gray-500">в корзине</div>
        </div>
        
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center"
        >
          <Plus size={20} />
        </button>
      </div>
      
      <div className="text-center">
        <div className="text-lg font-bold text-gray-900">
          Итого: {formatPrice(product.price * quantity)}
        </div>
      </div>
    </div>
  )
}
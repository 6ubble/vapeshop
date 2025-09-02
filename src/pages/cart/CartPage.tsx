import React, { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button, Card, EmptyState } from '../../shared/ui'
import { CheckoutForm } from '../../features/checkout/Chekout'
import { useCartStore, useAppStore } from '../../shared/lib/stores'
import { useTelegram } from '../../shared/lib/Telegram'
import { formatPrice } from '../../shared/lib/utils'

export const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const { showMainButton, hideMainButton, haptic } = useTelegram()
  
  const { items, updateQuantity, removeItem, clearCart } = useCartStore()
  const total = useCartStore(state => state.getTotal())
  const count = useCartStore(state => state.getCount())
  
  const { isCheckoutOpen, setCheckoutOpen } = useAppStore()

  // Обновляем главную кнопку
  useEffect(() => {
    if (items.length > 0) {
      showMainButton(
        `Оформить заказ • ${formatPrice(total)}`,
        () => {
          haptic.medium()
          setCheckoutOpen(true)
        }
      )
    } else {
      hideMainButton()
    }

    return () => hideMainButton()
  }, [items.length, total, showMainButton, hideMainButton, haptic, setCheckoutOpen])

  const handleQuantityChange = useCallback((productId: string, newQuantity: number) => {
    haptic.light()
    updateQuantity(productId, newQuantity)
  }, [haptic, updateQuantity])

  const handleRemoveItem = useCallback((productId: string) => {
    haptic.medium()
    removeItem(productId)
  }, [haptic, removeItem])

  const handleProductClick = useCallback((productId: string) => {
    haptic.light()
    navigate(`/product/${productId}`)
  }, [haptic, navigate])

  if (items.length === 0) {
    return (
      <EmptyState
        title="Корзина пуста"
        description="Добавьте товары из каталога"
        icon={<ShoppingBag size={48} className="text-tg-hint" />}
        action={{
          label: 'Перейти в каталог',
          onClick: () => {
            haptic.light()
            navigate('/catalog')
          }
        }}
      />
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Корзина ({count})
          </h1>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              haptic.medium()
              clearCart()
            }}
            className="text-red-500"
          >
            <Trash2 size={16} className="mr-1" />
            Очистить
          </Button>
        </div>

        {/* Товары в корзине */}
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.product.id}>
              <div className="flex gap-4">
                <div 
                  className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(item.product.id)}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-xs text-tg-hint uppercase">
                        {item.product.brand}
                      </div>
                      <h3 className="font-medium text-tg-text">
                        {item.product.name}
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="font-bold text-tg-button">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                      <div className="text-xs text-tg-hint">
                        {formatPrice(item.product.price)} за шт.
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 bg-tg-secondary-bg rounded-full flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 bg-tg-button text-tg-button-text rounded-full flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Итого */}
        <Card className="bg-tg-secondary-bg">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg">Товары ({count}):</span>
              <span className="text-lg font-medium">{formatPrice(total)}</span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">К оплате:</span>
                <span className="text-xl font-bold text-tg-button">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Модальное окно оформления заказа */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
          <div className="bg-white rounded-t-xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-4 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Оформление заказа</h3>
                <button 
                  onClick={() => setCheckoutOpen(false)}
                  className="p-1 text-2xl leading-none"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <CheckoutForm />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
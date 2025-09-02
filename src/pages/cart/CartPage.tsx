import React, { useEffect } from 'react'
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

  useEffect(() => {
    if (items.length > 0) {
      showMainButton(`Оформить заказ • ${formatPrice(total)}`, () => {
        haptic.medium()
        setCheckoutOpen(true)
      })
    } else {
      hideMainButton()
    }
    return () => hideMainButton()
  }, [items.length, total, showMainButton, hideMainButton, haptic, setCheckoutOpen])

  if (items.length === 0) {
    return (
      <EmptyState
        title="Корзина пуста"
        description="Добавьте товары из каталога"
        icon={<ShoppingBag size={48} className="text-gray-400" />}
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
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">Корзина ({count})</h1>
          
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
            <span className="hidden sm:inline">Очистить</span>
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.product.id}>
              <div className="flex gap-3 sm:gap-4">
                <div 
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                  onClick={() => {
                    haptic.light()
                    navigate(`/product/${item.product.id}`)
                  }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 uppercase">
                        {item.product.brand}
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {item.product.name}
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => {
                        haptic.medium()
                        removeItem(item.product.id)
                      }}
                      className="p-1 text-red-500 flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="font-bold text-black text-sm sm:text-base">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPrice(item.product.price)} за шт.
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          haptic.light()
                          updateQuantity(item.product.id, item.quantity - 1)
                        }}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => {
                          haptic.light()
                          updateQuantity(item.product.id, item.quantity + 1)
                        }}
                        className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center"
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

        <Card className="bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-lg sm:text-xl font-bold">К оплате:</span>
            <span className="text-lg sm:text-xl font-bold text-black">
              {formatPrice(total)}
            </span>
          </div>
        </Card>

        <Button
          onClick={() => {
            haptic.medium()
            setCheckoutOpen(true)
          }}
          fullWidth
          size="lg"
          className="bg-black text-white hover:bg-gray-800"
        >
          Оформить заказ • {formatPrice(total)}
        </Button>
      </div>

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
          <div className="bg-white rounded-t-xl w-full max-w-md mx-auto max-h-[85vh] overflow-y-auto">
            <div className="p-4 border-b bg-white">
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
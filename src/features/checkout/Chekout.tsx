import React, { useState } from 'react'
import { MapPin, Phone, User } from 'lucide-react'
import { Button, Input, Card } from '../../shared/ui'
import { useCartStore } from '../../shared/lib/stores'
import { useCreateOrder } from '../../shared/api'
import { useTelegram } from '../../shared/lib/Telegram'
import { formatPrice } from '../../shared/lib/utils'

export const CheckoutForm: React.FC = () => {
  const { items } = useCartStore()
  const total = useCartStore(state => state.getTotal())
  const { user, haptic, showAlert } = useTelegram()
  const createOrderMutation = useCreateOrder()
  
  const [formData, setFormData] = useState({
    name: user?.first_name || '',
    phone: '',
    deliveryType: 'pickup' as 'pickup' | 'delivery',
    address: '',
    comment: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Введите имя'
    if (!formData.phone.trim()) newErrors.phone = 'Введите телефон'
    if (formData.deliveryType === 'delivery' && !formData.address.trim()) {
      newErrors.address = 'Введите адрес'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate() || items.length === 0) {
      haptic.error()
      return
    }

    haptic.medium()

    try {
      const deliveryFee = formData.deliveryType === 'delivery' ? 300 : 0
      
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          telegramId: user?.id,
          username: user?.username
        },
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        delivery: {
          type: formData.deliveryType,
          address: formData.deliveryType === 'delivery' ? formData.address : 'Самовывоз',
          comment: formData.comment
        },
        total: total + deliveryFee
      }

      await createOrderMutation.mutateAsync(orderData)
      
      await showAlert(
        `✅ Заказ успешно отправлен!\n\nНаш менеджер свяжется с вами в течение 15 минут.`
      )
      
    } catch (error) {
      await showAlert('❌ Ошибка отправки заказа. Попробуйте еще раз.')
      haptic.error()
    }
  }

  const deliveryFee = formData.deliveryType === 'delivery' ? 300 : 0
  const finalTotal = total + deliveryFee

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-semibold mb-3">Контакты</h3>
        <div className="space-y-3">
          <Input
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            placeholder="Ваше имя"
            error={errors.name}
            icon={<User size={16} />}
          />
          
          <Input
            value={formData.phone}
            onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
            placeholder="+7 (999) 123-45-67"
            error={errors.phone}
            icon={<Phone size={16} />}
            type="tel"
          />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold mb-3">Получение</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="delivery"
              checked={formData.deliveryType === 'pickup'}
              onChange={() => setFormData(prev => ({ ...prev, deliveryType: 'pickup' }))}
            />
            <div>
              <div className="font-medium">Самовывоз • Бесплатно</div>
              <div className="text-sm text-tg-hint">готов через 30 мин</div>
            </div>
          </label>
          
          <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="delivery"
              checked={formData.deliveryType === 'delivery'}
              onChange={() => setFormData(prev => ({ ...prev, deliveryType: 'delivery' }))}
            />
            <div>
              <div className="font-medium">Доставка • {formatPrice(300)}</div>
              <div className="text-sm text-tg-hint">1-2 часа</div>
            </div>
          </label>
        </div>
        
        {formData.deliveryType === 'delivery' && (
          <div className="mt-3">
            <Input
              value={formData.address}
              onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
              placeholder="Адрес доставки"
              error={errors.address}
              icon={<MapPin size={16} />}
            />
          </div>
        )}
      </Card>

      <Card>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Товары:</span>
            <span>{formatPrice(total)}</span>
          </div>
          
          {deliveryFee > 0 && (
            <div className="flex justify-between">
              <span>Доставка:</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
          )}
          
          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>К оплате:</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={createOrderMutation.isPending || items.length === 0}
        loading={createOrderMutation.isPending}
        fullWidth
        size="lg"
      >
        {createOrderMutation.isPending ? 'Отправляем...' : `Заказать за ${formatPrice(finalTotal)}`}
      </Button>
    </div>
  )
}
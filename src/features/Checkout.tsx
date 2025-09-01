import React, { useState } from 'react';
import { Button, Input, Card } from '../shared/ui';
import { useCart, useCreateOrder } from '../entities/cart';
import { useTelegram } from '../shared/telegram';
import { formatPrice } from '../shared/api';

// Простая форма оформления заказа
export const CheckoutForm: React.FC = () => {
  const { items, total } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { user, showAlert } = useTelegram();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.first_name || '',
    phone: '',
    deliveryType: 'pickup' as 'pickup' | 'delivery',
    address: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Введите имя';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Введите телефон';
    } else if (!/^(\+7|8)\d{10}$/.test(customerInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Неверный формат телефона';
    }
    
    if (customerInfo.deliveryType === 'delivery' && !customerInfo.address.trim()) {
      newErrors.address = 'Введите адрес доставки';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    if (items.length === 0) {
      await showAlert('Корзина пуста');
      return;
    }

    try {
      await createOrder({
        items,
        customerInfo,
        total
      });
      
      await showAlert('Заказ успешно оформлен! Ожидайте подтверждения.');
    } catch (error) {
      await showAlert('Ошибка при оформлении заказа. Попробуйте еще раз.');
    }
  };

  const deliveryFee = customerInfo.deliveryType === 'delivery' ? 300 : 0;
  const finalTotal = total + deliveryFee;

  return (
    <div className="space-y-4">
      {/* Контактная информация */}
      <Card>
        <h3 className="font-semibold mb-3">Контактные данные</h3>
        
        <div className="space-y-3">
          <Input
            value={customerInfo.name}
            onChange={(value) => setCustomerInfo(prev => ({ ...prev, name: value }))}
            placeholder="Ваше имя"
            error={errors.name}
          />
          
          <Input
            value={customerInfo.phone}
            onChange={(value) => setCustomerInfo(prev => ({ ...prev, phone: value }))}
            placeholder="+7 (999) 999-99-99"
            error={errors.phone}
          />
        </div>
      </Card>

      {/* Способ получения */}
      <Card>
        <h3 className="font-semibold mb-3">Способ получения</h3>
        
        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              checked={customerInfo.deliveryType === 'pickup'}
              onChange={() => setCustomerInfo(prev => ({ ...prev, deliveryType: 'pickup' }))}
            />
            <div>
              <div className="font-medium">Самовывоз</div>
              <div className="text-sm text-tg-hint">Бесплатно</div>
            </div>
          </label>
          
          <label className="flex items-center gap-3">
            <input
              type="radio"
              checked={customerInfo.deliveryType === 'delivery'}
              onChange={() => setCustomerInfo(prev => ({ ...prev, deliveryType: 'delivery' }))}
            />
            <div>
              <div className="font-medium">Доставка</div>
              <div className="text-sm text-tg-hint">300₽</div>
            </div>
          </label>
        </div>
        
        {customerInfo.deliveryType === 'delivery' && (
          <div className="mt-3">
            <Input
              value={customerInfo.address}
              onChange={(value) => setCustomerInfo(prev => ({ ...prev, address: value }))}
              placeholder="Адрес доставки"
              error={errors.address}
            />
          </div>
        )}
      </Card>

      {/* Итого */}
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
            <div className="flex justify-between font-bold text-lg">
              <span>Итого:</span>
              <span className="text-tg-button">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Кнопка заказа */}
      <Button
        onClick={handleSubmit}
        disabled={isPending || items.length === 0}
        fullWidth
        className={isPending ? 'opacity-50' : ''}
      >
        {isPending ? 'Оформляем...' : `Оформить заказ • ${formatPrice(finalTotal)}`}
      </Button>
    </div>
  );
};
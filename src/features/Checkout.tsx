import React, { useState } from 'react';
import { MapPin, Phone, User, CreditCard } from 'lucide-react';
import { Button, Input, Card } from '../shared/Ui';
import { useCart, useCreateOrder } from '../entities/cart';
import { useTelegram } from '../shared/Telegram';
import { formatPrice } from '../shared/api';

interface CheckoutFormProps {
  onSuccess?: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const { items, total } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { user, showAlert, haptic } = useTelegram();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.first_name || '',
    phone: '',
    deliveryType: 'pickup' as 'pickup' | 'delivery',
    address: '',
    comment: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Валидация формы
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Введите имя';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!/^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/.test(customerInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Неверный формат телефона';
    }
    
    if (customerInfo.deliveryType === 'delivery' && !customerInfo.address.trim()) {
      newErrors.address = 'Введите адрес доставки';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Форматирование телефона
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const match = digits.match(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    
    if (match) {
      let formatted = '';
      if (match[1]) formatted += `+7`;
      if (match[2]) formatted += ` (${match[2]}`;
      if (match[3]) formatted += `) ${match[3]}`;
      if (match[4]) formatted += `-${match[4]}`;
      if (match[5]) formatted += `-${match[5]}`;
      return formatted;
    }
    
    return value;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      haptic.error();
      return;
    }
    
    if (items.length === 0) {
      await showAlert('Корзина пуста');
      return;
    }

    haptic.medium();

    try {
      await createOrder({
        items,
        customerInfo: {
          ...customerInfo,
          userId: user?.id,
          total: finalTotal,
          metadata: {
            platform: 'telegram',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        }
      });
      
      haptic.success();
      await showAlert('✅ Заказ успешно оформлен!\n\nМы свяжемся с вами в течение 15 минут для подтверждения.');
      
      onSuccess?.();
      
    } catch (error) {
      haptic.error();
      await showAlert('❌ Ошибка при оформлении заказа.\n\nПроверьте подключение к интернету и попробуйте еще раз.');
    }
  };

  // Расчет стоимости доставки
  const deliveryFee = customerInfo.deliveryType === 'delivery' ? 300 : 0;
  const finalTotal = total + deliveryFee;

  // Минимальная сумма заказа
  const minOrderAmount = 1000;
  const isMinOrderMet = total >= minOrderAmount;

  return (
    <div className="space-y-4">
      {/* Контактная информация */}
      <Card>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <User size={18} />
          Контактные данные
        </h3>
        
        <div className="space-y-3">
          <Input
            value={customerInfo.name}
            onChange={(value) => setCustomerInfo(prev => ({ ...prev, name: value }))}
            placeholder="Ваше имя"
            error={errors.name}
            icon={<User size={16} />}
          />
          
          <Input
            value={customerInfo.phone}
            onChange={(value) => {
              const formatted = formatPhone(value);
              setCustomerInfo(prev => ({ ...prev, phone: formatted }));
            }}
            placeholder="+7 (999) 999-99-99"
            error={errors.phone}
            icon={<Phone size={16} />}
            type="tel"
          />
        </div>
      </Card>

      {/* Способ получения */}
      <Card>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin size={18} />
          Способ получения
        </h3>
        
        <div className="space-y-3">
          {/* Самовывоз */}
          <label className="flex items-start gap-3 p-3 bg-tg-secondary-bg rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              name="delivery"
              checked={customerInfo.deliveryType === 'pickup'}
              onChange={() => setCustomerInfo(prev => ({ ...prev, deliveryType: 'pickup' }))}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium">🏪 Самовывоз</div>
              <div className="text-sm text-tg-hint">
                ул. Примерная, 123 • Бесплатно
              </div>
              <div className="text-xs text-green-600 mt-1">
                Готов через 30 минут
              </div>
            </div>
          </label>
          
          {/* Доставка */}
          <label className="flex items-start gap-3 p-3 bg-tg-secondary-bg rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              name="delivery"
              checked={customerInfo.deliveryType === 'delivery'}
              onChange={() => setCustomerInfo(prev => ({ ...prev, deliveryType: 'delivery' }))}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium">🚗 Доставка курьером</div>
              <div className="text-sm text-tg-hint">
                По городу • {formatPrice(deliveryFee)}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                1-2 часа
              </div>
            </div>
          </label>
        </div>
        
        {/* Адрес доставки */}
        {customerInfo.deliveryType === 'delivery' && (
          <div className="mt-3">
            <Input
              value={customerInfo.address}
              onChange={(value) => setCustomerInfo(prev => ({ ...prev, address: value }))}
              placeholder="Введите адрес доставки"
              error={errors.address}
              icon={<MapPin size={16} />}
            />
          </div>
        )}
      </Card>

      {/* Комментарий к заказу */}
      <Card>
        <h3 className="font-semibold mb-3">💬 Комментарий к заказу</h3>
        <textarea
          value={customerInfo.comment}
          onChange={(e) => setCustomerInfo(prev => ({ ...prev, comment: e.target.value }))}
          placeholder="Дополнительные пожелания (необязательно)"
          rows={3}
          className="w-full px-3 py-2 bg-tg-secondary-bg rounded-lg text-tg-text placeholder-tg-hint resize-none"
        />
      </Card>

      {/* Детализация заказа */}
      <Card>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <CreditCard size={18} />
          Детали заказа
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Товары ({items.length}):</span>
            <span className="font-medium">{formatPrice(total)}</span>
          </div>
          
          {deliveryFee > 0 && (
            <div className="flex justify-between">
              <span>Доставка:</span>
              <span className="font-medium">{formatPrice(deliveryFee)}</span>
            </div>
          )}
          
          {!isMinOrderMet && (
            <div className="flex justify-between text-orange-600">
              <span>До минимальной суммы:</span>
              <span className="font-medium">
                {formatPrice(minOrderAmount - total)}
              </span>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-2 mt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>К оплате:</span>
              <span className="text-tg-button">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Способ оплаты */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-center gap-3">
          <CreditCard size={20} className="text-blue-500" />
          <div className="text-sm">
            <div className="font-medium text-blue-800">Оплата при получении</div>
            <div className="text-blue-600">Наличными или картой</div>
          </div>
        </div>
      </Card>

      {/* Предупреждение о минимальной сумме */}
      {!isMinOrderMet && (
        <Card className="bg-orange-50 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="text-orange-500">⚠️</div>
            <div className="text-sm">
              <div className="font-medium text-orange-800">
                Минимальная сумма заказа {formatPrice(minOrderAmount)}
              </div>
              <div className="text-orange-600">
                Добавьте товаров еще на {formatPrice(minOrderAmount - total)}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Кнопка оформления */}
      <div className="space-y-3">
        <Button
          onClick={handleSubmit}
          disabled={isPending || items.length === 0 || !isMinOrderMet}
          loading={isPending}
          fullWidth
          size="lg"
          className={isPending ? 'opacity-50' : ''}
        >
          {isPending 
            ? 'Оформляем заказ...' 
            : `Оформить заказ • ${formatPrice(finalTotal)}`
          }
        </Button>

        {/* Дополнительная информация */}
        <div className="text-center text-xs text-tg-hint">
          Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
        </div>
      </div>
    </div>
  );
};
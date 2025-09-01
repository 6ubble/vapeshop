// src/features/SimpleCheckout.tsx
import React, { useState } from 'react';
import { MapPin, Phone, User, Banknote } from 'lucide-react';
import { Button, Input, Card } from '../shared/Ui';
import { useCart } from '../entities/cart';
import { useTelegram } from '../shared/Telegram';
import { formatPrice } from '../shared/utils';

interface CheckoutFormProps {
  onSuccess?: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const { items, total, clear } = useCart();
  const { user, haptic, showAlert } = useTelegram();
  
  const [formData, setFormData] = useState({
    name: user?.first_name || '',
    phone: '',
    deliveryType: 'pickup' as 'pickup' | 'delivery',
    address: '',
    comment: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Простая валидация
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Введите имя';
    if (!formData.phone.trim()) newErrors.phone = 'Введите телефон';
    if (formData.deliveryType === 'delivery' && !formData.address.trim()) {
      newErrors.address = 'Введите адрес';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || items.length === 0) {
      haptic.error();
      return;
    }

    setIsSubmitting(true);
    haptic.medium();

    try {
      // Формируем данные заказа
      const orderData = {
        type: 'new_order',
        timestamp: new Date().toISOString(),
        customer: {
          name: formData.name,
          phone: formData.phone,
          telegramId: user?.id,
          username: user?.username
        },
        items: items.map(item => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity
        })),
        delivery: {
          type: formData.deliveryType,
          address: formData.deliveryType === 'delivery' ? formData.address : 'Самовывоз',
          comment: formData.comment
        },
        totals: {
          items: total,
          delivery: formData.deliveryType === 'delivery' ? 300 : 0,
          final: total + (formData.deliveryType === 'delivery' ? 300 : 0)
        },
        paymentMethod: 'cash'
      };

      // Отправляем в Telegram бот
      const tg = window.Telegram?.WebApp;
      if (tg?.sendData) {
        tg.sendData(JSON.stringify(orderData));
      }

      // Показываем успех
      await showAlert(
        `✅ Заказ успешно отправлен!\n\n` +
        `Наш менеджер свяжется с вами в течение 15 минут для подтверждения.\n\n` +
        `📞 ${formData.phone}\n` +
        `💰 Оплата: ${formatPrice(orderData.totals.final)} наличными`
      );

      // Очищаем корзину и форму
      clear();
      onSuccess?.();
      
    } catch (error) {
      await showAlert('❌ Ошибка отправки заказа. Попробуйте еще раз.');
      haptic.error();
    } finally {
      setIsSubmitting(false);
    }
  };

  const deliveryFee = formData.deliveryType === 'delivery' ? 300 : 0;
  const finalTotal = total + deliveryFee;

  return (
    <div className="space-y-4">
      {/* Контакты */}
      <Card>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <User size={18} />
          Ваши контакты
        </h3>
        
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

      {/* Получение */}
      <Card>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin size={18} />
          Как получить заказ?
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="delivery"
              checked={formData.deliveryType === 'pickup'}
              onChange={() => setFormData(prev => ({ ...prev, deliveryType: 'pickup' }))}
            />
            <div className="flex-1">
              <div className="font-medium">🏪 Самовывоз • Бесплатно</div>
              <div className="text-sm text-tg-hint">ул. Примерная, 123 • готов через 30 мин</div>
            </div>
          </label>
          
          <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="delivery"
              checked={formData.deliveryType === 'delivery'}
              onChange={() => setFormData(prev => ({ ...prev, deliveryType: 'delivery' }))}
            />
            <div className="flex-1">
              <div className="font-medium">🚗 Доставка • {formatPrice(300)}</div>
              <div className="text-sm text-tg-hint">по городу • 1-2 часа</div>
            </div>
          </label>
        </div>
        
        {formData.deliveryType === 'delivery' && (
          <div className="mt-3">
            <Input
              value={formData.address}
              onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
              placeholder="Улица, дом, квартира"
              error={errors.address}
              icon={<MapPin size={16} />}
            />
          </div>
        )}
      </Card>

      {/* Комментарий */}
      <Card>
        <h3 className="font-semibold mb-3">💬 Комментарий</h3>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          placeholder="Этаж, домофон, пожелания..."
          rows={3}
          className="w-full px-3 py-2 bg-tg-secondary-bg rounded-lg resize-none"
        />
      </Card>

      {/* Оплата */}
      <Card className="bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <Banknote size={24} className="text-green-600" />
          <div>
            <div className="font-semibold text-green-800">Оплата наличными</div>
            <div className="text-sm text-green-600">При получении • без комиссий</div>
          </div>
        </div>
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
          
          <hr className="my-2" />
          
          <div className="flex justify-between text-lg font-bold">
            <span>К оплате наличными:</span>
            <span className="text-tg-button">{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </Card>

      {/* Кнопка заказа */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || items.length === 0}
        loading={isSubmitting}
        fullWidth
        size="lg"
      >
        {isSubmitting ? 'Отправляем...' : `Заказать за ${formatPrice(finalTotal)}`}
      </Button>

      <div className="text-center text-xs text-tg-hint">
        Менеджер перезвонит для подтверждения заказа
      </div>
    </div>
  );
};
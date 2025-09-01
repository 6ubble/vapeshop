import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

import { useTelegram } from '../../app/telegram';
import { Button, Card, Input, Divider, EmptyState } from '../../shared/ui';
import type { CartItem } from '../../shared/types';
import { MOCK_PRODUCTS, APP_CONFIG } from '../../shared/config';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { showMainButton, hideMainButton, haptic } = useTelegram();

  // Мокап данных корзины
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      productId: '1',
      product: MOCK_PRODUCTS[0],
      quantity: 2
    },
    {
      productId: '2', 
      product: MOCK_PRODUCTS[1],
      quantity: 1
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Расчеты
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = promoDiscount;
  const deliveryFee = subtotal >= 2000 ? 0 : 300; // Бесплатная доставка от 2000₽
  const total = subtotal - discount + deliveryFee;

  const handleCheckout = useCallback(() => {
    if (total < APP_CONFIG.minOrderAmount) {
      // Показать предупреждение о минимальной сумме
      return;
    }
    
    // Переход к оформлению заказа
    navigate('/checkout', {
      state: {
        cartItems,
        subtotal,
        discount: promoDiscount,
        deliveryFee,
        total,
        promoCode
      }
    });
  }, [total, cartItems, subtotal, promoDiscount, deliveryFee, promoCode, navigate]);

  useEffect(() => {
    if (cartItems.length > 0) {
      showMainButton(`Оформить заказ • ${formatPrice(total)}`, () => {
        haptic.heavy();
        handleCheckout();
      });
    } else {
      hideMainButton();
    }

    return () => hideMainButton();
  }, [cartItems, total, showMainButton, hideMainButton, haptic, handleCheckout]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setCartItems(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, quantity: Math.min(newQuantity, 10) }
          : item
      )
    );
    haptic.light();
  };

  const removeItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    haptic.medium();
  };

  const applyPromoCode = () => {
    haptic.light();
    
    // Мокап промокодов
    const promoCodes = {
      'WELCOME20': 0.2,
      'SAVE10': 0.1,
      'NEWBIE': 0.15
    };

    const discount = promoCodes[promoCode.toUpperCase() as keyof typeof promoCodes];
    
    if (discount) {
      setPromoDiscount(subtotal * discount);
      // Можно показать уведомление об успехе
    } else {
      // Можно показать ошибку
      setPromoDiscount(0);
    }
  };

  if (cartItems.length === 0) {
    return (
      <EmptyState
        title="Корзина пуста"
        description="Добавьте товары из каталога, чтобы оформить заказ"
        icon={<ShoppingBag size={48} />}
        action={
          <Button onClick={() => navigate('/catalog')}>
            Перейти в каталог
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Корзина</h1>
        <span className="text-tg-hint">
          {cartItems.reduce((sum, item) => sum + item.quantity, 0)} товаров
        </span>
      </div>

      {/* Товары */}
      <div className="space-y-3">
        {cartItems.map((item) => (
          <Card key={item.productId} padding="sm">
            <div className="flex gap-3">
              {/* Изображение */}
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Информация */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-tight mb-1">
                  {item.product.name}
                </h3>
                <div className="text-xs text-tg-hint mb-2">
                  {item.product.brand}
                </div>
                <div className="font-bold text-tg-button">
                  {formatPrice(item.product.price)}
                </div>
              </div>

              {/* Управление количеством */}
              <div className="flex flex-col items-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.productId)}
                  className="p-1 text-red-500"
                >
                  <Trash2 size={16} />
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 p-0"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </Button>
                  
                  <span className="font-medium min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 p-0"
                    disabled={item.quantity >= 10}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Промокод */}
      <Card>
        <div className="space-y-3">
          <h3 className="font-semibold">Промокод</h3>
          <div className="flex gap-2">
            <Input
              value={promoCode}
              onChange={setPromoCode}
              placeholder="Введите промокод"
              className="flex-1"
            />
            <Button variant="outline" onClick={applyPromoCode}>
              Применить
            </Button>
          </div>
          {promoDiscount > 0 && (
            <div className="text-sm text-green-600">
              ✓ Промокод применен! Скидка: {formatPrice(promoDiscount)}
            </div>
          )}
        </div>
      </Card>

      {/* Итого */}
      <Card>
        <div className="space-y-3">
          <h3 className="font-semibold">Итого</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Товары:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Скидка:</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span>Доставка:</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600">Бесплатно</span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </span>
            </div>
            
            <Divider />
            
            <div className="flex justify-between font-bold text-lg">
              <span>К оплате:</span>
              <span className="text-tg-button">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Информация о минимальной сумме */}
          {total < APP_CONFIG.minOrderAmount && (
            <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              Минимальная сумма заказа: {formatPrice(APP_CONFIG.minOrderAmount)}
              <br />
              Добавьте товаров еще на: {formatPrice(APP_CONFIG.minOrderAmount - total)}
            </div>
          )}

          {/* Информация о бесплатной доставке */}
          {deliveryFee > 0 && subtotal < 2000 && (
            <div className="text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              До бесплатной доставки: {formatPrice(2000 - subtotal)}
            </div>
          )}
        </div>
      </Card>

      {/* Дополнительные действия */}
      <div className="space-y-2">
        <Button
          variant="outline"
          fullWidth
          onClick={() => navigate('/catalog')}
        >
          Продолжить покупки
        </Button>
      </div>
    </div>
  );
};
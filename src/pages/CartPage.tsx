import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button, Card, EmptyState, BottomSheet } from '../shared/Ui';
import { CheckoutForm } from '../features/Checkout';
import { useCart } from '../entities/cart';
import { useTelegram } from '../shared/Telegram';
import { formatPrice } from '../shared/api';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { showMainButton, hideMainButton, haptic } = useTelegram();
  const [showCheckout, setShowCheckout] = useState(false);
  
  const { 
    items, 
    total,
    count,
    updateQuantity, 
    remove,
    clear 
  } = useCart();

  // Главная кнопка Telegram для оформления заказа
  useEffect(() => {
    if (items.length > 0) {
      showMainButton(
        `Оформить заказ • ${formatPrice(total)}`,
        () => {
          haptic.medium();
          setShowCheckout(true);
        }
      );
    } else {
      hideMainButton();
    }

    return () => hideMainButton();
  }, [items.length, total, showMainButton, hideMainButton, haptic]);

  // Обработчики
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    haptic.light();
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    haptic.medium();
    
    // Подтверждение удаления
    const tg = window.Telegram?.WebApp;
    if (tg?.showConfirm) {
      tg.showConfirm(
        `Удалить "${productName}" из корзины?`,
        (confirmed: boolean) => {
          if (confirmed) {
            remove(productId);
          }
        }
      );
    } else {
      remove(productId);
    }
  };

  const handleClearCart = () => {
    haptic.medium();
    
    const tg = window.Telegram?.WebApp;
    if (tg?.showConfirm) {
      tg.showConfirm(
        'Очистить всю корзину?',
        (confirmed: boolean) => {
          if (confirmed) {
            clear();
          }
        }
      );
    } else {
      clear();
    }
  };

  // Пустая корзина
  if (items.length === 0) {
    return (
      <EmptyState
        title="Корзина пуста"
        description="Добавьте товары из каталога для оформления заказа"
        icon={<ShoppingBag size={48} className="text-tg-hint" />}
        action={{
          label: 'Перейти в каталог',
          onClick: () => {
            haptic.light();
            navigate('/catalog');
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Корзина ({count})
        </h1>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearCart}
          className="text-red-500 hover:bg-red-50"
        >
          <Trash2 size={16} className="mr-1" />
          Очистить
        </Button>
      </div>

      {/* Список товаров */}
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.product.id} className="overflow-hidden">
            <div className="flex gap-4">
              {/* Изображение */}
              <div 
                className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                onClick={() => {
                  haptic.light();
                  navigate(`/product/${item.product.id}`);
                }}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Информация о товаре */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-tg-hint uppercase tracking-wide">
                      {item.product.brand}
                    </div>
                    <h3 
                      className="font-medium text-tg-text line-clamp-2 leading-tight cursor-pointer hover:text-tg-button"
                      onClick={() => {
                        haptic.light();
                        navigate(`/product/${item.product.id}`);
                      }}
                    >
                      {item.product.name}
                    </h3>
                  </div>
                  
                  {/* Кнопка удаления */}
                  <button
                    onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Цена и количество */}
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-bold text-tg-button">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    <div className="text-xs text-tg-hint">
                      {formatPrice(item.product.price)} за шт.
                    </div>
                  </div>

                  {/* Счетчик количества */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 bg-tg-secondary-bg rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 bg-tg-button text-tg-button-text rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
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
          
          <div className="flex justify-between items-center text-sm text-tg-hint">
            <span>Доставка:</span>
            <span>рассчитается при заказе</span>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">К оплате:</span>
              <span className="text-xl font-bold text-tg-button">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Дополнительные действия */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          onClick={() => {
            haptic.light();
            navigate('/catalog');
          }}
          className="flex items-center justify-center gap-2"
        >
          Добавить товары
        </Button>
        
        <Button
          onClick={() => {
            haptic.light();
            setShowCheckout(true);
          }}
          className="flex items-center justify-center gap-2"
        >
          Оформить
          <ArrowRight size={16} />
        </Button>
      </div>

      {/* Рекомендации (только если есть товары) */}
      <Card>
        <div className="text-center">
          <h3 className="font-medium mb-2">💡 Полезно знать</h3>
          <div className="text-sm text-tg-hint space-y-2">
            <div>• Доставка от 300₽ по городу</div>
            <div>• Самовывоз бесплатно</div>
            <div>• Оплата при получении</div>
          </div>
        </div>
      </Card>

      {/* Bottom Sheet для оформления заказа */}
      <BottomSheet
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="Оформление заказа"
      >
        <CheckoutForm onSuccess={() => setShowCheckout(false)} />
      </BottomSheet>
    </div>
  );
};
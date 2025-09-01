import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Settings, 
  MapPin, 
  Bell,
  ExternalLink,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { Card, Divider, Badge } from '../shared/Ui';
import { useUserStore } from '../entities/user';
import { useCart } from '../entities/cart';
import { useTelegram } from '../shared/Telegram';
import { formatPrice } from '../shared/api';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, haptic } = useTelegram();
  const { favorites } = useUserStore();
  const { count: cartCount } = useCart();

  // Статистика пользователя
  const stats = [
    { label: 'В корзине', value: cartCount, color: 'blue' },
    { label: 'Избранное', value: favorites.size, color: 'red' },
    { label: 'Заказов', value: 0, color: 'green' }, // TODO: из API
  ];

  const menuSections = [
    {
      title: 'Покупки',
      items: [
        {
          icon: <ShoppingBag size={20} />,
          label: 'Мои заказы',
          action: () => navigate('/orders'),
          badge: '0', // TODO: из API
          description: 'История покупок'
        },
        {
          icon: <Heart size={20} />,
          label: 'Избранное',
          action: () => navigate('/favorites'),
          badge: favorites.size > 0 ? favorites.size.toString() : undefined,
          description: 'Отложенные товары'
        },
        {
          icon: <CreditCard size={20} />,
          label: 'Способы оплаты',
          action: () => navigate('/payment-methods'),
          description: 'Карты и счета'
        }
      ]
    },
    {
      title: 'Настройки',
      items: [
        {
          icon: <MapPin size={20} />,
          label: 'Адреса доставки',
          action: () => navigate('/addresses'),
          description: 'Сохраненные адреса'
        },
        {
          icon: <Bell size={20} />,
          label: 'Уведомления',
          action: () => navigate('/notifications'),
          description: 'Настройка push-уведомлений'
        },
        {
          icon: <Settings size={20} />,
          label: 'Настройки',
          action: () => navigate('/settings'),
          description: 'Общие настройки'
        }
      ]
    },
    {
      title: 'Поддержка',
      items: [
        {
          icon: <ExternalLink size={20} />,
          label: 'Техподдержка',
          action: () => {
            haptic.light();
            window.Telegram?.WebApp?.openTelegramLink('https://t.me/vapeshop_support');
          },
          description: 'Связаться с поддержкой'
        },
        {
          icon: <ExternalLink size={20} />,
          label: 'Наш канал',
          action: () => {
            haptic.light();
            window.Telegram?.WebApp?.openTelegramLink('https://t.me/vapeshop_channel');
          },
          description: 'Новости и акции'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Профиль пользователя */}
      <Card className="text-center">
        {user?.photo_url ? (
          <img 
            src={user.photo_url} 
            alt="Аватар" 
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-tg-button shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-tg-button to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user?.first_name?.[0] || 'U'}
          </div>
        )}
        
        <h2 className="text-xl font-bold mb-1">
          {user?.first_name} {user?.last_name}
        </h2>
        
        {user?.username && (
          <p className="text-tg-hint mb-3">@{user.username}</p>
        )}

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`
                text-2xl font-bold mb-1
                ${stat.color === 'blue' ? 'text-blue-500' : ''}
                ${stat.color === 'red' ? 'text-red-500' : ''}
                ${stat.color === 'green' ? 'text-green-500' : ''}
              `}>
                {stat.value}
              </div>
              <div className="text-xs text-tg-hint">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Быстрые действия */}
      {cartCount > 0 && (
        <Card 
          onClick={() => {
            haptic.light();
            navigate('/cart');
          }}
          className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <div>
                <div className="font-medium">Завершить покупку</div>
                <div className="text-sm text-tg-hint">
                  {cartCount} товаров на {formatPrice(useCart().total)}
                </div>
              </div>
            </div>
            
            <ArrowRight size={20} className="text-tg-hint" />
          </div>
        </Card>
      )}

      {/* Меню разделов */}
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h3 className="font-semibold text-lg mb-3 text-tg-text">
            {section.title}
          </h3>
          
          <Card padding="none">
            {section.items.map((item, index) => (
              <React.Fragment key={index}>
                <button
                  onClick={() => {
                    haptic.light();
                    item.action();
                  }}
                  className="w-full flex items-center justify-between p-4 hover:bg-tg-bg active:bg-tg-bg transition-colors text-left"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-tg-hint">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-tg-text">{item.label}</div>
                      <div className="text-sm text-tg-hint">{item.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <Badge variant="info" size="sm">
                        {item.badge}
                      </Badge>
                    )}
                    <ArrowRight size={16} className="text-tg-hint" />
                  </div>
                </button>
                
                {index < section.items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card>
        </div>
      ))}

      {/* Информация о приложении */}
      <Card className="bg-gray-50">
        <h3 className="font-semibold mb-3 text-center">О приложении</h3>
        <div className="space-y-2 text-sm text-tg-hint text-center">
          <div>VapeShop Mini App v1.0.0</div>
          <div>Работаем с 2020 года</div>
          <div>Режим работы: 09:00 — 22:00</div>
          
          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs">
              Сделано с ❤️ для Telegram
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
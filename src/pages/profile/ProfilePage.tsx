
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';

import { useTelegram } from '../../app/telegram/TelegramProvider';
import { Card, Button, Divider } from '../../shared/ui';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, haptic } = useTelegram();

  const menuItems = [
    {
      icon: <ShoppingBag size={20} />,
      label: 'Мои заказы',
      action: () => navigate('/orders'),
      badge: '3'
    },
    {
      icon: <Heart size={20} />,
      label: 'Избранное',
      action: () => navigate('/favorites'),
      badge: '12'
    },
    {
      icon: <Settings size={20} />,
      label: 'Настройки',
      action: () => navigate('/settings')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Профиль пользователя */}
      <Card>
        <div className="text-center">
          {user?.photo_url ? (
            <img 
              src={user.photo_url} 
              alt="Аватар" 
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
          ) : (
            <div className="w-20 h-20 bg-tg-button rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              {user?.first_name?.[0] || 'U'}
            </div>
          )}
          
          <h2 className="text-xl font-bold mb-1">
            {user?.first_name} {user?.last_name}
          </h2>
          
          {user?.username && (
            <p className="text-tg-hint">@{user.username}</p>
          )}
        </div>
      </Card>

      {/* Меню */}
      <Card padding="none">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <button
              onClick={() => {
                haptic.light();
                item.action();
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-tg-bg active:bg-tg-bg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-tg-hint">
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="bg-tg-button text-tg-button-text text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                <div className="text-tg-hint transform rotate-180">
                  ←
                </div>
              </div>
            </button>
            
            {index < menuItems.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      {/* Информация */}
      <Card>
        <h3 className="font-semibold mb-3">О приложении</h3>
        <div className="space-y-2 text-sm text-tg-hint">
          <div>Версия: 1.0.0</div>
          <div>Поддержка: @vapeshop_support</div>
          <div>Режим работы: 09:00 - 22:00</div>
        </div>
      </Card>
    </div>
  );
};
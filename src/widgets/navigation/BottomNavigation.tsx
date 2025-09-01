import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Grid3X3 } from 'lucide-react';

import { useTelegram } from '../../app/telegram';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { haptic } = useTelegram();

  // Мокап количества товаров в корзине
  const cartItemsCount = 2;

  const navItems: NavItem[] = [
    {
      path: '/',
      icon: <Home size={24} />,
      label: 'Главная'
    },
    {
      path: '/catalog',
      icon: <Grid3X3 size={24} />,
      label: 'Каталог'
    },
    {
      path: '/search',
      icon: <Search size={24} />,
      label: 'Поиск'
    },
    {
      path: '/cart',
      icon: <ShoppingCart size={24} />,
      label: 'Корзина',
      badge: cartItemsCount
    },
    {
      path: '/profile',
      icon: <User size={24} />,
      label: 'Профиль'
    }
  ];

  const handleNavClick = () => {
    haptic.light();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-app mx-auto bg-tg-bg border-t border-tg-hint border-opacity-20">
        <div className="flex items-center justify-around py-2 px-4 safe-area-insets">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className="flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-colors"
              >
                <div className="relative mb-1">
                  <div className={`transition-colors ${
                    isActive 
                      ? 'text-tg-button' 
                      : 'text-tg-hint'
                  }`}>
                    {item.icon}
                  </div>
                  
                  {/* Бейдж для корзины */}
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </div>
                  )}
                </div>
                
                <span className={`text-xs font-medium transition-colors ${
                  isActive 
                    ? 'text-tg-button' 
                    : 'text-tg-hint'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
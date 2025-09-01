import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../entities/cart';
import { useTelegram } from '../shared/Telegram';

const navItems = [
  {
    path: '/',
    icon: Home,
    label: 'Главная',
    exactMatch: true
  },
  {
    path: '/catalog',
    icon: Search,
    label: 'Каталог',
    exactMatch: false
  },
  {
    path: '/cart',
    icon: ShoppingCart,
    label: 'Корзина',
    exactMatch: true
  },
  {
    path: '/profile',
    icon: User,
    label: 'Профиль',
    exactMatch: true
  }
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { count } = useCart();
  const { haptic } = useTelegram();
  
  const isActive = (path: string, exactMatch: boolean) => {
    if (exactMatch) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      {/* Фон с размытием */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/50" />
      
      <div className="relative max-w-md mx-auto px-6 py-4">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exactMatch);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => haptic.light()}
                className={`
                  group flex flex-col items-center py-3 px-4 rounded-2xl transition-all duration-300
                  ${active 
                    ? 'text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg scale-110' 
                    : 'text-slate-500 hover:text-slate-700 hover:scale-105'
                  }
                `}
              >
                <div className="relative mb-2">
                  <div className={`
                    p-2 rounded-xl transition-all duration-300
                    ${active 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:shadow-md'
                    }
                  `}>
                    <Icon size={20} />
                  </div>
                  
                  {/* Бейдж корзины */}
                  {item.path === '/cart' && count > 0 && (
                    <div className="absolute -top-1 -right-1">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500 rounded-full blur-sm opacity-75 animate-pulse" />
                        <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                          {count > 99 ? '99+' : count}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <span className={`
                  text-xs font-medium transition-all duration-300
                  ${active ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-700'}
                `}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
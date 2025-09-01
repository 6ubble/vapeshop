import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useCart } from '../entities/cart';
import { useTelegram } from '../shared/Telegram';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { count } = useCart();
  const { isReady } = useTelegram();
  
  // Скрываем навигацию на некоторых страницах
  const hideNavigation = ['/product'].some(path => 
    location.pathname.startsWith(path)
  );
  
  // Показываем лоадер пока Telegram не готов
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-300 rounded-full animate-pulse" />
          </div>
          <div className="text-indigo-600 font-medium text-lg">Загрузка...</div>
          <div className="text-indigo-400 text-sm mt-2">Подготавливаем приложение</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800">
      {/* Контентная область */}
      <main className={`
        px-6 py-6 
        ${hideNavigation ? 'pb-6' : 'pb-24'}
        max-w-md mx-auto
        animate-fade-in
      `}>
        {children}
      </main>
      
      {/* Навигация */}
      {!hideNavigation && <Navigation />}
      
      {/* Индикатор корзины для всего приложения */}
      {count > 0 && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-sm opacity-75 animate-pulse" />
            <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
              {count > 99 ? '99+' : count}
            </div>
          </div>
        </div>
      )}
      
      {/* Декоративные элементы */}
      <div className="fixed top-0 left-0 w-full h-32 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-8 right-1/4 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-2xl" />
      </div>
    </div>
  );
};
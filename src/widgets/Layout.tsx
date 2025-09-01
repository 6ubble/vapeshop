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
      <div className="min-h-screen bg-tg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-tg-button border-t-transparent rounded-full mx-auto mb-4" />
          <div className="text-tg-hint">Загрузка...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-tg-bg text-tg-text">
      {/* Контентная область */}
      <main className={`
        px-4 py-4 
        ${hideNavigation ? 'pb-4' : 'pb-20'}
        max-w-md mx-auto
      `}>
        {children}
      </main>
      
      {/* Навигация */}
      {!hideNavigation && <Navigation />}
      
      {/* Индикатор корзины для всего приложения */}
      {count > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-tg-button text-tg-button-text text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {count > 99 ? '99+' : count}
          </div>
        </div>
      )}
    </div>
  );
};
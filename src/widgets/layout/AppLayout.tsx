import React from 'react';
import { BottomNavigation } from '../navigation/BottomNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    // Контейнер с максимальной шириной и центрированием для десктопа
    <div className="min-h-screen bg-tg-bg flex justify-center">
      <div className="w-full max-w-app min-h-screen-safe bg-tg-bg relative">
        {/* Основной контент с отступом снизу для навигации */}
        <main className="px-4 py-6 pb-24">
          {children}
        </main>
        
        {/* Нижняя навигация */}
        <BottomNavigation />
      </div>
    </div>
  );
};
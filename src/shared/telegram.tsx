import React, { createContext, useContext, useEffect, useState } from 'react';
import type { TelegramUser } from './types';

// Упрощенный контекст Telegram
interface TelegramContext {
  user: TelegramUser | null;
  isReady: boolean;
  
  // Основные методы
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  
  // Haptic feedback
  haptic: {
    light: () => void;
    medium: () => void;
    heavy: () => void;
    success: () => void;
    error: () => void;
  };
  
  // Утилиты
  close: () => void;
  showAlert: (message: string) => void;
}

const Context = createContext<TelegramContext | null>(null);

// Провайдер
export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      // Инициализация
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
      
      setUser(tg.initDataUnsafe.user || null);
      setIsReady(true);
      
      // Применяем тему
      applyTelegramTheme(tg.themeParams);
    } else {
      // Fallback для разработки
      console.warn('Telegram WebApp недоступен');
      setIsReady(true);
      applyDefaultTheme();
    }
  }, []);

  const applyTelegramTheme = (theme: any) => {
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        root.style.setProperty(`--tg-${key.replace(/_/g, '-')}`, value);
      }
    });
  };

  const applyDefaultTheme = () => {
    const root = document.documentElement;
    root.style.setProperty('--tg-bg-color', '#ffffff');
    root.style.setProperty('--tg-text-color', '#000000');
    root.style.setProperty('--tg-hint-color', '#999999');
    root.style.setProperty('--tg-button-color', '#2481cc');
    root.style.setProperty('--tg-button-text-color', '#ffffff');
    root.style.setProperty('--tg-secondary-bg-color', '#f4f4f5');
  };

  const value: TelegramContext = {
    user,
    isReady,
    
    showMainButton: (text, onClick) => {
      const tg = window.Telegram?.WebApp;
      if (tg?.MainButton) {
        tg.MainButton.setText(text);
        tg.MainButton.show();
        tg.MainButton.onClick(onClick);
      }
    },
    
    hideMainButton: () => {
      const tg = window.Telegram?.WebApp;
      if (tg?.MainButton) {
        tg.MainButton.hide();
      }
    },
    
    showBackButton: (onClick) => {
      const tg = window.Telegram?.WebApp;
      if (tg?.BackButton) {
        tg.BackButton.show();
        tg.BackButton.onClick(onClick);
      }
    },
    
    hideBackButton: () => {
      const tg = window.Telegram?.WebApp;
      if (tg?.BackButton) {
        tg.BackButton.hide();
      }
    },
    
    haptic: {
      light: () => window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light'),
      medium: () => window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium'), 
      heavy: () => window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('heavy'),
      success: () => window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success'),
      error: () => window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error'),
    },
    
    close: () => window.Telegram?.WebApp?.close(),
    
    showAlert: (message) => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.showAlert(message);
      } else {
        alert(message);
      }
    }
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

// Хук для использования
export const useTelegram = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider');
  }
  return context;
};

// Типы для window.Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}
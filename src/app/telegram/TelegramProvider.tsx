import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  initData,
  viewport,
  themeParams,
  mainButton,
  backButton,
  hapticFeedback,
  cloudStorage
} from '@telegram-apps/sdk';

// Типы для Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        sendData: (data: string) => void;
        initData: string;
        themeParams: any;
        isExpanded: boolean;
        expand: () => void;
        close: () => void;
      };
    };
  }
}

// Типы
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface TelegramContextType {
  user: TelegramUser | null;
  isReady: boolean;
  theme: 'light' | 'dark';
  error: string | null;
  // Методы для работы с Telegram
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (onClick?: () => void) => void;
  hideBackButton: () => void;
  haptic: {
    light: () => void;
    medium: () => void;
    heavy: () => void;
  };
  storage: {
    set: (key: string, value: string) => Promise<void>;
    get: (key: string) => Promise<string | null>;
    remove: (key: string) => Promise<void>;
  };
  sendDataToBot: (data: any) => void;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

// Кастомный хук
export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram должен использоваться внутри TelegramProvider');
  }
  return context;
};

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeTelegram();
  }, []);

  const initializeTelegram = async () => {
    try {
      // Проверяем, запущено ли в Telegram
      if (!window.Telegram?.WebApp) {
        console.warn('Приложение не запущено в Telegram WebApp');
        // В dev режиме создаем мок данные
        if (import.meta.env.DEV) {
          setUser({
            id: 12345,
            first_name: 'Тест',
            last_name: 'Пользователь',
            username: 'testuser',
            language_code: 'ru'
          });
          setTheme('light');
          setIsReady(true);
          return;
        }
      }

      // Инициализация SDK
      initUtils();

      // Парсинг init data
      const initDataParsed = initData.parse();
      console.log('Telegram init data:', initDataParsed);

      // Настройка viewport
      viewport.expand();
      viewport.bindCssVars();

      // Настройка темы
      themeParams.bindCssVars();
      const isDark = themeParams.isDark;
      setTheme(isDark ? 'dark' : 'light');

      // Получение пользователя
      const telegramUser = initDataParsed.initData?.user;
      if (telegramUser) {
        setUser(telegramUser);
      }

      // Настройка кнопок по умолчанию
      backButton.hide();
      mainButton.hide();

      setIsReady(true);

    } catch (err) {
      console.error('Ошибка инициализации Telegram:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      setIsReady(true);
    }
  };

  // Методы для работы с главной кнопкой
  const showMainButton = (text: string, onClick: () => void) => {
    mainButton.setText(text);
    mainButton.onClick(onClick);
    mainButton.show();
  };

  const hideMainButton = () => {
    mainButton.hide();
  };

  // Методы для работы с кнопкой назад
  const showBackButton = (onClick?: () => void) => {
    if (onClick) {
      backButton.onClick(onClick);
    }
    backButton.show();
  };

  const hideBackButton = () => {
    backButton.hide();
  };

  // Методы для haptic feedback
  const haptic = {
    light: () => hapticFeedback.impactOccurred('light'),
    medium: () => hapticFeedback.impactOccurred('medium'),
    heavy: () => hapticFeedback.impactOccurred('heavy'),
  };

  // Методы для работы с облачным хранилищем
  const storage = {
    set: async (key: string, value: string) => {
      try {
        await cloudStorage.setItem(key, value);
      } catch (error) {
        console.error('Ошибка сохранения в облачное хранилище:', error);
      }
    },
    
    get: async (key: string): Promise<string | null> => {
      try {
        return await cloudStorage.getItem(key);
      } catch (error) {
        console.error('Ошибка чтения из облачного хранилища:', error);
        return null;
      }
    },
    
    remove: async (key: string) => {
      try {
        await cloudStorage.removeItem(key);
      } catch (error) {
        console.error('Ошибка удаления из облачного хранилища:', error);
      }
    }
  };

  // Отправка данных боту
  const sendDataToBot = (data: any) => {
    try {
      const dataString = JSON.stringify(data);
      window.Telegram?.WebApp?.sendData(dataString);
    } catch (error) {
      console.error('Ошибка отправки данных боту:', error);
    }
  };

  const contextValue: TelegramContextType = {
    user,
    isReady,
    theme,
    error,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    haptic,
    storage,
    sendDataToBot,
  };

  return (
    <TelegramContext.Provider value={contextValue}>
      {children}
    </TelegramContext.Provider>
  );
};
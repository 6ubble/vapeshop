import React, { useEffect, useState, useCallback } from 'react';
import type { TelegramWebApp, TelegramUser, TelegramThemeParams } from './types';
import { TelegramContext, type TelegramContextType } from './context';

interface TelegramProviderProps {
  children: React.ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useState<TelegramThemeParams>({});

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Настраиваем приложение
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
      
      setWebApp(tg);
      setUser(tg.initDataUnsafe.user || null);
      setTheme(tg.themeParams);
      setIsReady(true);
      
      // Применяем тему Telegram к CSS переменным
      applyTelegramTheme(tg.themeParams);
      
      // Слушаем изменения темы
      tg.onEvent('themeChanged', () => {
        setTheme(tg.themeParams);
        applyTelegramTheme(tg.themeParams);
      });
      
      // Слушаем изменение viewport
      tg.onEvent('viewportChanged', () => {
        // Можно добавить логику для адаптации к изменению размера
        console.log('Viewport changed:', tg.viewportHeight);
      });
    } else {
      // Fallback для разработки вне Telegram
      console.warn('Telegram WebApp is not available. Running in development mode.');
      setIsReady(true);
      
      // Применяем стандартную тему для разработки
      applyTelegramTheme({
        bg_color: '#ffffff',
        text_color: '#000000',
        hint_color: '#999999',
        link_color: '#2481cc',
        button_color: '#2481cc',
        button_text_color: '#ffffff',
        secondary_bg_color: '#f4f4f5'
      });
    }
  }, []);

  const applyTelegramTheme = (themeParams: TelegramThemeParams) => {
    const root = document.documentElement;
    
    // Применяем цвета из Telegram к CSS переменным
    if (themeParams.bg_color) {
      root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
    }
    if (themeParams.text_color) {
      root.style.setProperty('--tg-theme-text-color', themeParams.text_color);
    }
    if (themeParams.hint_color) {
      root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color);
    }
    if (themeParams.link_color) {
      root.style.setProperty('--tg-theme-link-color', themeParams.link_color);
    }
    if (themeParams.button_color) {
      root.style.setProperty('--tg-theme-button-color', themeParams.button_color);
    }
    if (themeParams.button_text_color) {
      root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
    }
    if (themeParams.secondary_bg_color) {
      root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color);
    }
  };

  const showMainButton = useCallback((text: string, onClick: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text);
      webApp.MainButton.show();
      webApp.MainButton.onClick(onClick);
    }
  }, [webApp]);

  const hideMainButton = useCallback(() => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide();
      // Очищаем все обработчики
      webApp.MainButton.offClick(() => {});
    }
  }, [webApp]);

  const showBackButton = useCallback((onClick: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(onClick);
    }
  }, [webApp]);

  const hideBackButton = useCallback(() => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide();
      webApp.BackButton.offClick(() => {});
    }
  }, [webApp]);

  const haptic = {
    light: () => webApp?.HapticFeedback?.impactOccurred('light'),
    medium: () => webApp?.HapticFeedback?.impactOccurred('medium'),
    heavy: () => webApp?.HapticFeedback?.impactOccurred('heavy'),
    success: () => webApp?.HapticFeedback?.notificationOccurred('success'),
    error: () => webApp?.HapticFeedback?.notificationOccurred('error'),
    warning: () => webApp?.HapticFeedback?.notificationOccurred('warning'),
  };

  const close = useCallback(() => {
    webApp?.close();
  }, [webApp]);

  const expand = useCallback(() => {
    webApp?.expand();
  }, [webApp]);

  const sendData = useCallback((data: unknown) => {
    if (webApp) {
      webApp.sendData(JSON.stringify(data));
    }
  }, [webApp]);

  const showAlert = useCallback((message: string): Promise<void> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showAlert(message, () => resolve());
      } else {
        alert(message);
        resolve();
      }
    });
  }, [webApp]);

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, (confirmed) => resolve(confirmed));
      } else {
        resolve(confirm(message));
      }
    });
  }, [webApp]);

  const value: TelegramContextType = {
    webApp,
    user,
    isReady,
    theme,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    haptic,
    close,
    expand,
    sendData,
    showAlert,
    showConfirm,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};


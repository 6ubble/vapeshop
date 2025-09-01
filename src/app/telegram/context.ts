import { createContext } from 'react';
import type { TelegramWebApp, TelegramUser, TelegramThemeParams } from './types';

export interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isReady: boolean;
  theme: TelegramThemeParams;
  
  // Методы для работы с интерфейсом
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
    warning: () => void;
  };
  
  // Утилиты
  close: () => void;
  expand: () => void;
  sendData: (data: unknown) => void;
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
}

export const TelegramContext = createContext<TelegramContextType | null>(null);

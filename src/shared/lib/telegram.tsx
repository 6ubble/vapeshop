import React, { createContext, useContext, useEffect, useState } from 'react'
import type { TelegramUser } from '../types/types'

interface TelegramContext {
  user: TelegramUser | null
  isReady: boolean
  
  showMainButton: (text: string, onClick: () => void) => void
  hideMainButton: () => void
  showBackButton: (onClick: () => void) => void
  hideBackButton: () => void
  
  haptic: {
    light: () => void
    medium: () => void
    heavy: () => void
    success: () => void
    error: () => void
  }
  
  close: () => void
  showAlert: (message: string) => Promise<void>
}

const Context = createContext<TelegramContext | null>(null)

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    
    if (tg) {
      // Инициализация WebApp
      tg.ready()
      tg.expand()
      tg.enableClosingConfirmation()
      
      // Применение темы Telegram
      const theme = tg.themeParams
      const root = document.documentElement
      
      if (theme) {
        Object.entries(theme).forEach(([key, value]) => {
          if (value && typeof value === 'string') {
            root.style.setProperty(`--tg-${key.replace(/_/g, '-')}`, value)
          }
        })
      }
      
      setUser(tg.initDataUnsafe?.user || null)
      setIsReady(true)
    } else {
      // Fallback для разработки в браузере
      console.warn('Telegram WebApp API недоступен. Режим разработки.')
      
      // Мок пользователь для разработки
      setUser({
        id: 123456789,
        first_name: 'Test',
        last_name: 'User', 
        username: 'testuser'
      })
      
      // Применяем дефолтную тему
      const root = document.documentElement
      root.style.setProperty('--tg-bg-color', '#ffffff')
      root.style.setProperty('--tg-text-color', '#000000')
      root.style.setProperty('--tg-hint-color', '#999999')
      root.style.setProperty('--tg-button-color', '#2481cc')
      root.style.setProperty('--tg-button-text-color', '#ffffff')
      root.style.setProperty('--tg-secondary-bg-color', '#f4f4f5')
      
      setIsReady(true)
    }
  }, [])

  const value: TelegramContext = {
    user,
    isReady,
    
    showMainButton: (text, onClick) => {
      const tg = window.Telegram?.WebApp?.MainButton
      if (tg) {
        tg.setText(text)
        tg.onClick(onClick)
        tg.show()
      }
    },
    
    hideMainButton: () => {
      window.Telegram?.WebApp?.MainButton?.hide()
    },
    
    showBackButton: (onClick) => {
      const tg = window.Telegram?.WebApp?.BackButton
      if (tg) {
        tg.onClick(onClick)
        tg.show()
      }
    },
    
    hideBackButton: () => {
      window.Telegram?.WebApp?.BackButton?.hide()
    },
    
    haptic: {
      light: () => window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('light'),
      medium: () => window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('medium'),
      heavy: () => window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('heavy'),
      success: () => window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success'),
      error: () => window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('error'),
    },
    
    close: () => window.Telegram?.WebApp?.close?.(),
    
    showAlert: (message) => {
      return new Promise<void>((resolve) => {
        const tg = window.Telegram?.WebApp
        if (tg?.showAlert) {
          tg.showAlert(message, () => resolve())
        } else {
          alert(message)
          resolve()
        }
      })
    }
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export const useTelegram = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider')
  }
  return context
}
export interface Product {
  id: string
  name: string
  price: number
  image: string
  brand: string
  category: CategoryId
  inStock: boolean
  rating: number
  description: string
  isPopular?: boolean
  isNew?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  customer: {
    name: string
    phone: string
    telegramId?: number
    username?: string
  }
  delivery: {
    type: 'pickup' | 'delivery'
    address: string
    comment?: string
  }
  status: 'pending' | 'confirmed' | 'completed'
  createdAt: string
}

export type CategoryId = 'all' | 'pods' | 'disposable' | 'liquids' | 'accessories'

export interface Category {
  id: CategoryId
  name: string
  emoji: string
}

// Telegram WebApp типы
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        enableClosingConfirmation: () => void
        initData: string
        initDataUnsafe: {
          user?: TelegramUser
        }
        themeParams: Record<string, string>
        MainButton: {
          setText: (text: string) => void
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
        BackButton: {
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
        HapticFeedback: {
          impactOccurred: (type: 'light' | 'medium' | 'heavy') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
        }
        showAlert: (message: string, callback?: () => void) => void
        sendData: (data: string) => void
        openTelegramLink: (url: string) => void
      }
    }
  }
}
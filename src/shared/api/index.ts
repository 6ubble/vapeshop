import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.vapeshop.com'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Автоматическая авторизация через Telegram
api.interceptors.request.use((config) => {
  const tg = window.Telegram?.WebApp
  
  if (tg?.initData) {
    config.headers.Authorization = `tma ${tg.initData}`
  }
  
  if (tg?.initDataUnsafe?.user?.id) {
    config.headers['X-User-ID'] = tg.initDataUnsafe.user.id.toString()
  }
  
  return config
})

// Обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const tg = window.Telegram?.WebApp
    
    if (error.response?.status === 401) {
      tg?.showAlert?.('Ошибка авторизации')
    } else if (error.response?.status >= 500) {
      tg?.showAlert?.('Ошибка сервера. Попробуйте позже.')
      tg?.HapticFeedback?.notificationOccurred?.('error')
    }
    
    return Promise.reject(error)
  }
)
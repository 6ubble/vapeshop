import axios from 'axios';

// Конфигурация API
const API_URL = import.meta.env.VITE_API_URL || 'https://api.vapeshop.com';

// HTTP клиент с автоматической авторизацией через Telegram
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Интерсептор для добавления Telegram данных
api.interceptors.request.use((config) => {
  const tg = window.Telegram?.WebApp;
  
  if (tg?.initData) {
    config.headers.Authorization = `tma ${tg.initData}`;
  }
  
  // User ID для персонализации
  if (tg?.initDataUnsafe?.user?.id) {
    config.headers['X-User-ID'] = tg.initDataUnsafe.user.id.toString();
  }
  
  return config;
});

// Интерсептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Показываем уведомления через Telegram UI
    const tg = window.Telegram?.WebApp;
    
    if (error.response?.status === 401) {
      tg?.showAlert?.('Ошибка авторизации');
      tg?.close?.();
    } else if (error.response?.status >= 500) {
      tg?.showAlert?.('Ошибка сервера. Попробуйте позже.');
      tg?.HapticFeedback?.notificationOccurred?.('error');
    }
    
    return Promise.reject(error);
  }
);

// Утилиты
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(price);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Offline-first утилиты
export const isOnline = () => navigator.onLine;

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

// Telegram специфичные утилиты
export const shareProduct = (product: { name: string; id: string }) => {
  const tg = window.Telegram?.WebApp;
  const url = `${window.location.origin}/product/${product.id}`;
  
  if (tg) {
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(product.name)}`);
  }
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
  } catch {
    // Fallback для старых браузеров
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};
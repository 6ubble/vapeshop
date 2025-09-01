// Utility функция для классов (замена clsx)
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  
  // Генерация уникальных ID
  export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  // Debounce функция
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
  
  // Throttle функция
  export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: ReturnType<typeof setTimeout> | null;
    let lastExecTime = 0;
    
    return (...args: Parameters<T>) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  };
  
  // Форматирование цены
  export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Форматирование даты
  export const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d);
  };
  
  // Форматирование времени
  export const formatTime = (date: string | Date): string => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };
  
  // Валидация email
  export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Валидация телефона
  export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };
  
  // Форматирование телефона
  export const formatPhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    const match = digits.match(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    
    if (match) {
      let formatted = '';
      if (match[1]) formatted += `+7`;
      if (match[2]) formatted += ` (${match[2]}`;
      if (match[3]) formatted += `) ${match[3]}`;
      if (match[4]) formatted += `-${match[4]}`;
      if (match[5]) formatted += `-${match[5]}`;
      return formatted;
    }
    
    return phone;
  };
  
  // Склонение слов
  export const pluralize = (count: number, words: [string, string, string]): string => {
    const cases = [2, 0, 1, 1, 1, 2];
    const index = (count % 100 > 4 && count % 100 < 20) ? 2 : cases[Math.min(count % 10, 5)];
    return words[index];
  };
  
  // Пример: pluralize(5, ['товар', 'товара', 'товаров']) => 'товаров'
  
  // Сокращение длинного текста
  export const truncate = (text: string, length: number = 50): string => {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  };
  
  // Проверка онлайн статуса
  export const isOnline = (): boolean => navigator.onLine;
  
  // Детекция мобильного устройства
  export const isMobile = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };
  
  // Детекция Telegram среды
  export const isTelegramEnvironment = (): boolean => {
    return !!(window.Telegram?.WebApp);
  };
  
  // Безопасное копирование в буфер обмена
  export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
      return true;
    } catch {
      // Fallback для старых браузеров
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch {
        return false;
      }
    }
  };
  
  // Ретрай с экспоненциальной задержкой
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
  
  // Локальное хранилище с обработкой ошибок
  export const storage = {
    get: <T>(key: string, defaultValue: T): T => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    
    set: (key: string, value: any): boolean => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    
    remove: (key: string): boolean => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    }
  };
  
  // Оптимизация изображений для Telegram
  export const optimizeImageUrl = (url: string, width: number = 400): string => {
    // Для продакшена можно использовать CDN с ресайзом
    if (url.includes('unsplash.com')) {
      return `${url}?w=${width}&q=80&fm=webp`;
    }
    
    return url;
  };
  
  // Детекция темной темы
  export const isDarkTheme = (): boolean => {
    const tg = window.Telegram?.WebApp;
    return tg?.colorScheme === 'dark' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  
  // Конвертация hex в rgb
  export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16), 
      b: parseInt(result[3], 16)
    } : null;
  };
  
  // Генерация контрастного цвета
  export const getContrastColor = (hex: string): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };
  
  // Анимированный скролл
  export const smoothScrollTo = (element: HTMLElement, top: number = 0) => {
    element.scrollTo({
      top,
      behavior: 'smooth'
    });
  };
  
  // Проверка видимости элемента
  export const isElementInViewport = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };
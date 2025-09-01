// API конфигурация
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.vapeshop.example.com';
export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

// Telegram конфигурация
export const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
export const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'VapeShopBot';

// Константы приложения
export const APP_CONFIG = {
  name: 'VapeShop',
  version: '1.0.0',
  supportUrl: 'https://t.me/vapeshop_support',
  
  // Лимиты
  maxCartItems: 50,
  maxImageSize: 5 * 1024 * 1024, // 5MB
  minOrderAmount: 500, // рублей
  
  // Валюта
  currency: {
    code: 'RUB',
    symbol: '₽',
    decimals: 0
  },
  
  // Время работы
  workingHours: {
    start: '09:00',
    end: '22:00',
    timezone: 'Europe/Moscow'
  }
} as const;

// Категории товаров
export const PRODUCT_CATEGORIES = [
  {
    id: 'pod-systems',
    name: 'Pod-системы',
    emoji: '🔋',
    description: 'Компактные устройства для начинающих и опытных вейперов'
  },
  {
    id: 'disposable',
    name: 'Одноразовые',
    emoji: '💨',
    description: 'Готовые к использованию одноразовые вейпы'
  },
  {
    id: 'liquids',
    name: 'Жидкости',
    emoji: '🧪',
    description: 'Премиальные жидкости для электронных сигарет'
  },
  {
    id: 'cartridges',
    name: 'Картриджи',
    emoji: '📦',
    description: 'Сменные картриджи для pod-систем'
  },
  {
    id: 'accessories',
    name: 'Аксессуары',
    emoji: '🔧',
    description: 'Комплектующие и аксессуары для вейпинга'
  }
] as const;

// Бренды
export const POPULAR_BRANDS = [
  'JUUL',
  'IQOS',
  'Vaporesso',
  'SMOK',
  'Uwell',
  'GeekVape',
  'Voopoo',
  'Lost Vape',
  'Aspire',
  'Innokin'
] as const;

// Способы доставки
export const DELIVERY_OPTIONS = [
  {
    id: 'pickup',
    name: 'Самовывоз',
    description: 'Забрать в магазине',
    price: 0,
    emoji: '🏪'
  },
  {
    id: 'delivery',
    name: 'Доставка',
    description: 'Доставка курьером',
    price: 300,
    emoji: '🚚'
  }
] as const;

// Способы оплаты
export const PAYMENT_METHODS = [
  {
    id: 'cash',
    name: 'Наличными',
    description: 'Оплата при получении',
    emoji: '💵'
  },
  {
    id: 'card',
    name: 'Картой',
    description: 'Оплата банковской картой',
    emoji: '💳'
  },
  {
    id: 'telegram_stars',
    name: 'Telegram Stars',
    description: 'Оплата через Telegram',
    emoji: '⭐'
  }
] as const;

// Сортировка товаров
export const SORT_OPTIONS = [
  { value: 'popularity', label: 'По популярности' },
  { value: 'price_asc', label: 'Сначала дешевые' },
  { value: 'price_desc', label: 'Сначала дорогие' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'name', label: 'По названию' }
] as const;

// Возрастные ограничения
export const AGE_RESTRICTION = {
  minAge: 18,
  warningMessage: 'Данный товар предназначен для лиц старше 18 лет'
} as const;

// Мокап данных для разработки
export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'JUUL Device Starter Kit',
    description: 'Стартовый набор JUUL с зарядным устройством и двумя картриджами',
    price: 2990,
    originalPrice: 3500,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400'
    ],
    category: 'pod-systems' as const,
    brand: 'JUUL',
    inStock: true,
    stockCount: 15,
    rating: 4.5,
    reviewsCount: 128,
    tags: ['популярное', 'новинка'],
    specifications: [
      { name: 'Емкость батареи', value: '200 мАч' },
      { name: 'Объем картриджа', value: '0.7 мл' },
      { name: 'Время зарядки', value: '1 час' }
    ],
    isPopular: true,
    isNew: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'HQD Cuvie Plus 1200',
    description: 'Одноразовая электронная сигарета на 1200 затяжек',
    price: 590,
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400'
    ],
    category: 'disposable' as const,
    brand: 'HQD',
    inStock: true,
    stockCount: 45,
    rating: 4.2,
    reviewsCount: 89,
    tags: ['хит продаж'],
    specifications: [
      { name: 'Количество затяжек', value: '1200' },
      { name: 'Емкость батареи', value: '950 мАч' },
      { name: 'Объем жидкости', value: '4.8 мл' }
    ],
    isPopular: true,
    isNew: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
] as const;
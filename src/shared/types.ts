// Базовые типы для всего приложения

// Товар - простой интерфейс
export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    brand: string;
    category: string;
    inStock: boolean;
    rating: number;
    description: string;
    isPopular?: boolean;
    isNew?: boolean;
  }
  
  // Корзина
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  // Заказ - только основное
  export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    customerName: string;
    phone: string;
    status: 'pending' | 'confirmed' | 'completed';
    createdAt: string;
  }
  
  // Telegram пользователь
  export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  }
  
  // Категории - простые строки
  export type CategoryId = 'all' | 'pod-systems' | 'disposable' | 'liquids' | 'accessories';
  
  // API ответы
  export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
  }
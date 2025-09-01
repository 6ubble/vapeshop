// Общие типы
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Типы продуктов
export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Для скидок
  images: string[];
  category: ProductCategory;
  brand: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  specifications: ProductSpecification[];
  isPopular: boolean;
  isNew: boolean;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export enum ProductCategory {
  POD_SYSTEMS = 'pod-systems',
  DISPOSABLE = 'disposable',
  LIQUIDS = 'liquids',
  CARTRIDGES = 'cartridges',
  ACCESSORIES = 'accessories'
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.POD_SYSTEMS]: 'Pod-системы',
  [ProductCategory.DISPOSABLE]: 'Одноразовые',
  [ProductCategory.LIQUIDS]: 'Жидкости',
  [ProductCategory.CARTRIDGES]: 'Картриджи',
  [ProductCategory.ACCESSORIES]: 'Аксессуары'
};

// Типы корзины
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>; // Для вариантов товара
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  discount: number;
  finalPrice: number;
}

// Типы заказа
export interface Order extends BaseEntity {
  orderNumber: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  discount: number;
  finalPrice: number;
  status: OrderStatus;
  deliveryInfo: DeliveryInfo;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Ожидает подтверждения',
  [OrderStatus.CONFIRMED]: 'Подтвержден',
  [OrderStatus.PREPARING]: 'Готовится',
  [OrderStatus.READY]: 'Готов к выдаче',
  [OrderStatus.DELIVERED]: 'Выдан',
  [OrderStatus.CANCELLED]: 'Отменен'
};

export interface DeliveryInfo {
  type: 'pickup' | 'delivery';
  address?: string;
  phone: string;
  name: string;
  notes?: string;
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TELEGRAM_STARS = 'telegram_stars'
}

// Типы пользователя
export interface User {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  languageCode?: string;
  phone?: string;
  favoriteProducts: string[];
  orderHistory: string[];
}

// API типы
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Фильтры и поиск
export interface ProductFilters {
  category?: ProductCategory;
  priceRange?: [number, number];
  brands?: string[];
  inStock?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  tags?: string[];
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popularity' | 'name';
}

// Telegram типы
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

// Уведомления
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
import type { CartItem } from '../cart/types';

export interface Order {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

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
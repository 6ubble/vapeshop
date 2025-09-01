import type { Product } from '../product/types';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  discount: number;
  finalPrice: number;
}
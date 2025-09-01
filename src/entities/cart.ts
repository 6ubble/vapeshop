import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Product } from '../shared/types';

interface CartItem {
  product: Product;
  quantity: number;
}

// API для заказов
const API_URL = import.meta.env.VITE_API_URL || 'https://api.yourshop.com';

const orderAPI = {
  create: async (data: { items: CartItem[]; customerInfo: any }) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.Telegram?.WebApp?.initData}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

// Store корзины (локальное состояние)
interface CartStore {
  items: CartItem[];
  
  add: (product: Product) => void;
  remove: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  
  get total(): number;
  get count(): number;
  hasItem: (productId: string) => boolean;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      get total() {
        return get().items.reduce((sum, item) => 
          sum + item.product.price * item.quantity, 0
        );
      },
      
      get count() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      hasItem: (productId) => 
        get().items.some(item => item.product.id === productId),
      
      add: (product) => {
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
        
        set((state) => {
          const existing = state.items.find(item => item.product.id === product.id);
          
          if (existing) {
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }
          
          return { items: [...state.items, { product, quantity: 1 }] };
        });
      },
      
      remove: (productId) => {
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId)
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().remove(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        }));
      },
      
      clear: () => {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
        set({ items: [] });
      }
    }),
    { name: 'vapeshop-cart' }
  )
);

// React Query мутация для создания заказа
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { clear } = useCart();
  
  return useMutation({
    mutationFn: orderAPI.create,
    onSuccess: (data) => {
      // Очищаем корзину
      clear();
      
      // Инвалидируем кеш заказов
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Отправляем данные боту
      window.Telegram?.WebApp?.sendData(JSON.stringify({
        type: 'order_created',
        orderId: data.id
      }));
    }
  });
};
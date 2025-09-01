import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import type { Product } from '../product/api';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  getItem: (productId: string) => CartItem | undefined;
  hasItem: (productId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        items: [],
        
        // Computed values
        get totalItems() {
          return get().items.reduce((sum, item) => sum + item.quantity, 0);
        },
        
        get totalPrice() {
          return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        },

        // Actions
        addItem: (product) => {
          set((state) => {
            const existingItem = state.items.find(item => item.product.id === product.id);
            
            if (existingItem) {
              return {
                items: state.items.map(item =>
                  item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                )
              };
            }
            
            return {
              items: [...state.items, { product, quantity: 1 }]
            };
          });
        },

        removeItem: (productId) => {
          set((state) => ({
            items: state.items.filter(item => item.product.id !== productId)
          }));
        },

        updateQuantity: (productId, quantity) => {
          if (quantity <= 0) {
            get().removeItem(productId);
            return;
          }
          
          set((state) => ({
            items: state.items.map(item =>
              item.product.id === productId
                ? { ...item, quantity }
                : item
            )
          }));
        },

        clearCart: () => set({ items: [] }),

        // Helpers
        getItem: (productId) => {
          return get().items.find(item => item.product.id === productId);
        },

        hasItem: (productId) => {
          return get().items.some(item => item.product.id === productId);
        }
      }),
      {
        name: 'vapeshop-cart',
        // Интеграция с Telegram Cloud Storage
        storage: {
          getItem: async (name) => {
            try {
              // Сначала пробуем Telegram Cloud Storage
              const telegramData = await window.Telegram?.WebApp?.CloudStorage?.getItem?.(name);
              if (telegramData) return telegramData;
              
              // Fallback в localStorage
              return localStorage.getItem(name);
            } catch {
              return localStorage.getItem(name);
            }
          },
          setItem: async (name, value) => {
            try {
              // Сохраняем в Telegram Cloud Storage
              await window.Telegram?.WebApp?.CloudStorage?.setItem?.(name, value);
              // И дублируем в localStorage как fallback
              localStorage.setItem(name, value);
            } catch {
              localStorage.setItem(name, value);
            }
          },
          removeItem: async (name) => {
            try {
              await window.Telegram?.WebApp?.CloudStorage?.removeItem?.(name);
              localStorage.removeItem(name);
            } catch {
              localStorage.removeItem(name);
            }
          }
        }
      }
    )
  )
);
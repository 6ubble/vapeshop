import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import type { Product } from '../../shared/types';

interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

interface CartStore {
  items: CartItem[];
  
  // Computed values
  totalItems: number;
  totalPrice: number;
  isEmpty: boolean;
  
  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Helpers
  getItem: (productId: string) => CartItem | undefined;
  hasItem: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
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
        
        get isEmpty() {
          return get().items.length === 0;
        },

        // Actions
        addItem: (product: Product) => {
          set((state) => {
            const existingItem = state.items.find(item => item.product.id === product.id);
            
            if (existingItem) {
              // Увеличиваем количество существующего товара
              return {
                items: state.items.map(item =>
                  item.product.id === product.id
                    ? { ...item, quantity: Math.min(item.quantity + 1, 99) } // Максимум 99 штук
                    : item
                )
              };
            }
            
            // Добавляем новый товар
            return {
              items: [...state.items, { 
                product, 
                quantity: 1,
                addedAt: new Date().toISOString()
              }]
            };
          });
          
          // Haptic feedback если доступен
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
          }
        },

        removeItem: (productId: string) => {
          set((state) => ({
            items: state.items.filter(item => item.product.id !== productId)
          }));
          
          // Haptic feedback
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
          }
        },

        updateQuantity: (productId: string, quantity: number) => {
          if (quantity <= 0) {
            get().removeItem(productId);
            return;
          }
          
          set((state) => ({
            items: state.items.map(item =>
              item.product.id === productId
                ? { ...item, quantity: Math.min(Math.max(quantity, 1), 99) }
                : item
            )
          }));
        },

        clearCart: () => {
          set({ items: [] });
          
          // Haptic feedback
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
          }
        },

        // Helpers
        getItem: (productId: string) => {
          return get().items.find(item => item.product.id === productId);
        },

        hasItem: (productId: string) => {
          return get().items.some(item => item.product.id === productId);
        },
        
        getItemQuantity: (productId: string) => {
          const item = get().getItem(productId);
          return item ? item.quantity : 0;
        }
      }),
      {
        name: 'vapeshop-cart',

        
        // Подписка на изменения для аналитики
        onRehydrateStorage: () => (state) => {
          console.log('Cart rehydrated with:', state?.items?.length || 0, 'items');
        }
      }
    )
  )
);

// Селекторы для оптимизации рендеринга
export const useCartTotalItems = () => useCartStore(state => state.totalItems);
export const useCartTotalPrice = () => useCartStore(state => state.totalPrice);
export const useCartIsEmpty = () => useCartStore(state => state.isEmpty);
export const useCartItem = (productId: string) => useCartStore(state => state.getItem(productId));
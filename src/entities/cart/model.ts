import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem } from '../../shared/types'

interface CartStore {
  items: CartItem[]
  
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  
  get total(): number
  get count(): number
  hasItem: (productId: string) => boolean
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      get total() {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      },
      
      get count() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
      
      hasItem: (productId) => get().items.some(item => item.product.id === productId),
      
      addItem: (product) => {
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')
        
        set(state => {
          const existing = state.items.find(item => item.product.id === product.id)
          
          if (existing) {
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            }
          }
          
          return { items: [...state.items, { product, quantity: 1 }] }
        })
      },
      
      removeItem: (productId) => {
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium')
        set(state => ({
          items: state.items.filter(item => item.product.id !== productId)
        }))
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        }))
      },
      
      clearCart: () => {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success')
        set({ items: [] })
      }
    }),
    { name: 'vape-cart' }
  )
)

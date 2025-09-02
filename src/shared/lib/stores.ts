import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem, CategoryId } from '../types/types'

// === CART STORE ===
interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      },
      
      getCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
      
      addItem: (product) => {
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
        set({ items: [] })
      }
    }),
    { name: 'vape-cart' }
  )
)

// === FILTERS STORE ===
interface FiltersStore {
  selectedCategory: CategoryId
  searchQuery: string
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'name'
  
  setCategory: (category: CategoryId) => void
  setSearch: (query: string) => void
  setSorting: (sort: FiltersStore['sortBy']) => void
  clearFilters: () => void
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'popular',
  
  setCategory: (selectedCategory) => set({ selectedCategory }),
  setSearch: (searchQuery) => set({ searchQuery }),
  setSorting: (sortBy) => set({ sortBy }),
  clearFilters: () => set({ 
    selectedCategory: 'all', 
    searchQuery: '', 
    sortBy: 'popular' 
  })
}))

// === APP UI STORE ===
interface AppStore {
  isCheckoutOpen: boolean
  setCheckoutOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  isCheckoutOpen: false,
  setCheckoutOpen: (isCheckoutOpen) => set({ isCheckoutOpen })
}))
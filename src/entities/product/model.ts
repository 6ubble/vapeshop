import { create } from 'zustand'

// Категории товаров
export const CATEGORIES = [
  { id: 'all', name: 'Все', emoji: '🛍️' },
  { id: 'pods', name: 'Pod-системы', emoji: '🔋' },
  { id: 'disposable', name: 'Одноразовые', emoji: '💨' },
  { id: 'liquids', name: 'Жидкости', emoji: '🧪' },
  { id: 'accessories', name: 'Аксессуары', emoji: '🔧' }
]

interface ProductFiltersStore {
  selectedCategory: string
  searchQuery: string
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'name'
  
  setCategory: (category: string) => void
  setSearch: (query: string) => void
  setSorting: (sort: ProductFiltersStore['sortBy']) => void
  clearFilters: () => void
}

export const useProductFilters = create<ProductFiltersStore>((set) => ({
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
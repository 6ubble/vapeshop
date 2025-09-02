import type { Product, CategoryId, Category } from '../types/types'

// === CATEGORIES ===
export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Все', emoji: '🛍️' },
  { id: 'pods', name: 'Pod-системы', emoji: '🔋' },
  { id: 'disposable', name: 'Одноразовые', emoji: '💨' },
  { id: 'liquids', name: 'Жидкости', emoji: '🧪' },
  { id: 'accessories', name: 'Аксессуары', emoji: '🔧' }
]

// === PRICE FORMATTING ===
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(price)
}

// === PRODUCT FILTERS ===
export const filterProducts = (
  products: Product[], 
  category: CategoryId, 
  searchQuery: string
): Product[] => {
  let filtered = products

  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category)
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query)
    )
  }

  return filtered
}

export const sortProducts = (
  products: Product[], 
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'name'
): Product[] => {
  const sorted = [...products]
  
  switch (sortBy) {
    case 'popular':
      return sorted.sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1
        if (!a.isPopular && b.isPopular) return 1
        return b.rating - a.rating
      })
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
    default:
      return sorted
  }
}


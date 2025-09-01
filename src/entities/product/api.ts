import { useQuery } from '@tanstack/react-query'
import { api } from '../../shared/api'
import type { Product } from '../../shared/types'

// API методы
const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get('/products')
    return data
  },
  
  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`)
    return data
  },
  
  search: async (query: string): Promise<Product[]> => {
    const { data } = await api.get('/products/search', {
      params: { q: query, limit: 20 }
    })
    return data
  }
}

// Мок данные как fallback
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'JUUL Device Starter Kit',
    price: 2990,
    originalPrice: 3490,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400',
    brand: 'JUUL',
    category: 'pods',
    inStock: true,
    rating: 4.5,
    description: 'Оригинальная pod-система JUUL с простым управлением и отличной передачей вкуса.',
    isPopular: true,
    isNew: false
  },
  {
    id: '2',
    name: 'Elf Bar BC5000 Strawberry Kiwi',
    price: 1290,
    image: 'https://images.unsplash.com/photo-1585951218062-4ec0fcd2d4ad?w=400',
    brand: 'Elf Bar',
    category: 'disposable',
    inStock: true,
    rating: 4.8,
    description: 'Популярная одноразовая электронная сигарета с ярким вкусом клубники и киви.',
    isPopular: true,
    isNew: true
  },
  {
    id: '3',
    name: 'Nasty Juice Grape Berry 60ml',
    price: 890,
    originalPrice: 1190,
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400',
    brand: 'Nasty Juice',
    category: 'liquids',
    inStock: true,
    rating: 4.6,
    description: 'Премиальная жидкость с насыщенным вкусом винограда и ягод.',
    isPopular: false,
    isNew: false
  }
]

// React Query хуки
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsAPI.getAll,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: MOCK_PRODUCTS, // Fallback на мок данные
    retry: 2
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
    placeholderData: () => MOCK_PRODUCTS.find(p => p.id === id)
  })
}

export const useProductSearch = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productsAPI.search(query),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000
  })
}
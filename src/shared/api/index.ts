import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCartStore } from '../lib/stores'
import type { Product, Order } from '../types/types'

// === API CLIENT ===
const API_URL = import.meta.env.VITE_API_URL || 'https://api.vapeshop.com'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Telegram авторизация
api.interceptors.request.use((config) => {
  const tg = window.Telegram?.WebApp
  
  if (tg?.initData) {
    config.headers.Authorization = `tma ${tg.initData}`
  }
  
  if (tg?.initDataUnsafe?.user?.id) {
    config.headers['X-User-ID'] = tg.initDataUnsafe.user.id.toString()
  }
  
  return config
})

// Обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const tg = window.Telegram?.WebApp
    
    if (error.response?.status === 401) {
      tg?.showAlert?.('Ошибка авторизации')
      } else if (error.response?.status >= 500) {
    tg?.showAlert?.('Ошибка сервера. Попробуйте позже.')
  }
    
    return Promise.reject(error)
  }
)

// === MOCK DATA ===
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'JUUL Device Starter Kit',
    price: 2990,
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
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400',
    brand: 'Nasty Juice',
    category: 'liquids',
    inStock: true,
    rating: 4.6,
    description: 'Премиальная жидкость с насыщенным вкусом винограда и ягод.',
    isPopular: false,
    isNew: false
  },
  {
    id: '4',
    name: 'SMOK Nord 4 Pod Kit',
    price: 3590,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400',
    brand: 'SMOK',
    category: 'pods',
    inStock: true,
    rating: 4.3,
    description: 'Мощная pod-система с регулировкой мощности и отличной автономностью.',
    isPopular: true,
    isNew: false
  },
  {
    id: '5',
    name: 'Lost Mary OS5000 Blueberry',
    price: 1490,
    image: 'https://images.unsplash.com/photo-1585951218062-4ec0fcd2d4ad?w=400',
    brand: 'Lost Mary',
    category: 'disposable',
    inStock: false,
    rating: 4.7,
    description: 'Стильная одноразовка с насыщенным вкусом черники.',
    isPopular: false,
    isNew: true
  },
  {
    id: '6',
    name: 'Vaporesso XROS 3 Mini',
    price: 2790,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400',
    brand: 'Vaporesso',
    category: 'pods',
    inStock: true,
    rating: 4.4,
    description: 'Компактная pod-система с отличной эргономикой и вкусопередачей.',
    isPopular: false,
    isNew: true
  }
]

// === API FUNCTIONS ===
const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    try {
      const { data } = await api.get('/products')
      return data
    } catch {
      return MOCK_PRODUCTS
    }
  },
  
  getById: async (id: string): Promise<Product> => {
    try {
      const { data } = await api.get(`/products/${id}`)
      return data
    } catch {
      const product = MOCK_PRODUCTS.find(p => p.id === id)
      if (!product) throw new Error('Product not found')
      return product
    }
  }
}

const ordersAPI = {
  create: async (orderData: any): Promise<Order> => {
    const { data } = await api.post('/orders', orderData)
    return data
  },
  
  getHistory: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders')
    return data
  }
}

// === REACT QUERY HOOKS ===
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsAPI.getAll,
    staleTime: 10 * 60 * 1000
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000
  })
}



export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const { clearCart } = useCartStore()
  
  return useMutation({
    mutationFn: ordersAPI.create,
    onSuccess: (data) => {
      clearCart()
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      
      window.Telegram?.WebApp?.sendData?.(JSON.stringify({
        type: 'order_created',
        orderId: data.id
      }))
    }
  })
}

export const useOrderHistory = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersAPI.getHistory,
    staleTime: 5 * 60 * 1000
  })
}
export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  brand: string
  category: string
  inStock: boolean
  rating: number
  description: string
  isPopular?: boolean
  isNew?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  customerName: string
  phone: string
  status: 'pending' | 'confirmed' | 'completed'
  createdAt: string
}

export type CategoryId = 'all' | 'pods' | 'disposable' | 'liquids' | 'accessories'

// shared/api/index.ts
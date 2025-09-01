import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Простой тип товара
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  category: string;
  inStock: boolean;
  rating: number;
  description: string;
}

// API клиент прямо здесь
const API_URL = import.meta.env.VITE_API_URL || 'https://api.yourshop.com';

const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${window.Telegram?.WebApp?.initData}`
      }
    });
    return response.json();
  },
  
  getById: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${window.Telegram?.WebApp?.initData}`
      }
    });
    return response.json();
  },
  
  search: async (query: string): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${window.Telegram?.WebApp?.initData}`
      }
    });
    return response.json();
  }
};

// React Query хуки - кеширование для бэкенда
export const useProducts = () => 
  useQuery({
    queryKey: ['products'],
    queryFn: productsAPI.getAll,
    staleTime: 10 * 60 * 1000, // 10 минут кеш
    gcTime: 30 * 60 * 1000,    // 30 минут в памяти
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 минут кеш
  });

export const useProductSearch = (query: string) =>
  useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productsAPI.search(query),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 минут кеш для поиска
  });

// Категории
export const CATEGORIES = [
  { id: 'all', name: 'Все', emoji: '🛍️' },
  { id: 'pods', name: 'Pod-системы', emoji: '🔋' },
  { id: 'disposable', name: 'Одноразовые', emoji: '💨' },
  { id: 'liquids', name: 'Жидкости', emoji: '🧪' }
];
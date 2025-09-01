import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  inStock: boolean;
  rating: number;
  description: string;
  tags: string[];
}

// API функции
export const productApi = {
  getAll: () => apiClient.get<Product[]>('/products'),
  getById: (id: string) => apiClient.get<Product>(`/products/${id}`),
  search: (query: string) => apiClient.get<Product[]>(`/products/search?q=${query}`)
};

// React Query хуки
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productApi.getAll,
    staleTime: 10 * 60 * 1000, // Товары кешируем на 10 минут
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
};

export const useProductSearch = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productApi.search(query),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // Поиск кешируем на 2 минуты
  });
};
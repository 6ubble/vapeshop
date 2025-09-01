import { apiClient } from '../../shared/api/api';
import type { Product } from './types';

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    return apiClient.get('/products');
  },

  getById: async (id: string): Promise<Product> => {
    return apiClient.get(`/products/${id}`);
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    return apiClient.get(`/products?category=${category}`);
  },

  search: async (query: string): Promise<Product[]> => {
    return apiClient.get(`/products/search?q=${encodeURIComponent(query)}`);
  }
};

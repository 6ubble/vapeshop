import { apiClient } from '../../shared/api/api';
import type { User } from './types';

export const userApi = {
  getProfile: async (userId: number): Promise<User> => {
    return apiClient.get(`/users/${userId}`);
  },

  updateProfile: async (userId: number, data: Partial<User>): Promise<User> => {
    return apiClient.post(`/users/${userId}`, data);
  },

  addToFavorites: async (userId: number, productId: string): Promise<void> => {
    return apiClient.post(`/users/${userId}/favorites`, { productId });
  },

  removeFromFavorites: async (userId: number, productId: string): Promise<void> => {
    return apiClient.delete(`/users/${userId}/favorites/${productId}`);
  }
};
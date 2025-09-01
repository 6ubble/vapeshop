import { apiClient } from '../../shared/api/api';
import type { Order, OrderStatus } from './types';

export const orderApi = {
  create: async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    return apiClient.post('/orders', orderData);
  },

  getById: async (orderId: string): Promise<Order> => {
    return apiClient.get(`/orders/${orderId}`);
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    return apiClient.get(`/orders?userId=${userId}`);
  },

  updateStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    return apiClient.post(`/orders/${orderId}/status`, { status });
  }
};
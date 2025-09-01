import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';
import { useCartStore } from '../../../entities/cart/store';

interface OrderData {
  items: Array<{ productId: string; quantity: number }>;
  customerInfo: {
    name: string;
    phone: string;
    deliveryType: 'pickup' | 'delivery';
    address?: string;
  };
  totalPrice: number;
  telegramUserId: number;
}

const orderApi = {
  create: (data: OrderData) => apiClient.post<{ orderId: string }>('/orders', data)
};

export const useCreateOrder = () => {
  const clearCart = useCartStore(state => state.clearCart);
  
  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: (data) => {
      clearCart();
      // Отправляем данные боту
      window.Telegram?.WebApp?.sendData(JSON.stringify({
        type: 'order_created',
        orderId: data.orderId
      }));
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
    }
  });
};
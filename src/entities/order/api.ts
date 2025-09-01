import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../shared/api'
import { useCart } from '../cart/model'
import type { Order } from '../../shared/types'

const orderAPI = {
  create: async (orderData: any): Promise<Order> => {
    const { data } = await api.post('/orders', orderData)
    return data
  },
  
  getHistory: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders')
    return data
  }
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const { clearCart } = useCart()
  
  return useMutation({
    mutationFn: orderAPI.create,
    onSuccess: (data) => {
      clearCart()
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      
      // Отправляем данные боту
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
    queryFn: orderAPI.getHistory,
    staleTime: 5 * 60 * 1000
  })
}
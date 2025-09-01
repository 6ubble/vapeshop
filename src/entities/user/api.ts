import { useQuery } from '@tanstack/react-query'
import { api } from '../../shared/api'
import type { TelegramUser } from '../../shared/types'

const userAPI = {
  getProfile: async (): Promise<TelegramUser> => {
    const { data } = await api.get('/user/profile')
    return data
  }
}

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: userAPI.getProfile,
    staleTime: 15 * 60 * 1000,
    retry: 1
  })
}
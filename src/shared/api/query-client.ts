import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут для товаров
      gcTime: 10 * 60 * 1000, // 10 минут в кеше
      retry: 1, // Для мобильной сети
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst' // Важно для Telegram
    },
    mutations: {
      retry: 2,
      networkMode: 'online'
    }
  }
});
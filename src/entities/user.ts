import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../shared/api';
import type { TelegramUser } from '../shared/types';

// Расширенный интерфейс пользователя
export interface User extends TelegramUser {
  preferences?: {
    favoriteCategories: string[];
    notifications: boolean;
    language: 'ru' | 'en';
  };
  orders?: {
    total: number;
    lastOrderDate?: string;
  };
  address?: {
    city: string;
    street: string;
    building: string;
    apartment?: string;
  };
}

// API для пользователя
const userAPI = {
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/user/profile');
    return data;
  },
  
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const { data } = await api.patch('/user/profile', userData);
    return data;
  },
  
  getFavorites: async (): Promise<string[]> => {
    const { data } = await api.get('/user/favorites');
    return data;
  },
  
  addToFavorites: async (productId: string): Promise<void> => {
    await api.post('/user/favorites', { productId });
  },
  
  removeFromFavorites: async (productId: string): Promise<void> => {
    await api.delete(`/user/favorites/${productId}`);
  }
};

// Store для пользователя (локальные настройки)
interface UserStore {
  telegramUser: TelegramUser | null;
  favorites: Set<string>;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: 'ru' | 'en';
  };
  
  // Actions
  setTelegramUser: (user: TelegramUser | null) => void;
  toggleFavorite: (productId: string) => void;
  updatePreferences: (prefs: Partial<UserStore['preferences']>) => void;
  
  // Getters
  isFavorite: (productId: string) => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      telegramUser: null,
      favorites: new Set<string>(),
      preferences: {
        theme: 'auto',
        notifications: true,
        language: 'ru'
      },
      
      setTelegramUser: (user) => {
        set({ telegramUser: user });
      },
      
      toggleFavorite: (productId) => {
        const favorites = new Set(get().favorites);
        
        if (favorites.has(productId)) {
          favorites.delete(productId);
          // Haptic feedback
          window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
        } else {
          favorites.add(productId);
          window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
        }
        
        set({ favorites });
      },
      
      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs }
        }));
      },
      
      isFavorite: (productId) => get().favorites.has(productId)
    }),
    { 
      name: 'vapeshop-user',
      // Сериализация Set для localStorage
      serialize: (state) => JSON.stringify({
        ...state,
        favorites: Array.from(state.favorites)
      }),
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          favorites: new Set(parsed.favorites || [])
        };
      }
    }
  )
);

// React Query хуки
export const useUserProfile = () =>
  useQuery({
    queryKey: ['user', 'profile'],
    queryFn: userAPI.getProfile,
    staleTime: 15 * 60 * 1000, // 15 минут
    retry: 1
  });

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: (data) => {
      // Обновляем кеш
      // queryClient.setQueryData(['user', 'profile'], data);
      
      // Haptic feedback
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
    }
  });

export const useFavorites = () => {
  const { favorites, toggleFavorite, isFavorite } = useUserStore();
  
  const addToFavoritesMutation = useMutation({
    mutationFn: userAPI.addToFavorites,
    onSuccess: (_, productId) => {
      toggleFavorite(productId);
    },
    onError: () => {
      window.Telegram?.WebApp?.showAlert?.('Ошибка при добавлении в избранное');
    }
  });
  
  const removeFromFavoritesMutation = useMutation({
    mutationFn: userAPI.removeFromFavorites,
    onSuccess: (_, productId) => {
      toggleFavorite(productId);
    },
    onError: () => {
      window.Telegram?.WebApp?.showAlert?.('Ошибка при удалении из избранного');
    }
  });
  
  const toggle = (productId: string) => {
    if (isFavorite(productId)) {
      removeFromFavoritesMutation.mutate(productId);
    } else {
      addToFavoritesMutation.mutate(productId);
    }
  };
  
  return {
    favorites: Array.from(favorites),
    isFavorite,
    toggle,
    isLoading: addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending
  };
};

// Хук для синхронизации с Telegram
export const useTelegramSync = () => {
  const { setTelegramUser } = useUserStore();
  
  React.useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg?.initDataUnsafe?.user) {
      setTelegramUser(tg.initDataUnsafe.user);
    }
  }, [setTelegramUser]);
};
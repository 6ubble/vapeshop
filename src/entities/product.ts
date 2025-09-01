import { useQuery } from '@tanstack/react-query';
import { api } from '../shared/api';
import type { Product } from '../shared/types';

// API методы
const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get('/products');
    return data;
  },
  
  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
  
  search: async (query: string): Promise<Product[]> => {
    const { data } = await api.get('/products/search', {
      params: { q: query, limit: 20 }
    });
    return data;
  },
  
  getByCategory: async (category: string): Promise<Product[]> => {
    const { data } = await api.get('/products', {
      params: { category, limit: 50 }
    });
    return data;
  }
};

// React Query хуки с оптимальным кешированием
export const useProducts = () => {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: productsAPI.getAll,
    staleTime: 10 * 60 * 1000, // 10 минут - товары меняются не часто
    gcTime: 30 * 60 * 1000,    // 30 минут в памяти
    refetchOnWindowFocus: false,
    networkMode: 'offlineFirst' // Важно для Telegram
  });
  
  return {
    ...query,
    // Удобные геттеры для фильтрации
    getByCategory: (categoryId: string) => {
      if (!query.data) return [];
      if (categoryId === 'all') return query.data;
      return query.data.filter(p => p.category === categoryId);
    },
    
    getPopular: () => query.data?.filter(p => p.isPopular) || [],
    getNew: () => query.data?.filter(p => p.isNew) || [],
    getOnSale: () => query.data?.filter(p => p.originalPrice) || [],
    getInStock: () => query.data?.filter(p => p.inStock) || []
  };
};

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 минут для одного товара
    gcTime: 60 * 60 * 1000,    // Час в памяти
  });

export const useProductSearch = (query: string) =>
  useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productsAPI.search(query),
    enabled: query.length > 2, // Поиск только для строк длиннее 2 символов
    staleTime: 2 * 60 * 1000,  // 2 минуты для поиска (короче кеш)
    gcTime: 10 * 60 * 1000,    // 10 минут в памяти
  });

// Категории товаров
export const CATEGORIES = [
  { 
    id: 'all', 
    name: 'Все', 
    emoji: '🛍️',
    description: 'Все товары' 
  },
  { 
    id: 'pods', 
    name: 'Pod-системы', 
    emoji: '🔋',
    description: 'Многоразовые устройства'
  },
  { 
    id: 'disposable', 
    name: 'Одноразовые', 
    emoji: '💨',
    description: 'Готовые к использованию'
  },
  { 
    id: 'liquids', 
    name: 'Жидкости', 
    emoji: '🧪',
    description: 'Вкусы для заправки'
  },
  {
    id: 'accessories',
    name: 'Аксессуары', 
    emoji: '🔧',
    description: 'Дополнительные товары'
  }
];

// Mock данные для разработки (удалить в продакшене)
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'JUUL Device Starter Kit',
    price: 2990,
    originalPrice: 3490,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400',
    brand: 'JUUL',
    category: 'pods',
    inStock: true,
    rating: 4.5,
    description: 'Оригинальная pod-система JUUL с простым управлением и отличной передачей вкуса. В комплекте: устройство, зарядное устройство, 2 картриджа.\n\nОсобенности:\n• Автоматическая активация\n• Магнитное соединение картриджей\n• Индикатор заряда\n• Компактный размер',
    isPopular: true,
    isNew: false
  },
  {
    id: '2',
    name: 'Elf Bar BC5000 Strawberry Kiwi',
    price: 1290,
    image: 'https://images.unsplash.com/photo-1585951218062-4ec0fcd2d4ad?w=400',
    brand: 'Elf Bar',
    category: 'disposable',
    inStock: true,
    rating: 4.8,
    description: 'Популярная одноразовая электронная сигарета с ярким вкусом клубники и киви. 5000 затяжек гарантированного удовольствия.\n\nХарактеристики:\n• 5000 затяжек\n• Никотин: 50 мг/мл\n• Аккумулятор: 650 мАч\n• Премиум жидкость',
    isPopular: true,
    isNew: true
  },
  {
    id: '3',
    name: 'Relx Infinity Device',
    price: 3590,
    image: 'https://images.unsplash.com/photo-1564070608-3350dbb134ec?w=400',
    brand: 'RELX',
    category: 'pods',
    inStock: false,
    rating: 4.3,
    description: 'Премиальное устройство RELX Infinity с инновационной технологией Super Smooth и долговечным аккумулятором.',
    isPopular: false,
    isNew: false
  },
  {
    id: '4',
    name: 'Nasty Juice Grape Berry 60ml',
    price: 890,
    originalPrice: 1190,
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400',
    brand: 'Nasty Juice',
    category: 'liquids',
    inStock: true,
    rating: 4.6,
    description: 'Премиальная жидкость с насыщенным вкусом винограда и ягод. Идеально сбалансированная формула для максимального удовольствия.',
    isPopular: true,
    isNew: false
  }
];

// Хук с fallback на mock данные
export const useProductsWithFallback = () => {
  const query = useProducts();
  
  // Если нет данных с сервера, используем mock
  const data = query.data?.length ? query.data : MOCK_PRODUCTS;
  
  return {
    ...query,
    data,
    getByCategory: (categoryId: string) => {
      if (categoryId === 'all') return data;
      return data.filter(p => p.category === categoryId);
    },
    getPopular: () => data.filter(p => p.isPopular),
    getNew: () => data.filter(p => p.isNew),
    getOnSale: () => data.filter(p => p.originalPrice),
    getInStock: () => data.filter(p => p.inStock)
  };
};
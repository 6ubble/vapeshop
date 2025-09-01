import { API_BASE_URL } from '../config';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    // Добавляем Telegram init data для авторизации
    if (window.Telegram?.WebApp?.initData) {
      config.headers = {
        ...config.headers,
        'X-Telegram-Init-Data': window.Telegram.WebApp.initData,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API Error');
      }

      return result.data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Специальный метод для загрузки файлов
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, unknown>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, String(additionalData[key]));
      });
    }

    const headers = { ...this.defaultHeaders };
    delete headers['Content-Type']; // Браузер сам установит для FormData

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

// Создаем экземпляр API клиента
export const apiClient = new ApiClient(API_BASE_URL);

// Мок API для разработки
export const mockApiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    console.log('Mock API GET:', endpoint);
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Возвращаем моковые данные в зависимости от endpoint
    if (endpoint.includes('/products')) {
      const { MOCK_PRODUCTS } = await import('../config');
      return MOCK_PRODUCTS as T;
    }
    
    throw new Error('Mock endpoint not implemented');
  },

  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    console.log('Mock API POST:', endpoint, data);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Имитация успешного ответа
    return { success: true, id: Date.now().toString() } as T;
  },

  put: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    console.log('Mock API PUT:', endpoint, data);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return { success: true } as T;
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    console.log('Mock API DELETE:', endpoint);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return { success: true } as T;
  }
};

// Экспортируем нужный клиент в зависимости от окружения
export const api = import.meta.env.DEV ? mockApiClient : apiClient;

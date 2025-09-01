interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
  }
  
  class ApiClient {
    private baseURL = import.meta.env.VITE_API_URL || 'https://api.yourshop.com';
  
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const url = `${this.baseURL}${endpoint}`;
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          // Telegram авторизация
          'X-Telegram-Init-Data': window.Telegram?.WebApp?.initData || '',
          ...options.headers,
        },
        ...options,
      };
  
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
  
      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Request failed');
      }
  
      return result.data;
    }
  
    get<T>(endpoint: string) {
      return this.request<T>(endpoint);
    }
  
    post<T>(endpoint: string, data?: any) {
      return this.request<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
    }
  }
  
  export const apiClient = new ApiClient();
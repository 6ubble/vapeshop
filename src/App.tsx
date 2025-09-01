import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelegramProvider } from './shared/Telegram';
import { AppLayout } from './widgets/Layout';
import { LoadingSpinner } from './shared/Ui';
import { useTelegramSync } from './entities/user';

// Ленивая загрузка страниц для оптимизации
const HomePage = React.lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CatalogPage = React.lazy(() => import('./pages/CatalogPage').then(m => ({ default: m.CatalogPage })));
const ProductPage = React.lazy(() => import('./pages/ProductPage').then(m => ({ default: m.ProductPage })));
const CartPage = React.lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));

// React Query клиент - оптимизирован для Telegram Mini Apps
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 минут кеш
      gcTime: 10 * 60 * 1000,      // 10 минут в памяти
      retry: (failureCount, error: any) => {
        // Не ретраим 4xx ошибки
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,  // Telegram не имеет фокуса окон
      refetchOnReconnect: true,     // Переподключение к интернету
      networkMode: 'offlineFirst'   // Важно для мобильных сетей
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst'
    }
  }
});

// Обработка ошибок React Query
queryClient.setMutationDefaults(['order'], {
  mutationFn: async (data) => {
    const tg = window.Telegram?.WebApp;
    
    try {
      return await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      tg?.HapticFeedback?.notificationOccurred?.('error');
      throw error;
    }
  }
});

// Компонент для синхронизации с Telegram
const TelegramSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useTelegramSync();
  return <>{children}</>;
};

// Fallback компонент для загрузки
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="text-tg-hint mt-4">Загрузка...</p>
    </div>
  </div>
);

// Роутер с Suspense
const AppRouter: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      
      {/* Дополнительные страницы */}
      <Route path="/orders" element={<Navigate to="/profile" replace />} />
      <Route path="/favorites" element={<Navigate to="/profile" replace />} />
      <Route path="/settings" element={<Navigate to="/profile" replace />} />
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

// Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Telegram Mini App Error:', error, errorInfo);
    
    // Отправляем ошибку в Telegram для отладки
    window.Telegram?.WebApp?.sendData?.(JSON.stringify({
      type: 'error',
      message: error.message,
      stack: error.stack
    }));
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-tg-bg flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-bold text-tg-text mb-2">
              Что-то пошло не так
            </h2>
            <p className="text-tg-hint mb-6 max-w-sm">
              Произошла ошибка в приложении. Попробуйте перезапустить.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-tg-button text-tg-button-text rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Перезапустить
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Главный компонент приложения
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TelegramProvider>
          <TelegramSync>
            <BrowserRouter>
              <AppLayout>
                <AppRouter />
              </AppLayout>
            </BrowserRouter>
          </TelegramSync>
        </TelegramProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
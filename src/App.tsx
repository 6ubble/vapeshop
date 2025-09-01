import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelegramProvider } from './shared/telegram';
import { AppLayout } from './widgets/layout';

// Страницы
import { HomePage } from './pages/home';
import { CatalogPage } from './pages/catalog';
import { ProductPage } from './pages/product';
import { CartPage } from './pages/cart';
import { ProfilePage } from './pages/profile';

// React Query клиент - настроен для Telegram
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 минут кеш
      gcTime: 10 * 60 * 1000,      // 10 минут в памяти
      retry: 2,                     // Retry для плохого интернета
      refetchOnWindowFocus: false,  // Не перезагружать при фокусе
      networkMode: 'offlineFirst'   // Оффлайн режим
    }
  }
});

// Простой роутер
const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/catalog" element={<CatalogPage />} />
    <Route path="/product/:id" element={<ProductPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

// Главный компонент - все провайдеры здесь
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <BrowserRouter>
          <AppLayout>
            <AppRouter />
          </AppLayout>
        </BrowserRouter>
      </TelegramProvider>
    </QueryClientProvider>
  );
};

export default App;
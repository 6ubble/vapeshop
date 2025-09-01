import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TelegramProvider } from './telegram/TelegramProvider';
import { AppRouter } from './providers/AppRouter';
import { LoadingScreen } from './shared/ui/index';
import { useTelegram } from './telegram/TelegramProvider';

// Создаем QueryClient для React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Внутренний компонент приложения
const AppContent: React.FC = () => {
  const { isReady, error } = useTelegram();

  if (!isReady) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            Ошибка инициализации
          </h2>
          <p className="text-tg-hint mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-tg"
          >
            Перезагрузить
          </button>
        </div>
      </div>
    );
  }

  return <AppRouter />;
};

// Главный компонент с провайдерами
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TelegramProvider>
    </QueryClientProvider>
  );
};

export default App;
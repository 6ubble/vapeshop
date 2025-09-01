import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { QueryProvider } from './app/providers/QueryProvider';
import { TelegramProvider } from './app/telegram';
import { AppRouter } from './app/router';
import { ErrorBoundary } from './shared/ui/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <TelegramProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </TelegramProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;
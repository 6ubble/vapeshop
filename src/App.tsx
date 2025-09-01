import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { QueryProvider } from './app/providers/QueryProvider.tsx';
import { TelegramProvider } from './app/telegram';
import { AppRouter } from './app/router/';

const App: React.FC = () => {
  return (
    <QueryProvider>
      <TelegramProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </TelegramProvider>
    </QueryProvider>
  );
};

export default App;

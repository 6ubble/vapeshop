import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../shared/api/query-client';

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
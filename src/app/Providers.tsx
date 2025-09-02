import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { TelegramProvider } from '../shared/lib/Telegram'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst'
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst'
    }
  }
})

interface Props {
  children: React.ReactNode
}

export const AppProviders: React.FC<Props> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <TelegramProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </TelegramProvider>
  </QueryClientProvider>
)
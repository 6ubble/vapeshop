import React from 'react'
import { useLocation } from 'react-router-dom'
import { Navigation } from './Navigation'
import { useTelegram } from '../shared/lib/Telegram'
import { LoadingSpinner } from '../shared/ui'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const { isReady } = useTelegram()
  
  const hideNavigation = location.pathname.startsWith('/product')
  
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 mt-4">Загрузка...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className={`
        px-4 py-6 
        ${hideNavigation ? 'pb-6' : 'pb-20'}
        max-w-7xl mx-auto
      `}>
        {children}
      </main>
      
      {!hideNavigation && <Navigation />}
    </div>
  )
}
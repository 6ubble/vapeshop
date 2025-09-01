import React from 'react'
import { useLocation } from 'react-router-dom'
import { Navigation } from '../navigation/ui'
import { useCart } from '../../entities/cart/model'
import { useTelegram } from '../../shared/lib/telegram.tsx'
import { LoadingSpinner } from '../../shared/ui'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const { count } = useCart()
  const { isReady } = useTelegram()
  
  const hideNavigation = ['/product'].some(path => 
    location.pathname.startsWith(path)
  )
  
  if (!isReady) {
    return (
      <div className="min-h-screen bg-tg-bg flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-tg-hint mt-4">Загрузка...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-tg-bg">
      <main className={`
        px-4 py-6 
        ${hideNavigation ? 'pb-6' : 'pb-20'}
        max-w-md mx-auto
      `}>
        {children}
      </main>
      
      {!hideNavigation && <Navigation />}
      
      {count > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {count > 99 ? '99+' : count}
          </div>
        </div>
      )}
    </div>
  )
}

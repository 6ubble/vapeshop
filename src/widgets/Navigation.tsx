import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, User } from 'lucide-react'
import { useCartStore } from '../shared/lib/stores'
import { useTelegram } from '../shared/lib/Telegram'

const navItems = [
  { path: '/', icon: Search, label: 'Каталог', exactMatch: true },
  { path: '/cart', icon: ShoppingCart, label: 'Корзина', exactMatch: true },
  { path: '/profile', icon: User, label: 'Профиль', exactMatch: true }
]

export const Navigation: React.FC = () => {
  const location = useLocation()
  const count = useCartStore(state => state.getCount())
  const { haptic } = useTelegram()
  
  const isActive = (path: string, exactMatch: boolean) => {
    if (exactMatch) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path, item.exactMatch)
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => haptic.light()}
                className={`
                  flex flex-col items-center py-2 px-2 sm:px-4 rounded-lg
                  ${active ? 'text-black' : 'text-gray-500'}
                `}
              >
                <div className="relative mb-1">
                  <Icon size={20} className="sm:w-6 sm:h-6" />
                  
                  {item.path === '/cart' && count > 0 && (
                    <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {count > 99 ? '99+' : count}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
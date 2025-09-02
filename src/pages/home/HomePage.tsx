import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Gift, Star } from 'lucide-react'
import { Card, Badge } from '../../shared/ui'
import { ProductCard } from '../../widgets/ProductCard'
import { useProducts } from '../../shared/api'
import { useTelegram } from '../../shared/lib/Telegram'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, haptic } = useTelegram()
  const { data: products = [] } = useProducts()
  
  // Мемоизируем фильтрацию
  const { popularProducts, newProducts } = useMemo(() => ({
    popularProducts: products.filter(p => p.isPopular).slice(0, 4),
    newProducts: products.filter(p => p.isNew).slice(0, 2)
  }), [products])

  const quickActions = [
    {
      title: 'Pod-системы',
      emoji: '🔋',
      path: '/catalog?category=pods'
    },
    {
      title: 'Одноразовые', 
      emoji: '💨',
      path: '/catalog?category=disposable'
    },
    {
      title: 'Жидкости',
      emoji: '🧪',
      path: '/catalog?category=liquids'
    },
    {
      title: 'Популярное',
      icon: <Star size={24} className="text-yellow-500" />,
      path: '/catalog?filter=popular'
    }
  ]

  const handleProductClick = React.useCallback((productId: string) => {
    haptic.light()
    navigate(`/product/${productId}`)
  }, [haptic, navigate])

  return (
    <div className="space-y-6">
      {/* Приветствие и поиск */}
      <Card className="text-center bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">
            VapeShop 💨
          </h1>
          {user && (
            <p className="text-tg-hint">
              Привет, {user.first_name}! Рады видеть тебя снова 👋
            </p>
          )}
        </div>
        
        <Link 
          to="/catalog" 
          onClick={() => haptic.light()}
          className="block"
        >
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Search size={20} className="text-tg-hint" />
            <span className="text-tg-hint text-left flex-1">
              Поиск товаров...
            </span>
          </div>
        </Link>
      </Card>

      {/* Промо баннер */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl mb-1">Скидка 20%</h3>
            <p className="text-sm opacity-90 mb-2">На первый заказ</p>
            <Badge variant="warning">
              Промокод: WELCOME20
            </Badge>
          </div>
          <Gift size={48} className="opacity-80" />
        </div>
      </Card>

      {/* Категории */}
      <div>
        <h2 className="text-lg font-bold mb-3">Категории</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link 
              key={index}
              to={action.path}
              onClick={() => haptic.light()}
            >
              <Card className="text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white text-2xl">
                  {action.emoji || action.icon}
                </div>
                <div className="font-semibold text-sm">
                  {action.title}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Популярные товары */}
      {popularProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">🔥 Популярные товары</h2>
            <Link to="/catalog">
              <button className="text-tg-button text-sm font-medium">
                Все →
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {popularProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
                variant="grid"
              />
            ))}
          </div>
        </div>
      )}

      {/* Новинки */}
      {newProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">✨ Новинки</h2>
            <Link to="/catalog">
              <button className="text-tg-button text-sm font-medium">
                Все →
              </button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {newProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
                variant="list"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
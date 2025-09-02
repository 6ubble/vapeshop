import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, Settings, MapPin, ExternalLink, Package } from 'lucide-react'
import { Card } from '../../shared/ui'
import { useCartStore } from '../../shared/lib/stores'
import { useOrderHistory } from '../../shared/api'
import { useTelegram } from '../../shared/lib/Telegram'
import { formatPrice } from '../../shared/lib/utils'

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, haptic } = useTelegram()
  const count = useCartStore(state => state.getCount())
  const total = useCartStore(state => state.getTotal())
  const { data: orderHistory = [] } = useOrderHistory()

  const stats = [
    { label: 'В корзине', value: count, color: 'blue' },
    { label: 'Заказов', value: orderHistory.length, color: 'green' },
    { label: 'Сумма', value: formatPrice(total), color: 'purple' },
  ]

  const handleNavigate = useCallback((path: string) => {
    haptic.light()
    navigate(path)
  }, [haptic, navigate])

  const handleOpenSupport = useCallback(() => {
    haptic.light()
    window.Telegram?.WebApp?.openTelegramLink?.('https://t.me/vapeshop_support')
  }, [haptic])

  const menuSections = [
    {
      title: 'Покупки',
      items: [
        {
          icon: <Package size={20} />,
          label: 'Мои заказы',
          action: () => handleNavigate('/orders'),
          description: `${orderHistory.length} заказов`,
          show: true
        },
        {
          icon: <Heart size={20} />,
          label: 'Избранное',
          action: () => handleNavigate('/favorites'),
          description: 'Отложенные товары',
          show: false // Пока не реализовано
        }
      ]
    },
    {
      title: 'Настройки',
      items: [
        {
          icon: <MapPin size={20} />,
          label: 'Адреса доставки',
          action: () => handleNavigate('/addresses'),
          description: 'Сохраненные адреса',
          show: false // Пока не реализовано
        },
        {
          icon: <Settings size={20} />,
          label: 'Настройки',
          action: () => handleNavigate('/settings'),
          description: 'Уведомления, язык',
          show: false // Пока не реализовано
        }
      ]
    },
    {
      title: 'Поддержка',
      items: [
        {
          icon: <ExternalLink size={20} />,
          label: 'Техподдержка',
          action: handleOpenSupport,
          description: 'Связаться с поддержкой',
          show: true
        }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Профиль пользователя */}
      <Card className="text-center">
        {user?.photo_url ? (
          <img 
            src={user.photo_url} 
            alt="Аватар" 
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        ) : (
          <div className="w-24 h-24 bg-tg-button rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            {user?.first_name?.[0] || 'U'}
          </div>
        )}
        
        <h2 className="text-xl font-bold mb-1">
          {user?.first_name} {user?.last_name}
        </h2>
        
        {user?.username && (
          <p className="text-tg-hint mb-3">@{user.username}</p>
        )}

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-xl font-bold mb-1 text-tg-button">
                {stat.value}
              </div>
              <div className="text-xs text-tg-hint">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Быстрый переход в корзину */}
      {count > 0 && (
        <Card 
          onClick={() => handleNavigate('/cart')}
          className="bg-green-50 border-green-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <div>
                <div className="font-medium">Завершить покупку</div>
                <div className="text-sm text-tg-hint">
                  {count} товаров на {formatPrice(total)}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Меню секции */}
      {menuSections.map((section, sectionIndex) => {
        const visibleItems = section.items.filter(item => item.show)
        
        if (visibleItems.length === 0) return null
        
        return (
          <div key={sectionIndex}>
            <h3 className="font-semibold text-lg mb-3">
              {section.title}
            </h3>
            
            <Card className="p-0">
              {visibleItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                >
                  <div className="text-tg-hint">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-tg-hint">{item.description}</div>
                  </div>
                </button>
              ))}
            </Card>
          </div>
        )
      })}

      {/* Информация о приложении */}
      <Card className="text-center bg-tg-secondary-bg">
        <div className="text-sm text-tg-hint">
          <p className="mb-2">VapeShop v1.0</p>
          <p>Telegram Mini App</p>
        </div>
      </Card>
    </div>
  )
}
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, ExternalLink } from 'lucide-react'
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

  const handleNavigate = (path: string) => {
    haptic.light()
    navigate(path)
  }

  const handleOpenSupport = () => {
    haptic.light()
    window.Telegram?.WebApp?.openTelegramLink?.('https://t.me/vapeshop_support')
  }

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
      <Card className="text-center">
        {user?.photo_url ? (
          <img 
            src={user.photo_url} 
            alt="Аватар" 
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        ) : (
          <div className="w-24 h-24 bg-black rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            {user?.first_name?.[0] || 'U'}
          </div>
        )}
        
        <h2 className="text-xl font-bold mb-1">
          {user?.first_name} {user?.last_name}
        </h2>
        
        {user?.username && (
          <p className="text-gray-500 mb-3">@{user.username}</p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-xl font-bold mb-1 text-black">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

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
                  className="w-full flex items-center gap-3 p-4 text-left border-b border-gray-100 last:border-b-0"
                >
                  <div className="text-gray-500">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </button>
              ))}
            </Card>
          </div>
        )
      })}
    </div>
  )
}
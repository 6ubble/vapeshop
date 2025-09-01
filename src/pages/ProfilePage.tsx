import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, Settings, MapPin, ExternalLink } from 'lucide-react'
import { Card } from '../shared/ui'
import { useCart } from '../entities/cart/model'
import { useTelegram } from '../shared/lib/telegram.tsx'
import { formatPrice } from '../shared/lib/utils'

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, haptic } = useTelegram()
  const { count, total } = useCart()

  const stats = [
    { label: 'В корзине', value: count, color: 'blue' },
    { label: 'Избранное', value: 0, color: 'red' },
    { label: 'Заказов', value: 0, color: 'green' },
  ]

  const menuSections = [
    {
      title: 'Покупки',
      items: [
        {
          icon: <ShoppingBag size={20} />,
          label: 'Мои заказы',
          action: () => navigate('/orders'),
          description: 'История покупок'
        },
        {
          icon: <Heart size={20} />,
          label: 'Избранное',
          action: () => navigate('/favorites'),
          description: 'Отложенные товары'
        }
      ]
    },
    {
      title: 'Настройки',
      items: [
        {
          icon: <MapPin size={20} />,
          label: 'Адреса доставки',
          action: () => navigate('/addresses'),
          description: 'Сохраненные адреса'
        },
        {
          icon: <Settings size={20} />,
          label: 'Настройки',
          action: () => navigate('/settings'),
          description: 'Общие настройки'
        }
      ]
    },
    {
      title: 'Поддержка',
      items: [
        {
          icon: <ExternalLink size={20} />,
          label: 'Техподдержка',
          action: () => {
            haptic.light()
            window.Telegram?.WebApp?.openTelegramLink('https://t.me/vapeshop_support')
          },
          description: 'Связаться с поддержкой'
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

        <div className="grid grid-cols-3 gap-4 mt-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold mb-1 text-tg-button">
                {stat.value}
              </div>
              <div className="text-xs text-tg-hint">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {count > 0 && (
        <Card 
          onClick={() => {
            haptic.light()
            navigate('/cart')
          }}
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

      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h3 className="font-semibold text-lg mb-3">
            {section.title}
          </h3>
          
          <Card padding="none">
            {section.items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  haptic.light()
                  item.action()
                }}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
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
      ))}
    </div>
  )
}

export default ProfilePage
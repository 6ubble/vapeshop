import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Gift, Star, Zap } from 'lucide-react';
import { Card, SectionHeader, Badge } from '../shared/Ui';
import { ProductCard, ProductCardSkeleton } from '../widgets/ProductCard';
import { useProducts } from '../entities/product';
import { useTelegram } from '../shared/Telegram';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, haptic } = useTelegram();
  const { data: products, isLoading } = useProducts();
  
  // Фильтруем товары для показа на главной
  const popularProducts = products?.filter(p => p.isPopular).slice(0, 4) || [];
  const newProducts = products?.filter(p => p.isNew).slice(0, 2) || [];

  const quickActions = [
    {
      title: 'Pod-системы',
      emoji: '🔋',
      path: '/catalog?category=pods',
      description: 'Многоразовые устройства'
    },
    {
      title: 'Одноразовые',
      emoji: '💨', 
      path: '/catalog?category=disposable',
      description: 'Готовые к использованию'
    },
    {
      title: 'Жидкости',
      emoji: '🧪',
      path: '/catalog?category=liquids', 
      description: 'Вкусы для заправки'
    },
    {
      title: 'Популярное',
      icon: <Star size={24} className="text-yellow-500" />,
      path: '/catalog?filter=popular',
      description: 'Хиты продаж'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Приветствие с персонализацией */}
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
        
        {/* Поисковая строка */}
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
            <Zap size={16} className="text-tg-button" />
          </div>
        </Link>
      </Card>

      {/* Промо баннер */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xl mb-1">Скидка 20%</h3>
              <p className="text-sm opacity-90 mb-2">На первый заказ</p>
              <Badge variant="warning" >
                Промокод: WELCOME20
              </Badge>
            </div>
            <Gift size={48} className="opacity-80" />
          </div>
        </div>
        
        {/* Декоративный элемент */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16" />
      </Card>

      {/* Быстрые действия */}
      <div>
        <SectionHeader>Категории</SectionHeader>
        
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Link 
              key={index}
              to={action.path}
              onClick={() => haptic.light()}
            >
              <Card className="text-center hover:shadow-md transition-shadow">
                <div className="mb-3">
                  {action.emoji ? (
                    <div className="text-3xl mb-2">{action.emoji}</div>
                  ) : (
                    <div className="flex justify-center mb-2">{action.icon}</div>
                  )}
                </div>
                
                <div className="font-medium text-tg-text mb-1">
                  {action.title}
                </div>
                
                <div className="text-xs text-tg-hint">
                  {action.description}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Популярные товары */}
      <div>
        <SectionHeader>
          🔥 Популярные товары
          <Link to="/catalog?filter=popular">
            <button 
              className="text-tg-button text-sm font-medium hover:underline"
              onClick={() => haptic.light()}
            >
              Все →
            </button>
          </Link>
        </SectionHeader>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <ProductCardSkeleton key={i} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {popularProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => {
                  haptic.light();
                  navigate(`/product/${product.id}`);
                }}
                variant="grid"
              />
            ))}
          </div>
        )}
      </div>

      {/* Новинки */}
      {newProducts.length > 0 && (
        <div>
          <SectionHeader>
            ✨ Новинки
            <Link to="/catalog?filter=new">
              <button 
                className="text-tg-button text-sm font-medium hover:underline"
                onClick={() => haptic.light()}
              >
                Все →
              </button>
            </Link>
          </SectionHeader>
          
          <div className="space-y-3">
            {newProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => {
                  haptic.light();
                  navigate(`/product/${product.id}`);
                }}
                variant="list"
              />
            ))}
          </div>
        </div>
      )}

      {/* Информационный блок */}
      <Card className="bg-orange-50 border-l-4 border-orange-500">
        <div className="flex gap-3">
          <div className="text-orange-500 text-xl">⚠️</div>
          <div className="text-sm">
            <div className="font-medium text-orange-800 mb-1">
              Возрастные ограничения 18+
            </div>
            <div className="text-orange-700">
              Продажа табачных изделий лицам младше 18 лет запрещена законом РФ
            </div>
          </div>
        </div>
      </Card>

      {/* Контакты и поддержка */}
      <Card className="text-center">
        <div className="space-y-3">
          <h3 className="font-semibold">Нужна помощь?</h3>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => {
                haptic.light();
                window.Telegram?.WebApp?.openTelegramLink('https://t.me/vapeshop_support');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-tg-button text-tg-button-text rounded-lg hover:opacity-90 transition-opacity"
            >
              💬 Поддержка
            </button>
            
            <button
              onClick={() => {
                haptic.light();
                window.Telegram?.WebApp?.openTelegramLink('https://t.me/vapeshop_channel');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-tg-secondary-bg text-tg-text rounded-lg hover:bg-gray-200 transition-colors"
            >
              📢 Канал
            </button>
          </div>
          
          <div className="text-xs text-tg-hint">
            Режим работы: 09:00 — 22:00
          </div>
        </div>
      </Card>
    </div>
  );
};
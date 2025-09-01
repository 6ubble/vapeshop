import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Gift, Star, TrendingUp } from 'lucide-react';
import { Card, SectionHeader, Badge } from '../shared/ui';
import { ProductCard } from '../widgets/product-card';
import { useProducts } from '../entities/product';
import { useTelegram } from '../shared/telegram';

export const HomePage: React.FC = () => {
  const { user, haptic } = useTelegram();
  const { getPopular, getNew } = useProducts();
  
  const popularProducts = getPopular().slice(0, 3);
  const newProducts = getNew().slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Приветствие */}
      <Card className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          Добро пожаловать! 💨
        </h1>
        {user && (
          <p className="text-tg-hint">
            Привет, {user.first_name}!
          </p>
        )}
        
        {/* Поиск */}
        <Link to="/catalog" className="block mt-4">
          <div className="flex items-center gap-3 p-3 bg-tg-secondary-bg rounded-lg">
            <Search size={20} className="text-tg-hint" />
            <span className="text-tg-hint">Поиск товаров...</span>
          </div>
        </Link>
      </Card>

      {/* Промо баннер */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Скидка 20%</h3>
            <p className="text-sm opacity-90">На первый заказ</p>
            <p className="text-xs mt-1">Промокод: WELCOME20</p>
          </div>
          <Gift size={32} className="opacity-80" />
        </div>
      </Card>

      {/* Быстрые действия */}
      <div>
        <SectionHeader>Категории</SectionHeader>
        
        <div className="grid grid-cols-2 gap-3">
          <Link to="/catalog?category=pod-systems">
            <Card className="text-center">
              <div className="text-2xl mb-2">🔋</div>
              <div className="font-medium">Pod-системы</div>
            </Card>
          </Link>
          
          <Link to="/catalog?category=disposable">
            <Card className="text-center">
              <div className="text-2xl mb-2">💨</div>
              <div className="font-medium">Одноразовые</div>
            </Card>
          </Link>
          
          <Link to="/catalog?filter=popular">
            <Card className="text-center">
              <Star size={24} className="mx-auto mb-2 text-yellow-500" />
              <div className="font-medium text-sm">Популярное</div>
            </Card>
          </Link>
          
          <Link to="/catalog?filter=new">
            <Card className="text-center">
              <TrendingUp size={24} className="mx-auto mb-2 text-green-500" />
              <div className="font-medium text-sm">Новинки</div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Популярные товары */}
      {popularProducts.length > 0 && (
        <div>
          <SectionHeader>
            Популярные товары
            <Link to="/catalog?filter=popular">
              <button className="text-tg-button text-sm">Все</button>
            </Link>
          </SectionHeader>
          
          <div className="space-y-3">
            {popularProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => {
                  haptic.light();
                  // Навигация будет в роутере
                }}
                variant="list"
              />
            ))}
          </div>
        </div>
      )}

      {/* Возрастное ограничение */}
      <Card className="border-l-4 border-orange-500 bg-orange-50">
        <div className="flex gap-3">
          <div className="text-orange-500">⚠️</div>
          <div className="text-sm">
            <div className="font-medium text-orange-800">18+</div>
            <div className="text-orange-700">
              Продажа табачных изделий лицам младше 18 лет запрещена
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
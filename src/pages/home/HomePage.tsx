import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Star, Zap, Gift, TrendingUp } from 'lucide-react';

import { useTelegram } from '../../app/telegram';
import { Button, Card, SectionHeader, Badge } from '../../shared/ui/index';
import { ProductCard } from '../../widgets/product-card/ProductCard';
import { PRODUCT_CATEGORIES, MOCK_PRODUCTS } from '../../shared/config';

export const HomePage: React.FC = () => {
  const { user, haptic } = useTelegram();

  const handleCategoryClick = (categoryId: string) => {
    haptic.light();
    // Навигация к каталогу с фильтром
    console.log('Navigate to category:', categoryId);
  };

  const handleProductClick = (productId: string) => {
    haptic.light();
    console.log('Navigate to product:', productId);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Приветствие и поиск */}
      <Card padding="lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Добро пожаловать в VapeShop! 💨
          </h1>
          {user && (
            <p className="text-tg-hint">
              Привет, {user.first_name}! Найди свой идеальный вейп
            </p>
          )}
        </div>
        
        <Link to="/catalog">
          <div className="flex items-center gap-3 p-4 bg-tg-bg rounded-lg border border-tg-hint border-opacity-20 hover:bg-opacity-80 active:scale-[0.98] transition-all">
            <Search size={20} className="text-tg-hint" />
            <span className="text-tg-hint flex-1">Поиск товаров...</span>
            <ShoppingBag size={20} className="text-tg-hint" />
          </div>
        </Link>
      </Card>

      {/* Баннер со скидкой */}
      <Card padding="md" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Скидка 20% на первый заказ!</h3>
            <p className="text-sm opacity-90">Используй промокод WELCOME20</p>
          </div>
          <Gift size={32} className="opacity-80" />
        </div>
      </Card>

      {/* Категории */}
      <div>
        <SectionHeader>
          Категории
          <Link to="/catalog">
            <Button variant="ghost" size="sm">
              Все
            </Button>
          </Link>
        </SectionHeader>
        
        <div className="grid grid-cols-2 gap-3">
          {PRODUCT_CATEGORIES.slice(0, 4).map((category) => (
            <Card
              key={category.id}
              clickable
              onClick={() => handleCategoryClick(category.id)}
              className="text-center"
            >
              <div className="text-2xl mb-2">{category.emoji}</div>
              <div className="font-medium text-sm">{category.name}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Популярные товары */}
      <div>
        <SectionHeader>
          Популярные товары
          <Link to="/catalog?filter=popular">
            <Button variant="ghost" size="sm">
              Все
            </Button>
          </Link>
        </SectionHeader>
        
        <div className="space-y-4">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product.id)}
              variant="horizontal"
            />
          ))}
        </div>
      </div>

      {/* Быстрые действия */}
      <div>
        <SectionHeader>Быстрые действия</SectionHeader>
        
        <div className="grid grid-cols-2 gap-3">
          <Link to="/catalog?filter=new">
            <Card clickable className="text-center">
              <Zap size={24} className="mx-auto mb-2 text-tg-button" />
              <div className="font-medium text-sm">Новинки</div>
              <Badge variant="info" size="sm" className="">12 товаров</Badge>
            </Card>
          </Link>
          
          <Link to="/catalog?sort=rating">
            <Card clickable className="text-center">
              <Star size={24} className="mx-auto mb-2 text-yellow-500" />
              <div className="font-medium text-sm">Топ рейтинг</div>
              <Badge variant="warning" size="sm" className="">★ 4.5+</Badge>
            </Card>
          </Link>
          
          <Link to="/catalog?filter=discount">
            <Card clickable className="text-center">
              <Gift size={24} className="mx-auto mb-2 text-red-500" />
              <div className="font-medium text-sm">Скидки</div>
              <Badge variant="error" size="sm" className="">до -30%</Badge>
            </Card>
          </Link>
          
          <Link to="/catalog?sort=popularity">
            <Card clickable className="text-center">
              <TrendingUp size={24} className="mx-auto mb-2 text-green-500" />
              <div className="font-medium text-sm">Хиты продаж</div>
              <Badge variant="success" size="sm" className="">ТОП</Badge>
            </Card>
          </Link>
        </div>
      </div>

      {/* Информация о магазине */}
      <Card>
        <div className="text-center space-y-3">
          <h3 className="font-semibold">Почему выбирают нас?</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-tg-button">✓ Только оригинал</div>
              <div className="text-tg-hint">100% подлинные товары</div>
            </div>
            <div>
              <div className="font-medium text-tg-button">✓ Быстрая доставка</div>
              <div className="text-tg-hint">От 30 минут</div>
            </div>
            <div>
              <div className="font-medium text-tg-button">✓ Гарантия качества</div>
              <div className="text-tg-hint">Обмен/возврат</div>
            </div>
            <div>
              <div className="font-medium text-tg-button">✓ Поддержка 24/7</div>
              <div className="text-tg-hint">Всегда на связи</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Возрастное предупреждение */}
      <Card className="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
        <div className="flex items-start gap-3">
          <div className="text-orange-500 mt-1">⚠️</div>
          <div className="text-sm">
            <div className="font-medium text-orange-800 dark:text-orange-200">
              Внимание! Возрастное ограничение 18+
            </div>
            <div className="text-orange-700 dark:text-orange-300 mt-1">
              Продажа табачной продукции лицам младше 18 лет запрещена
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
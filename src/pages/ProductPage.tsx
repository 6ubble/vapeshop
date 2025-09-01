import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Share, Shield, Truck } from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '../shared/Ui';
import { AddToCartButton } from '../features/AddToCart';
import { ProductCard } from '../widgets/ProductCard';
import { useProduct, useProducts } from '../entities/product';
import { useFavorites } from '../entities/user';
import { useTelegram } from '../shared/Telegram';
import { formatPrice, shareProduct } from '../shared/api';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { haptic, showBackButton, hideBackButton } = useTelegram();
  
  const { data: product, isLoading, error } = useProduct(id!);
  const { data: allProducts = [] } = useProducts();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();

  // Похожие товары
  const relatedProducts = allProducts
    .filter(p => p.id !== id && p.category === product?.category)
    .slice(0, 4);

  useEffect(() => {
    // Telegram Back Button
    showBackButton(() => {
      haptic.medium();
      navigate(-1);
    });

    return () => hideBackButton();
  }, [showBackButton, hideBackButton, haptic, navigate]);

  // Состояния загрузки и ошибок
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-tg-hint mt-4">Загружаем товар...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-tg-text mb-2">Товар не найден</h2>
        <p className="text-tg-hint mb-6">Возможно, товар был удален или перемещен</p>
        <Button onClick={() => navigate('/catalog')}>
          Перейти в каталог
        </Button>
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Хедер с действиями */}
      <div className="flex items-center justify-between -mt-2">
        <Button
          variant="ghost"
          onClick={() => {
            haptic.light();
            navigate(-1);
          }}
        >
          <ArrowLeft size={20} />
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              haptic.light();
              toggleFavorite(product.id);
            }}
          >
            <Heart 
              size={20} 
              className={isFavorite(product.id) ? 'text-red-500 fill-current' : ''}
            />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              haptic.light();
              shareProduct(product);
            }}
          >
            <Share size={20} />
          </Button>
        </div>
      </div>

      {/* Галерея изображений */}
      <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Основная информация */}
      <Card>
        <div className="space-y-4">
          {/* Заголовок и цена */}
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <div className="text-sm text-tg-hint uppercase tracking-wide mb-1">
                {product.brand}
              </div>
              <h1 className="text-xl font-bold text-tg-text leading-tight">
                {product.name}
              </h1>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-tg-button">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && (
                <div className="text-sm text-tg-hint line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>
          </div>

          {/* Рейтинг */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="font-medium">{product.rating}</span>
            </div>
            <span className="text-tg-hint text-sm">превосходное качество</span>
          </div>

          {/* Бейджи */}
          <div className="flex flex-wrap gap-2">
            {product.isNew && <Badge variant="info">Новинка</Badge>}
            {product.isPopular && <Badge variant="warning">Хит продаж</Badge>}
            {discount > 0 && <Badge variant="error">Скидка -{discount}%</Badge>}
            {product.inStock ? (
              <Badge variant="success">✓ В наличии</Badge>
            ) : (
              <Badge variant="error">Нет в наличии</Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Кнопка добавления в корзину */}
      <AddToCartButton product={product} />

      {/* Описание */}
      <Card>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          📋 Описание товара
        </h3>
        <div className="prose prose-sm max-w-none text-tg-text leading-relaxed">
          {product.description.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </Card>

      {/* Характеристики */}
      <Card>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          ⚙️ Характеристики
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-tg-hint">Бренд</span>
              <div className="font-medium">{product.brand}</div>
            </div>
            <div>
              <span className="text-tg-hint">Категория</span>
              <div className="font-medium">{product.category}</div>
            </div>
            <div>
              <span className="text-tg-hint">Рейтинг</span>
              <div className="font-medium">{product.rating}/5.0</div>
            </div>
            <div>
              <span className="text-tg-hint">Артикул</span>
              <div className="font-medium text-xs">#{product.id.slice(-6).toUpperCase()}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Гарантии и доставка */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <Shield size={24} className="mx-auto mb-2 text-green-500" />
          <div className="font-medium text-sm">Гарантия качества</div>
          <div className="text-xs text-tg-hint">Только оригинал</div>
        </Card>
        
        <Card className="text-center">
          <Truck size={24} className="mx-auto mb-2 text-blue-500" />
          <div className="font-medium text-sm">Быстрая доставка</div>
          <div className="text-xs text-tg-hint">От 300₽</div>
        </Card>
      </div>

      {/* Похожие товары */}
      {relatedProducts.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-lg">🔄 Похожие товары</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {relatedProducts.map(relatedProduct => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                onClick={() => {
                  haptic.light();
                  navigate(`/product/${relatedProduct.id}`);
                }}
                variant="grid"
              />
            ))}
          </div>
        </div>
      )}

      {/* Отступ для навигации */}
      <div className="h-4" />
    </div>
  );
};
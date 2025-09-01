import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Share } from 'lucide-react';
import { Button, Card, Badge } from '../shared/ui';
import { AddToCartButton } from '../features/add-to-cart';
import { useProduct } from '../entities/product';
import { useTelegram } from '../shared/telegram';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { haptic, showBackButton, hideBackButton } = useTelegram();
  
  const product = useProduct(id!);

  useEffect(() => {
    // Показываем кнопку "Назад" в Telegram
    showBackButton(() => {
      haptic.medium();
      navigate(-1);
    });

    return () => hideBackButton();
  }, [showBackButton, hideBackButton, haptic, navigate]);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-tg-text mb-2">Товар не найден</h2>
        <Button onClick={() => navigate('/catalog')}>
          Перейти в каталог
        </Button>
      </div>
    );
  }

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB', 
      maximumFractionDigits: 0
    }).format(price);

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Хедер с кнопками */}
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
          <Button variant="ghost" size="sm">
            <Heart size={20} />
          </Button>
          <Button variant="ghost" size="sm">
            <Share size={20} />
          </Button>
        </div>
      </div>

      {/* Изображение товара */}
      <div className="aspect-square rounded-xl overflow-hidden bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Основная информация */}
      <Card>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-1">{product.name}</h1>
            <div className="text-tg-hint">{product.brand}</div>
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
        <div className="flex items-center gap-1 mb-3">
          <Star size={16} className="text-yellow-400 fill-current" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-tg-hint text-sm">отличный товар</span>
        </div>

        {/* Бейджи */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.isNew && <Badge variant="info">Новинка</Badge>}
          {product.isPopular && <Badge variant="warning">Хит продаж</Badge>}
          {discount > 0 && <Badge variant="error">-{discount}%</Badge>}
          {product.inStock ? (
            <Badge variant="success">В наличии</Badge>
          ) : (
            <Badge variant="error">Нет в наличии</Badge>
          )}
        </div>

        {/* Кнопка добавления */}
        <AddToCartButton product={product} />
      </Card>

      {/* Описание */}
      <Card>
        <h3 className="font-semibold mb-3">Описание</h3>
        <p className="text-tg-text leading-relaxed">
          {product.description}
        </p>
      </Card>

      {/* Простые характеристики */}
      <Card>
        <h3 className="font-semibold mb-3">О товаре</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-tg-hint">Бренд:</span>
            <span>{product.brand}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-tg-hint">Категория:</span>
            <span>{product.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-tg-hint">Рейтинг:</span>
            <span>{product.rating}/5.0</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
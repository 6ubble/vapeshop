import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, Star } from 'lucide-react';

import { useTelegram } from '../../app/telegram';
import { Button, Card, Badge } from '../../shared/ui';
import { MOCK_PRODUCTS } from '../../shared/config';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { haptic, showMainButton, hideMainButton } = useTelegram();

  // Мокап поиска товара
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];

  React.useEffect(() => {
    showMainButton(`В корзину • ${formatPrice(product.price)}`, () => {
      haptic.heavy();
      console.log('Add to cart:', product.id);
    });

    return () => hideMainButton();
  }, [product, showMainButton, hideMainButton, haptic]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-4 -mt-6">
      {/* Хедер */}
      <div className="flex items-center justify-between p-4 -mx-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            haptic.light();
            navigate(-1);
          }}
          className="p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Heart size={20} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Share size={20} />
          </Button>
        </div>
      </div>

      {/* Изображение */}
      <div className="aspect-square rounded-xl overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Основная информация */}
      <Card>
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold leading-tight mb-1">
                {product.name}
              </h1>
              <div className="text-tg-hint">{product.brand}</div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-tg-button">
                {formatPrice(product.price)}
              </div>
              {('originalPrice' in product) && product.originalPrice && (
                <div className="text-sm text-tg-hint line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-tg-hint">({product.reviewsCount} отзывов)</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.isNew && <Badge variant="info" className="">Новинка</Badge>}
                          {product.isPopular && <Badge variant="warning" className="">Хит</Badge>}
                        {product.tags.map((tag: string) => (
              <Badge key={tag} className="">{tag}</Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Описание */}
      <Card>
        <h3 className="font-semibold mb-2">Описание</h3>
        <p className="text-tg-text leading-relaxed">
          {product.description}
        </p>
      </Card>

      {/* Характеристики */}
      <Card>
        <h3 className="font-semibold mb-3">Характеристики</h3>
        <div className="space-y-2">
          {product.specifications.map((spec: { name: string; value: string }, index: number) => (
            <div key={index} className="flex justify-between">
              <span className="text-tg-hint">{spec.name}:</span>
              <span className="font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
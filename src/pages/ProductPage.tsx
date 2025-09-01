import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Share } from 'lucide-react'
import { Button, Card, Badge, LoadingSpinner } from '../shared/ui'
import { AddToCartButton } from '../features/add-to-cart/ui'
import { ProductCard } from '../widgets/product-card/ui'
import { useProduct, useProducts } from '../entities/product/api'
import { useTelegram } from '../shared/lib/telegram.tsx'
import { formatPrice } from '../shared/lib/utils'

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { haptic, showBackButton, hideBackButton } = useTelegram()
  
  const { data: product, isLoading, error } = useProduct(id!)
  const { data: allProducts = [] } = useProducts()

  const relatedProducts = allProducts
    .filter(p => p.id !== id && p.category === product?.category)
    .slice(0, 4)

  useEffect(() => {
    showBackButton(() => {
      haptic.medium()
      navigate(-1)
    })

    return () => hideBackButton()
  }, [showBackButton, hideBackButton, haptic, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-tg-hint mt-4">Загружаем товар...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-2">Товар не найден</h2>
        <p className="text-tg-hint mb-6">Возможно, товар был удален</p>
        <Button onClick={() => navigate('/catalog')}>
          Перейти в каталог
        </Button>
      </div>
    )
  }

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            haptic.light()
            navigate(-1)
          }}
        >
          <ArrowLeft size={20} />
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => {
            haptic.light()
            // Share functionality
          }}
        >
          <Share size={20} />
        </Button>
      </div>

      <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <div className="text-sm text-tg-hint uppercase mb-1">
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

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="font-medium">{product.rating}</span>
            </div>
            <span className="text-tg-hint text-sm">превосходное качество</span>
          </div>

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

      <AddToCartButton product={product} />

      <Card>
        <h3 className="font-semibold mb-3">Описание товара</h3>
        <div className="prose prose-sm max-w-none text-tg-text">
          {product.description.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </Card>

      {relatedProducts.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-lg">Похожие товары</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {relatedProducts.map(relatedProduct => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                onClick={() => {
                  haptic.light()
                  navigate(`/product/${relatedProduct.id}`)
                }}
                variant="grid"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductPage
import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Share } from 'lucide-react'
import { Button, Card, LoadingSpinner } from '../../shared/ui'
import { AddToCartButton } from '../../features/add_cart/AddCart'
import { useProduct } from '../../shared/api'
import { useTelegram } from '../../shared/lib/Telegram'

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { haptic, showBackButton, hideBackButton } = useTelegram()
  
  const { data: product, isLoading, error } = useProduct(id!)

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
          <p className="text-gray-500 mt-4">Загружаем товар...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-2">Товар не найден</h2>
        <p className="text-gray-500 mb-6">Возможно, товар был удален</p>
        <Button onClick={() => navigate('/catalog')}>
          Перейти в каталог
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
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
            // TODO: Share functionality
          }}
        >
          <Share size={20} />
        </Button>
      </div>

      <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-lg max-w-lg mx-auto">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <Card>
        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight mb-2">
            {product.name}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {product.description}
          </p>
        </div>
      </Card>

      <AddToCartButton product={product} />
    </div>
  )
}
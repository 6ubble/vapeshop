import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductSearch } from '../../features/search/Search'
import { ProductFilters } from '../../features/filters/Filters'
import { ProductCard } from '../../widgets/ProductCard'
import { EmptyState } from '../../shared/ui'
import { useProducts } from '../../shared/api'
import { useFiltersStore } from '../../shared/lib/stores'
import { useTelegram } from '../../shared/lib/Telegram'
import { filterProducts, sortProducts } from '../../shared/lib/utils'

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate()
  const { haptic } = useTelegram()
  
  const { data: products = [], isLoading } = useProducts()
  const { selectedCategory, searchQuery, sortBy } = useFiltersStore()

  const displayProducts = useMemo(() => {
    const filtered = filterProducts(products, selectedCategory, searchQuery)
    return sortProducts(filtered, sortBy)
  }, [products, selectedCategory, searchQuery, sortBy])

  const handleProductClick = (productId: string) => {
    haptic.light()
    navigate(`/product/${productId}`)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-100 rounded-lg" />
        <div className="h-8 bg-gray-100 rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ProductSearch placeholder="Поиск товаров..." />

      {!searchQuery && <ProductFilters />}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product.id)}
          />
        ))}
      </div>

      {displayProducts.length === 0 && (
        <EmptyState 
          title={searchQuery ? "Ничего не найдено" : "Товары скоро появятся"}
          description={searchQuery 
            ? "Попробуйте изменить поисковый запрос" 
            : "Следите за обновлениями каталога"
          }
          icon={<div className="text-4xl">{searchQuery ? '🔍' : '📦'}</div>}
          action={searchQuery ? {
            label: 'Очистить поиск',
            onClick: () => useFiltersStore.getState().setSearch('')
          } : undefined}
        />
      )}
    </div>
  )
}
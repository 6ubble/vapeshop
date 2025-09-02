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

  // Мемоизируем фильтрацию и сортировку
  const displayProducts = useMemo(() => {
    const filtered = filterProducts(products, selectedCategory, searchQuery)
    return sortProducts(filtered, sortBy)
  }, [products, selectedCategory, searchQuery, sortBy])

  const handleProductClick = (productId: string) => {
    haptic.light()
    navigate(`/product/${productId}`)
  }

  const isSearching = searchQuery.length > 0

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ProductSearch placeholder="Поиск товаров..." />

      {!isSearching && <ProductFilters />}

      <div className="grid grid-cols-2 gap-3">
        {displayProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product.id)}
            variant="grid"
          />
        ))}
      </div>

      {displayProducts.length === 0 && (
        <EmptyState 
          title={isSearching ? "Ничего не найдено" : "Товары скоро появятся"}
          description={isSearching 
            ? "Попробуйте изменить поисковый запрос" 
            : "Следите за обновлениями каталога"
          }
          icon={<div className="text-4xl">{isSearching ? '🔍' : '📦'}</div>}
          action={isSearching ? {
            label: 'Очистить поиск',
            onClick: () => useFiltersStore.getState().setSearch('')
          } : undefined}
        />
      )}
    </div>
  )
}
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductSearch } from '../features/product-search/ui'
import { ProductCard } from '../widgets/product-card/ui'
import { EmptyState } from '../shared/ui'
import { useProducts } from '../entities/product/api'
import { useProductFilters, CATEGORIES } from '../entities/product/model'
import { useTelegram } from '../shared/lib/telegram.tsx'
import type { Product } from '../shared/types'
import { useCallback } from 'react'

const CatalogPage: React.FC = () => {
  const navigate = useNavigate()
  const { haptic } = useTelegram()
  
  const { data: products = [], isLoading } = useProducts()
  const { selectedCategory, setCategory } = useProductFilters()
  
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const getFilteredProducts = (): Product[] => {
    if (isSearching) return searchResults

    if (selectedCategory === 'all') return products
    return products.filter(p => p.category === selectedCategory)
  }

  const displayProducts = getFilteredProducts()

  const handleSearchResults = useCallback((results: Product[], searching: boolean) => {
    setSearchResults(prev => {
      const sameResults = prev.length === results.length && prev.every((p, i) => p.id === results[i]?.id);
      return sameResults ? prev : results;
    });

    setIsSearching(prev => prev === searching ? prev : searching);
  }, []);


  const handleProductClick = (product: Product) => {
    haptic.light()
    navigate(`/product/${product.id}`)
  }

  return (
    <div className="space-y-4">
      <ProductSearch 
        onResults={handleSearchResults}
        placeholder="Поиск товаров..."
      />

      {!isSearching && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => {
                haptic.light()
                setCategory(category.id)
              }}
              className={`
                px-4 py-2 rounded-full whitespace-nowrap transition-colors
                ${selectedCategory === category.id
                  ? 'bg-tg-button text-tg-button-text'
                  : 'bg-tg-secondary-bg text-tg-text hover:bg-gray-200'
                }
              `}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {displayProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
              variant="grid"
            />
          ))}
        </div>
      )}

      {!isLoading && displayProducts.length === 0 && (
        <EmptyState 
          title={isSearching ? "Ничего не найдено" : "Товары скоро появятся"}
          description={isSearching 
            ? "Попробуйте изменить поисковый запрос" 
            : "Следите за обновлениями каталога"
          }
          icon={<div className="text-4xl">{isSearching ? '🔍' : '📦'}</div>}
          action={isSearching ? {
            label: 'Очистить поиск',
            onClick: () => setIsSearching(false)
          } : undefined}
        />
      )}
    </div>
  )
}

export default CatalogPage
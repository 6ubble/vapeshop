import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../../shared/ui'
import { useProductSearch } from '../../entities/product/api'

import type { Product } from '../../shared/types'

interface ProductSearchProps {
  onResults: (products: Product[], isSearching: boolean) => void
  placeholder?: string
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onResults,
  placeholder = 'Поиск товаров...'
}) => {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounced query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const { 
    data: searchResults = [], 
    isLoading 
  } = useProductSearch(debouncedQuery)

  // Передаем результаты родителю
  useEffect(() => {
    const isSearching = debouncedQuery.length > 0
    onResults(searchResults, isSearching)
  }, [searchResults, debouncedQuery, onResults])

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={setQuery}
        placeholder={placeholder}
        icon={<Search size={20} />}
      />
      
      {query && (
        <button
          onClick={() => {
            setQuery('')
            setDebouncedQuery('')
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-tg-hint hover:text-tg-text transition-colors"
        >
          <X size={16} />
        </button>
      )}

      {isLoading && debouncedQuery && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-tg-button border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../../shared/ui'
import { useFiltersStore } from '../../shared/lib/stores'

interface ProductSearchProps {
  placeholder?: string
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  placeholder = 'Поиск товаров...'
}) => {
  const { searchQuery, setSearch } = useFiltersStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  
  // Debounced search - обновляем глобальное состояние с задержкой
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(localQuery)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [localQuery, setSearch])

  const handleClear = () => {
    setLocalQuery('')
    setSearch('')
  }

  return (
    <div className="relative">
      <Input
        value={localQuery}
        onChange={setLocalQuery}
        placeholder={placeholder}
        icon={<Search size={20} />}
      />
      
      {localQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-tg-hint hover:text-tg-text transition-colors"
        >
          <X size={16} />
        </button>
      )}

      {searchQuery !== localQuery && localQuery && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-tg-button border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  )
}
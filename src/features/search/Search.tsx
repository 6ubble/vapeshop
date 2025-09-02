import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input, Card } from '../../shared/ui'
import { useFiltersStore } from '../../shared/lib/stores'

interface ProductSearchProps {
  placeholder?: string
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  placeholder = 'Поиск товаров...'
}) => {
  const { searchQuery, setSearch } = useFiltersStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  
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
    <Card className="p-0">
      <div className="relative">
        <Input
          value={localQuery}
          onChange={setLocalQuery}
          placeholder={placeholder}
          icon={<Search size={20} />}
          className="border-0 bg-transparent"
        />
        
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </Card>
  )
}
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../shared/Ui';
import { useProductSearch } from '../entities/Product';
import { debounce } from '../shared/utils';
import type { Product } from '../shared/types';

interface SearchProps {
  onResults: (products: Product[], isSearching: boolean) => void;
  placeholder?: string;
}

// Поиск с React Query кешированием
export const ProductSearch: React.FC<SearchProps> = ({
  onResults,
  placeholder = 'Поиск товаров...'
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounced query для оптимизации API запросов
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // React Query хук с кешированием
  const { 
    data: searchResults = [], 
    isLoading,
    error 
  } = useProductSearch(debouncedQuery);

  // Передаем результаты родителю
  useEffect(() => {
    const isSearching = debouncedQuery.length > 0;
    onResults(searchResults, isSearching);
  }, [searchResults, debouncedQuery, onResults]);

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={setQuery}
        placeholder={placeholder}
        icon={<Search size={20} />}
      />
      
      {/* Кнопка очистки */}
      {query && (
        <button
          onClick={() => {
            setQuery('');
            setDebouncedQuery('');
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-tg-hint hover:text-tg-text transition-colors"
        >
          <X size={16} />
        </button>
      )}

      {/* Индикатор загрузки */}
      {isLoading && debouncedQuery && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-tg-button border-t-transparent rounded-full" />
        </div>
      )}

      {/* Ошибка поиска */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm z-10">
          Ошибка поиска. Попробуйте еще раз.
        </div>
      )}
    </div>
  );
};
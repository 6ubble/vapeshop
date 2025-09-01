import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useProductSearch } from '../../../entities/product/api';
import { useDebounce } from '../../../shared/lib/hooks';

interface SearchInputProps {
  onResultsChange: (products: Product[]) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onResultsChange,
  placeholder = 'Поиск товаров...'
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  const { data: searchResults = [], isLoading } = useProductSearch(debouncedQuery);

  React.useEffect(() => {
    onResultsChange(searchResults);
  }, [searchResults, onResultsChange]);

  return (
    <div className="relative">
      <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tg-hint" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-tg-secondary-bg rounded-lg border-none focus:ring-2 focus:ring-tg-button"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tg-hint p-1"
        >
          <X size={16} />
        </button>
      )}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-tg-button border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};
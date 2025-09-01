import React, { useState, useMemo } from 'react';
import { useProducts } from '../../../entities/product/api';
import { SearchInput } from '../../../features/product-search';
import { ProductCard } from '../../../widgets/product-card';
import { LoadingGrid, EmptyState } from '../../../shared/ui';

const CATEGORIES = [
  { id: 'all', name: 'Все', emoji: '🛍️' },
  { id: 'pod-systems', name: 'Pod-системы', emoji: '🔋' },
  { id: 'disposable', name: 'Одноразовые', emoji: '💨' },
  { id: 'liquids', name: 'Жидкости', emoji: '🧪' }
];

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: products = [], isLoading, error } = useProducts();
  
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isSearching, setIsSearching] = useState(false);

  // Фильтрация товаров
  const displayProducts = useMemo(() => {
    if (isSearching && searchResults.length >= 0) {
      return searchResults;
    }
    
    if (selectedCategory === 'all') {
      return products;
    }
    
    return products.filter(product => product.category === selectedCategory);
  }, [products, searchResults, selectedCategory, isSearching]);

  const handleSearchResults = (results: Product[]) => {
    setSearchResults(results);
    setIsSearching(true);
  };

  if (isLoading) return <LoadingGrid />;
  if (error) return <EmptyState title="Ошибка загрузки" />;

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <SearchInput 
        onResultsChange={handleSearchResults}
        placeholder="Поиск товаров..."
      />

      {/* Категории */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setIsSearching(false);
            }}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category.id && !isSearching
                ? 'bg-tg-button text-tg-button-text'
                : 'bg-tg-secondary-bg text-tg-text'
            }`}
          >
            {category.emoji} {category.name}
          </button>
        ))}
      </div>

      {/* Товары */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-2 gap-3' 
          : 'space-y-3'
      }>
        {displayProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            variant={viewMode}
            onClick={() => navigate(`/product/${product.id}`)}
          />
        ))}
      </div>

      {displayProducts.length === 0 && (
        <EmptyState 
          title="Товары не найдены"
          description="Попробуйте изменить запрос или категорию"
        />
      )}
    </div>
  );
};
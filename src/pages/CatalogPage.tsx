import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Filter, SortAsc } from 'lucide-react';
import { ProductSearch } from '../features/Search';
import { ProductCard, ProductCardSkeleton } from '../widgets/ProductCard';
import { EmptyState, BottomSheet, Button, Badge } from '../shared/Ui';
import { useProducts, CATEGORIES } from '../entities/product';
import { useTelegram } from '../shared/Telegram';
import type { Product } from '../shared/types';

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { haptic } = useTelegram();
  
  const { data: products = [], isLoading } = useProducts();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Фильтры из URL
  const categoryParam = searchParams.get('category') || 'all';
  const filterParam = searchParams.get('filter') || '';
  const sortParam = searchParams.get('sort') || 'popular';
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedFilter, setSelectedFilter] = useState(filterParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);

  // Фильтрация и сортировка
  const getFilteredProducts = (): Product[] => {
    if (isSearching) return searchResults;
    
    let filtered = products;
    
    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Дополнительные фильтры
    switch (selectedFilter) {
      case 'popular':
        filtered = filtered.filter(p => p.isPopular);
        break;
      case 'new':
        filtered = filtered.filter(p => p.isNew);
        break;
      case 'sale':
        filtered = filtered.filter(p => p.originalPrice);
        break;
      case 'inStock':
        filtered = filtered.filter(p => p.inStock);
        break;
    }
    
    // Сортировка
    switch (selectedSort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // popular
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }
    
    return filtered;
  };

  const displayProducts = getFilteredProducts();

  // Обработчики
  const handleSearchResults = (results: Product[], searching: boolean) => {
    setSearchResults(results);
    setIsSearching(searching);
  };

  const handleCategoryChange = (categoryId: string) => {
    haptic.light();
    setSelectedCategory(categoryId);
    setIsSearching(false);
    updateURL({ category: categoryId });
  };

  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === 'all' || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    setSearchParams(newParams);
  };

  const handleProductClick = (product: Product) => {
    haptic.light();
    navigate(`/product/${product.id}`);
  };

  const filterOptions = [
    { id: '', label: 'Все товары', count: products.length },
    { id: 'popular', label: 'Популярные', count: products.filter(p => p.isPopular).length },
    { id: 'new', label: 'Новинки', count: products.filter(p => p.isNew).length },
    { id: 'sale', label: 'Скидки', count: products.filter(p => p.originalPrice).length },
    { id: 'inStock', label: 'В наличии', count: products.filter(p => p.inStock).length }
  ];

  const sortOptions = [
    { id: 'popular', label: 'По популярности' },
    { id: 'price_asc', label: 'Сначала дешевые' },
    { id: 'price_desc', label: 'Сначала дорогие' },
    { id: 'rating', label: 'По рейтингу' },
    { id: 'name', label: 'По алфавиту' }
  ];

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <ProductSearch 
        onResults={handleSearchResults}
        placeholder="Поиск товаров..."
      />

      {/* Фильтры и сортировка */}
      {!isSearching && (
        <div className="flex gap-2">
          {/* Категории */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-2 pb-2 scrollbar-hide">
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`
                    px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200
                    ${selectedCategory === category.id
                      ? 'bg-tg-button text-tg-button-text shadow-md'
                      : 'bg-tg-secondary-bg text-tg-text hover:bg-gray-200'
                    }
                  `}
                >
                  {category.emoji} {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Кнопка фильтров */}
          <button
            onClick={() => {
              haptic.light();
              setShowFilters(true);
            }}
            className="p-2 bg-tg-secondary-bg rounded-lg hover:bg-gray-200 transition-colors relative"
          >
            <Filter size={20} />
            {(selectedFilter || selectedSort !== 'popular') && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}
          </button>
        </div>
      )}

      {/* Результаты поиска или каталог */}
      <div className="space-y-3">
        {/* Заголовок результатов */}
        {!isSearching && selectedFilter && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-tg-hint">
              {displayProducts.length} товаров найдено
            </span>
            
            <button
              onClick={() => {
                setSelectedFilter('');
                updateURL({ filter: '' });
              }}
              className="text-sm text-tg-button hover:underline"
            >
              Сбросить
            </button>
          </div>
        )}

        {/* Сетка товаров */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <ProductCardSkeleton key={i} variant="grid" />
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
      </div>

      {/* Пустое состояние */}
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

      {/* Bottom Sheet для фильтров */}
      <BottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Фильтры и сортировка"
      >
        <div className="space-y-6">
          {/* Фильтры */}
          <div>
            <h3 className="font-semibold mb-3">Фильтры</h3>
            <div className="space-y-2">
              {filterOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => {
                    haptic.light();
                    setSelectedFilter(option.id);
                    updateURL({ filter: option.id });
                  }}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg transition-colors
                    ${selectedFilter === option.id
                      ? 'bg-tg-button text-tg-button-text'
                      : 'bg-tg-secondary-bg text-tg-text hover:bg-gray-200'
                    }
                  `}
                >
                  <span>{option.label}</span>
                  <Badge variant="default">{option.count}</Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Сортировка */}
          <div>
            <h3 className="font-semibold mb-3">Сортировка</h3>
            <div className="space-y-2">
              {sortOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => {
                    haptic.light();
                    setSelectedSort(option.id);
                    updateURL({ sort: option.id });
                  }}
                  className={`
                    w-full flex items-center p-3 rounded-lg transition-colors
                    ${selectedSort === option.id
                      ? 'bg-tg-button text-tg-button-text'
                      : 'bg-tg-secondary-bg text-tg-text hover:bg-gray-200'
                    }
                  `}
                >
                  <SortAsc size={16} className="mr-2" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Применить */}
          <Button
            onClick={() => setShowFilters(false)}
            fullWidth
          >
            Применить фильтры
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
};
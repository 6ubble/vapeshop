import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';

import { useTelegram } from '../../app/telegram/TelegramProvider';
import { Input, Button, Card, SectionHeader, Badge } from '../../shared/ui';
import { ProductCard } from '../../widgets/product-card/ProductCard';
import { PRODUCT_CATEGORIES, MOCK_PRODUCTS, SORT_OPTIONS } from '../../shared/config';
import type { ProductFilters } from '../../shared/types';

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { haptic } = useTelegram();

  // Состояния
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    search: searchParams.get('search') || '',
    sortBy: 'popularity'
  });

  // Мокап отфильтрованных товаров
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    return true;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, search: query }));
    haptic.light();
  };

  const handleProductClick = (productId: string) => {
    haptic.light();
    navigate(`/product/${productId}`);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setFilters(prev => ({ 
      ...prev, 
      category: prev.category === categoryId ? undefined : categoryId as any 
    }));
    haptic.light();
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
    haptic.light();
  };

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <Card padding="md">
        <Input
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Поиск товаров..."
          icon={<Search size={20} />}
        />
      </Card>

      {/* Фильтры и сортировка */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex-1"
        >
          <SlidersHorizontal size={16} />
          Фильтры
          {(filters.category) && (
            <Badge variant="info" size="sm">1</Badge>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleViewMode}
          className="px-3"
        >
          {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
        </Button>
      </div>

      {/* Развернутые фильтры */}
      {showFilters && (
        <Card>
          <SectionHeader>Категории</SectionHeader>
          <div className="grid grid-cols-2 gap-2">
            {PRODUCT_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={filters.category === category.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleCategoryFilter(category.id)}
                className="text-sm"
              >
                {category.emoji} {category.name}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Результаты поиска */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-tg-hint">
          Найдено товаров: {filteredProducts.length}
        </span>
        
        <select 
          value={filters.sortBy || 'popularity'}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
          className="text-sm bg-tg-secondary-bg border-none rounded px-3 py-1"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Список товаров */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product.id)}
            variant={viewMode === 'grid' ? 'vertical' : 'horizontal'}
          />
        ))}
      </div>

      {/* Пустое состояние */}
      {filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">Товары не найдены</h3>
          <p className="text-tg-hint mb-4">
            Попробуйте изменить параметры поиска
          </p>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setFilters({ sortBy: 'popularity' });
            }}
          >
            Сбросить фильтры
          </Button>
        </Card>
      )}
    </div>
  );
};
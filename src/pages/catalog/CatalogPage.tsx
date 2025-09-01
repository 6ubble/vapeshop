import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ProductSearch } from '../features/search';
import { ProductCard } from '../widgets/product-card';
import { EmptyState } from '../shared/ui';
import { useProducts, CATEGORIES } from '../entities/product';
import { useTelegram } from '../shared/telegram';
import type { Product } from '../shared/types';

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { haptic } = useTelegram();
  
  const { getAll, getByCategory } = useProducts();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Фильтр из URL
  const categoryParam = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  // Логика отображения товаров
  const displayProducts = isSearching 
    ? searchResults 
    : getByCategory(selectedCategory);

  const handleSearchResults = (results: Product[]) => {
    setSearchResults(results);
    setIsSearching(results.length > 0 || true); // Показываем поиск даже если пусто
  };

  const handleCategoryChange = (categoryId: string) => {
    haptic.light();
    setSelectedCategory(categoryId);
    setIsSearching(false);
    
    // Обновляем URL без перезагрузки
    const newParams = new URLSearchParams(searchParams);
    if (categoryId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', categoryId);
    }
    
    const newUrl = newParams.toString() ? `?${newParams.toString()}` : '';
    window.history.replaceState({}, '', `/catalog${newUrl}`);
  };

  const handleProductClick = (product: Product) => {
    haptic.light();
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <ProductSearch onResults={handleSearchResults} />

      {/* Категории - только если не ищем */}
      {!isSearching && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`
                px-4 py-2 rounded-full whitespace-nowrap transition-colors
                ${selectedCategory === category.id
                  ? 'bg-tg-button text-tg-button-text'
                  : 'bg-tg-secondary-bg text-tg-text'
                }
              `}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Результаты */}
      <div className="space-y-3">
        {displayProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product)}
            variant="list"
          />
        ))}
      </div>

      {/* Пустое состояние */}
      {displayProducts.length === 0 && (
        <EmptyState 
          title={isSearching ? "Ничего не найдено" : "Товары скоро появятся"}
          description={isSearching ? "Попробуйте изменить запрос" : "Следите за обновлениями"}
          icon={<div className="text-4xl">🔍</div>}
        />
      )}
    </div>
  );
};
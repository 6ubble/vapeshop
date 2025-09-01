import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { LoadingScreen } from '../../shared/ui';
import { AppLayout } from '../../widgets/layout/AppLayout';

// Lazy loading страниц для оптимизации
const HomePage = React.lazy(() => import('../../pages/home/HomePage').then(m => ({ default: m.HomePage })));
const CatalogPage = React.lazy(() => import('../../pages/catalog/CatalogPage').then(m => ({ default: m.CatalogPage })));
const ProductPage = React.lazy(() => import('../../pages/product/ProductPage').then(m => ({ default: m.ProductPage })));
const CartPage = React.lazy(() => import('../../pages/cart/CartPage').then(m => ({ default: m.CartPage })));
const ProfilePage = React.lazy(() => import('../../pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));

// Компонент для поиска (можно сделать отдельной страницей или модалом)
const SearchPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Поиск</h1>
      <p className="text-tg-hint">Страница поиска в разработке...</p>
    </div>
  );
};

// Страница 404
const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h1 className="text-4xl font-bold text-tg-hint mb-4">404</h1>
      <p className="text-tg-text mb-4">Страница не найдена</p>
      <button 
        onClick={() => window.history.back()}
        className="btn-tg"
      >
        Вернуться назад
      </button>
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <AppLayout>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<HomePage />} />
          
          {/* Каталог */}
          <Route path="/catalog" element={<CatalogPage />} />
          
          {/* Товар */}
          <Route path="/product/:id" element={<ProductPage />} />
          
          {/* Поиск */}
          <Route path="/search" element={<SearchPage />} />
          
          {/* Корзина */}
          <Route path="/cart" element={<CartPage />} />
          
          {/* Профиль */}
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* 404 */}
          <Route path="/404" element={<NotFoundPage />} />
          
          {/* Перенаправление всех неизвестных путей на 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
};
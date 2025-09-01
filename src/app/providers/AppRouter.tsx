import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { HomePage } from '../../pages/home/HomePage';
import { CatalogPage } from '../../pages/catalog/CatalogPage';
import { ProductPage } from '../../pages/product/ProductPage';
import { CartPage } from '../../pages/cart/CartPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';
import { AppLayout } from '../../widgets/layout/AppLayout';

export const AppRouter: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/search" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </AppLayout>
  );
};
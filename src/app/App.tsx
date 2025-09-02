import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '../widgets/Layout'

// Прямые импорты для лучшей производительности
import { HomePage } from '../pages/home/HomePage'
import { CatalogPage } from '../pages/catalog/CatalogPage'
import { ProductPage } from '../pages/product/ProductPage'
import { CartPage } from '../pages/cart/CartPage'
import { ProfilePage } from '../pages/profile/ProfilePage'

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
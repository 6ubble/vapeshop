import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '../widgets/layout/ui'
import { LoadingSpinner } from '../shared/ui/index'

// Lazy imports
const HomePage = React.lazy(() => import('../pages/HomePage'))
const CatalogPage = React.lazy(() => import('../pages/CatalogPage'))
const ProductPage = React.lazy(() => import('../pages/ProductPage'))
const CartPage = React.lazy(() => import('../pages/CartPage'))
const ProfilePage = React.lazy(() => import('../pages/ProfilePage'))

const PageLoader = () => (
  <div className="flex items-center justify-center py-20">
    <LoadingSpinner size="lg" />
  </div>
)

const App: React.FC = () => {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App

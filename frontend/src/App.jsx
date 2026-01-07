import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './Layout';

import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';

import { lazy, Suspense, useEffect } from 'react';
import { useAuthStore } from './store/auth';
import ProductsPage from './pages/ProductPage';

const HomePage = lazy(() => import('./pages/HomePage'));
const CreatePage = lazy(() => import('./pages/CreatePage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const EditProductPage = lazy(() => import('./pages/EditProductPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Shared layout (navbar/footer inside Layout) */}
        <Route element={<Layout />}>
          {/* Guest-only routes */}
          <Route
            path='/login'
            element={
              <GuestRoute>
                <AuthPage />
              </GuestRoute>
            }
          />
          <Route
            path='/register'
            element={
              <GuestRoute>
                <AuthPage />
              </GuestRoute>
            }
          />
          <Route path='/' element={<HomePage />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/products' element={<ProductsPage />} />

          {/* Protected: logged-in users only */}
          <Route
            path='/cart'
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path='/create'
            element={
              <AdminRoute>
                <CreatePage key='create' isEditMode={false} />
              </AdminRoute>
            }
          />

          <Route
            path='/edit/:id'
            element={
              <AdminRoute>
                <EditProductPage key='edit' isEditMode={true} />
              </AdminRoute>
            }
          />
        </Route>

        {/* Catch-all → send back home */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;

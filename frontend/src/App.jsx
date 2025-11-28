import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import CartPage from './pages/CartPage';
import ProductDetails from './pages/ProductDetails';
import EditProductPage from './pages/EditProductPage';
import { AuthPage } from './pages/AuthPage';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import ScrollToTop from './ScrollToTop';

function App() {
  return (
    <Routes>
      {/* Auth routes (no navbar/footer) */}
      <Route path='/login' element={<AuthPage />} />
      <Route path='/register' element={<AuthPage />} />

      {/* Layout routes (with navbar + footer) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path='/' element={<HomePage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        {/* ADMIN ONLY ROUTES */}
        <Route
          path='/create'
          element={
            <AdminRoute>
              <CreatePage />
            </AdminRoute>
          }
        />

        <Route
          path='/edit/:id'
          element={
            <AdminRoute>
              <EditProductPage />
            </AdminRoute>
          }
        />
      </Route>

      {/* Catch-all redirect */}
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  );
}

export default App;

import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import CartPage from './pages/CartPage'
import ProductDetails from './pages/ProductDetails'
import EditProductPage from './pages/EditProductPage'
import { AuthPage } from './pages/AuthPage'

function App() {
  return (
    <Routes>
      {/* Auth routes (no navbar/footer) */}
      <Route path='/login' element={<AuthPage />} />
      <Route path='/register' element={<AuthPage />} />

      {/* Layout routes (with navbar + footer) */}
      <Route element={<Layout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/create' element={<CreatePage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/edit/:id' element={<EditProductPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  )
}

export default App

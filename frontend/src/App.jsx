import { Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import Navbar from './components/navbar'
import CartPage from './pages/CartPage'
import ProductDetails from './pages/ProductDetails'
import EditProductPage from './pages/EditProductPage'
import './index.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/create' element={<CreatePage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/edit/:id' element={<EditProductPage />} />
      </Routes>
    </>
  )
}

export default App

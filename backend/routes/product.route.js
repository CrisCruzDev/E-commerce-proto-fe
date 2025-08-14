import express from 'express'

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  getProduct,
} from '../controller/product.controller.js'

import {
  addToCart,
  getCart,
  updateQty,
  removeFromCart,
  getCartById,
} from '../controller/cart.controller.js'

const router = express.Router()

export default router

router.get('/', getProducts)
router.get('/get/:productId', getProduct)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.get('/cart', getCart)
router.post('/cart/:id', addToCart)
router.put('/cart/update/:product_id', updateQty)
router.delete('/cart/remove/:product_id', removeFromCart)

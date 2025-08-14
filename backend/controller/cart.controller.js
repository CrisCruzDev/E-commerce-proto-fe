import mongoose from 'mongoose'
import Product from '../models/product.model.js'
import Cart from '../models/cart.model.js'

export const getCart = async (req, res) => {
  try {
    const items = await Cart.find({}).populate({
      path: 'items.product',
      select: 'name price image',
    })

    console.log('getCart: ', items)

    if (!items || items.length === 0) {
      return res.status(200).json({ success: true, data: { items: [] } })
    }

    const cart = items[0]
    const filteredItems = cart.items.filter((item) => item.product !== null)

    if (filteredItems.length !== cart.items.length) {
      cart.items = filteredItems
      await cart.save()
    }

    res.status(200).json({ success: true, data: cart })
  } catch (error) {
    console.error('Error in fetching cart:', error.message)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const getCartById = async (req, res) => {
  try {
    const { id: cartId } = req.params
    const cart = await Cart.findById(cartId).populate('items.product')
    console.log('getCartById: ', cart)

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' })
    }

    const filteredItems = cart.items.filter((item) => item.product !== null)
    if (filteredItems.length !== cart.items.length) {
      cart.items = filteredItems
      await cart.save()
    }

    res.status(200).json({ success: true, data: cart })
  } catch (error) {
    console.error('Error in fetching cart by ID:', error.message)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const addToCart = async (req, res) => {
  try {
    const { id: product_id } = req.params
    const { qty: quantity } = req.body

    if (!mongoose.Types.ObjectId.isValid(product_id)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    const product = await Product.findById(product_id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const userId = 'test-user-1'
    let cart = await Cart.findOne({ userId })
    if (!cart) {
      cart = new Cart({ userId, items: [] })
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      product_id,
      { $inc: { stock: -quantity } },
      { new: true, runValidators: true },
    )

    // Check if the stock update was successful and didn't go negative
    if (!updatedProduct || updatedProduct.stock < 0) {
      // Revert the stock change if the update failed
      if (updatedProduct) {
        await Product.findByIdAndUpdate(product_id, {
          $inc: { stock: quantity },
        })
      }
      return res.status(400).json({ message: 'Not enough stock available' })
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === product_id,
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ product: product_id, quantity })
    }

    await cart.save()

    res
      .status(200)
      .json({ message: 'Item added to cart', data: updatedProduct })
  } catch (error) {
    console.error('Error in adding to cart:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const updateQty = async (req, res) => {
  try {
    const { product_id } = req.params
    const { action } = req.body
    const userId = 'test-user-1'

    const cart = await Cart.findOne({ userId })
    const product = await Product.findById(product_id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === product_id,
    )

    if (!item) {
      return res.status(404).json({ message: 'Product not in cart' })
    }

    if (action === 'increment') {
      const updatedProduct = await Product.findByIdAndUpdate(
        product_id,
        { $inc: { stock: -1 } },
        { new: true, runValidators: true },
      )
      if (!updatedProduct || updatedProduct.stock < 0) {
        // If stock is now negative, revert the cart change and return an error
        await Product.findByIdAndUpdate(product_id, { $inc: { stock: 1 } })
        return res
          .status(400)
          .json({ message: 'Cannot increment, out of stock' })
      }
      item.quantity += 1
      console.log('increment-updatedStock: ', product.stock)
      console.log('increment-quantity: ', item.quantity)
    } else if (action === 'decrement') {
      // Prevents decrementing below 1, forcing user to use remove button
      if (item.quantity === 1) {
        return res.status(400).json({
          message:
            'Cannot decrement below 1. Please remove the item from cart.',
        })
      }
      // Find the product and atomically increment its stock
      await Product.findByIdAndUpdate(
        product_id,
        { $inc: { stock: 1 } },
        { new: true, runValidators: true },
      )
      item.quantity -= 1
      console.log('decrement-updatedStock: ', product.stock)
      console.log('decrement-quantity: ', item.quantity)
    } else {
      return res.status(400).json({ message: 'Invalid action type' })
    }

    await cart.save()

    const updatedCart = await Cart.findOne({ userId }).populate('items.product')

    res.status(200).json({
      message: 'Quantity updated',
      data: updatedCart,
    })
  } catch (error) {
    console.error('Error in updating quantity:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const removeFromCart = async (req, res) => {
  try {
    const { product_id } = req.params
    const userId = 'test-user-1'

    const cart = await Cart.findOne({ userId })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    // Find the item to get its quantity and restore the stock
    const itemToRemove = cart.items.find(
      (item) => item.product.toString() === product_id,
    )
    if (itemToRemove) {
      await Product.findByIdAndUpdate(
        product_id,
        { $inc: { stock: itemToRemove.quantity } },
        { new: true, runValidators: true },
      )
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== product_id,
    )
    await cart.save()

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price image',
    })

    res.status(200).json({ message: 'Item removed', data: updatedCart })
  } catch (error) {
    console.error('Error in removing from cart:', error.message)
    res.status(500).json({ message: error.message })
  }
}

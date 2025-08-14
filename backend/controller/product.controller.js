import mongoose from 'mongoose'
import Product from '../models/product.model.js'

export const getProduct = async (req, res) => {
  try {
    console.time('[DB] fetchProduct')
    console.log('Received request:', req.body)

    const product = await Product.findById({
      _id: req.params.productId,
    })

    console.timeEnd('[DB] fetchProduct')
    res.status(200).json({ success: true, data: product })
  } catch (error) {
    console.timeEnd('[DB] fetchProduct')
    console.log('error in fetching product:', error.message)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const getProducts = async (req, res) => {
  try {
    console.time('[DB] fetchProducts')
    console.log('Received request:', req.body)

    const products = await Product.find({})

    console.timeEnd('[DB] fetchProducts')
    res.status(200).json({ success: true, data: products })
  } catch (error) {
    console.timeEnd('[DB] fetchProducts')
    console.log('error in fetching products:', error.message)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const createProduct = async (req, res) => {
  const product = req.body
  if (!product.name || !product.price || !product.image) {
    return res
      .status(400)
      .json({ success: false, message: 'Please provide all fields' })
  }
  const newProduct = new Product(product)

  try {
    console.time('[DB] createProduct')

    await newProduct.save()

    console.timeEnd('[DB] createProduct')
    res.status(201).json({ success: true, data: newProduct })
  } catch (error) {
    console.timeEnd('[DB] createProduct')
    console.error('error in creating product:', error.message)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
}

export const updateProduct = async (req, res) => {
  const id = req.params.id
  const product = req.body

  console.log(`[Backend] Attempting to update product with ID: ${id}`)
  console.log('[Backend] Received update data:', product)

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log(`[Backend] Invalid Product ID format: ${id}`)
    return res
      .status(404)
      .json({ success: false, message: 'Invalid Product id' })
  }
  try {
    console.time('[DB] updateProduct')

    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    })

    console.timeEnd('[DB] updateProduct')

    if (!updatedProduct) {
      console.log(`[Backend] Product not found with ID: ${id}`)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found.' })
    }

    console.log('[Backend] Product updated successfully:', updatedProduct)
    res.status(200).json({ success: true, data: updatedProduct })
  } catch (error) {
    console.timeEnd('[DB] updateProduct')
    console.error(`[Backend] Error updating product ${id}:`, error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const deleteProduct = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: 'Invalid Product id' })
  }

  try {
    console.time('[DB] deleteProduct')

    await Product.findByIdAndDelete(id)

    console.timeEnd('[DB] deleteProduct')
    res.status(200).json({ success: true, message: 'Product deleted' })
  } catch (error) {
    console.timeEnd('[DB] deleteProduct')
    console.log('error in deleting product:', error.message)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
}

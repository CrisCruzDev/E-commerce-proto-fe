import api from './axiosInstance'

export const getProducts = async () => {
  const res = await api.get('/products')
  return res.data.data
}

export const getProductById = async (pid) => {
  const res = await api.get(`/products/get/${pid}`)
  return res.data.data
}

export const addProductToCart = async ({ id, qty = 1 }) => {
  const res = await api.post(`/products/cart/${id}`, { qty })
  return res.data.data
}

export const createProduct = async (newProduct) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const res = await api.post('/products', newProduct)
  return res.data.data
}

export const updateProduct = async ({ id, product }) => {
  const res = await api.put(`/products/${id}`, product)
  if (!res.data?.data) {
    throw new Error('Invalid response structure')
  }

  return res.data.data
}

export const deleteProduct = async (pid) => {
  const res = await api.delete(`/products/${pid}`)
  return res.data.message
}

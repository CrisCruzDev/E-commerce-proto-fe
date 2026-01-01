import api from './axiosInstance'

export const getCart = async () => {
  const res = await api.get('/products/cart')
  return res.data?.data
}

export const addToCart = async ({ id, qty }) => {
  const res = await api.post(`/products/cart/${id}`, { qty })
  return res.data.data
}

export const updateCartItemQty = async (product_id, action) => {
  const res = await api.put(`/products/cart/update/${product_id}`, { action })
  return res.data.data
}

export const removeFromCart = async (product_id) => {
  const res = await api.delete(`/products/cart/remove/${product_id}`)
  return res.data.data
}

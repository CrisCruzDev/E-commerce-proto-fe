// EditProductPage.jsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../api/productApi'
import CreatePage from './CreatePage'
import { useProductStore } from '../store/product'
import { useEffect } from 'react'

const EditProductPage = () => {
  const { id } = useParams()
  const { setUpdateProduct } = useProductStore()

  const { data: product, isLoading } = useQuery({
    queryKey: ['getProductById', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  })

  useEffect(() => {
    if (product) {
      setUpdateProduct(product)
    }
  }, [product])

  if (isLoading) return <p>Loading...</p>

  return <CreatePage isEditMode />
}

export default EditProductPage

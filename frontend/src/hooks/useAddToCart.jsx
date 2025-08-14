import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToCart } from '../api/cartApi'
import toast from 'react-hot-toast'

export const useAddToCart = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, qty }) => addToCart({ id, qty }),
    onSuccess: (data, variables) => {
      console.log('variables.id: ', variables.id)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Added to cart')
      queryClient.invalidateQueries({
        queryKey: ['getProductById', variables.id],
      })
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to add item to cart.'
      toast.error('Add to cart error')
    },
  })

  return mutation
}

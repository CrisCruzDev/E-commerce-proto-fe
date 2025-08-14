import { useState } from 'react'
import { updateCartItemQty, removeFromCart } from '../../api/cartApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cart'
import toast from 'react-hot-toast'

const CartCard = ({ item }) => {
  const queryClient = useQueryClient()
  const { increment, decrement } = useCartStore()
  const navigate = useNavigate()

  const [itemToDeleteId, setItemToDeleteId] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const openConfirmModal = () => setIsConfirmModalOpen(true)
  const closeConfirmModal = () => setIsConfirmModalOpen(false)

  console.log('item:', item)

  const { data: productData } = useQuery({
    queryKey: ['getProductById', item.product._id],
    queryFn: () => getProductById(item.product._id),
    staleTime: 60 * 1000,
  })

  console.log('productData:', productData)

  const updateQtyMutation = useMutation({
    mutationFn: ({ product_id, action }) => {
      return updateCartItemQty(product_id, action)
    },
    onMutate: async ({ product_id, action }) => {
      await queryClient.cancelQueries(['cart'])
      const previousCart = queryClient.getQueryData(['cart'])

      const currentProductData = queryClient.getQueryData([
        'getProductById',
        product_id,
      ])
      const currentStock = currentProductData?.stock ?? 0

      queryClient.setQueryData(['cart'], (oldCartData) => {
        if (!oldCartData || !oldCartData.items) return oldCartData
        const updatedItems = oldCartData.items
          .map((cartItem) => {
            if (cartItem.product._id === product_id) {
              let newQuantity = cartItem.quantity
              if (action === 'increment') {
                newQuantity += 1
              } else if (action === 'decrement') {
                newQuantity = Math.max(1, newQuantity - 1)
              }
              return { ...cartItem, quantity: newQuantity }
            }
            return cartItem
          })
          .filter((cartItem) => cartItem.quantity > 0) // Remove if quantity becomes 0

        // If the item quantity becomes 0 and was removed, ensure the overall cart structure is correct
        return { ...oldCartData, items: updatedItems }
      })

      return { previousCart }
    },

    // Ensure data is fresh from server
    onSuccess: (data, variables) => {
      console.log('variables.product_id: ', variables.product_id)
      queryClient.setQueryData(['cart'], data.data)
      queryClient.invalidateQueries({
        queryKey: ['getProductById', variables.product_id],
      })
    },

    // Roll back if mutation fails
    onError: (err, variables, context) => {
      console.log('onError:', err)
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart)
      }
    },
  })

  const removeFromCartMutation = useMutation({
    mutationFn: (product_id) => removeFromCart(product_id),
    onMutate: async ({ product_id }) => {
      await queryClient.cancelQueries(['cart'])
      const previousCart = queryClient.getQueryData(['cart'])

      queryClient.setQueryData(['cart'], (oldCartData) => {
        if (!oldCartData || !oldCartData.items) return oldCartData

        const updatedItems = oldCartData.items.filter(
          (cartItem) => cartItem.product._id !== product_id,
        )

        return { ...oldCartData, items: updatedItems }
      })

      return { previousCart }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data.data)
      toast.success('Item Removed')
      queryClient.invalidateQueries(['cart'])
      closeConfirmModal()
    },

    onError: (err, variables, context) => {
      console.log('onError:', err)
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart)
        toast.error('Remove item error')
      }
    },
  })

  const handleDecrement = (pid) => {
    if (item.quantity === 1) {
      setItemToDeleteId(item.product._id)
      openConfirmModal()
    } else {
      console.log('decrementID:', pid)
      updateQtyMutation.mutate({
        product_id: item.product._id,
        action: 'decrement',
      })
    }
  }

  const handleIncrement = (pid) => {
    console.log('incrementID:', pid)
    if (item.quantity >= productData.stock) {
      toast.error('Cannot add more items than are in stock.')
      return
    }
    updateQtyMutation.mutate({
      product_id: item.product._id,
      action: 'increment',
    })
  }

  const handleConfirmRemove = () => {
    console.log('itemToDeleteId:', itemToDeleteId)
    if (itemToDeleteId) {
      removeFromCartMutation.mutate(itemToDeleteId)
    }
  }

  return (
    <div className='flex flex-col sm:grid sm:grid-cols-4 gap-4 items-center py-5 px-4 sm:px-8 border border-gray-200 mt-3 '>
      <div
        className='flex items-center space-x-4 col-span-2 w-full cursor-pointer'
        onClick={() => navigate(`/product/${productData?._id}`)}
      >
        <div className='w-20 h-20 flex-shrink-0 overflow-hidden'>
          <img
            src={productData?.image}
            alt={productData?.name}
            className='object-cover w-full h-full'
          />
        </div>

        <div className='flex-grow'>
          <p className='text-lg font-medium'>{productData?.name}</p>
          <p className='text-xs font-light text-gray-500/50 mt-1'>
            {productData?._id}
          </p>
        </div>
      </div>

      <div className='flex justify-between w-full mt-4 sm:mt-0 sm:col-span-2'>
        <div className='flex flex-col items-center sm:hidden'>
          <p className='text-sm text-gray-500'>Price</p>
          <p className='text-lg'>${productData?.price}</p>
        </div>
        <p className='hidden sm:block'>${productData?.price}</p>
        <div className='flex flex-col items-center sm:hidden'>
          <p className='text-sm text-gray-500'>Quantity</p>
          <div className='w-24 flex items-center justify-between border border-gray-300'>
            <button
              className='w-full hover:bg-gray-100 cursor-pointer p-1'
              onClick={() => handleDecrement(item.product._id)}
              disabled={updateQtyMutation.isPending}
            >
              -
            </button>
            <p className='px-2 border-x border-gray-300'>{item?.quantity}</p>
            <button
              className='w-full hover:!bg-gray-100 cursor-pointer p-1'
              onClick={() => handleIncrement(item.product._id)}
              disabled={
                updateQtyMutation.isPending ||
                item.quantity >= productData?.stock
              }
            >
              +
            </button>
          </div>
        </div>
        <div className='hidden sm:flex items-center justify-center w-24 border border-gray-300'>
          <button
            className='w-full hover:bg-gray-100 cursor-pointer p-1'
            onClick={() => handleDecrement(item.product._id)}
            disabled={updateQtyMutation.isPending}
          >
            -
          </button>
          <p className='px-2 border-x border-gray-300'>{item?.quantity}</p>
          <button
            className='w-full hover:!bg-gray-100 cursor-pointer p-1'
            onClick={() => handleIncrement(item.product._id)}
            disabled={
              updateQtyMutation.isPending || item.quantity >= productData?.stock
            }
          >
            +
          </button>
        </div>
        <div className='flex flex-col items-end sm:hidden'>
          <p className='text-sm text-gray-500'>Total</p>
          <p className='text-lg'>
            ${(productData?.price * item?.quantity).toFixed(2)}
          </p>
        </div>
        <p className='hidden sm:block'>
          ${(productData?.price * item?.quantity).toFixed(2)}
        </p>
      </div>

      {isConfirmModalOpen && (
        <div className='fixed inset-0 bg-black/30 backdrop-blur-[5px] overflow-y-auto h-full w-full flex items-center justify-center z-50'>
          <div className='bg-white p-6 shadow-xl max-w-sm w-full'>
            <h3 className='text-lg font-bold mb-4'>Remove Item</h3>
            <p className='mb-6 text-gray-700'>
              Are you sure you want to remove this item from your cart?
            </p>
            <div className='flex justify-end !space-x-4'>
              <button
                className='!px-4 !py-1.5 !bg-gray-200 text-gray-800 hover:!bg-gray-300 transition-colors duration-200'
                onClick={closeConfirmModal}
              >
                Cancel
              </button>

              <button
                className='!px-4 !py-1.5 !bg-black/90 !text-white hover:!bg-black transition-colors duration-200'
                onClick={handleConfirmRemove}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartCard

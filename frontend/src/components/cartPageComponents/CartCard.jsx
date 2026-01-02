import { useState } from 'react';
import { updateCartItemQty, removeFromCart } from '../../api/cartApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cart';
import toast from 'react-hot-toast';

const CartCard = ({ item }) => {
  if (!item || !item.product) {
    return;
  }

  const { product, quantity } = item;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  console.log('item:', item);

  // const { data: productData } = useQuery({
  //   queryKey: ['getProductById', item?.product?._id],
  //   queryFn: () => getProductById(item.product._id),
  //   staleTime: 0,
  //   enabled: Boolean(item?.product?._id),
  // });

  // const updateQtyMutation = useMutation({
  //   mutationFn: ({ product_id, action }) => {
  //     return updateCartItemQty(product_id, action);
  //   },
  //   onMutate: async ({ product_id, action }) => {
  //     await queryClient.cancelQueries(['cart']);
  //     const previousCart = queryClient.getQueryData(['cart']);

  //     const currentProductData = queryClient.getQueryData([
  //       'getProductById',
  //       product_id,
  //     ]);

  //     if (
  //       action === 'increment' &&
  //       (!currentProductData || currentProductData.stock <= 0)
  //     ) {
  //       return; // don't optimistically update if no stock
  //     }

  //     queryClient.setQueryData(['cart'], oldCartData => {
  //       if (!oldCartData || !oldCartData.items) return oldCartData;

  //       const updatedItems = oldCartData.items
  //         .map(cartItem => {
  //           if (cartItem.product._id === product_id) {
  //             let newQuantity = cartItem.quantity;
  //             if (action === 'increment') {
  //               newQuantity += 1;
  //             } else if (action === 'decrement') {
  //               newQuantity = Math.max(1, newQuantity - 1);
  //             }
  //             return { ...cartItem, quantity: newQuantity };
  //           }
  //           return cartItem;
  //         })
  //         .filter(cartItem => cartItem.quantity > 0); // Remove if quantity becomes 0

  //       // If the item quantity becomes 0 and was removed, ensure the overall cart structure is correct
  //       return { ...oldCartData, items: updatedItems };
  //     });

  //     // Update product stock optimistically
  //     if (currentProductData) {
  //       queryClient.setQueryData(['getProductById', product_id], {
  //         ...currentProductData,
  //         stock:
  //           action === 'increment'
  //             ? currentProductData.stock - 1
  //             : currentProductData.stock + 1,
  //       });
  //     }

  //     return { previousCart, currentProductData };
  //   },

  //   // Ensure data is fresh from server
  //   onSuccess: (data, variables) => {
  //     console.log('variables.product_id: ', variables.product_id);
  //     queryClient.setQueryData(['cart'], data.data);
  //     queryClient.invalidateQueries({
  //       queryKey: ['getProductById', variables.product_id],
  //     });
  //   },

  //   // Roll back if mutation fails
  //   onError: (err, variables, context) => {
  //     console.log('onError:', err);
  //     if (context?.previousCart) {
  //       queryClient.setQueryData(['cart'], context.previousCart);
  //     }
  //     if (context?.previousProduct) {
  //       queryClient.setQueryData(
  //         ['getProductById', variables.product_id],
  //         context.previousProduct
  //       );
  //     }
  //     // optionally: show toast to user
  //     alert(err.response?.data?.message || 'Something went wrong!');
  //   },
  // });

  const updateQtyMutation = useMutation({
    mutationFn: ({ product_id, action }) =>
      updateCartItemQty(product_id, action),
    onMutate: async ({ product_id, action }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);

      // Optimistic update of the ENTIRE merged list
      queryClient.setQueryData(['cart'], oldItems => {
        return oldItems.map(i => {
          if (i.product._id === product_id) {
            const newQty =
              action === 'increment' ? i.quantity + 1 : i.quantity - 1;
            return { ...i, quantity: Math.max(1, newQty) };
          }
          return i;
        });
      });

      return { previousCart };
    },
    onSuccess: res => {
      // Option A: If your server returns the new full cart:
      // queryClient.setQueryData(['cart'], res.data);

      // Option B: Just refetch to be safe:
      queryClient.invalidateQueries(['cart']);
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: product_id => removeFromCart(product_id),
    onMutate: async ({ product_id }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);

      queryClient.setQueryData(['cart'], oldCartData => {
        if (!oldCartData || !oldCartData.items) return oldCartData;

        const updatedItems = oldCartData.items.filter(
          cartItem => cartItem.product._id !== product_id
        );

        return { ...oldCartData, items: updatedItems };
      });

      return { previousCart };
    },
    onSuccess: data => {
      queryClient.setQueryData(['cart'], data.data);
      toast.success('Item Removed');
      queryClient.invalidateQueries(['cart']);
      closeConfirmModal();
    },

    onError: (err, variables, context) => {
      console.log('onError:', err);
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
        toast.error('Remove item error');
      }
    },
  });

  const handleDecrement = pid => {
    if (item.quantity === 1) {
      setItemToDeleteId(item.product._id);
      openConfirmModal();
    } else {
      console.log('decrementID:', pid);
      updateQtyMutation.mutate({
        product_id: item.product._id,
        action: 'decrement',
      });
    }
  };

  const handleIncrement = pid => {
    console.log('incrementID:', pid);
    if (item?.product?.stock <= 0) {
      toast.error('Out of stock');
      return;
    }
    updateQtyMutation.mutate({
      product_id: item.product._id,
      action: 'increment',
    });
  };

  const handleConfirmRemove = () => {
    console.log('itemToDeleteId:', itemToDeleteId);
    if (itemToDeleteId) {
      removeFromCartMutation.mutate(itemToDeleteId);
    }
  };

  return (
    <div className='flex flex-col sm:grid sm:grid-cols-4 gap-4 items-center py-5 px-4 sm:px-8 border border-gray-300 mt-3 rounded-xs font-mono tracking-tighter'>
      <div
        className='flex items-center space-x-4 col-span-2 w-full cursor-pointer'
        onClick={() => navigate(`/product/${item?.product?._id}`)}
      >
        <div className='flex-shrink-0 overflow-hidden'>
          <img
            src={item?.product?.image}
            alt={item?.product?.name}
            className='object-contain w-30 h-25'
          />
        </div>

        <div className='flex-grow'>
          <p className='text-lg font-medium'>{item?.product?.name}</p>
          <p className='text-xs font-light text-gray-400 mt-1'>
            {item?.product?._id}
          </p>
        </div>
      </div>

      <div className='flex justify-between w-full mt-4 sm:mt-0 sm:col-span-2'>
        <div className='flex flex-col items-center sm:hidden'>
          <p className='text-sm text-gray-500'>Price</p>
          <p className='text-lg'>${item?.product?.price}</p>
        </div>
        <p className='hidden sm:block'>${item?.product?.price}</p>
        <div className='flex flex-col items-center sm:hidden'>
          <p className='text-sm text-gray-500'>Quantity</p>
          <div className='w-24 flex items-center justify-between border border-primary/50'>
            <button
              className='w-full hover:bg-gray-100 cursor-pointer p-1'
              onClick={() => handleDecrement(item.product._id)}
              disabled={updateQtyMutation.isPending}
            >
              -
            </button>
            <p className='px-2 border-x border-primary/50'>{item?.quantity}</p>
            <button
              className='w-full hover:!bg-gray-100 cursor-pointer p-1'
              onClick={() => handleIncrement(item.product._id)}
              disabled={updateQtyMutation.isPending}
            >
              +
            </button>
          </div>
        </div>
        <div className='hidden sm:flex items-center justify-center w-24 border border-primary/50'>
          <button
            className='w-full hover:bg-gray-100 cursor-pointer p-1'
            onClick={() => handleDecrement(item.product._id)}
            disabled={updateQtyMutation.isPending}
          >
            -
          </button>
          <p className='px-2 border-x border-primary/50'>{item?.quantity}</p>
          <button
            className='w-full hover:!bg-gray-100 cursor-pointer p-1'
            onClick={() => handleIncrement(item.product._id)}
            disabled={updateQtyMutation.isPending}
          >
            +
          </button>
        </div>
        <div className='flex flex-col items-end sm:hidden'>
          <p className='text-sm text-gray-500'>Total</p>
          <p className='text-lg'>
            ${(item?.product?.price * item?.quantity).toFixed(2)}
          </p>
        </div>
        <p className='hidden sm:block'>
          ${(item?.product?.price * item?.quantity).toFixed(2)}
        </p>
      </div>

      {isConfirmModalOpen && (
        <div className='fixed inset-0 bg-black/30 backdrop-blur-[5px] overflow-y-auto h-full w-full flex items-center justify-center z-50'>
          <div className='bg-white p-6 shadow-xl max-w-sm w-full'>
            <h3 className='text-lg font-bold mb-4'>Remove Item</h3>
            <p className='mb-6 text-gray-700'>
              Are you sure you want to remove this item from your cart?
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                className='px-4 py-1.5 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200 cursor-pointer'
                onClick={closeConfirmModal}
              >
                Cancel
              </button>

              <button
                className='px-4 py-1.5 bg-black/90 text-white hover:bg-black transition-colors duration-200 cursor-pointer'
                onClick={handleConfirmRemove}
              >
                {removeFromCartMutation.isPending ? (
                  <svg
                    className='animate-spin h-5 w-5 text-white mx-auto'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                    />
                  </svg>
                ) : (
                  'Remove'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartCard;

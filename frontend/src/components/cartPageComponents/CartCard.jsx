import { useState } from 'react';
import { updateCartItemQty } from '../../api/cartApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRemoveFromCart, useUpdateCartQty } from '../../hooks/useCartHooks';

const CartCard = ({ item }) => {
  if (!item || !item.product) {
    return;
  }
  const navigate = useNavigate();

  const removeFromCartMutation = useRemoveFromCart();
  const updateQtyMutation = useUpdateCartQty();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  console.log('item:', item);

  const handleIncrement = pid => {
    if (item?.product?.stock <= item.quantity) {
      toast.error('Cannot add more items in stock');
      return;
    }
    updateQtyMutation.mutate({
      product_id: pid,
      action: 'increment',
    });
  };

  const handleDecrement = pid => {
    if (item.quantity <= 1) {
      openConfirmModal();
      return;
    }
    updateQtyMutation.mutate({ product_id: pid, action: 'decrement' });
  };

  const handleConfirmRemove = () => {
    removeFromCartMutation.mutate(item.product._id, {
      onSuccess: () => closeConfirmModal(),
    });
  };

  return (
    <div className='flex flex-col sm:grid sm:grid-cols-4 gap-4 items-center py-5 px-4 sm:px-8 border border-gray-300 mt-3 rounded-sm font-mono tracking-tighter'>
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
          <div className='w-24 flex items-center justify-between border border-primary/50 rounded-sm'>
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

        <div className='hidden sm:flex items-center justify-center w-24 border border-primary/50 rounded-sm'>
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

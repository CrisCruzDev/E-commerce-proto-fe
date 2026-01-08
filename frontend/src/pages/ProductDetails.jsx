import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAddToCart } from '../hooks/useAddToCart';
import { useCartStore } from '../store/cart';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getProductById } from '../api/productApi';
import { useAuthStore } from '../store/auth';

const ProductDetails = () => {
  const { id: productId } = useParams();
  const queryClient = useQueryClient();

  const addToCartMutation = useAddToCart();
  const { resetQuantity } = useCartStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [qty, setQty] = useState(1);

  const user = useAuthStore(s => s.user);

  const { data: productFromQuery } = useQuery({
    queryKey: ['getProductById', productId],
    queryFn: () => getProductById(productId),
    initialData: () => {
      return queryClient
        .getQueryData(['products'])
        ?.find(p => p._id === productId);
    },
  });

  const product = productFromQuery;
  const currentStock = product?.stock || 0;

  useEffect(() => {
    if (addToCartMutation.isSuccess) {
      setQty(1);
      resetQuantity();
      addToCartMutation.reset();
    }
  }, [addToCartMutation.isSuccess]);

  const handleQuantity = () => {
    if (qty > currentStock) {
      toast.error(`Only ${currentStock} in stock.`);
      return;
    }

    if (currentStock === 0) return;

    addToCartMutation.mutate({ id: product?._id, qty: qty });
  };

  const isOutOfStock = currentStock === 0;
  console.log('SingleProductFromQuery: ', product);

  return (
    <div className='bg-white h-full'>
      {/* Main Container */}
      <div className='container mx-auto max-w-6xl p-4 md:p-8'>
        {/* Product Section */}
        <div className='flex flex-col md:flex-row gap-8 md:gap-16'>
          {/* Left Side: Image */}
          <div>
            {user?.role === 'admin' && (
              <Link
                className='w-fit flex items-center justify-center font-mono uppercase text-[10px] cursor-pointer hover:bg-gray-100 text-gray-500 px-2 py-1 border border-gray-200 rounded-sm hover:text-black transition-colors duration-200 mb-1'
                to={`/edit/${productId}`}
              >
                <p>Edit product &rarr;</p>
              </Link>
            )}

            <button
              className='cursor-pointer'
              onClick={() => setIsExpanded(true)}
              disabled={isOutOfStock}
            >
              <div className='relative w-full h-120 sm:h-full bg-gray-100 overflow-hidden flex items-center justify-center p-25'>
                <img
                  src={product?.image}
                  alt='Product'
                  className='object-contain h-full'
                />
                {/* SOLD OUT overlay */}
                {isOutOfStock && (
                  <div className='absolute inset-0 flex items-center justify-center z-10 bg-white/50 backdrop-blur-[1px]'>
                    <div className='text-red-600 font-bebas text-xl w-[75%] text-center bg-yellow/25 shadow-xs'>
                      Out of stock
                    </div>
                  </div>
                )}
                <p className='w-fit flex items-center justify-center font-mono uppercase text-[10px] cursor-pointer hover:bg-primary hover:text-white text-primary px-2 py-1 border border-gray-300 rounded-sm transition-colors duration-200 text-sm absolute bottom-4 right-4'>
                  Click to expand
                </p>
              </div>
            </button>
          </div>

          {/* Right Side: Details */}
          <div className='flex-1 flex flex-col space-y-6 font-mono'>
            {/* Brand, Name, and Price */}
            <div className='space-y-5'>
              <div className='text-sm text-gray-500'>{product?.brand}</div>
              <div className='text-5xl sm:text-4xl md:text-5xl font-semibold'>
                {product?.name}
              </div>
              <div className=''>${product?.price}</div>
            </div>

            {/* Separator */}
            <hr className='border-gray-200 mb-5' />

            {/* Description */}
            <div>
              <div className='text-sm text-gray-500 mb-2'>
                Product Description:
              </div>
              <p className='whitespace-pre-line mt-2 text-black'>
                {product?.description || 'N/A'}
              </p>
            </div>

            {/* Stock status */}
            <div
              className={`${
                currentStock > 0
                  ? currentStock < 6
                    ? 'text-orange-500'
                    : 'text-black'
                  : 'text-gray-300'
              }`}
            >
              {currentStock > 0
                ? currentStock < 6
                  ? `Only ${''} ${currentStock} ${''} left !`
                  : `${currentStock} ${''} left`
                : 'Out of stock'}
            </div>

            {/* Buttons and Quantity */}
            <div className='mt-auto flex flex-col space-y-4'>
              <div className='flex items-center gap-4'>
                {/* Quantity input */}
                <div className='flex items-center gap-2'>
                  <label
                    htmlFor='qty'
                    className='text-sm text-primary font-mono'
                  >
                    qty:
                  </label>
                  <select
                    id='qty'
                    className={`border border-gray-300 px-6 py-2 cursor-pointer rounded-sm ${
                      isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    value={qty}
                    onChange={e => {
                      setQty(Number(e.target.value));
                    }}
                    disabled={isOutOfStock}
                  >
                    {[...Array(10).keys()].map(i => (
                      <option key={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                {/* Add to cart button */}
                <button
                  className={`cursor-pointer flex-1 bg-black/92 text-white gap-2 h-10 hover:bg-black rounded-sm font-mono ${
                    addToCartMutation.isPending
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black/92 hover:bg-black '
                  } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleQuantity()}
                  disabled={
                    addToCartMutation.isPending ||
                    isOutOfStock ||
                    qty > currentStock
                  }
                >
                  {isOutOfStock ? (
                    'Out of stock'
                  ) : addToCartMutation.isPending ? (
                    <>
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
                    </>
                  ) : (
                    'Add to cart'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className='mt-16'>
          <h2 className='text-2xl font-bold font-mono'>Reviews</h2>
          <hr className='mt-2 border-gray-200' />
        </div>
      </div>
      {isExpanded && (
        <div
          className='fixed inset-0 bg-black/20 backdrop-blur-[5px] z-50 flex items-center justify-center p-20'
          onClick={() => setIsExpanded(false)}
        >
          <img
            src={product?.image}
            alt='Expanded product'
            className='max-w-full max-h-full object-contain'
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

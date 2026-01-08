import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../../store/product';
import { useAddToCart } from '../../hooks/useAddToCart';
import { useAuthStore } from '../../store/auth';
import { formatPrice } from '../../utils/formatCurrency';

const ProductCard = ({ product, isLoading, isError, error }) => {
  const setProductToEdit = useProductStore(s => s.setProductToEdit);
  const user = useAuthStore(s => s.user);
  const addToCartMutation = useAddToCart();

  const isUncategorized = !product?.category || !product?.brand;

  if (isLoading || !product)
    return <svg className='animate-spin h-10 w-10 text-white mx-auto' />;

  if (isError)
    return <div>Error: {error.response?.data?.message || error.message}</div>;

  const currentStock = product?.stock;
  const isOutOfStock = currentStock === 0;

  const handleEditClick = () => {
    setProductToEdit(product);
  };

  return (
    <div>
      <div className='flex flex-wrap items-center justify-start md:justify-between gap-2'>
        {user?.role === 'admin' && (
          <>
            <Link
              className='flex items-center justify-center font-mono font-bold uppercase text-[10px] cursor-pointer hover:bg-gray-100 text-gray-500 px-2 py-1 border border-gray-200 rounded-sm hover:text-black transition-colors duration-200'
              to={`/edit/${product?._id}`}
              onClick={handleEditClick}
            >
              <p>Edit &rarr;</p>
            </Link>
            {isUncategorized && (
              <div className='ml-0  w-fit flex items-center justify-center bg-yellow/40 text-gray-500 text-[10px] font-mono font-bold uppercase px-2 py-1 rounded-sm'>
                ❗Uncategorized
              </div>
            )}
          </>
        )}
      </div>
      <div className='w-full group transform transition-all duration-100 ease-in-out overflow-hidden relative'>
        {/* SOLD OUT overlay */}
        {isOutOfStock && (
          <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/75 backdrop-blur-[0.5px]'>
            <div className='py-1.5 w-full text-red-600 font-bebas text-xl text-center bg-yellow/50 shadow-xs'>
              Out of stock
            </div>
          </div>
        )}
        <Link to={`/product/${product?._id}`} state={{ product }}>
          <div
            className={`flex relative items-center justify-center overflow-hidden w-full aspect-square transition-all duration-300 ${
              !product?.image ? 'bg-neutral-100' : ''
            }`}
          >
            <img
              src={product?.image}
              alt={product?.name}
              loading='lazy'
              className='object-contain w-[80%] h-[80%] group-hover:scale-105 transition-transform duration-200 '
            />
          </div>

          <div>
            <p className='text-sm font-thin font-mono tracking-tight'>
              {product?.brand ?? 'N/A'}
            </p>
            <p className='text-lg font-semibold font-mono tracking-tight group-hover:text-orange-500 transition-colors duration-300 ease-in-out'>
              {product.name}
            </p>
          </div>
        </Link>

        <div className='flex flex-row justify-between items-center'>
          <div className='pt-1.5'>
            <p className='text-md font-mono tracking-tight text-black'>
              From {formatPrice(product?.price)}
            </p>
          </div>
          <button
            className=' h-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            onClick={() =>
              addToCartMutation.mutate({ id: product?._id, qty: 1 })
            }
            disabled={isOutOfStock || addToCartMutation.isPending}
          >
            <div className='flex items-start px-2 space-x-1 text-black/50 hover:text-black'>
              <svg
                className='w-5 h-5'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='0.5'
                  d='M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6'
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

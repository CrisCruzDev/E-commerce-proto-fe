import { useEffect } from 'react';
import { getProductById } from '../../api/productApi';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useProductStore } from '../../store/product';
import { useAddToCart } from '../../hooks/useAddToCart';

const ProductCard = ({ productData }) => {
  const setProductToEdit = useProductStore(s => s.setProductToEdit);
  const addToCartMutation = useAddToCart();

  const hasFullData =
    productData?.price &&
    productData?.stock !== undefined &&
    productData?.image;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getProductById', productData?._id],
    queryFn: () => getProductById(productData._id),
    initialData: hasFullData ? productData : undefined,
    staleTime: 0,
  });

  console.log('product: ', data);

  useEffect(() => {
    if (data) {
      setProductToEdit(data);
    }
  }, [data]);

  if (isLoading || !data)
    return (
      <svg
        className='animate-spin h-10 w-10 text-white mx-auto'
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
    );
  if (isError)
    return <div>Error: {error.response?.data?.message || error.message}</div>;

  const currentStock = data.stock;
  const isOutOfStock = currentStock === 0;

  return (
    <div>
      <Link
        className='text-[10px] cursor-pointer text-gray-400 hover:text-black transition-colors duration-200'
        to={`/edit/${data?._id}`}
      >
        <p>Quick edit &rarr;</p>
      </Link>
      <div className='w-full group transform transition-all duration-100 ease-in-out overflow-hidden'>
        <Link to={`/product/${data?._id}`} state={{ data }}>
          <div
            className={`flex relative items-center justify-center overflow-hidden w-full aspect-square transition-all duration-300 ${
              !data?.image ? 'bg-neutral-100' : ''
            }`}
          >
            <img
              src={data?.image}
              alt={data?.name}
              className='object-contain w-[80%] h-[80%] group-hover:scale-105 transition-transform duration-200'
            />
            {/* SOLD OUT overlay */}
            {isOutOfStock && (
              <div className='absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px]'>
                <div className='text-red-600 font-bebas text-xl w-[75%] text-center bg-yellow/25 shadow-xs'>
                  Out of stock
                </div>
              </div>
            )}
          </div>

          <div>
            <p className='text-xs font-thin uppercase tracking-wide'>
              {data?.brand ?? 'N/A'}
            </p>
            <p className='text-lg font-semibold tracking-tight group-hover:text-orange-500 transition-colors duration-300 ease-in-out'>
              {data.name}
            </p>
          </div>
        </Link>

        <div className='flex flex-row justify-between items-center'>
          <div className='pt-1.5'>
            <p className='text-lg tracking-tight text-black'>
              From ${data?.price}
            </p>
          </div>
          <button
            className=' h-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            onClick={() => addToCartMutation.mutate({ id: data?._id, qty: 1 })}
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

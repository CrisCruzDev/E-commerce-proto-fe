import { useEffect } from 'react'
import { getProductById } from '../../api/productApi'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useProductStore } from '../../store/product'
import { useAddToCart } from '../../hooks/useAddToCart'

const ProductCard = ({ product: initialProductData }) => {
  const { setUpdateProduct } = useProductStore()
  const addToCartMutation = useAddToCart()

  const hasFullData =
    initialProductData?.price &&
    initialProductData?.stock !== undefined &&
    initialProductData?.image

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getProductById', initialProductData?._id],
    queryFn: () => getProductById(initialProductData._id),
    initialData: hasFullData ? initialProductData : undefined,
    staleTime: 0,
  })

  console.log('product: ', data)

  useEffect(() => {
    if (data) {
      setUpdateProduct(data)
    }
  }, [data])

  if (isLoading || !data) return <div>Loading products...</div>
  if (isError)
    return <div>Error: {error.response?.data?.message || error.message}</div>

  const currentStock = data.stock
  const isOutOfStock = currentStock === 0

  return (
    <div>
      <Link
        className='text-[10px] transition-colors cursor-pointer !text-gray-400 hover:!text-black transition-colors duration-200'
        to={`/edit/${data?._id}`}
      >
        <p>Edit &rarr;</p>
      </Link>
      <div
        className={`w-70 group transform transition-all duration-100 ease-in-out overflow-hidden ${
          isOutOfStock ? 'opacity-30 pointer-events-auto' : ''
        }`}
      >
        <Link to={`/product/${data?._id}`} state={{ data }}>
          <div
            className={`flex relative items-center justify-center bg-gray-100/40 overflow-hidden w-full h-70 sm:h-70 group-hover:shadow-sm group-hover:scale-101 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out ${
              !data?.image ? 'bg-neutral-100' : ''
            }`}
          >
            <img
              src={data?.image}
              alt={data?.name}
              className='object-contain w-full h-full '
            />
            {/* SOLD OUT overlay */}
            {isOutOfStock && (
              <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
                <div className='text-red-800 text-xl rotate-[-45deg] w-full text-center bg-white/50'>
                  Out of stock
                </div>
              </div>
            )}
          </div>

          <div className='flex justify-center items-center pb-3'></div>

          <div>
            <p className='text-xs'>{data?.brand ?? 'N/A'}</p>
          </div>
          <div className='flex py-1'>
            <p className='text-lg font-semibold group-hover:text-orange-500 transition-colors duration-300 ease-in-out'>
              {data.name}
            </p>
          </div>
        </Link>

        <div className='flex flex-col justify-between items-start gap-2'>
          <p className='text-md font-semibold text-black'>${data?.price}</p>
          <button
            className='bg-black/92 text-white h-6 hover:bg-black transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            onClick={() => addToCartMutation.mutate({ id: data?._id, qty: 1 })}
            disabled={isOutOfStock || addToCartMutation.isLoading}
          >
            <div className='flex px-2 items-center !space-x-1'>
              <svg
                className='w-3 h-3 text-gray-800 dark:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6'
                />
              </svg>
              <p className='text-white text-xs'>Add to cart</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

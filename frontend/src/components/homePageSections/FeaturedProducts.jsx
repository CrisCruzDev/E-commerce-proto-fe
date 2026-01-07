import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../api/productApi';
import ProductCard from '../productComponents/ProductCard';
import ProductSkeleton from '../productComponents/ProductSkeleton';

const FeaturedProducts = () => {
  const [visibleCount, setVisibleCount] = useState(8);

  // Use your actual API call here
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    staleTime: 5 * 60 * 1000, // Cache for 5 mins
  });

  console.log('fetch all products', products);

  const loadMore = () => setVisibleCount(prev => prev + 4);

  return (
    <section className='w-full py-20 px-4 md:px-12 lg:px-[100px] bg-white'>
      {/* Editorial Header */}
      <div className='flex flex-col mb-16 items-center justify-center'>
        <h2 className='font-bebas text-5xl md:text-7xl text-black transform scale-y-110 origin-left uppercase'>
          Featured Products
        </h2>
        <p className='flex text-center text-[10px] md:text-xl text-gray-500 font-mono tracking-tight'>
          Get up to speed with the latest gadgets, gear, and tech on the market.
        </p>
        <div className='h-1 w-full bg-yellow mt-10 rounded-xs' />
      </div>

      {/* 4 COLUMN GRID */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6 lg:gap-8'>
        {isLoading
          ? [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
          : products
              ?.slice(0, visibleCount)
              .map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                />
              ))}
      </div>

      {/* Load More Button */}
      {!isLoading && visibleCount < products?.length && (
        <div className='mt-24 flex justify-center'>
          <button
            onClick={loadMore}
            className='font-bebas text-2xl lg:text-3xl border-b-2 border-black pb-1 hover:text-teal hover:border-teal transition-all cursor-pointer uppercase'
          >
            Load More....
          </button>
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;

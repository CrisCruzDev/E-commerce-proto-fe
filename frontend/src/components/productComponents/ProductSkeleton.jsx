const ProductSkeleton = () => (
  <div className='w-full flex flex-col gap-4'>
    {/* Image Box Skeleton */}
    <div className='aspect-square w-full bg-gray-200 animate-pulse rounded-sm' />
    {/* Text Skeletons */}
    <div className='flex flex-col gap-2'>
      <div className='h-4 w-1/4 bg-gray-200 animate-pulse' />
      <div className='h-6 w-3/4 bg-gray-200 animate-pulse' />
      <div className='h-5 w-1/3 bg-gray-200 animate-pulse' />
    </div>
  </div>
);

export default ProductSkeleton;

const CheckoutSkeleton = () => (
  <div className='max-w-4xl mx-auto p-8 font-mono animate-pulse'>
    <div className='h-10 bg-gray-200 w-1/3 mb-8' />
    <div className='grid md:grid-cols-2 gap-12'>
      {/* Summary Skeleton */}
      <div className='space-y-6'>
        {[1, 2, 3].map(i => (
          <div key={i} className='flex justify-between border-b pb-2'>
            <div className='h-4 bg-gray-200 w-1/2' />
            <div className='h-4 bg-gray-200 w-1/4' />
          </div>
        ))}
        <div className='h-8 bg-gray-200 w-2/3 mt-4' />
      </div>
      {/* Form Skeleton */}
      <div className='space-y-6'>
        <div className='h-16 bg-gray-100 border rounded' />
        <div className='h-14 bg-gray-300 rounded' />
      </div>
    </div>
  </div>
);

export default CheckoutSkeleton;

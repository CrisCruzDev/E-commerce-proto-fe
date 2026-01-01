export const CartSkeleton = () => (
  <div className='flex flex-col sm:grid sm:grid-cols-4 gap-4 items-center py-5 px-4 sm:px-8 border border-gray-200 mt-3 rounded-xs animate-pulse'>
    <div className='flex items-center space-x-4 col-span-2 w-full'>
      <div className='w-20 h-20 bg-gray-200 rounded-xs' />
      <div className='flex-grow space-y-2'>
        <div className='h-5 bg-gray-200 w-3/4' />
        <div className='h-3 bg-gray-100 w-1/2' />
      </div>
    </div>
    <div className='flex justify-between w-full sm:col-span-2'>
      <div className='h-5 bg-gray-200 w-12' />
      <div className='h-8 bg-gray-200 w-24' />
      <div className='h-5 bg-gray-200 w-12' />
    </div>
  </div>
);

export const SummarySkeleton = () => (
  <div className='p-6 border border-gray-200 rounded-xs animate-pulse'>
    <div className='h-8 bg-gray-200 w-1/2 mb-6' />
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <div className='h-4 bg-gray-100 w-20' />
        <div className='h-4 bg-gray-100 w-12' />
      </div>
      <div className='flex justify-between'>
        <div className='h-4 bg-gray-100 w-20' />
        <div className='h-4 bg-gray-100 w-12' />
      </div>
      <div className='h-[1px] bg-gray-200 my-4' />
      <div className='flex justify-between'>
        <div className='h-6 bg-gray-200 w-24' />
        <div className='h-6 bg-gray-200 w-20' />
      </div>
    </div>
    <div className='h-12 bg-gray-200 w-full mt-8' />
  </div>
);

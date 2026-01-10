const SummarySkeleton = () => (
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

export default SummarySkeleton;

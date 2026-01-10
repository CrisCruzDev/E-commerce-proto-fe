import { useGetMyOrders } from '../hooks/useOrderHooks';
import OrderCard from '../components/orderComponents/OrderCard';

const OrderHistoryPage = () => {
  const { data: orders, isLoading, isError } = useGetMyOrders();

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto p-8 min-h-screen flex flex-col gap-6 animate-pulse'>
        <div className='h-12 w-1/3 bg-gray-200 rounded'></div>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className='h-40 bg-gray-100 border border-gray-200'
          ></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center font-mono'>
        <p className='text-secondary font-bold mb-4'>Failed to load orders.</p>
        <button onClick={() => window.location.reload()} className='underline'>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-4 md:p-8 min-h-screen'>
      <h1 className='font-bebas text-4xl md:text-5xl mb-8 border-b-2 border-black pb-4'>
        Your Order History
      </h1>

      {orders && orders.length === 0 ? (
        <div className='text-center py-20 bg-gray-50 border border-black/10'>
          <Package size={48} className='mx-auto mb-4 text-gray-300' />
          <h2 className='font-bebas text-2xl text-gray-400 mb-4'>
            No orders found
          </h2>
          <Link to='/'>
            <button className='bg-black text-white px-8 py-3 font-bebas tracking-wider hover:bg-gray-800 transition-colors'>
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className='space-y-8'>
          {orders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;

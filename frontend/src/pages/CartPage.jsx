import { Link } from 'react-router-dom';
import CartCard from '../components/cartPageComponents/CartCard';
import { SummaryCard } from '../components/cartPageComponents/SummaryCard';

import { useGetCart } from '../hooks/useCartHooks';
import SummarySkeleton from '../components/cartPageComponents/SummarySkeleton';
import CartSkeleton from '../components/cartPageComponents/CartSkeleton';

const CartPage = () => {
  const { data: cartItems, isLoading, isError, error } = useGetCart();

  console.log('cart: ', cartItems);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 font-bebas'>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='flex-1'>
            <div className='h-12 bg-gray-200 w-48 mb-8 rounded animate-pulse' />
            <CartSkeleton />
            <CartSkeleton />
            <CartSkeleton />
          </div>
          <div className='lg:w-1/4'>
            <SummarySkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='text-lg text-red-500'>
          Failed to load cart: {error.message}
        </p>
        <Link
          to='/'
          className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 duration-150'
        >
          Go Back
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    // Check the length of the extracted cartItems array
    return (
      <div className='py-20 flex flex-col items-center justify-start h-screen'>
        <p className='text-[75px] font-bebas text-yellow'>Your cart is empty</p>
        <Link
          to='/'
          className='px-8 py-3 border bg-primary hover:bg-black text-white font-bebas text-[20px] duration-150 rounded-xs'
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 font-bebas text-black'>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='flex-1'>
          <div className='flex items-end justify-between'>
            <h1 className='text-5xl'>Shopping Cart</h1>
            <span className='text-xl text-secondary'>
              {cartItems.length} Items
            </span>
          </div>
          <div className='hidden sm:grid grid-cols-4 gap-4 px-5 text-primary mt-5 font-mono tracking-tight'>
            <p className='col-span-2'>Item</p>

            <div className='flex justify-between col-span-2'>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
            </div>
          </div>

          {cartItems.map(item =>
            item.product ? <CartCard key={item._id} item={item} /> : null
          )}
        </div>

        <div className='lg:w-1/4'>
          <SummaryCard items={cartItems} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;

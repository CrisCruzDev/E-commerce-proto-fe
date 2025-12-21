import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCart } from '../api/cartApi';
import CartCard from '../components/cartPageComponents/CartCard';
import { SummaryCard } from '../components/cartPageComponents/SummaryCard';
import { getProductById } from '../api/productApi';
const CartPage = () => {
  const queryClient = useQueryClient();

  const {
    data: cartData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const cart = await getCart();

      // Fetch each product fully and store in cache
      await Promise.all(
        cart.items.map(async item => {
          if (item?.product?._id) {
            const fullProduct = await getProductById(item.product._id);
            queryClient.setQueryData(
              ['getProductById', item.product._id],
              fullProduct
            );
          }
        })
      );

      return cart;
    },
    refetchOnWindowFocus: true,
  });

  console.log('cart: ', cartData);

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

  const cartItems = (cartData?.items || []).filter(
    item => item.product !== null
  );

  console.log('cartItems: ', cartItems);

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
          <h1 className='text-5xl py-3'>Shopping Cart</h1>
          <div className='hidden sm:grid grid-cols-4 gap-4 pb-3 px-5 text-black mt-5'>
            <p className='col-span-2'>Item</p>

            <div className='flex justify-between col-span-2'>
              <p>Price</p> <p>Quantity</p>
              <p>Total</p>
            </div>
          </div>

          {cartItems.map(item =>
            item.product ? <CartCard key={item._id} item={item} /> : null
          )}
        </div>

        <div className='lg:w-1/4'>
          <SummaryCard item={cartItems} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;

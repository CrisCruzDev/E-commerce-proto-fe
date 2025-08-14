import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getCart } from '../api/cartApi'
import CartCard from '../components/cartPageComponents/CartCard'
import { SummaryCard } from '../components/cartPageComponents/SummaryCard'

const CartPage = () => {
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart(),
    refetchOnWindowFocus: true,
  })

  console.log('cart: ', cartData)

  const cartItems = (cartData?.items || []).filter(
    (item) => item.product !== null,
  )

  console.log('cartItems: ', cartItems)

  if (cartItems.length === 0) {
    // Check the length of the extracted cartItems array
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='text-2xl font-semibold text-gray-700 mb-4'>
          Your cart is empt
        </p>
        <Link
          to='/'
          className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 duration-150'
        >
          Continue
        </Link>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold mb-6'>Shopping Cart</h1>
          <div className='hidden sm:grid grid-cols-4 gap-4 pb-3 mt-1 px-5 border-b border-gray-300'>
            <p className='col-span-2 text-gray-500'>Item</p>

            <div className='flex justify-between col-span-2 text-gray-500'>
              <p>Price</p> <p>Quantity</p>
              <p>Total</p>
            </div>
          </div>

          {cartItems.map((item) =>
            item.product ? <CartCard key={item._id} item={item} /> : null,
          )}
        </div>

        <div className='lg:w-1/4'>
          <SummaryCard item={cartItems} />
        </div>
      </div>
    </div>
  )
}

export default CartPage

import { Link } from 'react-router-dom'

export const SummaryCard = ({ item }) => {
  const subtotal = item.reduce((acc, item) => {
    return acc + item.product?.price * item.quantity
  }, 0)

  const shipping = subtotal * 0.008
  const total = subtotal + shipping

  return (
    <div className='sticky '>
      <h2 className='text-2xl font-semibold mb-4'>Order Summary</h2>
      <div className='border-t border-gray-300 pt-4'>
        <div className='flex justify-between mb-4'>
          <p className='text-gray-600'>Subtotal</p>
          <p className='font-medium'>${subtotal.toFixed(2)}</p>
        </div>

        <div className='flex justify-between mb-4'>
          <p className='text-gray-600'>Shipping</p>
          <p className='font-medium'>${shipping.toFixed(2)}</p>
        </div>

        <div className='flex justify-between font-bold text-xl border-t border-gray-300 pt-4 mt-4'>
          <p>Total</p> <p>${total.toFixed(2)}</p>
        </div>
        <div className='w-auto mx-auto mt-15'>
          <p className='text-center text-gray-400 font-thin'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sd saq qe,
            sed do eiusmod tempor incididunt ut labore et dolore magna labore
            aliqua sed do.
          </p>
        </div>
      </div>

      <div className='mt-6'>
        <Link to='/checkout'>
          <button className='w-full py-3 bg-black/92 text-white font-medium hover:bg-black transition-colors duration-150 cursor-pointer'>
            Proceed to checkout
          </button>
        </Link>

        <div className='h-10 flex items-center'>
          <div className='flex-grow h-[0.5px] bg-gray-400'></div>
          <p className='px-3 text-black/70 font-thin'>OR</p>
          <div className='flex-grow h-[0.5px] bg-gray-400'></div>
        </div>

        <a href='/'>
          <button className='w-full py-3 border border-black font-light hover:bg-gray-100 duration-150 cursor-pointer'>
            Continue shopping
          </button>
        </a>
      </div>
    </div>
  )
}

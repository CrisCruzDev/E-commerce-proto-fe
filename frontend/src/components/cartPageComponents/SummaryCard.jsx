import { Link } from 'react-router-dom';

export const SummaryCard = ({ item }) => {
  const subtotal = item.reduce((acc, item) => {
    return acc + item.product?.price * item.quantity;
  }, 0);

  const shipping = subtotal * 0.008;
  const total = subtotal + shipping;

  return (
    <div className='sticky flex flex-col justify-between gap-12'>
      <h2 className='text-2xl mb-4'>Order Summary</h2>
      <div className='border-t border-primary/50 pt-4'>
        <div className='flex justify-between mb-4'>
          <p className='text-primary'>Subtotal</p>
          <p className='font-medium'>${subtotal.toFixed(2)}</p>
        </div>

        <div className='flex justify-between mb-4'>
          <p className='text-primary'>Shipping</p>
          <p className='font-medium'>${shipping.toFixed(2)}</p>
        </div>

        <div className='flex justify-between text-xl border-t border-primary/50 pt-4 mt-4'>
          <p>Total</p> <p>${total.toFixed(2)}</p>
        </div>
        <div className='w-auto mx-auto mt-15'>
          <p className='text-center text-primary font-thin'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sd saq qe,
            sed do eiusmod tempor incididunt ut labore et dolore magna labore
            aliqua sed do.
          </p>
        </div>
      </div>

      <div className='mt-6'>
        <Link to='/checkout'>
          <button className='w-full py-3 text-[20px] bg-primary text-white font-medium hover:bg-black transition-colors duration-150 cursor-pointer rounded-xs'>
            Proceed to checkout
          </button>
        </Link>

        <div className='h-10 flex items-center'>
          <div className='flex-grow h-[0.5px] bg-gray-400'></div>
          <p className='px-3 text-black/70 font-thin'>OR</p>
          <div className='flex-grow h-[0.5px] bg-gray-400'></div>
        </div>

        <a href='/'>
          <button className='w-full py-3 text-[20px] border border-primary font-light hover:bg-gray-100 duration-150 cursor-pointer rounded-xs'>
            Continue shopping
          </button>
        </a>
      </div>
    </div>
  );
};

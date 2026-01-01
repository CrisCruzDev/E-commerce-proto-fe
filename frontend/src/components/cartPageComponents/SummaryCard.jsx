import { Link } from 'react-router-dom';

export const SummaryCard = ({ items = [] }) => {
  // Safe calculation handling potential missing prices
  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? subtotal * 0.008 : 0;
  const total = subtotal + shipping;

  return (
    <div className='text-primary lg:sticky lg:top-24 flex flex-col gap-6 p-6 border border-black/10 bg-gray-50/30 rounded-xs'>
      <h2 className='text-3xl font-bebas uppercase tracking-wide'>
        Order Summary
      </h2>

      <div className='border-t border-black/10 pt-4 space-y-4 '>
        <div className='flex justify-between font-mono tracking-tight'>
          <p>Subtotal</p>
          <p className='font-medium text-black'>${subtotal.toFixed(2)}</p>
        </div>

        <div className='flex justify-between font-mono tracking-tight'>
          <p>Estimated Shipping</p>
          <p className='font-medium text-black'>${shipping.toFixed(2)}</p>
        </div>

        <div className='flex justify-between text-2xl font-bebas border-t border-black/10 pt-4 mt-4'>
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </div>

      <div className='mt-4 space-y-3'>
        <Link to='/checkout' className='block'>
          <button className='w-full py-4 bg-primary text-white font-bebas text-xl hover:bg-black transition-colors duration-200 rounded-xs uppercase tracking-wider shadow-sm cursor-pointer'>
            Proceed to checkout
          </button>
        </Link>

        <Link to='/' className='block'>
          <button className='w-full py-3 border border-primary font-bebas text-lg hover:bg-white hover:shadow-sm transition-all duration-200 rounded-xs uppercase cursor-pointer'>
            Continue shopping
          </button>
        </Link>
      </div>

      <p className='text-xs text-center text-gray-400 font-light mt-2 font-mono tracking-tight'>
        Secure Checkout. Taxes calculated at next step.
      </p>
    </div>
  );
};

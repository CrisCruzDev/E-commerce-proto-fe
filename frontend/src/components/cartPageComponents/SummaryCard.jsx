import { Link } from 'react-router-dom';

export const SummaryCard = ({ items }) => {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const calculateShipping = qty => {
    if (qty === 0) return 0;
    if (qty <= 3) return 5.0; // 1-3 items
    if (qty <= 6) return 8.0; // 4-6 items
    if (qty <= 10) return 12.0; // 7-10 items
    if (qty <= 15) return 18.0; // 11-15 items
    return 25.0; // 15+ items
  };

  const shippingCost = calculateShipping(totalQuantity);
  const orderTotal = subtotal + shippingCost;

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
          <p>Shipping</p>
          <p className='font-medium text-black'>${shippingCost.toFixed(2)}</p>
        </div>
        <p className='font-mono tracking-tight text-[10px] text-gray-500 italic'>
          {totalQuantity <= 3
            ? 'Standard rate applied.'
            : totalQuantity > 15
            ? 'Heavy load handling applied.'
            : 'Bulk shipping rate applied.'}
        </p>

        {/* Dynamic Shipping Notice */}

        <div className='flex justify-between text-2xl font-bebas border-t border-black/10 pt-4 mt-4'>
          <p>Total</p>
          <p>${orderTotal.toFixed(2)}</p>
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

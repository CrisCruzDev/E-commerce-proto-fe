import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-[80vh] flex flex-col items-center justify-center px-4 font-mono text-center'>
      <div className='p-4 bg-black text-white rounded-full mb-6'>
        <CheckCircle size={48} strokeWidth={1} />
      </div>

      <h1 className='font-bebas text-5xl md:text-7xl mb-4 tracking-tighter'>
        Order Complete
      </h1>

      <p className='max-w-md text-gray-500 text-sm mb-10'>
        Your transaction was successful. We have sent a receipt to your email
        address. Your items will be shipped shortly (Demo).
      </p>

      <div className='flex flex-col md:flex-row gap-4 w-full max-w-sm'>
        <Link
          to='/products'
          className='flex-1 border border-black py-4 font-bold hover:bg-black hover:text-white transition-all text-sm'
        >
          Continue Shopping
        </Link>
        <Link
          to='/profile/orders'
          className='flex-1 bg-black text-white py-4 font-bold hover:bg-zinc-800 transition-all text-sm'
        >
          View my Orders
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;

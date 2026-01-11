import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/auth';

const SuccessPage = () => {
  const user = useAuthStore(s => s.user);
  const devEmail = 'criscrosscruz@gmail.com';

  const copyDevEmail = () => {
    navigator.clipboard.writeText(devEmail);
    toast.success('Email copied!');
  };

  return (
    <div className='min-h-[80vh] flex flex-col items-center justify-center px-4 font-mono text-center'>
      <div className='p-4 bg-black text-white rounded-full mb-6'>
        <CheckCircle size={48} strokeWidth={1} />
      </div>

      <h1 className='font-bebas text-5xl md:text-7xl mb-4 tracking-tighter'>
        Order Complete
      </h1>

      {/* DEMO NOTICE */}
      <div className='max-w-sm border-2 border-black p-6 mb-10 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
        <p className='text-[10px] font-black uppercase mb-2 bg-black text-white px-2 py-1 inline-block'>
          Demo Environment
        </p>
        <p className='text-xs text-gray-700 leading-relaxed mb-4'>
          The receipt for <strong>{user?.email}</strong> was redirected to my
          developer inbox due to domain restrictions.
        </p>
        <button
          onClick={copyDevEmail}
          className='text-[12px] font-bold border-b-2 border-black transition-all pb-1 cursor-pointer'
        >
          Contact me to see the Receipt Layout criscrosscruz@gmail.com
        </button>
      </div>

      <div className='flex flex-col md:flex-row gap-4 w-full max-w-sm'>
        <Link
          to='/products'
          className='flex-1 border border-black py-4 font-bold hover:bg-black hover:text-white transition-all text-sm'
        >
          Continue Shopping
        </Link>
        <Link
          to='/orders'
          className='flex-1 bg-black text-white py-4 font-bold hover:bg-zinc-800 transition-all text-sm'
        >
          View my Orders
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;

import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../../api/authApi';
import { Link } from 'react-router-dom';
import { LogoSvg } from '../svg/LogoSvg';
import { useAuthStore } from '../../store/auth';
import toast from 'react-hot-toast';
import { useRegister } from '../../hooks/useAuth';

export const RegisterCard = ({ userData, setUserData }) => {
  const registerMutation = useRegister();

  const handleSubmit = e => {
    e.preventDefault();
    registerMutation.mutate(userData);
  };

  const handleInput = e => {
    setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className='w-105 h-115 flex flex-col items-center gap-[20px]'>
      <h1 className='text-[40px] font-bebas'>Register</h1>
      <div className='w-full pt-3 px-12'>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-[20px]'>
          {/* NAME INPUT */}
          <div className='relative'>
            <input
              type='name'
              name='name'
              id='name'
              value={userData.name}
              onChange={handleInput}
              placeholder=' ' // 👈 Required for the animation to work
              className='peer block w-full border border-black py-2 px-3 rounded-xs bg-transparent focus:outline-none focus:border-blue-500 font-sans'
            />
            <label
              htmlFor='email'
              className='absolute left-3 top-3 z-10 origin-[0] -translate-y-6 scale-75 transform bg-white px-1 text-sm duration-300 
              peer-placeholder-shown:top-3 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
              peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 
              /* COLOR CUSTOMIZATION BELOW */
              text-black peer-focus:text-blue-500 font-sans'
            >
              Name
            </label>
          </div>
          {/* EMAIL INPUT */}
          <div className='relative'>
            <input
              type='email'
              name='email'
              id='email'
              value={userData.email}
              onChange={handleInput}
              placeholder=' ' // 👈 Required for the animation to work
              className='peer block w-full border border-black py-2 px-3 rounded-xs bg-transparent focus:outline-none focus:border-blue-500 font-sans'
            />
            <label
              htmlFor='email'
              className='absolute left-3 top-3 z-10 origin-[0] -translate-y-6 scale-75 transform bg-white px-1 text-sm duration-300 
              peer-placeholder-shown:top-3 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
              peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 
              /* COLOR CUSTOMIZATION BELOW */
              text-black peer-focus:text-blue-500 font-sans'
            >
              Email address
            </label>
          </div>
          {/* PASSWORD INPUT */}
          <div className='relative'>
            <input
              type='password'
              name='password'
              id='password'
              value={userData.password}
              onChange={handleInput}
              placeholder=' '
              className='peer block w-full border border-black py-2 px-3 rounded-xs bg-transparent focus:outline-none focus:border-blue-500 font-sans'
            />
            <label
              htmlFor='password'
              className='absolute left-3 top-3 z-10 origin-[0] -translate-y-6 scale-75 transform bg-white px-1 text-sm duration-300 
              peer-placeholder-shown:top-3 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
              peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 
              /* COLOR CUSTOMIZATION BELOW */
              text-black peer-focus:text-blue-500 font-sans'
            >
              Password
            </label>
          </div>
          <div className='mt-[18px] px-8'>
            <button
              type='submit'
              className={`w-full py-3 bg-[#2E2E2E] text-white font-medium hover:bg-[#212121] transition-colors duration-150 cursor-pointer rounded-xs ${
                registerMutation.isPending ? 'opacity-50' : ''
              }`}
            >
              <p className='font-bebas text-[20px]'>Sign up</p>
            </button>
          </div>
        </form>
      </div>
      <div className='flex flex-col gap-[20px] px-12 w-full'>
        <div className='flex items-center'>
          <div className='flex-grow h-[0.5px] bg-black/20'></div>
          <p className='px-2 text-gray-400 text-sm'>Already have an account?</p>
          <div className='flex-grow h-[0.5px] bg-black/20'></div>
        </div>

        <div className='flex justify-center items-center'>
          <Link
            to='/login'
            className='text-blue-500 text-xs hover:text-blue-800'
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

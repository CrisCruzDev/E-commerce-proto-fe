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
      <h1 className='text-[25px] font-bebas'>Register</h1>
      <div className='w-full pt-5 px-12'>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-[20px]'>
          <input
            placeholder='Name'
            type='text'
            value={userData.name}
            onChange={handleInput}
            name='name'
            id='name'
            className='block w-full border border-black py-2 px-3 rounded-xs'
          />
          <input
            placeholder='Email address'
            type='email'
            value={userData.email}
            onChange={handleInput}
            name='email'
            id='email'
            className='block w-full border border-black py-2 px-3 rounded-xs'
          />
          <input
            placeholder='Password'
            type='password'
            value={userData.password}
            onChange={handleInput}
            name='password'
            id='password'
            className='block w-full border border-black py-2 px-3 rounded-xs'
          />
          <div className='mt-[18px] px-8'>
            <button
              type='submit'
              className='w-full py-3 bg-[#2E2E2E] text-white font-medium hover:bg-[#212121] transition-colors duration-150 cursor-pointer rounded-xs'
            >
              Sign up
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

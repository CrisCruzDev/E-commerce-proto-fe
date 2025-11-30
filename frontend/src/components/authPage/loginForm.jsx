import { Link } from 'react-router-dom';
import { LogoSvg } from '../svg/LogoSvg';
import toast from 'react-hot-toast';
import { useLogin } from '../../hooks/useAuth';

export const LoginCard = ({ userData, setUserData }) => {
  const loginMutation = useLogin({
    onError: () => {
      setUserData(prev => ({ ...prev, password: '' }));
    },
  });

  console.log('UserData state:', userData);
  console.log('Login mutation state:', {
    isPending: loginMutation.isPending,
    isError: loginMutation.isError,
    isSuccess: loginMutation.isSuccess,
  });

  const handleSubmit = e => {
    e.preventDefault();

    console.log('➡ SUBMIT TRIGGERED:', userData);

    // frontend validation
    if (!userData.email || !userData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    loginMutation.mutate(userData);
  };

  const handleInput = e => {
    setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <div className='flex flex-col items-start justify-center pt-10 px-20'>
        <h1 className='flex gap-4 text-[35px] leading-tight'>
          <LogoSvg />
          Welcome to my E-commerce mock up store!
        </h1>
      </div>
      <div className='flex justify-center items-center mt-10'>
        <div className='bg-white w-90 h-115 flex flex-col items-center py-7 shadow-sm'>
          <h1 className='text-[25px] font-medium'>Sign in</h1>
          <div className='w-full pt-10 px-12'>
            <form onSubmit={handleSubmit} className='flex flex-col space-y-3'>
              <input
                placeholder='Email address'
                type='email'
                value={userData.email}
                onChange={handleInput}
                name='email'
                id='email'
                className='block w-full border border-gray-300 py-2 px-3'
              />
              <input
                placeholder='password'
                type='password'
                value={userData.password}
                onChange={handleInput}
                name='password'
                id='password'
                className='block w-full border border-gray-300 py-2 px-3'
              />
              <div className='w-full flex items-start justify-end -mt-2'>
                <Link className='text-blue-500 text-xs font-medium hover:text-blue-800'>
                  forgot password?
                </Link>
              </div>
              <div className='pt-7'>
                <button
                  type='submit'
                  disabled={loginMutation.isPending}
                  className='w-full py-3 bg-black/92 text-white font-medium hover:bg-black transition-colors duration-150 cursor-pointer'
                >
                  {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
          <div className='px-12 w-full'>
            <div className='pt-3 flex items-center'>
              <div className='flex-grow h-[0.5px] bg-black/20'></div>
              <p className='px-2 text-black/30 font-thin text-sm'>
                Don't have an account?
              </p>
              <div className='flex-grow h-[0.5px] bg-black/20'></div>
            </div>

            <div className='flex justify-center items-center'>
              <Link
                to='/register'
                className='text-blue-500 text-sm font-medium hover:text-blue-800 -mt-1'
              >
                Register
              </Link>
            </div>
            <div className='py-3'>
              <button
                type='submit'
                className='flex justify-center items-center space-x-2 w-full py-3 border border-black/50 font-light hover:bg-gray-100 duration-150 cursor-pointer'
              >
                <div className='w-6'>
                  <svg
                    viewBox='-0.5 0 48 48'
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    xmlns:xlink='http://www.w3.org/1999/xlink'
                    fill='#000000'
                  >
                    <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
                    <g
                      id='SVGRepo_tracerCarrier'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    ></g>
                    <g id='SVGRepo_iconCarrier'>
                      {' '}
                      <title>Google-color</title>{' '}
                      <desc>Created with Sketch.</desc> <defs> </defs>{' '}
                      <g
                        id='Icons'
                        stroke='none'
                        stroke-width='1'
                        fill='none'
                        fill-rule='evenodd'
                      >
                        {' '}
                        <g
                          id='Color-'
                          transform='translate(-401.000000, -860.000000)'
                        >
                          {' '}
                          <g
                            id='Google'
                            transform='translate(401.000000, 860.000000)'
                          >
                            {' '}
                            <path
                              d='M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24'
                              id='Fill-1'
                              fill='#FBBC05'
                            >
                              {' '}
                            </path>{' '}
                            <path
                              d='M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333'
                              id='Fill-2'
                              fill='#EB4335'
                            >
                              {' '}
                            </path>{' '}
                            <path
                              d='M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667'
                              id='Fill-3'
                              fill='#34A853'
                            >
                              {' '}
                            </path>{' '}
                            <path
                              d='M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24'
                              id='Fill-4'
                              fill='#4285F4'
                            >
                              {' '}
                            </path>{' '}
                          </g>{' '}
                        </g>{' '}
                      </g>{' '}
                    </g>
                  </svg>
                </div>
                <p className='font-medium'>Sign in with Google</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

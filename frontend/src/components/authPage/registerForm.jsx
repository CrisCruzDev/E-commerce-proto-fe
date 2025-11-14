import { useMutation } from '@tanstack/react-query'
import { registerUser } from '../../api/authApi'
import { Link } from 'react-router-dom'
import { LogoSvg } from '../LogoSvg'
import { useAuthStore } from '../../store/auth'

export const RegisterCard = () => {
  const { setCredentials } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log('Register success:', data)
      setCredentials({
        user: data.user,
        accesToken: data.accesToken,
        refreshToken: data.refreshToken,
      })
    },
    onError: (err) => {
      console.error('Register error:', err)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    registerMutation.mutate(form)
  }

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  return (
    <>
      <div className='flex flex-col px-12 justify-center items-center w-60% h-full bg-[#FFFAF5]'>
        <h1 className='flex gap-4 text-[35px] leading-tight'>
          <LogoSvg />
          Register your account
        </h1>
        <div className='flex justify-center items-center mt-10'>
          <div className='bg-white w-90 h-115 flex flex-col items-center py-7 shadow-sm'>
            <h1 className='text-[25px] font-medium'>create an account</h1>
            <div className='w-full pt-10 px-12'>
              <form onSubmit={handleSubmit} className='flex flex-col space-y-3'>
                <input
                  placeholder='name'
                  type='text'
                  value={form.name}
                  onChange={handleInput}
                  name='name'
                  id='name'
                  className='block w-full border border-gray-300 py-2 px-3'
                />
                <input
                  placeholder='Email address'
                  type='email'
                  value={form.email}
                  onChange={handleInput}
                  name='email'
                  id='email'
                  className='block w-full border border-gray-300 py-2 px-3'
                />
                <input
                  placeholder='password'
                  type='password'
                  value={form.password}
                  onChange={handleInput}
                  name='password'
                  id='password'
                  className='block w-full border border-gray-300 py-2 px-3'
                />
                <div className='pt-7'>
                  <button
                    type='submit'
                    className='w-full py-3 bg-black/92 text-white font-medium hover:bg-black transition-colors duration-150 cursor-pointer'
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </div>
            <div className='px-12 w-full'>
              <div className='pt-3 flex items-center'>
                <div className='flex-grow h-[0.5px] bg-black/20'></div>
                <p className='px-2 text-black/30 font-thin text-sm'>
                  Already have an account?
                </p>
                <div className='flex-grow h-[0.5px] bg-black/20'></div>
              </div>

              <div className='flex justify-center items-center'>
                <Link
                  to='/login'
                  className='text-blue-500 text-sm font-medium hover:text-blue-800 -mt-1'
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

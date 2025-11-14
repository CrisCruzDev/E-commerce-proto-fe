import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import bgLogin from '../assets/login-bg.png'
import { RegisterCard } from '../components/authPage/registerForm'
import { LoginCard } from '../components/authPage/loginForm'

export const AuthPage = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  })
  const location = useLocation()
  const isRegister = location.pathname === '/register'

  useEffect(() => {
    setUserData({ email: '', password: '' })
  }, [isRegister])

  return (
    <div className='flex'>
      <div className='flex-1 h-screen bg-[#FFFAF5]'>
        {isRegister ? (
          <RegisterCard userData={userData} setUserData={setUserData} />
        ) : (
          <LoginCard userData={userData} setUserData={setUserData} />
        )}
      </div>
      <div
        className='w-1/2 h-screen bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${bgLogin})` }}
      ></div>
    </div>
  )
}

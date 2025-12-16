import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import bgLogin from '../assets/login-bg.png';
import { RegisterCard } from '../components/authPage/registerForm';
import { LoginCard } from '../components/authPage/loginForm';

const loginInitialState = {
  email: '',
  password: '',
};

const registerInitialState = {
  name: '',
  email: '',
  password: '',
};

const AuthPage = () => {
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  const [userData, setUserData] = useState(
    isRegister ? registerInitialState : loginInitialState
  );

  useEffect(() => {
    setUserData(isRegister ? registerInitialState : loginInitialState);
  }, [isRegister]);

  return (
    <div className='flex items-center justify-center py-20'>
      <div>
        {isRegister ? (
          <RegisterCard userData={userData} setUserData={setUserData} />
        ) : (
          <LoginCard userData={userData} setUserData={setUserData} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;

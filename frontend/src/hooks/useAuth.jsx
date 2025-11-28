import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import {
  getMe,
  loginUser,
  registerUser,
  requestAdminKey,
  verifyAdminKey,
} from '../api/authApi';
import { useAuthStore } from '../store/auth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();

  const setToken = useAuthStore(store => store.setToken);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: data => {
      console.log('LOGIN SUCCESS:', data);
      if (!data?.accessToken) {
        console.warn('❌ NO ACCESS TOKEN RECEIVED FROM BACKEND');
      }

      setToken(data?.accessToken);
      navigate('/');
    },
    onError: err => {
      console.error('LOGIN ERROR:', err.response?.data || err.message);
      const msg = err?.response?.data?.message;

      if (msg === 'invalid password') {
        toast.error('Wrong password');
      } else if (msg === 'user not found') {
        toast.error('Email not registered');
      } else {
        toast.error('Login failed. Try again.');
      }
    },
    ...queryOptions,
  });
};
export const useRegister = () => {
  const setToken = useAuthStore(store => store.setToken);

  return useMutation({
    mutationFn: registerUser,
    onSuccess: data => {
      console.log('REGISTER SUCCESS:', data);
      console.log('REGISTER RES:', data);
      if (!data?.accessToken) {
        toast.error('Registration succeeded but no access token received.');
        return;
      }
      setToken(data?.accessToken);
      toast.success('Logging in...');
      navigate('/');
    },
    onError: err => {
      console.error('REGISTER ERROR:', err.response?.data || err.message);
      const msg = err?.response?.data?.message;
      if (msg === 'email already exists') {
        toast.error('Email is already registered.');
      } else {
        toast.error('Registration failed.');
      }
    },
    ...queryOptions,
  });
};
export const useProfile = () => {
  const setUser = useAuthStore(store => store.setUser);
  const accessToken = useAuthStore(store => store.accessToken);
  const user = useAuthStore(store => store.user);

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await getMe();
      console.log('query result:', res);
      setUser(res);
      return res;
    },
    enabled: !!accessToken,
    onError: err => {
      console.error('ME ERROR:', err.response?.data || err.message);
    },
    onSettled: (data, error) => {
      console.log('ME settled data:', data);
      console.log('ME settled error:', error);
    },
  });
};
export const useRequestAdminKey = () => {
  return useMutation({
    mutationFn: requestAdminKey,
    onSuccess: data => {
      console.log('ADMIN REQUEST SUCCESS:', data);
    },
    onError: err => {
      console.error('ADMIN REQUEST ERROR:', err.response?.data || err.message);
    },
  });
};

export const useVerifyAdminKey = () => {
  const setUser = useAuthStore(store => store.setUser);

  return useMutation({
    mutationFn: verifyAdminKey,
    onSuccess: user => {
      console.log('ADMIN KEY VERIFIED:', user);
      setUser(prev => ({
        ...prev,
        ...user,
      }));
    },
    onError: err => {
      console.error(
        'ADMIN KEY VERIFICATION ERROR:',
        err.response?.data || err.message
      );
    },
  });
};

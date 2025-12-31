import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getMe,
  googleLogin,
  loginUser,
  logoutUser,
  registerUser,
  requestAdminKey,
  verifyAdminKey,
} from '../api/authApi';
import { useAuthStore } from '../store/auth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/product';

export const useGoogleLoginMutation = () => {
  const { setAuth } = useAuthStore.getState();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: googleLogin,
    onSuccess: res => {
      setAuth({
        user: res?.data,
        accessToken: res?.accessToken,
      });
      navigate('/');
      console.log('user google', res.data);
      console.log('accessToken google', res.accessToken);
    },
    onError: error => {
      console.error(err);
      toast.error('Google Login failed');
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async res => {
      const { setAuth } = useAuthStore.getState();
      console.log('LOGIN SUCCESS:', res);

      if (!res?.accessToken) {
        console.warn('❌ NO ACCESS TOKEN RECEIVED FROM BACKEND');
      }
      setAuth({
        accessToken: res?.accessToken,
        user: res?.data,
      });

      await useAuthStore.persist.rehydrate();
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
  const navigate = useNavigate();

  const { setAuth } = useAuthStore.getState();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: async res => {
      console.log('REGISTER SUCCESS:', res);
      console.log('REGISTER RES:', res);
      if (!res?.accessToken) {
        toast.success('Please log in');
        return;
      }
      setAuth({
        accessToken: res?.accessToken,
        user: res?.data,
      });
      await useAuthStore.persist.rehydrate();
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
// export const useProfile = () => {
//   const setUser = useAuthStore(s => s.setUser);
//   const accessToken = useAuthStore(s => s.accessToken);

//   return useQuery({
//     queryKey: ['me'],
//     queryFn: async () => {
//       const res = await getMe();
//       console.log('query result:', res);
//       return res.data;
//     },
//     enabled: !!accessToken,
//     onError: err => {
//       console.error('ME ERROR:', err.response?.data || err.message);
//     },
//     onSettled: (data, error) => {
//       console.log('ME settled data:', data);
//       console.log('ME settled error:', error);
//     },
//   });
// };
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
  const queryClient = useQueryClient();

  const setToken = useAuthStore(s => s.setToken);

  return useMutation({
    mutationFn: verifyAdminKey,
    onSuccess: res => {
      console.log('ADMIN KEY VERIFIED:', res);
      setToken(res.accessToken);
      toast.success(res.message || 'Admin privileges granted');
    },
    onError: err => {
      console.error(
        'ADMIN KEY VERIFICATION ERROR:',
        err.response?.data || err.message
      );
    },
  });
};
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const accessToken = useAuthStore(s => s.accessToken);

  return useMutation({
    mutationFn: async () => {
      if (!accessToken) return;
      try {
        await logoutUser();
      } catch (err) {
        console.warn('Logout API failed:', err);
        // still proceed with local logout
      }
    },
    onSuccess: () => {
      // CLEAR REACT QUERY CACHE
      queryClient.removeQueries(['cart']);
      queryClient.removeQueries(['products']);

      const initialAuthState = useAuthStore.getInitialState();
      const initialProductState = useProductStore.getInitialState();
      // SYNCHRONOUSLY RESET ZUSTAND IN-MEMORY STATE
      useAuthStore.setState(initialAuthState, true); // true for replace
      useProductStore.setState(initialProductState, true);

      // CLEAR PERSISTENT STORAGE
      useAuthStore.persist.clearStorage();
      useProductStore.persist.clearStorage();

      navigate('/login', { replace: true });
    },
  });
};

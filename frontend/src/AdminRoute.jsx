import { Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function AdminRoute({ children }) {
  const user = useAuthStore(store => store.user);
  const [denied, setDenied] = useState(false);

  if (!user) return <Navigate to='/login' />;

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin only.', { id: 'admin-denied' });
      setDenied(true);
    }
  }, [user]);

  if (denied) return <Navigate to='/' replace />;

  return children;
}

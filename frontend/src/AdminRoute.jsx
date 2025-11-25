import { Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';

export default function AdminRoute({ children }) {
  const user = useAuthStore(store => store.user);

  if (!user) return <Navigate to='/login' />;
  if (user.role !== 'admin') {
    toast.error('Access denied. Admin only.');
    return <Navigate to='/' replace />;
  }
  return children;
}

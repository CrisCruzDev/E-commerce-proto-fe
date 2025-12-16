import { Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.js';

export default function ProtectedRoute({ children }) {
  const token = useAuthStore(s => s.accessToken);
  const user = useAuthStore(s => s.user);

  if (!token || !user) return <Navigate to='/login' />;
  return children;
}

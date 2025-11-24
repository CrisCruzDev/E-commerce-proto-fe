import { Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.js';
import { useProfile } from './hooks/useAuth.jsx';

export default function ProtectedRoute({ children }) {
  const { isLoading, isError } = useProfile();
  const token = useAuthStore(s => s.accessToken);
  const user = useAuthStore(s => s.user);
  console.log('Protected: user', user);
  console.log('Protected: token', token);
  console.log('Protected: query status', { isLoading, isError });

  if (!token) return <Navigate to='/login' />;
  if (isLoading && !user) return <p>Loading...</p>;
  if (isError) return <Navigate to='/login' />;

  return children;
}

import { Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.js';
import { useProfile } from './hooks/useAuth.jsx';

export default function ProtectedRoute({ children }) {
  const token = useAuthStore(store => store.accessToken);
  if (!token) return <Navigate to='/login' />;

  const { data, isLoading, isError } = useProfile();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <Navigate to='/login' />;

  return children;
}

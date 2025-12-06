import { Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';

export default function GuestRoute({ children }) {
  const accessToken = useAuthStore(s => s.accessToken);

  // If token exists → user is logged in → redirect to home
  if (accessToken) {
    return <Navigate to='/' replace />;
  }

  return children;
}

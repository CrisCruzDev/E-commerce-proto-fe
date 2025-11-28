import { Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function AdminRoute({ children }) {
  const user = useAuthStore(s => s.user);

  if (!user) return <Navigate to='/login' replace />;

  if (user.role !== 'admin') return <Navigate to='/' replace />;

  return children;
}

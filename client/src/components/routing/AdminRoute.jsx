import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';

/**
 * Wraps admin-only routes. Non-admins get redirected home.
 */
export default function AdminRoute() {
  const user = useSelector(selectUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
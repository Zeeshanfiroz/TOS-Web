import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsInitialized } from '../../features/auth/authSlice';
import Spinner from '../ui/Spinner';

/**
 * Wraps admin-only routes. Non-admins get redirected home. Waits for the
 * initial session check so refreshing an admin page with a valid session
 * doesn't bounce the admin to /login.
 */
export default function AdminRoute() {
  const user = useSelector(selectUser);
  const isInitialized = useSelector(selectIsInitialized);

  if (!isInitialized) {
    return <Spinner fullPage />; // session check in progress
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
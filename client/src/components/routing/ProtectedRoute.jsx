import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsInitialized } from '../../features/auth/authSlice';
import Spinner from '../ui/Spinner';

/**
 * Wraps member-only routes. Redirects to login if not authenticated,
 * preserving the page they tried to visit. Waits for the initial session
 * check to finish first so a logged-in user refreshing the page doesn't
 * get flash-redirected to /login.
 */
export default function ProtectedRoute() {
  const user = useSelector(selectUser);
  const isInitialized = useSelector(selectIsInitialized);
  const location = useLocation();

  if (!isInitialized) {
    return <Spinner fullPage />; // session check in progress
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
}
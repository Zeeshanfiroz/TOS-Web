import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { getMe } from '../../features/auth/authSlice';
import Spinner from '../../components/ui/Spinner';

/**
 * OAuth landing page — the backend redirects here with ?token=...
 * Cookies are already set server-side; we just refresh the session
 * and move the user to their dashboard.
 */
export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Strip the token from the URL for cleanliness (spec D4.4)
    window.history.replaceState({}, '', '/oauth-success');
    dispatch(getMe()).finally(() => {
      navigate('/dashboard', { replace: true });
    });
  }, [dispatch, navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <motion.span
        className="text-5xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        🌱
      </motion.span>
      <p className="text-gray-600 font-medium">Signing you in...</p>
      <Spinner />
      {/* If something went wrong, offer a way out */}
      {params.get('error') && (
        <p className="text-red-500 text-sm">
          Login failed —{' '}
          <a href="/login" className="underline">
            try again
          </a>
        </p>
      )}
    </div>
  );
}

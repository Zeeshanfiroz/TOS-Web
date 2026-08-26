import { useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { login } from '../../features/auth/authSlice';
import { API_BASE } from '../../api/axios';
import PasswordInput from '../../components/ui/PasswordInput';
import TextField from '../../components/ui/FormFields';
import SEO from '../../components/common/SEO';

const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const user = useSelector((s) => s.auth.user);
  const isLoading = useSelector((s) => s.auth.isLoading);

  // Already logged in? Redirect
  useEffect(() => {
    if (user) navigate(location.state?.from || (user.role === 'admin' ? '/admin' : '/dashboard'));
  }, [user, navigate, location.state]);

  // OAuth failure feedback (spec D4)
  useEffect(() => {
    if (params.get('error') === 'oauth_failed') {
      toast.error('Social login failed. Please try again or use email/password.');
    }
  }, [params]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-forest-50 to-white">
      <SEO
        title="Login"
        description="Login to your Team of Sustainability account — RSVP to events, track your activity and stay updated."
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-4xl">🌱</span>
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-3">Welcome back</h1>
          <p className="text-gray-500 mt-2">Login to your TOS account</p>
        </div>

        <div className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={(values) => {
              dispatch(login(values))
                .unwrap()
                .then(() => toast.success('Logged in! 🌱'))
                .catch((msg) => toast.error(msg));
            }}
          >
            {({ errors }) => (
              <Form className="space-y-5">
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@college.edu"
                  errors={errors}
                />

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    component={PasswordInput}
                    aria-describedby="password-error"
                    aria-invalid={errors.password ? true : undefined}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400"
                  />
                  <p id="password-error" className="text-xs text-red-500 mt-1 empty:hidden">
                    {errors.password}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full py-3.5"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-center text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-forest-600 font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </p>

                {/* OAuth divider */}
                <div className="flex items-center gap-3 py-2">
                  <span className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider">or continue with</span>
                  <span className="flex-1 h-px bg-gray-200" />
                </div>

                {/* OAuth buttons — full browser redirect (spec D4) */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`${API_BASE}/auth/google`}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </a>
                  <a
                    href={`${API_BASE}/auth/github`}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </Form>
            )}
          </Formik>

          <p className="text-center text-sm text-gray-500 mt-6">
            New here?{' '}
            <Link to="/signup" className="font-semibold text-forest-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { login } from '../../features/auth/authSlice';

const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((s) => s.auth.user);
  const isLoading = useSelector((s) => s.auth.isLoading);

  // Already logged in? Redirect
  useEffect(() => {
    if (user) navigate(location.state?.from || (user.role === 'admin' ? '/admin' : '/dashboard'));
  }, [user, navigate, location.state]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-forest-50 to-white">
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
            {() => (
              <Form className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@college.edu"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400"
                  />
                  <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-1" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400"
                  />
                  <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-lg shadow-forest-200 transition-colors disabled:opacity-60"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
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
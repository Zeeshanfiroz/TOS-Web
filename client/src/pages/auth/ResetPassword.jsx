import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import PasswordInput from '../../components/ui/PasswordInput';
import SEO from '../../components/common/SEO';

const resetSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Please confirm your password'),
});

export default function ResetPassword() {
  const { token } = useParams();
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-forest-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <SEO title="Reset Password" description="Set a new password for your Team of Sustainability account." />
          <span className="text-4xl">🔐</span>
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-3">
            {done ? 'Password Reset!' : 'Set New Password'}
          </h1>
          <p className="text-gray-500 mt-2">
            {done ? 'Login with your new password.' : 'Choose a strong new password.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm">
          {done ? (
            <div className="text-center space-y-4">
              <span className="text-5xl">✅</span>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <Formik
              initialValues={{ password: '', confirmPassword: '' }}
              validationSchema={resetSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await api.post(`/auth/reset-password/${token}`, {
                    password: values.password,
                  });
                  toast.success('Password reset successful!');
                  setDone(true);
                } catch (err) {
                  toast.error(
                    err.response?.data?.message ||
                      'Reset failed — the link may have expired.'
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, errors }) => (
                <Form className="space-y-5">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                      New Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      component={PasswordInput}
                      aria-describedby="password-error"
                      aria-invalid={errors.password ? true : undefined}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400"
                    />
                    <ErrorMessage
                      id="password-error"
                      name="password"
                      component="p"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Confirm New Password
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Repeat new password"
                      component={PasswordInput}
                      aria-describedby="confirmPassword-error"
                      aria-invalid={errors.confirmPassword ? true : undefined}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400"
                    />
                    <ErrorMessage
                      id="confirmPassword-error"
                      name="confirmPassword"
                      component="p"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full py-3.5"
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password 🔐'}
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    <Link to="/login" className="hover:underline">
                      ← Back to Login
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </motion.div>
    </div>
  );
}

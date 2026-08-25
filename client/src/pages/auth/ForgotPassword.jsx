import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../api/axios';

const forgotSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-forest-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-4xl">🔑</span>
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-3">
            Forgot Password
          </h1>
          <p className="text-gray-500 mt-2">
            {sent
              ? 'Check your inbox — a reset link is on its way!'
              : 'Enter your email and we\u2019ll send you a reset link.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <span className="text-5xl">📬</span>
              <p className="text-gray-600 text-sm leading-relaxed">
                If that email is registered, you\u2019ll receive a password reset
                link valid for <strong>30 minutes</strong>. Don\u2019t forget to
                check your spam folder.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold"
              >
                ← Back to Login
              </Link>
            </div>
          ) : (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={forgotSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await api.post('/auth/forgot-password', values);
                  setSent(true);
                } catch (err) {
                  toast.error(
                    err.response?.data?.message || 'Something went wrong. Try again.'
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-lg shadow-forest-200 transition-colors disabled:opacity-60"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link 📧'}
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    Remembered it?{' '}
                    <Link to="/login" className="font-semibold text-forest-600 hover:underline">
                      Login here
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

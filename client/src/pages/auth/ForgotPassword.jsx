import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import TextField from '../../components/ui/FormFields';
import SEO from '../../components/events/common/SEO';

const forgotSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-forest-50 to-white">
      <SEO
        title="Forgot Password"
        description="Reset your Team of Sustainability account password — we'll email you a secure reset link."
      />
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
              ? 'Check your inbox — a reset link is on its way.'
              : 'Enter your email address and we will send you a reset link.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <span className="text-5xl">📬</span>
              <p className="text-gray-600 text-sm leading-relaxed">
                If that email is registered, you will receive a password reset link
                valid for <strong>30 minutes</strong>. Please also check your spam folder.
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
              {({ isSubmitting, errors }) => (
                <Form className="space-y-5">
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@college.edu"
                    errors={errors}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full py-3.5"
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

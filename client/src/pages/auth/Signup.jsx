import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { signup, verifyOtp, resendOtp } from '../../features/auth/authSlice';
import PasswordInput from '../../components/ui/PasswordInput';
import SEO from '../../components/common/SEO';

const signupSchema = Yup.object({
  name: Yup.string().trim().required('Name is required').max(80),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Please confirm your password'),
});

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const isLoading = useSelector((s) => s.auth.isLoading);

  const [step, setStep] = useState(1); // 1 = form, 2 = OTP entry
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resendIn, setResendIn] = useState(0);

  // Logged in (after OTP verified) → dashboard
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  // Resend countdown timer
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const handleSignup = async ({ confirmPassword: _omit, ...payload }) => {
    void _omit;
    try {
      await dispatch(signup(payload)).unwrap();
      setEmail(payload.email);
      setStep(2);
      setResendIn(30);
      toast.info('Verification code sent to your email 📧');
    } catch (msg) {
      toast.error(msg);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error('Enter the 6-digit code');
      return;
    }
    try {
      await dispatch(verifyOtp({ email, otp })).unwrap();
      toast.success('Email verified! Welcome to the club 🌱');
    } catch (msg) {
      toast.error(msg);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    try {
      const msg = await dispatch(resendOtp(email)).unwrap();
      toast.success(msg || 'New code sent!');
      setResendIn(30);
    } catch (msg) {
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-forest-50 to-white">
      <SEO
        title="Join the Club"
        description="Become a member of Team of Sustainability — VSSUT Burla's official sustainability club. Join IoT projects, drives and workshops."
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-4xl">🌱</span>
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-3">
            {step === 1 ? 'Join Team of Sustainability' : 'Verify Your Email'}
          </h1>
          <p className="text-gray-500 mt-2">
            {step === 1
              ? 'Become part of the campus sustainability movement'
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm">
          {step === 1 ? (
            /* ---------- STEP 1: Registration form ---------- */
            <Formik
              initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={signupSchema}
              onSubmit={handleSignup}
            >
              {() => (
                <Form className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400"
                    />
                    <ErrorMessage name="name" component="p" className="text-xs text-red-500 mt-1" />
                  </div>

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
                      placeholder="Min. 8 characters"
                      component={PasswordInput}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400"
                    />
                    <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-1" />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Confirm Password
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Repeat your password"
                      component={PasswordInput}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="p"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-lg shadow-forest-200 transition-colors disabled:opacity-60"
                  >
                    {isLoading ? 'Creating account...' : 'Create Account →'}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            /* ---------- STEP 2: OTP verification ---------- */
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2 text-center"
                >
                  Enter Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="- - - - - -"
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400 text-center text-2xl tracking-[0.5em] font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-lg shadow-forest-200 transition-colors disabled:opacity-60"
              >
                {isLoading ? 'Verifying...' : 'Verify & Join 🌱'}
              </button>

              <div className="text-center text-sm space-y-2">
                <p className="text-gray-400">Didn't get the code?</p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendIn > 0}
                  className="font-semibold text-forest-600 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                >
                  {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend Code'}
                </button>
                <p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-gray-500 hover:text-gray-700 underline"
                  >
                    ← Use a different email
                  </button>
                </p>
              </div>

              {/* Dev hint — remove in production */}
              {import.meta.env.DEV && (
                <p className="text-xs text-center text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                  💡 Dev mode: check the server terminal for the OTP if email isn't configured yet.
                </p>
              )}
            </form>
          )}

          {step === 1 && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Already a member?{' '}
              <Link to="/login" className="font-semibold text-forest-600 hover:underline">
                Login here
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
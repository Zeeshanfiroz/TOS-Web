import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { submitContact, clearContactState } from '../../features/contact/contactSlice';

const contactSchema = Yup.object({
  name: Yup.string().trim().required('Name is required').max(100),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  message: Yup.string()
    .trim()
    .required('Message is required')
    .max(2000, 'Message is too long'),
});

export default function Contact() {
  const dispatch = useDispatch();
  const { isSubmitting, successMessage, error } = useSelector((s) => s.contact);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearContactState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearContactState());
    }
  }, [successMessage, error, dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Info side */}
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="section-title">Get in Touch</h1>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Have an idea for a green initiative? Want to collaborate on an event?
            Or just want to say hi? Drop us a message — we usually reply within
            48 hours.
          </p>

          <div className="mt-10 space-y-5">
            {[
              ['📍', 'Visit Us', 'VSSUT Campus, Burla, Sambalpur, Odisha'],
              ['📧', 'Email Us', 'teamofsustainability@vssut.ac.in'],
              ['📷', 'Follow Us', '@teamofsustainability on Instagram'],
            ].map(([icon, title, detail]) => (
              <div key={title} className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-xl bg-forest-100 flex items-center justify-center text-xl shrink-0">
                  {icon}
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form side */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm"
        >
          <Formik
            initialValues={{ name: '', email: '', message: '' }}
            validationSchema={contactSchema}
            onSubmit={(values, { resetForm }) => {
              dispatch(submitContact(values)).then(() => resetForm());
            }}
          >
            {() => (
              <Form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Name
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
                    Email Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@college.edu"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400"
                  />
                  <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-1" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message
                  </label>
                  <Field
                    as="textarea"
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400 resize-none"
                  />
                  <ErrorMessage name="message" component="p" className="text-xs text-red-500 mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-lg shadow-forest-200 transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message 🌱'}
                </button>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
}
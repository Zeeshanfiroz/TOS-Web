import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { submitContact, clearContactState } from '../../features/contact/contactSlice';
import TextField, { TextArea } from '../../components/ui/FormFields';
import SEO from '../../components/common/SEO';

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
  const navigate = useNavigate();
  const { isSubmitting, successMessage, error } = useSelector((s) => s.contact);

  useEffect(() => {
    if (successMessage) {
      dispatch(clearContactState());
      navigate('/thank-you');
    }
    if (error) {
      toast.error(error);
      dispatch(clearContactState());
    }
  }, [successMessage, error, dispatch, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO
        title="Contact Us"
        description="Get in touch with Team of Sustainability at VSSUT Burla — collaborate on green initiatives, events or ask us anything."
      />
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
              ['📷', 'Follow Us', '@teamofsustainability_vssut • @tos_virtoswa'],
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
            {({ errors }) => (
              <Form className="space-y-5">
                <TextField
                  label="Your Name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  errors={errors}
                />

                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="jane@college.edu"
                  errors={errors}
                />

                <TextArea
                  label="Message"
                  name="message"
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  errors={errors}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full py-3.5"
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
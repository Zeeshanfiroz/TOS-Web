import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';

/**
 * ThankYou — shown after successful form submissions
 * (contact form, membership signup confirmation etc.)
 */
export default function ThankYou() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <SEO
        title="Thank You"
        description="Thank you for reaching out to Team of Sustainability — we'll get back to you soon!"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        className="text-center max-w-lg"
      >
        <motion.span
          className="inline-block text-7xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        >
          🌱
        </motion.span>

        <h1 className="font-display text-4xl font-bold text-gray-900 mt-6">
          Thank You!
        </h1>
        <p className="text-gray-600 mt-4 leading-relaxed">
          Your message has been received. A member of our team will get back to
          you within <strong>48 hours</strong>.
        </p>

        <div className="bg-forest-50 border border-forest-100 rounded-2xl p-6 mt-8 text-left">
          <h2 className="font-display font-semibold text-forest-800 mb-3">
            What happens next?
          </h2>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>We review your message and pick the right person to respond</li>
            <li>You'll hear from us at the email address you provided</li>
            <li>Meanwhile, explore our events and follow us on Instagram!</li>
          </ol>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-8 py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-lg shadow-forest-200 transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            to="/events"
            className="px-8 py-3.5 rounded-xl border border-forest-200 text-forest-700 font-semibold hover:bg-forest-50 transition-colors"
          >
            Explore Events
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

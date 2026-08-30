import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/events/common/SEO';

/**
 * 404 — animated not-found page.
 */
export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      <SEO title="Page Not Found" />
      {/* Floating leaves */}
      {['🍃', '🌿', '🍂'].map((leaf, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl opacity-20"
          style={{ left: `${15 + i * 30}%` }}
          animate={{ y: [-20, -80, -20], rotate: [0, 20, -15, 0] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {leaf}
        </motion.span>
      ))}

      {/* Big gradient 404 */}
      <motion.h1
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        className="font-display text-[7rem] md:text-[10rem] font-extrabold leading-none text-gradient select-none"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-xl font-display font-semibold text-gray-800"
      >
        This page wandered off into the wild 🍃
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 mt-2 max-w-md"
      >
        The page you’re looking for doesn’t exist or may have been moved. Let’s
        guide you back to the right path.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mt-8 flex flex-col sm:flex-row gap-3"
      >
        <Link
          to="/"
          className="shine px-8 py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-lg shadow-forest-200 transition-colors"
        >
          ← Back to Home
        </Link>
        <Link
          to="/events"
          className="px-8 py-3.5 rounded-xl border border-forest-200 text-forest-700 font-semibold hover:bg-forest-50 transition-colors"
        >
          Browse Events
        </Link>
      </motion.div>
    </div>
  );
}

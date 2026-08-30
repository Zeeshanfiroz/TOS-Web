import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CookieBanner — lightweight consent banner.
 * Stores consent in localStorage; analytics only load after acceptance.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
    // If previously accepted, allow analytics to load
    if (consent === 'accepted') {
      window.dispatchEvent(new Event('cookie-consent-accepted'));
    }
  }, []);

  const respond = (choice) => {
    localStorage.setItem('cookie-consent', choice);
    setVisible(false);
    if (choice === 'accepted') {
      window.dispatchEvent(new Event('cookie-consent-accepted'));
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="fixed bottom-0 inset-x-0 z-[90] p-4 md:p-5"
        >
          <div className="max-w-4xl mx-auto glass border border-forest-200 rounded-2xl shadow-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-2xl">🍪</span>
            <p className="text-sm text-gray-700 flex-1 leading-relaxed">
              We use essential cookies to keep you logged in, and optional
              analytics to improve the site. Read our{' '}
              <Link to="/privacy-policy" className="text-forest-700 font-semibold hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => respond('declined')}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => respond('accepted')}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

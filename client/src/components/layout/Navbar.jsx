import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout, selectUser, selectIsAdmin } from '../../features/auth/authSlice';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Shrink + deepen blur/shadow once the user scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    setOpen(false);
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'text-forest-700' : 'text-gray-600 hover:text-forest-700'
    }`;

  const mobileLinkClass =
    'block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-forest-700 hover:bg-forest-50 transition-colors';

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 border-b transition-all duration-300 relative bg-white ${
        scrolled
          ? 'border-humus/20 shadow-[0_8px_24px_-16px_rgba(38,32,26,0.45)]'
          : 'border-humus/15 shadow-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'h-14' : 'h-16'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <motion.img
              src="/Logo.png"
              alt="Team of Sustainability logo"
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="h-8 w-8 object-contain"
            />
            <span className="font-display font-bold text-base sm:text-lg text-forest-800 leading-tight">
              Team of <span className="text-gradient">Sustainability</span>
              <span className="block text-[10px] font-medium text-gray-500 -mt-0.5">
                VSSUT, Burla
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-forest-500"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-white bg-forest-700 hover:bg-forest-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-forest-700 hover:text-forest-800"
                >
                  {user.name.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-forest-700 hover:text-forest-800 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  Join Us
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-forest-50"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6 text-forest-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden absolute inset-x-0 top-full z-40 overflow-hidden border-t border-humus/15 bg-white shadow-[0_18px_30px_-22px_rgba(38,32,26,0.45)]"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <NavLink
                    to={l.to}
                    className={linkClass}
                    end={l.to === '/'}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.04, duration: 0.2 }}
                className="pt-2 border-t border-forest-100 space-y-1"
              >
                {user ? (
                  <>
                    <Link to="/dashboard" className={mobileLinkClass} onClick={() => setOpen(false)}>
                      My Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className={mobileLinkClass} onClick={() => setOpen(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={mobileLinkClass} onClick={() => setOpen(false)}>
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-3 py-2 rounded-lg text-sm font-semibold text-white bg-forest-600"
                      onClick={() => setOpen(false)}
                    >
                      Join Us
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
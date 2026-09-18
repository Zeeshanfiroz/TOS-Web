import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieBanner from '../events/common/CookieBanner';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip-to-content — first tabbable element for keyboard users (item 7) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-forest-600 focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main
        id="main-content"
        key={location.pathname}
        className="flex-1 opacity-100 transition-opacity duration-200 ease-out"
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
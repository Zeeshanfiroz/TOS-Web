import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Layout (tiny, kept eager — needed on every page)
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';
import Spinner from './components/ui/Spinner';

// Analytics (consent-gated)
import { initAnalytics, trackPageview } from './analytics';

/* ── Route-based code splitting ──
   Every page is lazy-loaded so public visitors never download admin-panel
   JS (and vice versa). The initial bundle shrinks to layout + Home. */
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Events = lazy(() => import('./pages/public/Events'));
const EventDetail = lazy(() => import('./pages/public/EventDetail'));
const Gallery = lazy(() => import('./pages/public/Gallery'));
const Announcements = lazy(() => import('./pages/public/Announcements'));
const AnnouncementDetail = lazy(() => import('./pages/public/AnnouncementDetail'));
const Team = lazy(() => import('./pages/public/Team'));
const Contact = lazy(() => import('./pages/public/Contact'));

const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const OAuthSuccess = lazy(() => import('./pages/auth/OAuthSuccess'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

const ThankYou = lazy(() => import('./pages/public/ThankYou'));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/public/Terms'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

const Dashboard = lazy(() => import('./pages/member/Dashboard'));

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageEvents = lazy(() => import('./pages/admin/ManageEvents'));
const ManageAnnouncements = lazy(() => import('./pages/admin/ManageAnnouncements'));
const ManageGallery = lazy(() => import('./pages/admin/ManageGallery'));
const ManageMembers = lazy(() => import('./pages/admin/ManageMembers'));
const ContactMessages = lazy(() => import('./pages/admin/ContactMessages'));

export default function App() {
  const location = useLocation();

  // Load analytics only after cookie consent (item #17)
  useEffect(() => {
    if (localStorage.getItem('cookie-consent') === 'accepted') initAnalytics();
    const handler = () => initAnalytics();
    window.addEventListener('cookie-consent-accepted', handler);
    return () => window.removeEventListener('cookie-consent-accepted', handler);
  }, []);

  // SPA pageview tracking on every route change
  useEffect(() => {
    trackPageview(location.pathname);
  }, [location.pathname]);

  return (
    // Suspense fallback while a lazy page chunk downloads
    <Suspense fallback={<Spinner fullPage />}>
      <Routes>
        {/* Public */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/announcements/:id" element={<AnnouncementDetail />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Post-action & legal */}
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Member area (protected) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Admin panel (protected + admin only) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="announcements" element={<ManageAnnouncements />} />
              <Route path="gallery" element={<ManageGallery />} />
              <Route path="members" element={<ManageMembers />} />
              <Route path="messages" element={<ContactMessages />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
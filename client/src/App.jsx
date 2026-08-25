import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';

// Public pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Events from './pages/public/Events';
import EventDetail from './pages/public/EventDetail';
import Gallery from './pages/public/Gallery';
import Announcements from './pages/public/Announcements';
import AnnouncementDetail from './pages/public/AnnouncementDetail';
import Team from './pages/public/Team';
import Contact from './pages/public/Contact';

// Auth
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import OAuthSuccess from './pages/auth/OAuthSuccess';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Post-action & legal
import ThankYou from './pages/public/ThankYou';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Terms from './pages/public/Terms';

// 404
import NotFound from './pages/public/NotFound';

// Analytics (consent-gated)
import { initAnalytics, trackPageview } from './analytics';

// Member
import Dashboard from './pages/member/Dashboard';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageGallery from './pages/admin/ManageGallery';
import ManageMembers from './pages/admin/ManageMembers';
import ContactMessages from './pages/admin/ContactMessages';

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
  );
}
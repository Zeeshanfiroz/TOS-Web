import { Routes, Route } from 'react-router-dom';

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
        <Route
          path="*"
          element={
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
              <span className="text-6xl">🍂</span>
              <h1 className="section-title">Page not found</h1>
              <a href="/" className="text-forest-600 hover:underline font-medium">
                Back to Home
              </a>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
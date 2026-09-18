const routeLoaders = {
  home: () => import('../pages/public/Home'),
  about: () => import('../pages/public/About'),
  events: () => import('../pages/public/Events'),
  eventDetail: () => import('../pages/public/EventDetail'),
  announcements: () => import('../pages/public/Announcements'),
  announcementDetail: () => import('../pages/public/AnnouncementDetail'),
  projects: () => import('../pages/public/Projects'),
  team: () => import('../pages/public/Team'),
  login: () => import('../pages/auth/Login'),
  signup: () => import('../pages/auth/Signup'),
  oauthSuccess: () => import('../pages/auth/OAuthSuccess'),
  forgotPassword: () => import('../pages/auth/ForgotPassword'),
  resetPassword: () => import('../pages/auth/ResetPassword'),
  dashboard: () => import('../pages/member/Dashboard'),
  adminDashboard: () => import('../pages/admin/AdminDashboard'),
  manageEvents: () => import('../pages/admin/ManageEvents'),
  manageProjects: () => import('../pages/admin/ManageProjects'),
  manageAnnouncements: () => import('../pages/admin/ManageAnnouncements'),
  manageTeam: () => import('../pages/admin/ManageTeam'),
  manageMembers: () => import('../pages/admin/ManageMembers'),
  contactMessages: () => import('../pages/admin/ContactMessages'),
};

export const prefetchRoute = (routeKey) => {
  const loader = routeLoaders[routeKey];
  if (!loader) return;

  if (typeof window === 'undefined') return;

  const scheduler = window.requestIdleCallback || ((cb) => setTimeout(cb, 150));
  scheduler(() => {
    void loader();
  });
};

export const prefetchLikelyRoutes = () => {
  const keys = [
    'home',
    'events',
    'announcements',
    'projects',
    'team',
    'login',
    'signup',
    'dashboard',
    'adminDashboard',
  ];

  keys.forEach((key) => prefetchRoute(key));
};

export const getAuthRedirect = (from, fallback = '/dashboard') => {
  if (typeof from !== 'string' || !from.trim()) return fallback;

  if (/^https?:\/\//i.test(from)) {
    window.location.assign(from);
    return null;
  }

  return from.startsWith('/') ? from : fallback;
};
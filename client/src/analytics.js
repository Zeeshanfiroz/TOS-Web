/**
 * Consent-gated GA4 analytics.
 * - Loads the gtag script ONLY after the user accepts cookies.
 * - Pageviews fire manually on React Router navigations (SPA doesn't trigger them).
 * - Set VITE_GA_ID in client env to enable; without it everything is a no-op.
 */
let loaded = false;

export const initAnalytics = () => {
  const GA_ID = import.meta.env.VITE_GA_ID;
  if (!GA_ID || loaded) return;
  loaded = true;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false }); // manual pageviews
  console.log('📊 Analytics enabled (consent given)');
};

export const trackPageview = (path) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', { page_path: path });
  }
};

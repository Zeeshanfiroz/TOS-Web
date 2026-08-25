import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Team of Sustainability — VSSUT, Burla';
const OG_IMAGE = '/og-image.png';
const SITE_URL = 'https://tos-web-mauve.vercel.app';

/**
 * SEO — per-page title, description, Open Graph & Twitter cards.
 * Usage: <SEO title="Events" description="..." />
 */
export default function SEO({ title, description }) {
  const fullTitle = title ? `${title} | TOS VSSUT` : SITE_NAME;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={`${SITE_URL}${OG_IMAGE}`} />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={`${SITE_URL}${OG_IMAGE}`} />
    </Helmet>
  );
}

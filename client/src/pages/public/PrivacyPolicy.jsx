import { Link } from 'react-router-dom';
import SEO from '../../components/events/common/SEO';

const sections = [
  {
    title: '1. What Data We Collect',
    items: [
      'Account details: your name, email address and password (stored securely hashed with bcrypt) when you register.',
      'Contact form submissions: your name, email and message content.',
      'Event RSVPs: which events you plan to attend.',
      'Uploaded images: photos you submit to the club gallery (stored on ImageKit cloud storage).',
      'Technical data: standard server logs (IP address, browser type) for security and rate limiting.',
    ],
  },
  {
    title: '2. How We Use Your Data',
    items: [
      'To operate your club membership and authenticate you.',
      'To send transactional emails (OTP verification, welcome message, password reset) via our email service provider Brevo.',
      'To plan events and respond to your enquiries.',
      'We never sell your personal data to anyone.',
    ],
  },
  {
    title: '3. Cookies',
    items: [
      'We use essential cookies (httpOnly) to keep you logged in — these cannot be read by scripts and are required for the site to function.',
      'We do not use advertising or third-party tracking cookies.',
    ],
  },
  {
    title: '4. Third-Party Services',
    items: [
      'MongoDB Atlas — database hosting (user and content data).',
      'ImageKit — cloud image storage and delivery for gallery/event photos.',
      'Brevo — transactional email delivery (OTP and notifications).',
      'Render / Vercel — application hosting.',
      'These services process data only as needed to provide their functionality.',
    ],
  },
  {
    title: '5. Your Rights',
    items: [
      'Request a copy of the personal data we hold about you.',
      'Request correction or deletion of your account and data.',
      'Withdraw consent for communications at any time.',
      'To exercise any of these rights, email us at teamofsustainability@vssut.ac.in.',
    ],
  },
  {
    title: '6. Data Security',
    items: [
      'Passwords are hashed with bcrypt and never stored in plain text.',
      'Sessions use httpOnly, secure cookies with rate-limited endpoints.',
      'Access to production systems is restricted to club administrators.',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO
        title="Privacy Policy"
        description="How Team of Sustainability (VSSUT Burla) collects, uses and protects your data — cookies, third-party services and your rights."
      />
      <h1 className="section-title">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mt-2">Last updated: August 2026</p>

      <p className="text-gray-600 mt-6 leading-relaxed">
        Team of Sustainability (&quot;we&quot;, &quot;the club&quot;), VSSUT
        Burla, respects your privacy. This policy explains what data we collect
        through this website and how we use it.
      </p>

      {sections.map((s) => (
        <section key={s.title} className="mt-10">
          <h2 className="font-display text-xl font-semibold text-forest-800">{s.title}</h2>
          <ul className="mt-3 space-y-2 text-gray-600 text-sm leading-relaxed list-disc list-inside">
            {s.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest-800">7. Contact</h2>
        <p className="mt-3 text-gray-600 text-sm leading-relaxed">
          Questions about this policy? Reach us at{' '}
          <a
            href="mailto:teamofsustainability@vssut.ac.in"
            className="text-forest-600 hover:underline"
          >
            teamofsustainability@vssut.ac.in
          </a>{' '}
          or visit us at VSSUT, Burla, Sambalpur, Odisha. See also our{' '}
          <Link to="/terms" className="text-forest-600 hover:underline">
            Terms of Use
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

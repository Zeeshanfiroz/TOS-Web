import { Link } from 'react-router-dom';
import SEO from '../../components/events/common/SEO';

const sections = [
  {
    title: '1. Accounts & Responsibilities',
    items: [
      'You must provide accurate information when registering.',
      'Keep your password confidential — you are responsible for activity on your account.',
      'One account per person. Accounts found impersonating others will be removed.',
    ],
  },
  {
    title: '2. Acceptable Use',
    items: [
      'Do not misuse the platform — no spam, abuse, harassment or illegal content.',
      'RSVP only for events you genuinely intend to attend (repeated no-shows may affect future RSVPs).',
      'Automated scraping, crawling or attempts to breach the platform are prohibited.',
    ],
  },
  {
    title: '3. Content Ownership',
    items: [
      'Photos you upload to the gallery remain yours, but you grant the club a non-exclusive right to display them on this website and social media with credit.',
      'Only upload photos you have the right to share and that have consent of people pictured.',
      'Club announcements and content are property of Team of Sustainability, VSSUT Burla.',
    ],
  },
  {
    title: '4. Availability & Liability',
    items: [
      'The service is provided "as is". We aim for high availability but do not guarantee uninterrupted access.',
      'Team of Sustainability is not liable for any indirect damages arising from use of this platform.',
      'Event details (dates, locations) may change — always confirm via official club channels before attending.',
    ],
  },
  {
    title: '5. Changes & Contact',
    items: [
      'We may update these terms; significant changes will be announced on the Announcements page.',
      'Continued use of the platform after changes means you accept the updated terms.',
      'Questions? Email teamofsustainability@vssut.ac.in.',
    ],
  },
];

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO
        title="Terms of Use"
        description="Terms of use for the Team of Sustainability website — accounts, acceptable use, content ownership and liability."
      />
      <h1 className="section-title">Terms of Use</h1>
      <p className="text-sm text-gray-500 mt-2">Last updated: August 2026</p>

      <p className="text-gray-600 mt-6 leading-relaxed">
        By using this website and becoming a member of Team of Sustainability,
        VSSUT Burla, you agree to the following terms.
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
        <p className="text-gray-600 text-sm leading-relaxed">
          See also our{' '}
          <Link to="/privacy-policy" className="text-forest-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

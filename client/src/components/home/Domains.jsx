import SectionHeading from './SectionHeading';

// The club's four working domains — from the club's own decks.
// Each domain gets its own accent + line icon so the cards scan as
// distinct, not four identical gray boxes (review Tier 2.6).
const DOMAINS = [
  {
    no: '01',
    title: 'Technical',
    body: 'IoT-based embedded systems that monitor and collect data — robotic and sensor builds aimed at real-life sustainability problems.',
    accent: 'text-neem border-t-neem bg-neem/10',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" rx="1.5" />
        <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
      </svg>
    ),
  },
  {
    no: '02',
    title: 'Design & Content',
    body: 'Posters, infographics, video and social media that spread awareness — and the narratives that make sustainability goals land.',
    accent: 'text-terracotta border-t-terracotta bg-terracotta/10',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19l7-7-4-4-7 7-1 5z" />
        <path d="M15 8l1.5-1.5a2.1 2.1 0 0 1 3 3L18 11" />
      </svg>
    ),
  },
  {
    no: '03',
    title: 'Event Management',
    body: 'Eco-conscious events: minimal waste, energy-efficient venues, green catering. Campaigns, workshops and clean-up drives, run with communities and volunteers.',
    accent: 'text-mahanadi border-t-mahanadi bg-mahanadi/10',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M4 10h16M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    no: '04',
    title: 'Research & Development',
    body: 'New methods for old problems, developed sustainably — plus bootcamps and research programs for members.',
    accent: 'text-laterite border-t-laterite bg-laterite/10',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 3h4M11 3v6l-5.5 9.2A1.8 1.8 0 0 0 7.2 21h9.6a1.8 1.8 0 0 0 1.7-2.8L13 9V3" />
        <path d="M8.5 15h7" />
      </svg>
    ),
  },
];

/**
 * Domains — the four ways into the club (Stage 4 content). Numbered cards
 * with a per-domain accent, line icon and top-border so each scans as its
 * own discipline (review Tier 2.6).
 */
export default function Domains() {
  return (
    <section className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 md:grid md:grid-cols-[180px_1fr] md:gap-12">
      <SectionHeading eyebrow="Four domains" title="Choose your path." />
      <div>
        <div className="domains-grid grid gap-5 sm:grid-cols-2">
          {DOMAINS.map((d) => (
            <article
              key={d.no}
              className={`domain-card rounded-md border border-humus/30 border-t-2 bg-kraft-card p-5 shadow-[0_1px_2px_rgba(38,32,26,0.05),0_10px_22px_-18px_rgba(38,32,26,0.4)] ${d.accent.split(' ').slice(1).join(' ')}`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${d.accent.split(' ').slice(0, 1).join(' ')} ${d.accent.split(' ').slice(2, 3).join(' ')}`}>
                  {d.icon}
                </span>
                <span className="font-display text-sm font-semibold text-humus/40">{d.no}</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-humus">{d.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-humus/80">{d.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


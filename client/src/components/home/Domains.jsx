import SectionHeading from './SectionHeading';

// The club's four working domains — from the club's own decks.
const DOMAINS = [
  {
    no: '01',
    title: 'Technical',
    body: 'IoT-based embedded systems that monitor and collect data — robotic and sensor builds aimed at real-life sustainability problems.',
  },
  {
    no: '02',
    title: 'Design & Content',
    body: 'Posters, infographics, video and social media that spread awareness — and the narratives that make sustainability goals land.',
  },
  {
    no: '03',
    title: 'Event Management',
    body: 'Eco-conscious events: minimal waste, energy-efficient venues, green catering. Campaigns, workshops and clean-up drives, run with communities and volunteers.',
  },
  {
    no: '04',
    title: 'Research & Development',
    body: 'New methods for old problems, developed sustainably — plus bootcamps and research programs for members.',
  },
];

/**
 * Domains — the four ways into the club (Stage 4 content). Typographic
 * numbered cards, no icon crutch.
 */
export default function Domains() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:grid md:grid-cols-[180px_1fr] md:gap-12">
      <SectionHeading eyebrow="Four domains" title="Pick your way in." />
      <div>
        <div className="domains-grid grid gap-5 sm:grid-cols-2">
          {DOMAINS.map((d) => (
            <article
              key={d.no}
              className="domain-card rounded-md border border-humus/30 bg-kraft-card p-5"
            >
              <span className="font-display text-sm font-semibold text-neem">{d.no}</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-humus">{d.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-humus/80">{d.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

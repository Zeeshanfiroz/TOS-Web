import SectionHeading from './SectionHeading';

// Real club projects — sourced from the club's project decks.
// buildPhoto: add the circuit/build photo URL from the decks when the
// club shares originals — the card header slot renders it automatically.
const PROJECTS = [
  {
    no: '01',
    title: 'Waste-sorting machine',
    body: 'A bin that sorts itself. An inductive sensor catches metal, a moisture sensor flags wet waste, an IR sensor detects the drop — the Arduino Uno processes all three and a motor driver slides the right bin into position.',
    tags: ['Arduino Uno', 'IR · moisture · metal sensors', 'Motor driver'],
    buildPhoto: null,
  },
  {
    no: '02',
    title: 'Solar tracker',
    body: 'A panel that follows the sun. LDRs read the light direction and feed the Arduino, which commands servo motors to reposition the panel for maximum capture through the day. GSM module reports the data.',
    tags: ['LDR sensors', 'Servo motors', 'GSM module'],
    buildPhoto: null,
  },
  {
    no: '03',
    title: 'Paper recycling',
    body: "The club's first public build, exhibited at Makers Fest 2023 — recycled paper made and demonstrated end to end on the fest floor.",
    tags: ['Makers Fest 2023'],
    buildPhoto: null,
  },
];

/* Engineering-drawing header motif per card — the club's builds ARE
   circuit diagrams, so the placeholder speaks the project's language.
   Replace with the real build photo (buildPhoto) when available. */
function BuildMotif({ variant }) {
  const flips = ['scale-x-100', '-scale-x-100', 'scale-x-100 -translate-y-1'];
  return (
    <div className="mb-4 overflow-hidden rounded-sm border border-humus/20 bg-humus">
      <svg
        viewBox="0 0 300 100"
        className={`h-20 w-full ${flips[variant % flips.length]}`}
        aria-hidden="true"
      >
        <g stroke="#3E7A4C" strokeOpacity="0.7" strokeWidth="1.5" fill="none">
          <polyline points="0,30 70,30 90,50 180,50" />
          <polyline points="300,70 230,70 210,50 150,50" />
          <polyline points="0,80 50,80 70,60 130,60" />
        </g>
        <g stroke="#31605F" strokeOpacity="0.6" strokeWidth="1.5" fill="none">
          <polyline points="300,25 240,25 220,45 160,45" />
        </g>
        <g fill="#3E7A4C" fillOpacity="0.8">
          <circle cx="90" cy="50" r="3.5" />
          <circle cx="210" cy="50" r="3.5" />
          <circle cx="70" cy="60" r="3" />
        </g>
        <g fill="#C05B2E">
          <circle cx="180" cy="50" r="3" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Projects — the club's real builds, spec-card style: build-motif header,
 * number, title, how-it-works, component tags. No stock photos; the
 * hardware IS the visual.
 */
export default function Projects() {
  return (
    <section className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 md:grid md:grid-cols-[180px_1fr] md:gap-12">
      <SectionHeading eyebrow="What we build" title="Ideas turned into action." />
      <div>
        <p className="max-w-md text-[15px] font-medium leading-relaxed text-humus/85">
          Student-built solutions for real sustainability challenges — designed,
          tested and demonstrated by the people behind them.
        </p>

        <div className="projects-grid mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <article
              key={p.no}
              className="project-card flex flex-col rounded-md border border-humus/30 bg-kraft-card p-5 shadow-[0_1px_2px_rgba(38,32,26,0.05),0_10px_22px_-18px_rgba(38,32,26,0.4)]"
            >
              {p.buildPhoto ? (
                <img
                  src={p.buildPhoto}
                  alt={`${p.title} — build photo`}
                  loading="lazy"
                  className="mb-4 h-20 w-full rounded-sm object-cover"
                />
              ) : (
                <BuildMotif variant={i} />
              )}
              <span className="font-display text-sm font-semibold text-neem">#{p.no}</span>
              <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-humus">
                {p.title}
              </h3>
              <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-humus/80">
                {p.body}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Components">
                {p.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded border border-humus/20 px-2 py-0.5 text-[11px] font-medium text-humus/70"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-4 text-xs text-humus/60">
          More build stories are on the way from our project teams — come talk to us at a campus drive.
        </p>
      </div>
    </section>
  );
}

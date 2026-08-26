import SectionHeading from './SectionHeading';

// Real club projects — sourced from the club's project decks.
const PROJECTS = [
  {
    no: '01',
    title: 'Waste-sorting machine',
    body: 'A bin that sorts itself. An inductive sensor catches metal, a moisture sensor flags wet waste, an IR sensor detects the drop — the Arduino Uno processes all three and a motor driver slides the right bin into position.',
    tags: ['Arduino Uno', 'IR · moisture · metal sensors', 'Motor driver'],
  },
  {
    no: '02',
    title: 'Solar tracker',
    body: 'A panel that follows the sun. LDRs read the light direction and feed the Arduino, which commands servo motors to reposition the panel for maximum capture through the day. GSM module reports the data.',
    tags: ['LDR sensors', 'Servo motors', 'GSM module'],
  },
  {
    no: '03',
    title: 'Paper recycling',
    body: 'The club\'s first public build, exhibited at Makers Fest 2023 — recycled paper made and demonstrated end to end on the fest floor.',
    tags: ['Makers Fest 2023'],
  },
];

/**
 * Projects — the club's real builds, spec-card style: number, title,
 * how-it-works, component tags. No stock photos; the hardware IS the visual.
 */
export default function Projects() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:grid md:grid-cols-[180px_1fr] md:gap-12">
      <SectionHeading eyebrow="What we build" title="Projects, not promises." />
      <div>
        <p className="max-w-md text-[15px] font-medium leading-relaxed text-humus/85">
          Student-built hardware aimed at real sustainability problems —
          designed, wired and demoed by members.
        </p>

        <div className="projects-grid mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <article
              key={p.no}
              className="project-card flex flex-col rounded-md border border-humus/30 bg-kraft-card p-5"
            >
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
          Full build writeups coming from the project teams — ask us anything at a drive.
        </p>
      </div>
    </section>
  );
}

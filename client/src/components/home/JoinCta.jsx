import SectionHeading from './SectionHeading';
import Button from '../ui/Button';

// Real member outcomes — from the club's own decks ("what members learn").
const LEARN = [
  'Arduino, sensors & embedded builds',
  'CAD, web development & data analysis',
  'Event planning, end to end',
  'Public speaking & outreach',
  'Graphic design & content writing',
  'Trash-to-treasure upcycling',
];

/**
 * Join CTA — the intent moment. Real "what you learn" outcomes, one
 * action, generous bottom whitespace before the footer.
 */
export default function JoinCta() {
  return (
    /* Tonal break #2 — full Humus dark closing beat (Stage: section rhythm) */
    <section className="join-section paper-texture bg-humus py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:grid md:grid-cols-[180px_1fr] md:gap-12">
        <SectionHeading eyebrow="Join" dark />
        <div className="join-copy mt-6 md:mt-0">
          <h2 className="max-w-xl font-display text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-kraft">
            You learn more here than in a classroom elective.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] font-medium leading-relaxed text-kraft/85">
            Pick a domain — technical, design, events or research — and learn by
            building. Members leave with working hardware, planned events and the
            confidence to present any of it on stage.
          </p>

          <ul className="mt-7 grid max-w-lg gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {LEARN.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-kraft/90">
                <svg viewBox="0 0 12 12" className="mt-1 h-3 w-3 shrink-0 text-neem-bright" fill="none" aria-hidden="true">
                  <path d="M2 6.5 4.8 9 10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <Button variant="kraft" to="/signup" className="mt-9">
            Join the club →
          </Button>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import SectionHeading from './SectionHeading';
import Lightbox from '../ui/Lightbox';

/**
 * REAL club record — every entry is an actual TOS event. No invented
 * achievements, no stock photos: tiles without a photo say so honestly.
 * When archive photos are digitised, drop them in /public/work/ and list
 * the filenames in `photos` — the tile switches to full-bleed on its own.
 */
const WORK = [
  {
    id: 'sambalpuri-hub',
    tag: 'Workshop · 72 women',
    title: 'Sambalpuri Hub workshop',
    meta: 'Apr 2025 · Sambalpuri Hub',
    dominant: true,
    photos: [],
    description: [
      'Seventy-two women from the Sambalpuri Hub, one room, and a full morning of hands-on sustainability work — our largest community session to date.',
      'The format was simple: less presentation, more doing. Everything covered was chosen because it works at household level with materials people already have.',
    ],
  },
  {
    id: 'robosumo',
    tag: 'Competition',
    title: 'Robosumo at Innovision',
    meta: 'NIT Rourkela · 2024',
    photos: [],
    description: [
      'We took a sumo bot to Robosumo at Innovision 2024, NIT Rourkela — designed and built in-house by the team.',
      'Win or lose, the point of entering is the engineering: what went wrong on the arena floor goes straight into the notes for the next chassis.',
    ],
  },
  {
    id: 'samavesh',
    tag: 'Fest events',
    title: 'SAMAVESH — Trash-to-Treasure & quizzes',
    meta: 'Feb 2025 · SAMAVESH fest',
    photos: [],
    description: [
      'Two events at SAMAVESH: a Trash-to-Treasure build competition and the sustainability quiz rounds.',
      'Best-out-of-waste is the club ethos in miniature — take what was thrown away and make it worth keeping.',
    ],
  },
  {
    id: 'virtoswa',
    tag: 'Annual fest',
    title: 'VIRTOSWA 2K25',
    meta: 'Campus · 2025',
    photos: [],
    description: [
      'VIRTOSWA 2K25 — the club\u2019s own fest, run end to end by members: the stalls, the events, the cleanup afterwards.',
    ],
  },
  {
    id: 'kirba-drive',
    tag: 'Outreach',
    title: 'Kirba school drive',
    meta: 'School session · Kirba',
    photos: [],
    description: [
      'A drive at the Kirba school — sessions with students, because the habits that stick start early.',
    ],
  },
  {
    id: 'makers-fest',
    tag: 'Showcase',
    title: 'Makers Fest',
    meta: '2023 · our first recorded build season',
    photos: [],
    description: [
      'Makers Fest 2023 — the earliest entry in this log, and where the build-first habit started.',
    ],
  },
];

/**
 * Recent Work — editorial bento of REAL club events. One dominant frame
 * (the Sambalpuri Hub workshop — largest direct impact), subordinate
 * tiles beside it. Full-bleed photo IS the card when a photo exists;
 * otherwise the tile says so honestly instead of faking it.
 * Every tile opens the shared Lightbox detail view.
 */
export default function WorkGrid() {
  const [openId, setOpenId] = useState(null);
  const openItem = WORK.find((w) => w.id === openId);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:grid md:grid-cols-[180px_1fr] md:gap-12">
      <SectionHeading eyebrow="Recent Work" title="What we’ve been doing" />
      <div>
        <div className="work-grid grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {WORK.map((w) => {
            const hasPhoto = w.photos.length > 0;
            return (
              <button
                key={w.id}
                onClick={() => setOpenId(w.id)}
                aria-label={`${w.title} — read the full story`}
                className={`work-tile group relative block overflow-hidden rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-laterite focus-visible:ring-offset-2 focus-visible:ring-offset-kraft ${w.dominant ? 'sm:col-span-2 md:row-span-2' : ''}`}
              >
                {hasPhoto ? (
                  <>
                    <img
                      src={`/work/${w.photos[0]}`}
                      alt={w.title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-neem/25 mix-blend-multiply" aria-hidden="true" />
                  </>
                ) : (
                  /* Honest gap — no photo yet, and the tile says so */
                  <div className="flex aspect-[4/3] h-full w-full flex-col justify-between bg-neem p-6 transition-colors duration-200 group-hover:bg-neem-bright md:p-8">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-kraft/70">
                      {w.tag}
                    </span>
                    <p className="font-display text-xl font-semibold leading-snug text-kraft md:text-2xl">
                      {w.title}
                    </p>
                  </div>
                )}

                {/* Caption baked into the bottom of the frame */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-humus/90 via-humus/60 to-transparent p-4 pt-10">
                  {!hasPhoto && (
                    <p className="text-[11px] uppercase tracking-[0.06em] text-kraft/60">
                      Photos coming from the club archive
                    </p>
                  )}
                  <p className="text-sm font-semibold text-kraft">{w.meta}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-md border border-humus/15 bg-kraft-card px-6 py-5 text-kraft/80">
          <p className="font-display text-lg font-semibold text-humus">
            More stories and impacts from the club are shared through our event updates.
          </p>
        </div>
      </div>

      {/* Detail view — shared Lightbox (focus trap + scroll lock + keys) */}
      <Lightbox
        open={Boolean(openItem)}
        onClose={() => setOpenId(null)}
        label={openItem ? `${openItem.title} — full story` : 'Details'}
        item={
          openItem && {
            src: openItem.photos[0] ? `/work/${openItem.photos[0]}` : undefined,
            alt: openItem.title,
            title: openItem.title,
            meta: `${openItem.tag} · ${openItem.meta}`,
            description: openItem.description,
            photoCount: openItem.photos.length,
          }
        }
      />
    </section>
  );
}
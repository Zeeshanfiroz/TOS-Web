import SectionHeading from './SectionHeading';

// TODO: swap these placeholders for real club archive photos — the duotone
// treatment (grayscale + neem multiply) is designed FOR those photos.
const WORK = [
  {
    title: 'Plantation drive — Plots A–D',
    meta: 'Dec 2025 · 500 saplings in the ground',
    img: 'https://picsum.photos/seed/tos-plantation/1200/800?grayscale',
    span: 'sm:col-span-2 md:row-span-2',
  },
  {
    title: 'Composting workshop',
    meta: 'Aug 2026 · metallurgy dept',
    img: 'https://picsum.photos/seed/tos-workshop/600/450?grayscale',
    span: '',
  },
  {
    title: 'Mahanadi clean-up',
    meta: 'Nov 2025 · 32 bags off the bank',
    img: 'https://picsum.photos/seed/tos-cleanup/600/450?grayscale',
    span: '',
  },
];

/**
 * Recent Work — asymmetric 2+1 grid of real work, ledger-captioned.
 * Tiles reveal with a clip-path wipe (field-print) on scroll.
 */
export default function WorkGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:grid md:grid-cols-[180px_1fr] md:gap-12">
      <SectionHeading eyebrow="Recent Work" title="What that looks like" />
      <div>
        <div className="work-grid grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {WORK.map((w) => (
            <a
              key={w.title}
              href="/gallery"
              className={`work-tile group relative block overflow-hidden rounded-md border border-humus/30 hover:border-neem/50 ${w.span}`}
            >
              <img
                src={w.img}
                alt={w.title}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] h-full w-full object-cover grayscale transition-transform duration-200 group-hover:scale-[1.02]"
              />
              {/* Neem duotone — unifies placeholders until real photos land */}
              <div className="absolute inset-0 bg-neem/25 mix-blend-multiply" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 border-t border-humus/25 bg-kraft/95 px-4 py-3">
                <p className="text-sm font-semibold text-humus">{w.title}</p>
                <p className="text-xs font-medium text-humus/70">{w.meta}</p>
              </div>
            </a>
          ))}

          <a
            href="/gallery"
            className="work-tile group flex items-center justify-between gap-4 rounded-md border border-humus/30 bg-kraft-card px-6 py-5 transition-colors hover:border-neem sm:col-span-2 md:col-span-3"
          >
            <p className="font-display text-lg font-semibold text-humus">
              Everything else is in the gallery — unretouched.
            </p>
            <span className="text-neem transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

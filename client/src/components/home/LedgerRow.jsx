/**
 * LedgerRow — one entry of the Field Ledger (the site's signature data
 * surface). Styled like a logged record: entry number, what + how much,
 * plot/location, date, and an "Alive" status tick for saplings.
 *
 * Props:
 *   entry — { no, title, meta, date, status? }
 */
export default function LedgerRow({ entry }) {
  const { no, title, meta, date, status } = entry;

  return (
    <article className="ledger-row w-[248px] shrink-0 snap-start rounded-md border border-humus/15 bg-kraft-card p-4">
      <div className="flex items-baseline justify-between border-b border-humus/10 pb-2">
        <span className="font-display text-sm font-semibold text-laterite">#{no}</span>
        <time className="text-[11px] uppercase tracking-[0.06em] text-humus/55">{date}</time>
      </div>

      <h3 className="mt-3 font-display text-base font-semibold leading-snug text-humus">
        {title}
      </h3>
      <p className="mt-1 text-[13px] leading-relaxed text-humus/65">{meta}</p>

      {status && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-neem">
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
            <path d="M2 6.5 4.8 9 10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {status}
        </p>
      )}
    </article>
  );
}

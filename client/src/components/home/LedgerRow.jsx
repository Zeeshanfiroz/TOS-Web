/**
 * LedgerRow — one entry of the Field Ledger (the site's signature data
 * surface). Styled like a logged record: entry number, what + how much,
 * plot/location, date, and an "Alive" status tick for saplings.
 *
 * Props:
 *   entry — { no, title, meta, date, status? }
 */
export default function LedgerRow({ entry }) {
  const { no, title, meta, date, status, photo } = entry;

  return (
    <article className="ledger-row w-[248px] shrink-0 snap-start rounded-md border border-humus/30 bg-kraft-card p-4 shadow-[0_1px_2px_rgba(38,32,26,0.05),0_10px_22px_-18px_rgba(38,32,26,0.4)]">
      {/* Photo slot — add `photo: '<url>'` to the entry data when the club
          shares full-resolution archive photos; until then a neem monogram
          tile keeps the card anchored. */}
      {photo ? (
        <img
          src={photo}
          alt={title}
          loading="lazy"
          className="mb-3 h-24 w-full rounded-sm object-cover"
        />
      ) : (
        <div
          className="mb-3 flex h-20 items-center justify-center rounded-sm border border-humus/15 bg-humus/5"
          aria-hidden="true"
        >
          <span className="font-display text-2xl font-semibold text-neem/50">
            {title.charAt(0)}
          </span>
        </div>
      )}

      <div className="flex items-baseline justify-between border-b border-humus/25 pb-2">
        <span className="font-display text-sm font-semibold text-neem">#{no}</span>
        <time className="text-[11px] uppercase tracking-[0.06em] text-humus/60">{date}</time>
      </div>

      <h3 className="mt-3 font-display text-base font-semibold leading-snug text-humus">
        {title}
      </h3>
      <p className="mt-1 text-[13px] font-medium leading-relaxed text-humus/80">{meta}</p>

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

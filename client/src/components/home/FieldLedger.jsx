import SectionHeading from './SectionHeading';
import LedgerRow from './LedgerRow';

// Real club achievements — sourced from the club's own decks (dated,
// verifiable). Newest first. TODO: move to an Achievements collection.
const ENTRIES = [
  { no: '09', title: 'VIRTOSWA 2K25 orientation', meta: 'New-member orientation program', date: 'Oct 2025' },
  { no: '08', title: 'Sambalpuri jewelry & accessories workshop', meta: 'With Sambalpuri Hub — 72 underprivileged women trained in sustainable crafts · Burla', date: 'Apr 2025' },
  { no: '07', title: 'Research bootcamp', meta: 'Students introduced to the research domain, end to end', date: '2025' },
  { no: '06', title: 'SAMAVESH — quiz + Trash to Treasure', meta: 'Sustainability quiz and upcycling event · Burla', date: 'Feb 2025' },
  { no: '05', title: 'Robosumo @ Innovision, NIT Rourkela', meta: 'Multiple competition wins', date: '2024' },
  { no: '04', title: 'VIRTOSWA 2024', meta: 'Club projects showcased on stage', date: '2024' },
  { no: '03', title: 'Rakshabandhan awareness drive', meta: 'Sustainability rally with students · Kirba school', date: '2024' },
  { no: '02', title: 'World Standards Day, IIT Bhubaneswar', meta: 'Club idea pitched on stage', date: '2023' },
  { no: '01', title: 'Makers Fest 2023', meta: 'Paper recycling project exhibited — first public build', date: '2023' },
];

/**
 * Field Ledger — the signature section (Stage 2), now running on REAL
 * data: the club's dated achievement record, newest first.
 */
export default function FieldLedger() {
  return (
    /* Tonal break #1 — kraft-deep full-bleed band (Stage: section rhythm) */
    <section className="paper-texture scroll-mt-24 bg-kraft-deep py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:grid md:grid-cols-[180px_1fr] md:gap-12">
        <SectionHeading eyebrow="On the record" title="Field ledger" />
        <div>
          <p className="max-w-md text-[15px] font-medium leading-relaxed text-humus/85">
            Dated and verifiable — everything the club has done since Makers
            Fest 2023, written down when it happened.
          </p>

          <div className="relative">
            <div className="ledger-strip mt-8 flex snap-x gap-4 overflow-x-auto pb-3">
              {ENTRIES.map((entry) => (
                <LedgerRow key={entry.no} entry={entry} />
              ))}
            </div>
            {/* Edge fades — the cut-off card reads as an intentional
                "there's more →" cue, not a layout bug (review Tier 3.9) */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-kraft-deep to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-kraft-deep to-transparent"
              aria-hidden="true"
            />
          </div>

          <p className="mt-3 text-xs text-humus/60">
            Scroll → · Newest first. Ask us for the photos behind any entry.
          </p>
        </div>
      </div>
    </section>
  );
}

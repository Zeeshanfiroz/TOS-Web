import SectionHeading from './SectionHeading';
import LedgerRow from './LedgerRow';

// Sample ledger entries — TODO: replace with the club ledger API
// (a small collection: type, item, quantity, plot/location, date, status).
const ENTRIES = [
  { no: '047', title: 'Neem sapling', meta: 'Plot B · nursery bed 2', date: 'Mar 2026', status: 'Alive' },
  { no: '048', title: 'Neem sapling', meta: 'Plot B · nursery bed 2', date: 'Mar 2026', status: 'Alive' },
  { no: '046', title: 'Peepal sapling', meta: 'Plot A · riverside row', date: 'Mar 2026', status: 'Alive' },
  { no: 'C-12', title: 'Compost batch closed', meta: '214 kg campus wet waste', date: 'Feb 2026' },
  { no: 'E-09', title: 'E-waste drive', meta: '86 kg collected · handed to recycler', date: 'Jan 2026' },
  { no: 'W-21', title: 'Composting workshop', meta: '40 attendees · metallurgy dept', date: 'Aug 2026' },
];

/**
 * Field Ledger — the signature section (Stage 2). A horizontally
 * scrolling strip of logged entries: every sapling, kilo and drive,
 * written down when it happened.
 */
export default function FieldLedger() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:grid md:grid-cols-[180px_1fr] md:gap-12 md:py-16">
      <SectionHeading eyebrow="The Log" title="Field ledger" />
      <div>
        <p className="max-w-md text-[15px] leading-relaxed text-humus/70">
          Every sapling, every kilo, every drive — written down when it happens.
          The numbers are the point, not the poster.
        </p>

        <div className="ledger-strip mt-8 flex snap-x gap-4 overflow-x-auto pb-3">
          {ENTRIES.map((entry) => (
            <LedgerRow key={entry.no} entry={entry} />
          ))}
        </div>

        <p className="mt-3 text-xs text-humus/50">
          Scroll → · Entries sync from the club ledger database.
        </p>
      </div>
    </section>
  );
}

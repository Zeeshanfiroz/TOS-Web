/**
 * Marquee — infinite scrolling strip. Duplicates content for a seamless loop.
 * Pauses on hover (see .marquee-hover in index.css).
 */
export default function Marquee({ items, className = '' }) {
  const row = (key) => (
    <div key={key} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item, i) => (
        <span
          key={i}
          className="flex items-center gap-3 whitespace-nowrap font-display text-lg font-semibold text-forest-800/90"
        >
          <span className="text-2xl">{item.icon}</span>
          {item.label}
          <span className="ml-7 h-1.5 w-1.5 rounded-full bg-forest-400" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`marquee-hover relative overflow-hidden border-y border-forest-100 bg-forest-50/60 py-5 ${className}`}
    >
      {/* Edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
      <div className="flex w-max animate-marquee">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}

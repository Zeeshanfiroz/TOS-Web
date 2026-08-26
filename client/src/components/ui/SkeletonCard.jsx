/**
 * SkeletonCard — shimmer loading placeholder that mirrors the real
 * EventCard shape: badge pill + banner (h-44) + title + meta + 2-line
 * description, so there is no jump when real content swaps in.
 *
 * Props:
 *   hasImage — set false for text-only cards (e.g. Announcements)
 */
export function SkeletonCard({ hasImage = true }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      {hasImage && <div className="h-44 bg-gradient-to-br from-gray-200 to-gray-100" />}
      <div className="p-5 space-y-3">
        {/* Badge pill — matches EventCard's date badge */}
        <div className="h-5 w-24 bg-gray-200 rounded-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        {/* Meta line — matches the 📍 location line */}
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

/**
 * SkeletonGrid — responsive grid of SkeletonCards matching the
 * Events/Announcements card grids (sm:2 / lg:3 columns, gap-6).
 *
 * Props:
 *   count    — number of skeleton cards to render (default 6)
 *   hasImage — pass false for text-only cards
 */
export function SkeletonGrid({ count = 6, hasImage = true }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} hasImage={hasImage} />
      ))}
    </div>
  );
}

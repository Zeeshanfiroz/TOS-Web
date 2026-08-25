/**
 * SkeletonCard — shimmer loading placeholder (event/announcement cards).
 * Spinners se zyada premium feel deta hai.
 */
export function SkeletonCard({ hasImage = true }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      {hasImage && <div className="h-44 bg-gradient-to-br from-gray-200 to-gray-100" />}
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

/** Grid of skeletons — Events/Announcements loading states ke liye */
export function SkeletonGrid({ count = 6, hasImage = true }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} hasImage={hasImage} />
      ))}
    </div>
  );
}

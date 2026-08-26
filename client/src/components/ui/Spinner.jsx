/**
 * Spinner — loading indicator in the brand forest palette.
 *
 * Props:
 *   fullPage — when true, wraps the spinner in a tall centered container
 *              (use for full-page route/loading states)
 */
export default function Spinner({ fullPage = false }) {
  const spinner = (
    <div className="flex items-center justify-center py-16">
      <div className="w-10 h-10 border-4 border-forest-200 border-t-forest-600 rounded-full animate-spin" />
    </div>
  );
  return fullPage ? <div className="min-h-[50vh]">{spinner}</div> : spinner;
}
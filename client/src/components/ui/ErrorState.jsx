/**
 * ErrorState — friendly error display with a Retry button.
 * Used by pages when a data fetch fails (network down, server error...).
 *
 * Props:
 *   message  — error text to show (defaults to a generic line)
 *   onRetry  — optional callback; renders a Retry button when provided
 */
export default function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) {
  return (
    <div className="text-center py-20" role="alert">
      <span className="text-5xl">🥀</span>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
      <p className="mt-1 text-sm text-gray-500">
        Please check your connection, or try again in a moment.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold shadow-lg shadow-forest-200 transition-colors"
        >
          🔄 Retry
        </button>
      )}
    </div>
  );
}

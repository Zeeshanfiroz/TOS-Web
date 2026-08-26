import { Component } from 'react';

/**
 * ErrorBoundary — catches render-time crashes anywhere below it and shows a
 * friendly fallback instead of a white screen. Also logs to the console so
 * the error is still visible in devtools.
 *
 * Note: catches render/lifecycle errors only — it cannot catch errors in
 * event handlers, async thunks or the initial render of the boundary itself.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('💥 App crashed:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-forest-50 to-white text-center">
          <span className="text-6xl">🥀</span>
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-6">
            Something went wrong
          </h1>
          <p className="text-gray-600 mt-3 max-w-md leading-relaxed">
            An unexpected error occurred while rendering the page. Don't worry —
            your data is safe. Try reloading.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-6 max-w-2xl overflow-auto text-left text-xs bg-red-50 text-red-700 rounded-xl p-4">
              {String(this.state.error)}
            </pre>
          )}
          <button
            onClick={this.handleReload}
            className="mt-8 px-8 py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-lg shadow-forest-200 transition-colors"
          >
            🔄 Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

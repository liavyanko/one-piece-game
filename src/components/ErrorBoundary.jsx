import React from 'react';

/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen ocean-background flex items-center justify-center p-4">
          <div className="card-premium p-6 rounded-2xl border-2 border-red-500/60 max-w-md w-full text-center">
            <h2 className="text-2xl font-black text-red-400 mb-4">⚠️ Something Went Wrong</h2>
            <p className="text-gray-300 mb-4">
              {this.props.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            <button
              onClick={this.handleReset}
              className="button-premium text-gray-900 font-black py-3 px-6 rounded-xl"
            >
              Try Again
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-400">Error Details</summary>
                <pre className="mt-2 text-xs text-red-300 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


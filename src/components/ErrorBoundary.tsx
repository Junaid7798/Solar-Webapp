import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090F] flex flex-col items-center justify-center p-8 text-center">
          <div className="text-amber text-5xl mb-6">&#9889;</div>
          <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
          <p className="text-white/40 mb-6 max-w-sm">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="bg-amber text-[#07090F] font-bold px-6 py-3 rounded-xl hover:bg-amber-light transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

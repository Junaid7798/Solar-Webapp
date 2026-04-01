import React from 'react';

interface AdminErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends React.Component<React.PropsWithChildren<object>, AdminErrorBoundaryState> {
  declare props: React.PropsWithChildren<object>;

  state: AdminErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Admin section crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090F] flex items-center justify-center p-6">
          <div className="max-w-md text-center admin-card p-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber mb-4">
              Admin Error
            </p>
            <h1 className="font-display text-2xl font-bold text-white mb-4">
              Something went wrong in the dashboard.
            </h1>
            <p className="text-white/60 text-sm mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl bg-depth border border-white/10 text-white/70 font-bold text-sm hover:text-white transition-colors"
              >
                Reload
              </button>
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="px-5 py-2.5 rounded-xl bg-amber text-depth font-bold text-sm hover:bg-amber-light transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

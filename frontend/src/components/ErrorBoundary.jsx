import React from 'react';
import { ShieldAlert } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong.</h1>
          <p className="text-slate-500 max-w-md mb-6">A component crashed while trying to render. This has been caught by the global error boundary to prevent the app from breaking.</p>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-left overflow-auto max-w-2xl w-full text-sm text-red-500 font-mono">
            {this.state.error?.toString()}
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-8 px-6 py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors"
          >
            Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

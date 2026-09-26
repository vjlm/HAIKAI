import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, LogOut, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[HAIKAI ERROR BOUNDARY] Caught uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public handleResetSession = () => {
    try {
      localStorage.removeItem('haikai_admin_token');
    } catch {}
    window.location.hash = '#admin';
    window.location.reload();
  };

  public handleReturnHome = () => {
    window.location.hash = '';
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#040609] text-[#c4ccd6] flex items-center justify-center p-4">
          <div className="w-full max-w-xl border border-[#9e2a2b] bg-[#080c12] p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1b2533]">
              <div className="p-2.5 rounded-full bg-[#1b080b] border border-[#9e2a2b] text-[#9e2a2b]">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-cinzel text-lg text-white uppercase tracking-wider">
                  {this.props.fallbackTitle || 'CONTROL SUITE RECOVERY'}
                </h2>
                <p className="text-xs font-editorial-mono text-[#8a99ac]">
                  An unexpected client-side rendering exception was intercepted.
                </p>
              </div>
            </div>

            <div className="p-3 border border-[#3b191c] bg-[#120608] text-xs font-editorial-mono text-[#f2afb2] space-y-1">
              <div className="font-bold">[!] ERROR MESSAGE:</div>
              <div className="font-mono break-all text-[11px] text-[#e0a2a5]">
                {this.state.error?.message || 'Unknown runtime error occurred.'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  if (this.props.onReset) this.props.onReset();
                  else window.location.reload();
                }}
                className="px-3 py-2.5 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-wider uppercase font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RETRY NOW</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetSession}
                className="px-3 py-2.5 border border-[#2b394d] bg-[#0c121a] hover:border-[#9e2a2b] text-[#cbd6e2] hover:text-white text-xs font-cinzel tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-[#9e2a2b]" />
                <span>RE-LOGIN</span>
              </button>

              <button
                type="button"
                onClick={this.handleReturnHome}
                className="px-3 py-2.5 border border-[#1b2533] bg-[#070a0e] hover:border-[#38495f] text-[#8695a7] hover:text-white text-xs font-cinzel tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>PUBLIC SITE</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

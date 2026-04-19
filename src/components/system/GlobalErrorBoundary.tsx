"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[UrbanShield Critical Fault]:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-6 text-white font-sans">
          <div className="max-w-xl w-full border-2 border-red-600/30 bg-[#0F172A] p-10 relative overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.1)]">
            {/* Tactical Accent */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-red-600" />
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 bg-red-600/10 p-5 rounded-full border border-red-600/20">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>

              <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                Module <span className="text-red-500">Failed</span>
              </h1>
              
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 mb-8">
                Runtime Intelligence Crash Caught
              </p>

              <div className="bg-black/40 border border-white/5 p-4 rounded mb-8 w-full text-left font-mono text-[9px]">
                <span className="text-red-500 font-bold">[SYSTEM_FAULT]:</span> {this.state.error?.message || "Unknown Application Boundary Error"}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#3B82F6] text-white font-black uppercase tracking-widest text-xs hover:bg-[#2563EB] transition-all shadow-[4px_4px_0px_#1D4ED8] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Reload Application
                </button>
                
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                >
                  <Home className="w-4 h-4" />
                  Return Home
                </button>
              </div>
            </div>

            {/* Bottom ID */}
            <div className="mt-12 text-[7px] font-bold tracking-[0.5em] text-white/10 uppercase text-center border-t border-white/5 pt-6">
                Recovery Protocol v1.0 | Stable Build Core
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

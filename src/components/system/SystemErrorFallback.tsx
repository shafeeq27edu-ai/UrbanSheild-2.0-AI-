"use client";

import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface SystemErrorFallbackProps {
    theme?: "light" | "dark";
    error?: Error;
    reset?: () => void;
}

export default function SystemErrorFallback({ 
    theme = "dark", 
    error, 
    reset 
}: SystemErrorFallbackProps) {
    const isLight = theme === "light";
    
    return (
        <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center p-6 ${
            isLight ? "bg-[#f5f2eb]" : "bg-[#0A0F1E]"
        }`}>
            <div className={`max-w-md w-full border-2 p-8 shadow-2xl relative overflow-hidden ${
                isLight ? "bg-white border-[var(--color-navy)]" : "bg-[#0F172A] border-[#3B82F6]/30"
            }`}>
                {/* Tactical Accent Corner */}
                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[50px] h-[50px] bg-red-600 rotate-45 translate-x-[25px] -translate-y-[25px]" />
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 bg-red-600/10 p-4 rounded-full">
                        <AlertCircle className="w-12 h-12 text-red-600" />
                    </div>

                    <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${
                        isLight ? "text-[var(--color-navy)]" : "text-white"
                    }`}>
                        System Error
                    </h1>
                    
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-6 ${
                        isLight ? "text-[var(--color-navy)]/60" : "text-white/60"
                    }`}>
                        The requested intelligence module failed to load.
                    </p>

                    {error && (
                        <div className={`w-full p-4 mb-8 font-mono text-left text-[9px] overflow-auto max-h-[100px] border border-red-500/20 rounded ${
                            isLight ? "bg-slate-50 text-red-600" : "bg-black/40 text-red-400"
                        }`}>
                            [CRITICAL_FAULT]: {error.message}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            onClick={() => reset?.()}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#3B82F6] text-white font-black uppercase tracking-widest text-xs hover:bg-[#2563EB] transition-all shadow-[4px_4px_0px_#1D4ED8] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry Module
                        </button>
                        
                        <Link
                            href="/"
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 font-black uppercase tracking-widest text-xs transition-all ${
                                isLight 
                                    ? "border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white" 
                                    : "border-white/20 text-white hover:bg-white/10"
                            }`}
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                    </div>
                </div>
                
                {/* Security Badge */}
                <div className="mt-8 pt-6 border-t border-slate-500/10 flex justify-between items-center">
                    <span className="text-[8px] font-bold tracking-widest text-red-600 opacity-50 uppercase">
                        Fault ID: {Math.random().toString(36).substring(7).toUpperCase()}
                    </span>
                    <span className="text-[8px] font-bold tracking-widest text-slate-500 uppercase">
                        Secure Kernel v1.0
                    </span>
                </div>
            </div>
        </div>
    );
}

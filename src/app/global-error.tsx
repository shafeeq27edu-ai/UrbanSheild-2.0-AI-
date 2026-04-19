"use client";

import React from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="m-0">
                <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0F1E] text-white p-8 font-sans">
                    <div className="max-w-4xl w-full border-4 border-red-600/30 p-12 bg-black/60 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse" />
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-red-600">
                                Global Failure
                            </h2>
                        </div>
                        
                        <p className="text-lg md:text-2xl font-bold tracking-tight text-white/90 mb-8 max-w-2xl leading-tight">
                            The UrbanShield Kernel has encountered an unrecoverable exception in the root rendering boundary.
                        </p>

                        <div className="bg-red-900/10 border border-red-600/20 p-6 rounded-none mb-10 w-full font-mono text-left">
                            <span className="block text-[10px] uppercase font-black tracking-widest text-red-600 mb-2">FAULT DIAGNOSTICS:</span>
                            <div className="text-red-400 text-xs overflow-auto max-h-[200px]">
                                <code>{error.message || "Root Hydration or Component Lifecycle Failure"}</code>
                                {error.stack && (
                                    <pre className="mt-4 text-[9px] opacity-40 select-all">
                                        {error.stack}
                                    </pre>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <button
                                className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[6px_6px_0px_#991B1B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                                onClick={() => reset()}
                            >
                                Reboot System Shell
                            </button>
                            
                            <button
                                className="px-10 py-5 border-2 border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-xs transition-all"
                                onClick={() => window.location.href = "/"}
                            >
                                Hard Reset to Dashboard
                            </button>
                        </div>
                        
                        <div className="mt-12 text-[8px] font-black tracking-[0.4em] text-white/20 uppercase text-center border-t border-white/5 pt-8">
                            Critical Security Protocol | UrbanShield Intelligence Core
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}

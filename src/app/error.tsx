'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-8 text-center font-sans">
            <div className="civic-card max-w-2xl p-12 border-2 border-red-500 flex flex-col items-center gap-8 shadow-[12px_12px_0px_#ef4444]">
                <h2 className="text-4xl font-black text-red-600 uppercase tracking-tighter">
                    System <span className="text-[var(--color-navy)]">Anomaly</span> Detected
                </h2>
                <p className="text-sm font-bold text-[var(--color-charcoal)] uppercase tracking-widest max-w-md">
                    The UrbanShield intelligence core has encountered a runtime exception. Diagnostic data has been logged.
                </p>
                <div className="w-full bg-slate-100 p-4 border border-slate-200">
                    <p className="text-[10px] font-mono text-red-500 overflow-auto max-h-32 text-left">
                        {error.message || "Unknown Runtime Error"}
                    </p>
                </div>
                <button
                    onClick={() => reset()}
                    className="civic-button bg-red-600 border-red-800 text-white px-12 py-4"
                >
                    REBOOT CONSOLE
                </button>
            </div>
        </div>
    );
}

'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white">
                <h2 className="text-6xl font-black text-red-500 mb-8 uppercase tracking-tighter">FATAL_SYSTEM_CRASH</h2>
                <p className="text-xl mb-12 text-slate-400 font-bold uppercase tracking-widest">Global Intelligence Link Severed</p>
                <button
                    onClick={() => reset()}
                    className="px-8 py-4 bg-white text-slate-900 font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                    FORCE SYSTEM RESET
                </button>
            </body>
        </html>
    );
}

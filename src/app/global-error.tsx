'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8 font-mono">
                    <h2 className="text-3xl text-red-500 mb-4 font-bold border-b-2 border-red-500 pb-2">CRITICAL SYSTEM FAILURE</h2>
                    <p className="mb-4 text-center max-w-2xl text-slate-300">
                        The UrbanShield kernel encountered an unrecoverable rendering boundary exception.
                    </p>
                    <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-md mb-8 w-full max-w-3xl overflow-auto text-sm text-red-400">
                        <code>{error.message || "Unknown Error Component State"}</code>
                    </div>
                    <button
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 font-bold uppercase tracking-widest transition-colors duration-200"
                        onClick={() => reset()}
                    >
                        Reboot Intelligence Shell
                    </button>
                </div>
            </body>
        </html>
    )
}

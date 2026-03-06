import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white p-10 font-sans text-center">
            <div className="max-w-md">
                <div className="text-[120px] font-black text-white/5 leading-none mb-4 select-none">404</div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Module Not Found</h2>
                <p className="text-white/60 mb-10 leading-relaxed">
                    The requested intelligence module could not be located in the current grid.
                </p>

                <Link
                    href="/"
                    className="inline-block px-10 py-4 border border-[var(--color-accent, #f6ad55)] text-[var(--color-accent, #f6ad55)] font-black uppercase tracking-widest rounded-lg hover:bg-[var(--color-accent, #f6ad55)] hover:text-[#0f172a] transition-all"
                >
                    Return to Core
                </Link>
            </div>
        </div>
    );
}

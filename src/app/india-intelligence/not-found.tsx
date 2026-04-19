import React from "react";
import Link from "next/link";
import { Home, Map } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] text-[var(--color-navy)] p-8 font-sans text-center">
            <div className="max-w-md w-full border-2 border-[var(--color-navy)]/10 p-12 relative overflow-hidden bg-white shadow-xl">
                {/* Regional Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent)]" />
                
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-accent)]/60 mb-8">
                    Regional Route Error
                </div>

                <h1 className="text-8xl font-black text-[var(--color-navy)] leading-none mb-6">404</h1>
                
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-[var(--color-navy)]">
                    Coordinate Mismatch
                </h2>
                
                <p className="text-[var(--color-charcoal)]/60 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10">
                    The requested regional intelligence node could not be mapped. Please return to the India Intelligence core.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/india-intelligence"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-accent)] text-white font-black uppercase tracking-widest text-xs hover:bg-[#e69b3e] transition-all shadow-[4px_4px_0px_#cc8a35] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    >
                        <Map className="w-4 h-4" />
                        India Intelligence
                    </Link>
                    
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-[var(--color-navy)]/10 text-[var(--color-navy)] font-black uppercase tracking-widest text-xs hover:bg-[var(--color-navy)]/5 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Command Center
                    </Link>
                </div>
            </div>
        </div>
    );
}

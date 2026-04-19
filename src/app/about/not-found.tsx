import React from "react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f2eb] text-[var(--color-navy)] p-8 font-sans text-center">
            <div className="max-w-md w-full border-2 border-[var(--color-navy)]/10 p-12 relative overflow-hidden bg-white shadow-2xl">
                {/* Editorial Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#B8962E]" />
                
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B8962E] mb-8">
                    Sub-Module Not Found
                </div>

                <h1 className="text-8xl font-black text-[var(--color-navy)] leading-none mb-6">404</h1>
                
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-[var(--color-navy)]">
                    Intelligence Gap Detected
                </h2>
                
                <p className="text-[var(--color-charcoal)]/60 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10">
                    The requested page in the About Platform module does not exist. Please return to the main editorial report.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/about"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-navy)] text-white font-black uppercase tracking-widest text-xs hover:bg-[#1a2a40] transition-all shadow-[4px_4px_0px_#B8962E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to About Module
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

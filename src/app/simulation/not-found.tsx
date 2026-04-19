import React from "react";
import Link from "next/link";
import { Home, Play } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0F1E] text-white p-8 font-sans text-center">
            <div className="max-w-md w-full border-2 border-white/10 p-12 relative overflow-hidden bg-[#0F172A]/50">
                {/* Simulation Accent */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#f6ad55]" />
                
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#f6ad55] mb-8">
                    Scenario Path Broken
                </div>

                <h1 className="text-8xl font-black text-white leading-none mb-6">404</h1>
                
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">
                    Timeline Discontinuity
                </h2>
                
                <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10">
                    The requested simulation scenario or sub-path does not exist in the current predictive model.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/simulation"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-[#f6ad55] text-[#0A0F1E] font-black uppercase tracking-widest text-xs hover:bg-[#e69b3e] transition-all shadow-[4px_4px_0px_#cc8a35] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    >
                        <Play className="w-4 h-4" />
                        Simulation Lab
                    </Link>
                    
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Command Center
                    </Link>
                </div>
            </div>
        </div>
    );
}

"use client";

import React from "react";

interface SystemLoadingScreenProps {
    theme?: "light" | "dark";
    message?: string;
}

export default function SystemLoadingScreen({ 
    theme = "dark", 
    message = "Loading intelligence module..." 
}: SystemLoadingScreenProps) {
    const isLight = theme === "light";
    
    return (
        <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center transition-colors duration-500 ${
            isLight ? "bg-[#f5f2eb]" : "bg-[#0A0F1E]"
        }`}>
            {/* Animated Loading Indicator */}
            <div className="relative mb-8">
                {/* Outer Ring */}
                <div className={`w-16 h-16 rounded-full border-2 ${
                    isLight ? "border-[var(--color-navy)]/10" : "border-white/10"
                }`} />
                
                {/* Scanning Orb */}
                <div className={`absolute top-0 left-0 w-16 h-16 rounded-full border-t-2 border-[#3B82F6] animate-spin`} />
                
                {/* Pulse Indicator */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#3B82F6] shadow-[0_0_15px_#3B82F6] animate-pulse`} />
            </div>

            {/* Loading Text */}
            <div className="text-center">
                <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 ${
                    isLight ? "text-[var(--color-navy)]" : "text-white"
                }`}>
                    {message}
                </p>
                
                {/* Scanner Bar */}
                <div className={`w-48 h-[1px] mx-auto relative overflow-hidden ${
                    isLight ? "bg-[var(--color-navy)]/10" : "bg-white/10"
                }`}>
                    <div className="absolute top-0 left-0 h-full w-full bg-[#3B82F6] -translate-x-full animate-[loading_1.5s_infinite]" />
                </div>
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
}

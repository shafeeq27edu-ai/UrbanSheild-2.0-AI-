import React from "react";
import IndiaDisasterPanel from "@/components/IndiaDisasterPanel";

export default function IndiaIntelligencePage() {
    return (
        <main className="min-h-screen bg-[#f8f9fa] pt-24 pb-12 px-4 sm:px-8 md:px-16 flex flex-col items-center">

            <div className="max-w-5xl w-full mb-12 animate-[fadeIn_0.5s_ease-out_forwards]">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-px bg-[var(--color-accent)]" />
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-navy)]/60">
                        REGIONAL MODULE
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--color-navy)] mb-6">
                    INDIA INTELLIGENCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[#f6ad55]">SURFACE</span>
                </h1>

                <p className="text-lg text-[var(--color-forest)] font-medium max-w-3xl leading-relaxed">
                    Dedicated regional analysis focusing on South Asian climate extremities. This module leverages localized data inputs to predict and mitigate the impacts of monsoon flooding and severe urban heatwaves.
                </p>
            </div>

            <div className="w-full animate-[slideUp_0.6s_ease-out_forwards]">
                <IndiaDisasterPanel />
            </div>

            {/* Reusing existing animations from the layout/globals if any, else defining simple ones inline or in globals */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </main>
    );
}

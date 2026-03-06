import React from "react";
import HistoricalSimulations from "@/components/HistoricalSimulations";
import DisasterSimulationPanel from "@/components/DisasterSimulationPanel";
import ARVRSimulation from "@/components/ARVRSimulation";

export default function SimulationsPage() {
    return (
        <main className="min-h-screen bg-[#f8f9fa] pt-24 pb-12 px-4 sm:px-8 md:px-16 flex flex-col items-center">

            <div className="max-w-[1400px] w-full mb-12 animate-[fadeIn_0.5s_ease-out_forwards]">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-px bg-[var(--color-accent)]" />
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-navy)]/60">
                        DYNAMIC SCENARIOS
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--color-navy)] mb-6">
                    DISASTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[#f6ad55]">SIMULATOR</span>
                </h1>

                <p className="text-lg text-[var(--color-forest)] font-medium max-w-3xl leading-relaxed">
                    {" A powerful narrative and analytical layer demonstrating UrbanShield's predictive capabilities applied to major nationwide disasters including Wayanad landslides, Bihar floods, Assam river surges, Gujarat rainfall, and Bengaluru urban floods. Watch the incident timeline unfold and observe dynamic telemetry alongside mapped impact zones. "}
                </p>
            </div>

            <div className="w-full max-w-[1400px] space-y-12 animate-[slideUp_0.6s_ease-out_forwards]">
                <DisasterSimulationPanel />

                <HistoricalSimulations />

                <div className="max-w-6xl mx-auto pt-12">
                    <ARVRSimulation />
                </div>
            </div>

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

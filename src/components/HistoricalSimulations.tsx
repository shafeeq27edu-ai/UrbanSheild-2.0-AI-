"use client";

import React, { useState } from 'react';

type CaseStudy = {
    id: string;
    title: string;
    year: string;
    type: "Flood" | "Cyclone";
    description: string;
    urbanShieldAction: string;
    predictedMetrics: { label: string; value: string; }[];
};

const caseStudies: CaseStudy[] = [
    {
        id: "uttarakhand",
        title: "Kedarnath Flash Floods",
        year: "2013",
        type: "Flood",
        description: "A multi-day cloudburst centered on the North Indian state of Uttarakhand caused devastating floods and landslides becoming the country&apos;s worst natural disaster since the 2004 tsunami.",
        urbanShieldAction: "UrbanShield&apos;s Monsoon Module would have detected the Extreme Anomaly (+4.2σ) in upper catchment precipitation 48 hours prior. The River Basin Stress Index would have hit Critical (98%), triggering automated evacuation protocols for Kedarnath valley before the glacial lake outburst.",
        predictedMetrics: [
            { label: "Precipitation Anomaly", value: "+4.2σ" },
            { label: "River Basin Capacity", value: "Exceeded by 310%" },
            { label: "Evacuation Lead Time", value: "48 hours" }
        ]
    },
    {
        id: "amphan",
        title: "Super Cyclone Amphan",
        year: "2020",
        type: "Cyclone",
        description: "A powerful and catastrophic tropical cyclone that caused widespread damage in Eastern India, specifically West Bengal, and Bangladesh, displacing millions.",
        urbanShieldAction: "Coupling wind-shear data with our Drainage Capacity metrics, UrbanShield would have mapped the exact urban corridors in Kolkata susceptible to systemic power failure and flooding. Pre-emptive infrastructure shedding would have saved 40% of the local grid.",
        predictedMetrics: [
            { label: "Storm Surge Propensity", value: "Critical" },
            { label: "Infrastructure Stress", value: "95%" },
            { label: "Grid Mitigation Saved", value: "400MW+" }
        ]
    }
];

export default function HistoricalSimulations() {
    const [activeStudy, setActiveStudy] = useState<CaseStudy>(caseStudies[0]);
    const [isSimulating, setIsSimulating] = useState(false);

    const handleSimulate = (study: CaseStudy) => {
        setIsSimulating(true);
        setActiveStudy(study);
        // Fake simulation delay to show the "intelligence processing"
        setTimeout(() => setIsSimulating(false), 1500);
    };

    return (
        <div className="w-full bg-[var(--color-navy)] rounded-xl overflow-hidden shadow-2xl border border-[var(--color-accent)]/30">
            <div className="bg-gradient-to-r from-[var(--color-navy)] to-[#1a365d] p-6 border-b border-[var(--color-accent)]/20 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-wider text-white">Historical Lens</h2>
                    <p className="text-xs text-[var(--color-accent)] uppercase tracking-widest mt-1">{" What if UrbanShield was active? "}</p>
                </div>
                <div className="flex gap-2">
                    {caseStudies.map(study => (
                        <button
                            key={study.id}
                            onClick={() => handleSimulate(study)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 ${activeStudy.id === study.id ? "bg-[var(--color-accent)] text-[var(--color-navy)]" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {study.year} {study.type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-8 relative min-h-[400px]">
                {isSimulating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-navy)] z-10">
                        <div className="w-16 h-16 border-4 border-[var(--color-accent)]/20 border-t-[var(--color-accent)] rounded-full animate-spin mb-4" />
                        <p className="text-[var(--color-accent)] text-xs uppercase font-black tracking-[0.3em] animate-pulse">Running Retrospective Simulation...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-[fadeIn_0.5s_ease-out_forwards] text-white">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-4xl font-black text-white tracking-tight leading-none mb-2">{activeStudy.title}</h3>
                                <div className="inline-block px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/30">
                                    Historical Event: {activeStudy.year}
                                </div>
                            </div>
                            <p className="text-white/70 leading-relaxed font-medium">
                                {activeStudy.description}
                            </p>

                            <div className="p-5 bg-white/5 border border-white/10 rounded-lg">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)] mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                                    UrbanShield Retrospective Analysis
                                </h4>
                                <p className="text-sm text-green-400 font-medium leading-relaxed">
                                    {activeStudy.urbanShieldAction}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-6">
                            <h4 className="text-[10px] uppercase font-black tracking-widest text-white/50 border-b border-white/10 pb-2">Simulated Telemetry Metrics</h4>
                            <div className="space-y-4">
                                {activeStudy.predictedMetrics.map((metric, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-black/20 rounded border border-white/5">
                                        <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                                            {metric.label}
                                        </span>
                                        <span className="text-xl font-black text-[var(--color-accent)]">
                                            {metric.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

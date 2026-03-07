"use client";

import { useMemo } from "react";
import { INITIAL_ZONES, calculateFloodRisk } from "@/engines/predictionEngine";

interface NeighborhoodRiskPanelProps {
    city: string;
    neighborhoods?: string[];
    metrics?: any;
}

const RISK_COLORS: Record<string, string> = {
    Critical: "bg-red-500",
    High: "bg-amber-500",
    Moderate: "bg-yellow-400",
    Low: "bg-green-500",
};

const RISK_TEXT_COLORS: Record<string, string> = {
    Critical: "text-red-600",
    High: "text-amber-600",
    Moderate: "text-yellow-600",
    Low: "text-green-600",
};

function getRiskCategory(score: number): string {
    if (score >= 62) return "Critical";
    if (score >= 38) return "High";
    if (score >= 24) return "Moderate";
    return "Low";
}

export default function NeighborhoodRiskPanel({ city, neighborhoods, metrics }: NeighborhoodRiskPanelProps) {
    const liveRainfall = metrics?.weather?.rainfall ?? 0;

    // Filter zones for currently selected city if available, otherwise use defaults
    const zones = useMemo(() => {
        const activeZones = INITIAL_ZONES.filter(z =>
            neighborhoods?.includes(z.name) || (city === "Bengaluru" && INITIAL_ZONES.some(iz => iz.name === z.name))
        );

        // Map zones to live risks using the prediction engine
        return (activeZones.length > 0 ? activeZones : INITIAL_ZONES.slice(0, 6))
            .map(zone => {
                const risk = calculateFloodRisk({
                    rainfall_mm: zone.rainfall_mm + (liveRainfall * 0.8),
                    drainage_index: zone.drainage_index,
                    elevation_index: zone.elevation_index,
                    soil_absorption: zone.soil_absorption,
                    historical_flood_factor: 0.5,
                });

                return {
                    name: zone.name,
                    score: Math.round(risk.score * 100)
                };
            })
            .sort((a, b) => b.score - a.score);
    }, [city, neighborhoods, liveRainfall]);

    return (
        <div className="border-2 border-[var(--color-navy)] bg-white/60 p-4">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--color-navy)]/50">
                    Ward Risk Breakdown
                </span>
                <div className="flex-1 h-px bg-[var(--color-navy)]/10" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--color-navy)] bg-[var(--color-accent)] px-2 py-0.5">
                    {city.toUpperCase()}
                </span>
            </div>
            <div className="flex flex-col gap-2">
                {zones.map(({ name, score }) => {
                    const cat = getRiskCategory(score);
                    const barWidth = `${score}%`;
                    return (
                        <div key={name} className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-[var(--color-navy)] w-32 shrink-0 truncate uppercase tracking-wide">
                                {name}
                            </span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-none overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-700 ${RISK_COLORS[cat]}`}
                                    style={{ width: barWidth }}
                                />
                            </div>
                            <span className={`text-[10px] font-black w-6 text-right ${RISK_TEXT_COLORS[cat]}`}>
                                {score}
                            </span>
                            <span className={`text-[8px] font-black uppercase tracking-widest w-14 ${RISK_TEXT_COLORS[cat]}`}>
                                {cat}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

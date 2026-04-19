"use client";

import { useMemo } from "react";
import { CITIES } from "@/engines/cityProfiles";
import { calculateFloodRisk } from "@/engines/predictionEngine";

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

// City-specific drainage offsets to differentiate zone risk profiles per city
const CITY_DRAINAGE_OFFSETS: Record<string, number> = {
    "Bengaluru": 35,
    "Delhi": 28,
    "Mumbai": 22,
    "Chennai": 25,
    "Hyderabad": 42,
    "Patna": 20,
    "Guwahati": 18,
    "Kolkata": 22,
    "Ahmedabad": 35,
    "Surat": 30,
    "Wayanad": 50,
    "Kozhikode": 45,
};

// Impervious surface per city, for flood amplification
const CITY_IMPERVIOUS: Record<string, number> = {
    "Bengaluru": 78,
    "Delhi": 85,
    "Mumbai": 90,
    "Chennai": 82,
    "Hyderabad": 72,
    "Patna": 65,
    "Guwahati": 60,
    "Kolkata": 88,
    "Ahmedabad": 75,
    "Surat": 80,
    "Wayanad": 35,
    "Kozhikode": 55,
};

function getRiskCategory(score: number): string {
    if (score >= 62) return "Critical";
    if (score >= 38) return "High";
    if (score >= 24) return "Moderate";
    return "Low";
}

function deterministicOffset(name: string, range: number): number {
    // Stable per-zone spread derived from name characters, no randomness
    const seed = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return ((seed % (range * 2 + 1)) - range);
}

export default function NeighborhoodRiskPanel({ city, neighborhoods, metrics }: NeighborhoodRiskPanelProps) {
    const liveRainfall = metrics?.weather?.rainfall ?? 0;
    const cityProfile = CITIES[city] ?? CITIES["Bengaluru"];

    const zones = useMemo(() => {
        // Determine which neighborhoods to display
        const activeNeighborhoods = neighborhoods?.length
            ? neighborhoods
            : cityProfile?.neighborhoods ?? [];

        if (activeNeighborhoods.length === 0) return [];

        const drainageBase = CITY_DRAINAGE_OFFSETS[city] ?? 35;
        const imperviousBase = CITY_IMPERVIOUS[city] ?? 75;
        const elevationBase = cityProfile.elevation_index ?? 0.3;

        return activeNeighborhoods.map((name) => {
            // Derive stable per-zone parameters from the name
            const drainageOffset = deterministicOffset(name, 12);
            const elevationOffset = deterministicOffset(name + "e", 15) / 100;
            const rainfallBase = 20 + (deterministicOffset(name + "r", 10));

            const risk = calculateFloodRisk({
                rainfall_mm: rainfallBase + liveRainfall * 0.8,
                drainage_index: Math.max(0.05, Math.min(1, (drainageBase + drainageOffset) / 100)),
                elevation_index: Math.max(0.05, Math.min(1, elevationBase + elevationOffset)),
                soil_absorption: Math.max(0.05, Math.min(1, (100 - imperviousBase) / 100)),
                historical_flood_factor: 0.5,
            });

            return {
                name,
                score: Math.min(100, Math.round(risk.score * 100)),
            };
        }).sort((a, b) => b.score - a.score);
    }, [city, neighborhoods, liveRainfall, cityProfile]);

    if (zones.length === 0) {
        return (
            <div className="border-2 border-[var(--color-navy)] bg-white/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--color-navy)]/50">Ward Risk Breakdown</span>
                    <div className="flex-1 h-px bg-[var(--color-navy)]/10" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--color-navy)] bg-[var(--color-accent)] px-2 py-0.5">
                        {city.toUpperCase()}
                    </span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center py-4">
                    Run stress test to load ward data
                </p>
            </div>
        );
    }

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
            <div className="flex flex-col">
                {zones.slice(0, 6).map(({ name, score }, idx, arr) => {
                    const cat = getRiskCategory(score);
                    return (
                        <div key={name} className={`flex items-center gap-3 py-2 ${idx !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}>
                            <span className="text-[10px] font-bold text-[var(--color-navy)] w-32 shrink-0 truncate uppercase tracking-wide">
                                {name}
                            </span>
                            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-700 ${RISK_COLORS[cat]}`}
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                            <span className={`text-[10px] font-black w-6 text-right ${RISK_TEXT_COLORS[cat]}`}>
                                {score}
                            </span>
                            <span className={`text-[8px] font-black uppercase tracking-widest w-16 text-center rounded-full px-1.5 py-0.5 border ${RISK_TEXT_COLORS[cat]} border-current opacity-80 bg-slate-50/50`}>
                                {cat}
                            </span>
                        </div>
                    );
                })}
                
                {zones.length > 6 && (
                    <button className="mt-4 text-[9px] font-black uppercase tracking-widest text-[#3B82F6] hover:text-[#B8962E] transition-colors self-start border-b border-transparent hover:border-[#B8962E]">
                        VIEW ALL WARDS →
                    </button>
                )}
            </div>
        </div>
    );
}

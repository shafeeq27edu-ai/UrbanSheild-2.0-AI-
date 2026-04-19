"use client";

import { Shield, Truck, Users, Building2 } from "lucide-react";

interface ResourceDeploymentPanelProps {
    city: string;
    metrics?: any;
}

interface UnitConfig {
    name: string;
    action: string;
}

const NDRF_UNITS: Record<string, UnitConfig[]> = {
    "Bengaluru": [
        { name: "NDRF Battalion 9 (Bengaluru)", action: "Deploy to Bellandur" },
        { name: "SDRF Karnataka Unit 3", action: "Standby — Outer Ring Road" },
    ],
    "Mumbai": [
        { name: "NDRF Battalion 4 (Mumbai)", action: "Deploy to Andheri East" },
        { name: "Coast Guard C-204 Vessel", action: "Pre-position — Arabian Sea" },
    ],
    "Delhi": [
        { name: "NDRF Battalion 1 (Delhi)", action: "Deploy to Rohini Sector 10" },
        { name: "SDRF Delhi Unit 7", action: "Standby — Yamuna Floodplain" },
    ],
    "Chennai": [
        { name: "NDRF Battalion 10 (Chennai)", action: "Deploy to Velachery" },
        { name: "SDRF Tamil Nadu Unit 2", action: "Standby — Adyar Riverbank" },
    ],
    "Wayanad": [
        { name: "NDRF Battalion 8 (Kochi)", action: "Deploy to Meppadi" },
        { name: "Indian Army RR Unit", action: "Standby — Kalpetta" },
    ],
    "Guwahati": [
        { name: "NDRF Battalion 14 (Guwahati)", action: "Deploy to Brahmaputra Embankment" },
        { name: "SDRF Assam Unit 1", action: "Standby — National Highway 27" },
    ],
};

function getUnits(city: string): UnitConfig[] {
    return NDRF_UNITS[city] ?? [
        { name: `NDRF Battalion (${city})`, action: "Deploy to high-risk zones" },
        { name: `SDRF State Unit`, action: "Standby at district HQ" },
    ];
}

function getResources(score: number) {
    const level = score >= 62 ? 3 : score >= 38 ? 2 : 1;
    return {
        pumps: [8, 5, 2][3 - level],
        buses: [45, 25, 10][3 - level],
        medical: [3, 2, 1][3 - level],
        costInaction: [180, 80, 20][3 - level],
        costDeploy: [45, 20, 8][3 - level],
        roi: [400, 400, 250][3 - level],
    };
}

export default function ResourceDeploymentPanel({ city, metrics }: ResourceDeploymentPanelProps) {
    const score = metrics?.compound_risk_index ?? 0;
    const category = metrics?.risk_category ?? "Low";

    if (score < 38) {
        return (
            <div className="border-2 border-[var(--color-navy)] bg-white/60 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--color-navy)]/40 text-center py-4">
                    NDRF Deployment Panel — Active at HIGH risk or above
                </div>
            </div>
        );
    }

    const units = getUnits(city);
    const res = getResources(score);

    return (
        <div className="border-2 border-[var(--color-navy)] bg-white/60 p-4">
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-[var(--color-navy)]" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--color-navy)]/50">
                    Recommended Resource Deployment
                </span>
                <div className="flex-1 h-px bg-[var(--color-navy)]/10" />
                <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-red-500 text-white">
                    {category}
                </span>
            </div>

            {/* NDRF & SDRF Units */}
            <div className="mb-4 flex flex-col gap-2">
                {units.map((u, i) => (
                    <div key={i} className="flex items-start gap-3 bg-[var(--color-navy)]/5 p-2">
                        <div className="w-1 h-full bg-[var(--color-accent)] self-stretch shrink-0 mt-1" />
                        <div>
                            <div className="text-[10px] font-black text-[var(--color-navy)]">{u.name}</div>
                            <div className="text-[9px] font-bold text-[var(--color-navy)]/60">→ {u.action}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Equipment */}
            <div className="grid grid-cols-3 md:flex gap-2 mb-4 w-full">
                {[
                    { icon: Building2, label: "Pump Stations", value: res.pumps + " units" },
                    { icon: Truck, label: "Evacuation Buses", value: res.buses + " buses" },
                    { icon: Users, label: "Medical Teams", value: res.medical + " teams" },
                ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-[var(--color-navy)] text-white p-2 flex flex-col items-center text-center flex-1">
                        <Icon className="w-3 h-3 mb-1 text-[var(--color-accent)]" />
                        <div className="text-[8px] font-bold uppercase tracking-widest opacity-60">{label}</div>
                        <div className="text-[11px] font-black">{value}</div>
                    </div>
                ))}
            </div>

            {/* Cost analysis */}
            <div className="border border-[#B8962E]/30 bg-[#B8962E]/5 mt-4 p-3 flex flex-col gap-1 relative shadow-[0_4px_10px_rgba(184,150,46,0.1)]">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#B8962E]" />
                
                <div className="flex justify-between items-end mb-2">
                    <span className="font-black text-[var(--color-navy)] uppercase tracking-wide text-[11px] flex items-center gap-1">
                        ROI of Early Action
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[8px] animate-bounce">
                            ↑
                        </div>
                    </span>
                    <span className="font-black text-[#B8962E] text-2xl leading-none">{res.roi}:1</span>
                </div>
                
                <div className="text-[9px] font-bold text-[var(--color-navy)]/60 bg-[var(--color-navy)]/5 px-2 py-1 uppercase tracking-widest text-center">
                    ₹{res.costDeploy} Lakh deployment vs ₹{res.costInaction} Crore inaction
                </div>
            </div>
        </div>
    );
}

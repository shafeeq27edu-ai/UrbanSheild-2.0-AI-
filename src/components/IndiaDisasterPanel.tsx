"use client";

import React, { useState, useEffect } from 'react';
import { monsoonFloodModule, heatwaveModule, IndiaRiskResult } from '@/lib/indiaModules';
import { weatherService } from '@/services/weatherService';

interface IndiaDisasterPanelProps {
    metrics?: any;
    coords?: [number, number];
}

export default function IndiaDisasterPanel({ metrics, coords }: IndiaDisasterPanelProps) {
    const [floodData, setFloodData] = useState<IndiaRiskResult | null>(null);
    const [heatData, setHeatData] = useState<IndiaRiskResult | null>(null);
    const [activeTab, setActiveTab] = useState<'flood' | 'heat'>('flood');
    const [loadingLocal, setLoadingLocal] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchLocalData = async () => {
            setLoadingLocal(true);
            try {
                // Determine coordinates, fallback to central India
                const lat = coords?.[0] || 20.5937;
                const lon = coords?.[1] || 78.9629;

                const weather = await weatherService.fetchWeather(lat, lon);

                // Get drainage efficiency from metrics if available, otherwise baseline 40
                let drainage = 40;
                if (metrics?.urban_profile?.drainage_efficiency) {
                    drainage = metrics.urban_profile.drainage_efficiency * 100;
                }

                const flood = monsoonFloodModule(weather.rainfall * 10, drainage, 85); // Multiply by 10 to simulate monsoon conditions faster in demo 
                const heat = heatwaveModule(weather.temperature, weather.humidity, 80);

                if (isMounted) {
                    setFloodData(flood);
                    setHeatData(heat);
                }
            } catch (error) {
                console.error("Failed to load local India disaster intelligence", error);
                if (isMounted) {
                    setFloodData(monsoonFloodModule(180, 40, 85));
                    setHeatData(heatwaveModule(42, 65, 80));
                }
            } finally {
                if (isMounted) setLoadingLocal(false);
            }
        };

        fetchLocalData();
        return () => { isMounted = false; };
    }, [metrics, coords]);

    if (!floodData || !heatData || loadingLocal) return <div className="text-[var(--color-navy)] uppercase tracking-widest text-[10px] font-black flex justify-center items-center h-full animate-pulse p-12">Loading Regional Intelligence...</div>;

    const currentData = activeTab === 'flood' ? floodData : heatData;
    const title = activeTab === 'flood' ? "Monsoon Flood Risk" : "Heatwave Vulnerability";
    const bgGradient = activeTab === 'flood' ? "from-[#1a365d] to-[#2c5282]" : "from-[#742a2a] to-[#9b2c2c]"; // Navy for flood, dark red for heat

    const getScoreColor = (score: number) => {
        if (score > 85) return "text-red-500";
        if (score > 65) return "text-orange-500";
        if (score > 40) return "text-yellow-500";
        return "text-green-500";
    };

    return (
        <div className="w-full max-w-5xl mx-auto rounded-xl border border-[var(--color-accent)]/20 overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm">
            {/* Header / Tabs */}
            <div className={`flex flex-col md:flex-row bg-gradient-to-r ${bgGradient} text-white`}>
                <button
                    onClick={() => setActiveTab('flood')}
                    className={`flex-1 py-4 px-6 text-left border-b-4 transition-colors ${activeTab === 'flood' ? 'border-[var(--color-accent)] bg-white/10' : 'border-transparent hover:bg-white/5'}`}
                >
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider">Monsoon Flood Risk</h2>
                    <p className="text-xs md:text-sm text-white/70 uppercase tracking-widest mt-1">Hydrological Analysis</p>
                </button>
                <button
                    onClick={() => setActiveTab('heat')}
                    className={`flex-1 py-4 px-6 text-left border-b-4 transition-colors ${activeTab === 'heat' ? 'border-[var(--color-accent)] bg-white/10' : 'border-transparent hover:bg-white/5'}`}
                >
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider">Heatwave Vulnerability</h2>
                    <p className="text-xs md:text-sm text-white/70 uppercase tracking-widest mt-1">Thermal Stress Analysis</p>
                </button>
            </div>

            {/* Dashboard Body */}
            <div className="p-8 md:p-12 space-y-12">

                {/* Score Section */}
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Gauge placeholder mapping */}
                    <div className="relative w-48 h-48 rounded-full border-8 border-[var(--color-navy)]/10 flex items-center justify-center flex-shrink-0">
                        {/* Circular progress visual mock */}
                        <div
                            className="absolute inset-0 rounded-full border-8 border-transparent"
                            style={{
                                borderTopColor: currentData.score > 50 ? 'var(--color-accent)' : 'currentColor',
                                borderRightColor: currentData.score > 25 ? 'var(--color-accent)' : 'transparent',
                                borderBottomColor: currentData.score > 75 ? 'var(--color-accent)' : 'transparent',
                                transform: 'rotate(-45deg)'
                            }}
                        />
                        <div className="text-center">
                            <span className={`text-6xl font-black block leading-none ${getScoreColor(currentData.score)}`}>
                                {currentData.score}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-navy)]/60">
                                / 100 RISK INDEX
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-1 text-xs font-black uppercase tracking-widest border border-current rounded-full ${getScoreColor(currentData.score)}`}>
                                {currentData.category} RISK
                            </span>
                        </div>
                        <h3 className="text-3xl font-black text-[var(--color-navy)] tracking-tight">
                            {title} Assessment
                        </h3>
                        <p className="text-[var(--color-forest)] font-medium leading-relaxed max-w-2xl">
                            {currentData.explanation}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Risk Indicators */}
                    <div className="bg-[var(--color-navy)]/5 p-6 rounded-lg border border-[var(--color-navy)]/10">
                        <h4 className="text-sm font-black text-[var(--color-navy)] uppercase tracking-widest mb-6 border-b border-[var(--color-navy)]/10 pb-2">
                            Risk Indicators
                        </h4>
                        <div className="space-y-4">
                            {Object.entries(currentData.details).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-navy)]/70">
                                        {key.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-md font-black text-[var(--color-forest)]">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Actions */}
                    <div className="bg-[var(--color-accent)]/10 p-6 rounded-lg border border-[var(--color-accent)]/20">
                        <h4 className="text-sm font-black text-[var(--color-navy)] uppercase tracking-widest mb-6 border-b border-[var(--color-navy)]/10 pb-2">
                            Recommended Actions
                        </h4>
                        <ul className="space-y-3">
                            {activeTab === 'flood' ? (
                                <>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                                        <span className="text-sm font-medium text-[var(--color-navy)]">Deploy rapid response pumps to low-lying commercial sectors.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                                        <span className="text-sm font-medium text-[var(--color-navy)]">Issue SMS alerts to residents within 500m of river basin.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                                        <span className="text-sm font-medium text-[var(--color-navy)]">Prepare evacuation centers in zones A and B.</span>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                                        <span className="text-sm font-medium text-[var(--color-navy)]">Activate cooling centers in high-density urban wards.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                                        <span className="text-sm font-medium text-[var(--color-navy)]">Increase water supply pressure during peak temperature hours (12PM - 4PM).</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                                        <span className="text-sm font-medium text-[var(--color-navy)]">Issue public advisory to suspend outdoor labor.</span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}

"use client";

import React, { useState, useEffect } from 'react';
import { monsoonFloodModule, heatwaveModule, IndiaRiskResult, getCityRecommendations } from '@/lib/indiaModules';
import { weatherService } from '@/services/weatherService';
import { CITIES, getCityByCoords } from '@/engines/cityProfiles';

interface IndiaDisasterPanelProps {
    metrics?: any;
    coords?: [number, number];
    city?: string;
}

export default function IndiaDisasterPanel({ metrics, coords, city }: IndiaDisasterPanelProps) {
    const [floodData, setFloodData] = useState<IndiaRiskResult | null>(null);
    const [heatData, setHeatData] = useState<IndiaRiskResult | null>(null);
    const [activeTab, setActiveTab] = useState<'flood' | 'heat'>('flood');
    const [loadingLocal, setLoadingLocal] = useState(false);
    const [weatherMeta, setWeatherMeta] = useState<{ dataSource: string, lastUpdated: string } | null>(null);

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
                if (metrics?.urban_profile?.drainage_efficiency !== undefined) {
                    drainage = metrics.urban_profile.drainage_efficiency * 100;
                }

                const safeCity = city || "Bengaluru";
                const profile = coords ? (getCityByCoords(coords[0], coords[1]) || CITIES[safeCity] || CITIES["Bengaluru"]) : (CITIES[safeCity] || CITIES["Bengaluru"]);

                const flood = monsoonFloodModule(
                    weather.rainfall,
                    profile.drainage_capacity_index,
                    profile.population_density,
                    profile.impervious_surface
                );
                const heat = heatwaveModule(
                    weather.temperature,
                    weather.humidity,
                    profile.green_cover_percent
                );

                setWeatherMeta({
                    dataSource: weather.dataSource,
                    lastUpdated: weather.lastUpdated
                });

                if (isMounted) {
                    setFloodData(flood);
                    setHeatData(heat);
                }
            } catch (error) {
                console.error("Failed to load local India disaster intelligence", error);
                if (isMounted) {
                    const fallbackProfile = CITIES["Bengaluru"];
                    const weather = { rainfall: 0, temperature: 28, humidity: 60, dataSource: "NDMA Fallback (Offline)", lastUpdated: new Date().toISOString() };
                    setFloodData(monsoonFloodModule(weather.rainfall, fallbackProfile.drainage_capacity_index, fallbackProfile.population_density, fallbackProfile.impervious_surface));
                    setHeatData(heatwaveModule(weather.temperature, weather.humidity, fallbackProfile.green_cover_percent));
                    setWeatherMeta({ dataSource: weather.dataSource, lastUpdated: weather.lastUpdated });
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
    return (
        <div className="w-full civic-card">
            {/* Header / Tabs */}
            <div className="flex flex-col md:flex-row border-b border-[var(--color-navy)] mb-6">
                <button
                    onClick={() => setActiveTab('flood')}
                    className={`flex-1 py-4 px-6 text-left border-b-4 transition-colors ${activeTab === 'flood' ? 'border-[var(--color-navy)] bg-[var(--color-navy)]/5' : 'border-transparent'}`}
                >
                    <h2 className="text-xl font-black uppercase tracking-wider !font-sans !mb-0">Monsoon Flood Risk</h2>
                    <p className="text-xs text-[var(--color-navy)]/60 uppercase tracking-widest">Hydrological Analysis</p>
                </button>
                <button
                    onClick={() => setActiveTab('heat')}
                    className={`flex-1 py-4 px-6 text-left border-b-4 transition-colors ${activeTab === 'heat' ? 'border-[var(--color-navy)] bg-[var(--color-navy)]/5' : 'border-transparent'}`}
                >
                    <h2 className="text-xl font-black uppercase tracking-wider !font-sans !mb-0">Heatwave Vulnerability</h2>
                    <p className="text-xs text-[var(--color-navy)]/60 uppercase tracking-widest">Thermal Stress Analysis</p>
                </button>
            </div>

            {/* Dashboard Body */}
            <div className="p-8 md:p-12 space-y-12">

                {/* Score Section */}
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Gauge placeholder mapping */}
                    <div className="relative w-48 h-48 rounded-full border-8 border-[var(--color-navy)]/10 flex items-center justify-center flex-shrink-0 bg-white shadow-inner">
                        <div className="text-center">
                            <span className="text-6xl font-black block leading-none text-[var(--color-navy)]">
                                {currentData.score}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-navy)]/40">
                                / 100 RISK INDEX
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="px-4 py-1 text-xs font-black uppercase tracking-widest border-2 border-[var(--color-navy)] text-[var(--color-navy)]">
                                STATUS: {currentData.category}
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
                    <div className="bg-[var(--color-navy)]/5 p-6 rounded-lg border border-[var(--color-navy)]/10 flex flex-col justify-between">
                        <div>
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
                        {weatherMeta && (
                            <div className="mt-8 pt-4 border-t border-[var(--color-navy)]/10 text-[9px] font-bold text-[var(--color-navy)]/50 uppercase tracking-widest space-y-1">
                                <p>Source: {weatherMeta.dataSource}</p>
                                <p>Updated: {new Date(weatherMeta.lastUpdated).toLocaleString()}</p>
                            </div>
                        )}
                    </div>

                    {/* Recommended Actions */}
                    <div className="bg-white p-6 border border-[var(--color-navy)]/10">
                        <h4 className="text-xs font-black text-[var(--color-navy)] uppercase tracking-widest mb-6 border-b border-[var(--color-navy)]/10 pb-2">
                            Recommended Actions
                        </h4>
                        <ul className="space-y-3">
                            {getCityRecommendations(city || "Bengaluru", activeTab).map((rec, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 mt-1.5 bg-[var(--color-accent)] flex-shrink-0" />
                                    <span className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-tight leading-tight">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

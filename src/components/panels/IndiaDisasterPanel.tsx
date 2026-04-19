"use client";

import React, { useState, useEffect } from 'react';
import { calculateMonsoonFloodRisk, FloodRiskOutput } from '@/modules/india/monsoonFloodModule';
import { calculateHeatwaveVulnerability, HeatwaveOutput } from '@/modules/india/heatwaveModule';
import { getCityRecommendations } from '@/lib/indiaModules';
import { weatherService } from '@/services/weatherService';
import { CITIES, getCityByCoords } from '@/engines/cityProfiles';

interface IndiaDisasterPanelProps {
    metrics?: any;
    coords?: [number, number];
    city?: string;
}

export default function IndiaDisasterPanel({ metrics, coords, city }: IndiaDisasterPanelProps) {
    const [floodData, setFloodData] = useState<any>(null);
    const [heatData, setHeatData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'flood' | 'heat'>('flood');
    const [loadingLocal, setLoadingLocal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [weatherMeta, setWeatherMeta] = useState<{ dataSource: string, lastUpdated: string } | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchLocalData = async () => {
            try {
                setLoadingLocal(true);
                setError(null);
                const lat = coords?.[0] || 12.9716;
                const lon = coords?.[1] || 77.5946;
                const weather = await weatherService.fetchWeather(lat, lon);

                const safeCity = city || "Bengaluru";
                const profile = coords ? (getCityByCoords(coords[0], coords[1]) || CITIES[safeCity] || CITIES["Bengaluru"]) : (CITIES[safeCity] || CITIES["Bengaluru"]);

                const flood = calculateMonsoonFloodRisk({
                    rainfallIntensity: weather.rainfall,
                    riverBasinStressIndex: 45, // Baseline for urban core
                    drainageCapacity: profile.drainage_capacity_index,
                    precipitationPatternAnomaly: 0.1
                });

                const heat = calculateHeatwaveVulnerability({
                    temperatureC: weather.temperature,
                    urbanHeatIslandEffect: 65, // Baseline urban core
                    populationDensity: profile.population_density / 1000, // Normalize to index
                    greenCoverPercent: profile.green_cover_percent
                });

                if (isMounted) {
                    setFloodData({ ...(flood || {}), score: flood?.riskScore || 0 });
                    setHeatData({ ...(heat || {}), score: heat?.vulnerabilityScore || 0 });
                    setWeatherMeta({
                        dataSource: weather.dataSource,
                        lastUpdated: weather.lastUpdated
                    });
                }
            } catch (error) {
                console.error("Local intelligence failure", error);
                if (isMounted) {
                    setError("Failed to fetch regional intelligence. Please check your connection.");
                }
            } finally {
                if (isMounted) setLoadingLocal(false);
            }
        };

        fetchLocalData();
        return () => { isMounted = false; };
    }, [coords, city, metrics]);

    if (error) return (
        <div className="w-full p-12 civic-card border-red-600/30 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-600/10 flex items-center justify-center mb-4">
                <span className="text-red-600 font-bold text-xl">!</span>
            </div>
            <p className="text-[var(--color-navy)] font-black uppercase tracking-widest text-xs mb-4">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[var(--color-navy)] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-accent)] transition-colors"
            >
                Retry Connection
            </button>
        </div>
    );

    if (!floodData || !heatData || loadingLocal) return <div className="text-[var(--color-navy)] uppercase tracking-widest text-[10px] font-black flex justify-center items-center h-[400px] animate-pulse p-12 civic-card">Loading Regional Intelligence...</div>;

    const currentData = activeTab === 'flood' ? floodData : heatData;
    const title = activeTab === 'flood' ? "Monsoon Flood Risk" : "Heatwave Vulnerability";

    // Joint insights for display
    const insightsDisplay = currentData.insights?.join(" ") || "No specific anomalies detected for this region.";

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
                    {/* Gauge Section */}
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

                    {/* Assessment Info */}
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
                            {insightsDisplay}
                        </p>
                    </div>
                </div>

                {/* Multi-column Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Risk Indicators */}
                    <div className="bg-[var(--color-navy)]/5 p-6 rounded-lg border border-[var(--color-navy)]/10 flex flex-col justify-between">
                        <div>
                            <h4 className="text-sm font-black text-[var(--color-navy)] uppercase tracking-widest mb-6 border-b border-[var(--color-navy)]/10 pb-2">
                                Risk Indicators
                            </h4>
                            <div className="space-y-4">
                                {Object.entries(currentData?.details || {}).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-navy)]/70">
                                            {key.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-md font-black text-[var(--color-forest)]">
                                            {String(value)}
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

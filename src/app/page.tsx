"use client";

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from "framer-motion";
import { Globe, MapPin } from "lucide-react";
import { apiClient } from '@/services/apiClient';
import { translationService, SupportedLanguage } from '@/services/translationService';
import { CITIES } from '@/engines/cityProfiles';

import Header from '@/components/ui/Header';
import RiskPanel from '@/components/ui/RiskPanel';
import RiskAlert from '@/components/ui/RiskAlert';
import LocationSearch from '@/components/map/LocationSearch';
import IndiaDisasterPanel from '@/components/IndiaDisasterPanel';
import EvacuationPanel from '@/components/EvacuationPanel';
import { BENGALURU_RISK_FALLBACK } from '@/engines/cityDefaults';

// SSR-Safe dynamic imports
const UrbanMap = dynamic(() => import('@/components/map/UrbanMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full min-h-[500px] bg-slate-100 animate-pulse flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Geospatial Engine...</div>
});

const NeighborhoodRiskPanel = dynamic(() => import('@/components/NeighborhoodRiskPanel'), { ssr: false });
const ForecastRiskTimeline = dynamic(() => import('@/components/ForecastRiskTimeline'), { ssr: false });
const AnomalyBanner = dynamic(() => import('@/components/AnomalyBanner'), { ssr: false });
const ResourceDeploymentPanel = dynamic(() => import('@/components/ResourceDeploymentPanel'), { ssr: false });
const SMSAlertPreview = dynamic(() => import('@/components/SMSAlertPreview'), { ssr: false });
const IndiaSeasonCalendar = dynamic(() => import('@/components/IndiaSeasonCalendar'), { ssr: false });

// ─── Japanese Wave SVG Animation ──────────────────────────────────────────────
function WaveAnimation() {
    return (
        <svg viewBox="0 0 1440 220" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <style>{`
                .wave1 { animation: waveMove 8s linear infinite; }
                .wave2 { animation: waveMove 12s linear infinite reverse; opacity: 0.6; }
                .wave3 { animation: waveMove 6s linear infinite; opacity: 0.3; }
                @keyframes waveMove {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
            <g className="wave1">
                <path d="M0 180 C120 140, 240 200, 360 170 C480 140, 600 200, 720 170 C840 140, 960 200, 1080 170 C1200 140, 1320 200, 1440 170 C1560 140, 1680 200, 1800 170 C1920 140, 2040 200, 2160 170 C2280 140, 2400 200, 2520 170 C2640 140, 2760 200, 2880 170 L2880 220 L0 220 Z"
                    fill="#1a2a40" opacity="0.9" />
            </g>
            <g className="wave2">
                <path d="M0 190 C180 160, 300 210, 480 185 C660 160, 780 210, 960 185 C1140 160, 1260 210, 1440 185 C1620 160, 1740 210, 1920 185 C2100 160, 2220 210, 2400 185 C2580 160, 2700 210, 2880 185 L2880 220 L0 220 Z"
                    fill="#0f1e30" opacity="0.7" />
            </g>
            <g className="wave3">
                <path d="M0 170 C60 155, 120 145, 180 155 C240 165, 300 145, 360 155 C420 165, 480 145, 540 155 C600 165, 660 145, 720 155 C780 165, 840 145, 900 155 C960 165, 1020 145, 1080 155 C1140 165, 1200 145, 1260 155 C1320 165, 1380 145, 1440 155 C1500 165, 1560 145, 1620 155 C1680 165, 1740 145, 1800 155 C1860 165, 1920 145, 1980 155 C2040 165, 2100 145, 2160 155 C2220 165, 2280 145, 2340 155 C2400 165, 2460 145, 2520 155 C2580 165, 2640 145, 2700 155 C2760 165, 2820 145, 2880 155"
                    fill="none" stroke="#b8860b" strokeWidth="1.5" opacity="0.6" />
            </g>
            {[60, 200, 340, 500, 680, 860, 1020, 1200, 1380].map((x, i) => (
                <g key={i} className="wave1" transform={`translate(${x}, 158)`}>
                    <path d="M0 0 C5 -12, 15 -18, 25 -14 C35 -10, 40 -2, 35 4"
                        fill="none" stroke="#b8860b" strokeWidth="1.5" opacity="0.5" />
                    <circle cx="25" cy="-6" r="2" fill="#b8860b" opacity="0.4" />
                </g>
            ))}
        </svg>
    );
}

export default function Home() {
    const [isLaunched, setIsLaunched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState<SupportedLanguage>('en');
    const [geoLoading, setGeoLoading] = useState(false);
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportSeverity, setReportSeverity] = useState("MODERATE");
    const [reportToken, setReportToken] = useState<string | null>(null);
    const [reportSubmitting, setReportSubmitting] = useState(false);
    const [reportType, setReportType] = useState("🌊 Flooding / Waterlogging");
    const [reportLocation, setReportLocation] = useState("");
    const [reportDescription, setReportDescription] = useState("");

    const [selectedLocation, setSelectedLocation] = useState("Bengaluru");
    const [selectedCoords, setSelectedCoords] = useState<[number, number]>([12.9716, 77.5946]);

    const [metrics, setMetrics] = useState<any>(null);
    const displayMetrics = metrics || (selectedLocation === "Bengaluru" ? BENGALURU_RISK_FALLBACK : null);

    const [error, setError] = useState<string | null>(null);

    const t = useMemo(() => translationService.getTranslations(language), [language]);

    const CITY_COORDS: Record<string, [number, number]> = {
        "Bengaluru": [12.9716, 77.5946],
        "Delhi": [28.6139, 77.2090],
        "Mumbai": [19.0760, 72.8777],
        "Chennai": [13.0827, 80.2707],
        "Hyderabad": [17.3850, 78.4867],
        "Patna": [25.5941, 85.1376],
        "Guwahati": [26.1445, 91.7362],
        "Kolkata": [22.5726, 88.3639],
        "Ahmedabad": [23.0225, 72.5714],
        "Surat": [21.1702, 72.8311],
        "Wayanad": [11.6854, 76.1320],
        "Kozhikode": [11.2588, 75.7804],
        "India": [20.5937, 78.9629]
    };

    const fetchMetrics = async (city: string, lat?: number, lng?: number) => {
        setLoading(true);
        setError(null);
        try {
            const latitude = lat ?? selectedCoords[0];
            const longitude = lng ?? selectedCoords[1];
            const res = await apiClient.fetch<any>("/api/stress-test", {
                method: "POST",
                body: JSON.stringify({ city, lat: latitude, lng: longitude })
            });
            if (res.success && res.data) {
                setMetrics(res.data);
            } else {
                throw new Error(res.error || "API returned an error");
            }
        } catch (err: any) {
            console.error("Prediction failed", err);
            setError(err.message || "SYSTEM ERROR: Backend API failed.");
        } finally {
            setLoading(false);
        }
    };

    const executeStressTest = () => fetchMetrics(selectedLocation, selectedCoords[0], selectedCoords[1]);

    const handleCityChange = (city: string) => {
        const safeCity = city || "Bengaluru";
        setSelectedLocation(safeCity);
        const coords = CITY_COORDS[safeCity] || CITY_COORDS["Bengaluru"];
        setSelectedCoords(coords);
    };

    const handleMapClick = (lat: number, lng: number) => {
        const safeLat = lat ?? 12.9716;
        const safeLng = lng ?? 77.5946;
        setSelectedCoords([safeLat, safeLng]);
        setSelectedLocation(`Point: ${safeLat.toFixed(4)}, ${safeLng.toFixed(4)}`);
        fetchMetrics("Custom Point", safeLat, safeLng);
    };

    const handleLocationSelect = (lat: number, lng: number, displayName: string) => {
        const parts = displayName ? displayName.split(",") : [];
        const derivedCity = parts.length > 0 ? parts[0].trim() : selectedLocation;
        setSelectedLocation(derivedCity || "Bengaluru");
        setSelectedCoords([lat ?? 12.9716, lng ?? 77.5946]);
        fetchMetrics(derivedCity || "Bengaluru", lat, lng);
    };

    const handleMyLocation = () => {
        if (!navigator.geolocation) return;
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setSelectedCoords([latitude, longitude]);
                setSelectedLocation("My Location");
                fetchMetrics("My Location", latitude, longitude);
                setGeoLoading(false);
            },
            () => {
                setGeoLoading(false);
                setError("Geolocation permission denied or unavailable.");
            },
            { timeout: 10000 }
        );
    };

    const handleSubmitReport = async () => {
        setReportSubmitting(true);
        try {
            const res = await fetch("/api/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: reportType, location: reportLocation,
                    description: reportDescription, severity: reportSeverity,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setReportToken(data.token);
            }
        } catch (e) {
            console.error("Report submission failed", e);
        } finally {
            setReportSubmitting(false);
        }
    };

    const cityProfile = CITIES[selectedLocation] ?? CITIES["Bengaluru"];

    return (
        <main className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans">
            <AnimatePresence mode="wait">
                {!isLaunched ? (
                    <motion.div
                        key="entry"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col relative overflow-hidden min-h-screen"
                        style={{ background: '#f5f2eb' }}
                    >
                        {/* TOP NAV BAR */}
                        <nav className="flex justify-between items-center px-8 py-5 z-20 relative">
                            <div>
                                <span className="text-2xl font-black tracking-tighter text-[#1a2a40]">URBAN</span>
                                <span className="text-2xl font-black tracking-tighter text-[#b8860b]">SHIELD</span>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-[#1a2a40]/50 font-bold">
                                    Civic Intelligence &amp; Risk Console
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDonateModal(true)}
                                    className="px-5 py-2 text-xs font-black uppercase tracking-widest bg-[#b8860b] text-white border-2 border-[#b8860b] hover:bg-transparent hover:text-[#b8860b] transition-all"
                                >
                                    ❤ DONATE
                                </button>
                                <button
                                    onClick={() => setShowReportModal(true)}
                                    className="px-5 py-2 text-xs font-black uppercase tracking-widest border-2 border-[#1a2a40] text-[#1a2a40] hover:bg-[#1a2a40] hover:text-white transition-all"
                                >
                                    ⚠ REPORT
                                </button>
                            </div>
                        </nav>

                        {/* HERO CONTENT */}
                        <div className="flex-1 flex flex-col items-center justify-center z-10 relative px-8 pb-32">
                            {/* LIVE STATS TICKER */}
                            <div className="flex gap-8 mb-10 text-center">
                                <div>
                                    <div className="text-3xl font-black text-[#1a2a40]">331</div>
                                    <div className="text-[9px] uppercase tracking-widest text-[#1a2a40]/50 font-bold">Extreme weather days<br />in India (2025)</div>
                                </div>
                                <div className="w-px bg-[#1a2a40]/20" />
                                <div>
                                    <div className="text-3xl font-black text-[#b8860b]">4,419</div>
                                    <div className="text-[9px] uppercase tracking-widest text-[#1a2a40]/50 font-bold">Deaths from extreme<br />weather (2025)</div>
                                </div>
                                <div className="w-px bg-[#1a2a40]/20" />
                                <div>
                                    <div className="text-3xl font-black text-[#1a2a40]">70%+</div>
                                    <div className="text-[9px] uppercase tracking-widest text-[#1a2a40]/50 font-bold">Cities lack adequate<br />stormwater drainage</div>
                                </div>
                            </div>

                            {/* MAIN HEADLINE */}
                            <h1 className="text-[clamp(3rem,10vw,8rem)] font-black tracking-tighter leading-[0.85] text-[#1a2a40] text-center mb-4 uppercase">
                                PREDICT.<br />
                                <span className="text-[#b8860b]">PROTECT.</span><br />
                                RESPOND.
                            </h1>

                            <p className="text-base text-[#1a2a40]/60 font-medium max-w-xl text-center mb-10 leading-relaxed">
                                India&apos;s first AI-powered civic disaster intelligence platform.
                                Real-time flood and heatwave prediction for 12 major cities.
                            </p>

                            {/* CTA BUTTONS */}
                            <div className="flex gap-4 flex-wrap justify-center">
                                <button
                                    onClick={() => setIsLaunched(true)}
                                    className="px-10 py-4 text-sm font-black uppercase tracking-widest bg-[#1a2a40] text-white border-2 border-[#1a2a40] hover:bg-transparent hover:text-[#1a2a40] transition-all shadow-[6px_6px_0px_#b8860b]"
                                >
                                    INITIALIZE CONSOLE →
                                </button>
                                <button
                                    onClick={() => setShowDonateModal(true)}
                                    className="px-10 py-4 text-sm font-black uppercase tracking-widest border-2 border-[#b8860b] text-[#b8860b] hover:bg-[#b8860b] hover:text-white transition-all"
                                >
                                    ❤ DONATE NOW
                                </button>
                            </div>
                        </div>

                        {/* JAPANESE WAVE SVG — pinned to bottom */}
                        <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none">
                            <WaveAnimation />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="console"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col flex-1"
                    >
                        <div className="page-wrapper relative">
                            {/* Top telemetry bar */}
                            <div className="w-full bg-[var(--color-navy)] text-highlight text-[10px] font-black tracking-widest uppercase p-1 flex justify-between items-center px-4 font-space">
                                <span className={!error && displayMetrics ? "text-green-400" : "text-slate-400"}>
                                    ● {t.ui_telemetry} ACTIVE
                                </span>
                                <div className="flex items-center gap-4">
                                    {/* Quick-access console buttons */}
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowReportModal(true)}
                                            className="px-3 py-1 text-[9px] font-black uppercase tracking-wider border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-navy)] transition-all">
                                            ⚠ REPORT
                                        </button>
                                        <button onClick={() => setShowDonateModal(true)}
                                            className="px-3 py-1 text-[9px] font-black uppercase tracking-wider bg-[var(--color-accent)] text-white hover:opacity-80 transition-all">
                                            ❤ DONATE
                                        </button>
                                    </div>
                                    <Globe className="w-3 h-3 text-[var(--color-accent)]" />
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                                        className="bg-transparent border-none text-highlight focus:outline-none cursor-pointer hover:text-[var(--color-accent)] transition-colors"
                                    >
                                        <option value="en" className="bg-slate-900">ENGLISH</option>
                                        <option value="hi" className="bg-slate-900">हिन्दी (HINDI)</option>
                                        <option value="bn" className="bg-slate-900">বাংলা (BENGALI)</option>
                                        <option value="ta" className="bg-slate-900">தமிழ் (TAMIL)</option>
                                        <option value="mr" className="bg-slate-900">मराठी (MARATHI)</option>
                                    </select>
                                </div>
                            </div>

                            <Header
                                selectedCity={selectedLocation || "Bengaluru"}
                                onCityChange={handleCityChange}
                                overallRisk={displayMetrics?.compound_risk_index || 0}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 flex-1">
                                {/* Left column */}
                                <div className="lg:col-span-3">
                                    <button
                                        onClick={executeStressTest}
                                        disabled={loading}
                                        className="w-full bg-amber-500 text-white font-black py-4 uppercase mb-4 shadow-[4px_4px_0px_#b45309] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {loading ? "INITIALIZING SIMULATION..." : t.ui_execute}
                                    </button>

                                    {loading && (
                                        <div className="text-[10px] uppercase font-black tracking-widest text-[var(--color-navy)] animate-pulse flex items-center gap-2 mb-4">
                                            <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-bounce" />
                                            Downloading Telemetry &amp; Modeling Prediction...
                                        </div>
                                    )}

                                    {displayMetrics && (
                                        <div className="bg-white/50 border border-[var(--color-navy)]/10 p-4 flex flex-col gap-2 relative overflow-hidden mb-4">
                                            {displayMetrics.engine_status === "CORE_RESILIENCE" && (
                                                <div className="absolute top-0 right-0 bg-amber-500 text-[8px] font-black text-white px-2 py-0.5 uppercase tracking-tighter">
                                                    Demo Mode
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center border-b border-[var(--color-navy)]/5 pb-2">
                                                <span className="text-[9px] font-black uppercase text-muted">{t.ui_confidence}</span>
                                                <span className="text-sm font-black text-[var(--color-navy)]">{displayMetrics.model_confidence}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 h-1 mt-1">
                                                <div
                                                    className="bg-[var(--color-accent)] h-full transition-all duration-1000"
                                                    style={{ width: `${displayMetrics.model_confidence}%` }}
                                                />
                                            </div>
                                            <div className="mt-2 text-[8px] font-bold text-muted uppercase tracking-widest flex items-center gap-1">
                                                <div className={`w-1 h-1 rounded-full ${displayMetrics.engine_status === "CORE_RESILIENCE" ? "bg-amber-400" : "bg-green-400"}`} />
                                                {displayMetrics.engine_status === "CORE_RESILIENCE" ? "Core Resilience Fallback Active" : "Premium Intelligence Online"}
                                            </div>
                                        </div>
                                    )}

                                    {/* TASK 6: NDRF Deployment */}
                                    <ResourceDeploymentPanel city={selectedLocation} metrics={displayMetrics} />
                                </div>

                                {/* Center column */}
                                <div className="lg:col-span-6 flex flex-col gap-4">
                                    {/* TASK 5: Anomaly Banner */}
                                    <AnomalyBanner city={selectedLocation} metrics={displayMetrics} />

                                    {/* TASK 9: Search + My Location */}
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <LocationSearch
                                                jurisdictionCity={selectedLocation}
                                                onSelectLocation={handleLocationSelect}
                                            />
                                        </div>
                                        <button
                                            onClick={handleMyLocation}
                                            disabled={geoLoading}
                                            title="Use my current location"
                                            className="shrink-0 h-[46px] px-3 bg-[var(--color-navy)] text-white border-2 border-[var(--color-navy)] hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <MapPin className={`w-4 h-4 ${geoLoading ? "animate-bounce" : ""}`} />
                                            <span className="text-[8px] font-black uppercase tracking-widest hidden sm:block">
                                                {geoLoading ? "..." : "ME"}
                                            </span>
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center bg-white/40 p-2 border border-[var(--color-navy)]/5 rounded-sm">
                                        <span className="text-[10px] font-black uppercase text-[var(--color-navy)] tracking-widest">
                                            Spatial Threat Mapping | India Core
                                        </span>
                                    </div>

                                    <div className="flex-1 min-h-[500px] relative border-2 border-[var(--color-navy)]">
                                        <UrbanMap
                                            center={selectedCoords || [12.9716, 77.5946]}
                                            riskLevel={displayMetrics?.compound_risk_index || 0}
                                            onMapClick={handleMapClick}
                                        />

                                        {error && (
                                            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-red-500/10 backdrop-blur-sm pointer-events-none">
                                                <div className="text-center p-6 bg-white border-2 border-red-500 pointer-events-auto">
                                                    <h3 className="text-red-600 font-black uppercase tracking-widest mb-2">Connection Error</h3>
                                                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">{error}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {displayMetrics && (
                                        <RiskAlert score={displayMetrics.compound_risk_index} language={language} />
                                    )}

                                    {/* TASK 4: 72-Hour Forecast */}
                                    <ForecastRiskTimeline
                                        lat={selectedCoords[0]}
                                        lng={selectedCoords[1]}
                                        city={selectedLocation}
                                    />
                                </div>

                                {/* Right column */}
                                <div className="lg:col-span-3 flex flex-col gap-6">
                                    {displayMetrics ? (
                                        <RiskPanel data={{
                                            flood_risk_index: displayMetrics.flood_risk_index,
                                            heat_risk_index: displayMetrics.heat_risk_index,
                                            compound_risk_index: displayMetrics.compound_risk_index,
                                        }} />
                                    ) : (
                                        <div className="text-center font-bold text-slate-400 uppercase tracking-widest text-[10px] p-12 border-2 border-dashed border-slate-200">
                                            Run Stress Test to View Urban Telemetry
                                        </div>
                                    )}

                                    {/* TASK 3: Neighbourhood Risk */}
                                    <NeighborhoodRiskPanel
                                        city={selectedLocation}
                                        neighborhoods={cityProfile?.neighborhoods}
                                        metrics={displayMetrics}
                                    />
                                </div>
                            </div>

                            {/* SMS Alert Preview — Task 7 */}
                            {displayMetrics && (
                                <div className="w-full px-8 pb-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-px bg-[var(--color-navy)]/20" />
                                        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-navy)]/40">
                                            EMERGENCY ALERT BROADCAST PREVIEW
                                        </span>
                                        <div className="flex-1 h-px bg-[var(--color-navy)]/5" />
                                    </div>
                                    <SMSAlertPreview city={selectedLocation} metrics={displayMetrics} />
                                </div>
                            )}

                            {/* Disaster Calendar — Task 8 */}
                            <div className="w-full px-8 pb-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-px bg-[var(--color-navy)]/20" />
                                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-navy)]/40">
                                        INDIA DISASTER SEASON INTELLIGENCE
                                    </span>
                                    <div className="flex-1 h-px bg-[var(--color-navy)]/5" />
                                </div>
                                <IndiaSeasonCalendar />
                            </div>

                            {/* India Intelligence Panel */}
                            <div className="w-full px-8 pb-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-px bg-[var(--color-navy)]/20" />
                                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-navy)]/40">
                                        REGIONAL MODULE: INDIA INTELLIGENCE SURFACE
                                    </span>
                                    <div className="flex-1 h-px bg-[var(--color-navy)]/5" />
                                </div>
                                <IndiaDisasterPanel metrics={displayMetrics} coords={selectedCoords} city={selectedLocation} />
                            </div>

                            {/* Evacuation Panel */}
                            <div className="w-full px-8 pb-16">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-px bg-[var(--color-navy)]/20" />
                                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-navy)]/40">
                                        RELIEF OPERATIONS: EVACUATION OPTIMIZATION
                                    </span>
                                    <div className="flex-1 h-px bg-[var(--color-navy)]/5" />
                                </div>
                                <EvacuationPanel metrics={displayMetrics} city={selectedLocation || "Bengaluru"} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DONATE MODAL */}
            {showDonateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white border-2 border-[#1a2a40] shadow-[8px_8px_0px_#b8860b] max-w-md w-full p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-[#1a2a40]">
                                    Disaster Relief Fund
                                </h2>
                                <p className="text-xs text-[#1a2a40]/50 uppercase tracking-widest font-bold mt-1">
                                    Support flood &amp; cyclone survivors
                                </p>
                            </div>
                            <button onClick={() => setShowDonateModal(false)} className="text-[#1a2a40]/40 hover:text-[#1a2a40] font-black text-xl">✕</button>
                        </div>

                        {/* Active campaigns */}
                        <div className="space-y-3 mb-6">
                            {[
                                { name: "Wayanad Landslide Relief", raised: "₹24.8L", goal: "₹50L", pct: 49, org: "Kerala CM Relief Fund" },
                                { name: "Assam Flood Victims 2024", raised: "₹18.2L", goal: "₹40L", pct: 45, org: "ASDMA" },
                                { name: "Bihar Monsoon Relief", raised: "₹31.5L", goal: "₹60L", pct: 52, org: "Bihar SDMA" },
                            ].map((campaign, i) => (
                                <div key={i} className="border border-[#1a2a40]/20 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-wide text-[#1a2a40]">{campaign.name}</p>
                                            <p className="text-[9px] text-[#1a2a40]/40 uppercase font-bold">{campaign.org}</p>
                                        </div>
                                        <span className="text-xs font-black text-[#b8860b]">{campaign.pct}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-[#1a2a40]/10 mb-2">
                                        <div className="h-full bg-[#b8860b]" style={{ width: `${campaign.pct}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[9px] text-[#1a2a40]/50 font-bold uppercase">
                                        <span>{campaign.raised} raised</span>
                                        <span>Goal: {campaign.goal}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {["₹100", "₹500", "₹1,000", "₹5,000"].map(amt => (
                                <button key={amt}
                                    className="py-2 text-xs font-black border-2 border-[#1a2a40] text-[#1a2a40] hover:bg-[#1a2a40] hover:text-white transition-all">
                                    {amt}
                                </button>
                            ))}
                        </div>
                        <a href="https://pmindiawebsite.nic.in/pages/pmnrf.php" target="_blank" rel="noopener noreferrer">
                            <button className="w-full py-3 bg-[#b8860b] text-white text-sm font-black uppercase tracking-widest hover:bg-[#1a2a40] transition-all">
                                DONATE NOW — REDIRECTING TO PM RELIEF FUND →
                            </button>
                        </a>
                        <p className="text-[9px] text-center text-[#1a2a40]/30 mt-3 uppercase font-bold">
                            Donations redirected to verified NDMA/PM Relief Fund portals
                        </p>
                    </div>
                </div>
            )}

            {/* REPORT MODAL */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white border-2 border-[#1a2a40] shadow-[8px_8px_0px_#b8860b] max-w-md w-full p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-[#1a2a40]">
                                    Raise a Report
                                </h2>
                                <p className="text-xs text-[#1a2a40]/50 uppercase tracking-widest font-bold mt-1">
                                    Report weather anomaly or ground situation
                                </p>
                            </div>
                            <button onClick={() => { setShowReportModal(false); setReportToken(null); }}
                                className="text-[#1a2a40]/40 font-black text-xl hover:text-[#1a2a40]">✕</button>
                        </div>

                        {reportToken ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">✅</div>
                                <p className="text-xs font-black uppercase tracking-widest text-[#1a2a40]/60 mb-2">Report Submitted</p>
                                <p className="text-xl font-black text-[#1a2a40] font-mono">{reportToken}</p>
                                <p className="text-[10px] text-[#1a2a40]/40 mt-3 uppercase font-bold">
                                    Save this token. Forwarding to district emergency cell.
                                </p>
                                <button
                                    onClick={() => { setShowReportModal(false); setReportToken(null); setReportLocation(""); setReportDescription(""); }}
                                    className="mt-6 px-8 py-3 bg-[#1a2a40] text-white text-xs font-black uppercase tracking-widest hover:bg-[#b8860b] transition-all"
                                >
                                    CLOSE
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#1a2a40]/60 block mb-1">Report Type</label>
                                    <select value={reportType} onChange={e => setReportType(e.target.value)}
                                        className="w-full border-2 border-[#1a2a40] p-2 text-xs font-bold uppercase bg-white focus:outline-none">
                                        <option>🌊 Flooding / Waterlogging</option>
                                        <option>🌡 Extreme Heat</option>
                                        <option>⛰ Landslide / Erosion</option>
                                        <option>🌪 Cyclone / Storm</option>
                                        <option>🚧 Infrastructure Damage</option>
                                        <option>📢 Missing Person / Rescue Needed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#1a2a40]/60 block mb-1">Location</label>
                                    <input value={reportLocation} onChange={e => setReportLocation(e.target.value)}
                                        className="w-full border-2 border-[#1a2a40] p-2 text-xs font-bold focus:outline-none"
                                        placeholder="Area, city, pincode..." />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#1a2a40]/60 block mb-1">Description</label>
                                    <textarea value={reportDescription} onChange={e => setReportDescription(e.target.value)}
                                        className="w-full border-2 border-[#1a2a40] p-2 text-xs font-bold focus:outline-none h-20 resize-none"
                                        placeholder="Describe the situation..." />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#1a2a40]/60 block mb-1">Severity</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(["LOW", "MODERATE", "CRITICAL"] as const).map(s => (
                                            <button key={s} onClick={() => setReportSeverity(s)}
                                                className={`py-2 text-[9px] font-black border-2 transition-all uppercase tracking-wider ${reportSeverity === s
                                                        ? "bg-[#1a2a40] text-white border-[#1a2a40]"
                                                        : "border-[#1a2a40] text-[#1a2a40] hover:bg-[#1a2a40] hover:text-white"
                                                    }`}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmitReport}
                                    disabled={reportSubmitting || !reportLocation}
                                    className="w-full py-3 bg-[#1a2a40] text-white text-sm font-black uppercase tracking-widest hover:bg-[#b8860b] transition-all disabled:opacity-50">
                                    {reportSubmitting ? "SUBMITTING..." : "SUBMIT REPORT → TOKEN GENERATED"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}

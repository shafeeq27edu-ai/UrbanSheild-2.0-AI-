"use client";

import { useEffect, useState, useMemo } from "react";
import { calculateRiskMetrics } from "@/engines/predictionEngine";
import { TrendingUp, Clock } from "lucide-react";

interface ForecastPoint {
    hour: number;
    label: string;
    rainfall: number;
    temperature: number;
    humidity: number;
    compound: number;
    category: string;
}

interface ForecastRiskTimelineProps {
    lat: number;
    lng: number;
    city: string;
}

const CAT_COLOR: Record<string, string> = {
    Critical: "#ef4444",
    High: "#f59e0b",
    Moderate: "#eab308",
    Low: "#22c55e",
};

export default function ForecastRiskTimeline({ lat, lng, city }: ForecastRiskTimelineProps) {
    const [forecast, setForecast] = useState<ForecastPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!lat || !lng) return;
        setLoading(true);
        setError(false);

        const controller = new AbortController();
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,precipitation,relative_humidity_2m&forecast_days=3&timezone=auto`,
            { signal: controller.signal }
        )
            .then(r => r.json())
            .then(data => {
                if (!data?.hourly) { setError(true); return; }
                const { time, temperature_2m, precipitation, relative_humidity_2m } = data.hourly;
                // Sample every 6 hours (max 12 points)
                const points: ForecastPoint[] = [];
                for (let i = 0; i < Math.min(time.length, 72); i += 6) {
                    const metrics = calculateRiskMetrics({
                        rainfall: (precipitation[i] || 0) * 24, // convert mm/hr → mm/day
                        temperature: temperature_2m[i] || 28,
                        humidity: relative_humidity_2m[i] || 60,
                        populationDensity: 5000,
                        drainageCapacity: 35,
                        imperviousSurface: 65,
                    });
                    const t = new Date(time[i]);
                    points.push({
                        hour: i,
                        label: t.toLocaleString("en-IN", { weekday: "short", hour: "2-digit", hour12: true }),
                        rainfall: Math.round((precipitation[i] || 0) * 24),
                        temperature: Math.round(temperature_2m[i] || 28),
                        humidity: Math.round(relative_humidity_2m[i] || 60),
                        compound: metrics.compound_risk_index,
                        category: metrics.risk_category,
                    });
                }
                setForecast(points);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [lat, lng]);

    const peak = useMemo(() => {
        if (!forecast.length) return null;
        return forecast.reduce((a, b) => a.compound > b.compound ? a : b);
    }, [forecast]);

    const maxScore = Math.max(...forecast.map(f => f.compound), 1);

    if (loading) {
        return (
            <div className="border-2 border-[var(--color-navy)] bg-white/60 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--color-navy)]/50 animate-pulse">
                    Loading 72-Hour Forecast...
                </div>
            </div>
        );
    }

    if (error || !forecast.length) {
        return (
            <div className="border-2 border-[var(--color-navy)] bg-white/60 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                    Forecast data unavailable — using live snapshot
                </div>
            </div>
        );
    }

    return (
        <div className="border-2 border-[var(--color-navy)] bg-white/60 p-4">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-[var(--color-navy)]" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--color-navy)]/50">
                    72-Hour Risk Forecast Timeline
                </span>
                <div className="flex-1 h-px bg-[var(--color-navy)]/10" />
                <span className="text-[9px] font-bold text-[var(--color-navy)]/40">{city.toUpperCase()}</span>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-1 h-24 mb-3">
                {forecast.map((f, i) => {
                    const h = Math.max(4, (f.compound / maxScore) * 96);
                    const color = CAT_COLOR[f.category] || "#22c55e";
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                            <div
                                className="w-full rounded-none transition-all duration-500"
                                style={{ height: h, backgroundColor: color, opacity: 0.85 }}
                                title={`${f.label}: ${f.compound} (${f.category})`}
                            />
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[var(--color-navy)] text-white text-[8px] px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 z-50 pointer-events-none transition-opacity">
                                {f.label}<br />{f.compound} · {f.category}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* X-axis labels */}
            <div className="flex gap-1 mb-3">
                {forecast.map((f, i) => (
                    <div key={i} className="flex-1 text-[7px] font-bold text-[var(--color-navy)]/40 text-center truncate">
                        {i % 2 === 0 ? f.label.split(",")[0] : ""}
                    </div>
                ))}
            </div>

            {/* Peak callout */}
            {peak && (
                <div
                    className="flex items-center gap-3 p-3 border border-dashed"
                    style={{ borderColor: CAT_COLOR[peak.category] }}
                >
                    <Clock className="w-4 h-4 shrink-0" style={{ color: CAT_COLOR[peak.category] }} />
                    <div>
                        <div className="text-[8px] font-black uppercase tracking-widest text-[var(--color-navy)]/50">Risk Peak</div>
                        <div className="text-sm font-black text-[var(--color-navy)]">{peak.label}</div>
                        <div className="text-[10px] font-bold" style={{ color: CAT_COLOR[peak.category] }}>
                            {peak.compound} / 100 — {peak.category.toUpperCase()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

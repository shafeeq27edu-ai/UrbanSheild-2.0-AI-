"use client";

import { AlertTriangle } from "lucide-react";

interface AnomalyBannerProps {
    city: string;
    metrics?: any;
}

interface Anomaly {
    label: string;
    detail: string;
    sigma?: number;
}

// Seasonal baselines per month (realistic Indian climate)
const RAINFALL_BASELINES: Record<number, number> = {
    0: 12, 1: 8, 2: 10, 3: 18, 4: 30, 5: 85,
    6: 185, 7: 190, 8: 145, 9: 90, 10: 40, 11: 18,
};
const TEMP_BASELINES: Record<number, number> = {
    0: 24, 1: 27, 2: 31, 3: 34, 4: 36, 5: 33,
    6: 29, 7: 28, 8: 29, 9: 30, 10: 29, 11: 26,
};

export default function AnomalyBanner({ city, metrics }: AnomalyBannerProps) {
    if (!metrics) return null;

    const month = new Date().getMonth();
    const baseRain = RAINFALL_BASELINES[month] ?? 85;
    const baseTemp = TEMP_BASELINES[month] ?? 30;
    const stdRain = 87;

    const rainfall = metrics.runtime_rainfall ?? metrics.weather?.precipitation ?? null;
    const temp = metrics.runtime_temperature ?? metrics.weather?.temperature ?? null;

    const anomalies: Anomaly[] = [];

    if (rainfall !== null && rainfall > baseRain) {
        const sigma = (rainfall - baseRain) / stdRain;
        if (sigma >= 1.5) {
            anomalies.push({
                label: `Rainfall +${sigma.toFixed(1)}σ above ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month]} baseline`,
                detail: `${rainfall}mm vs seasonal mean ${baseRain}mm`,
                sigma,
            });
        }
    }

    if (temp !== null && temp > baseTemp + 3) {
        anomalies.push({
            label: `Temperature +${(temp - baseTemp).toFixed(1)}°C above normal`,
            detail: `${temp}°C recorded vs ${baseTemp}°C baseline`,
        });
    }

    if (metrics.compound_risk_index >= 62) {
        anomalies.push({
            label: "Critical compound risk threshold breached",
            detail: "Infrastructure stress expected within 18 hours",
        });
    }

    if (!anomalies.length) return null;

    const maxSigma = anomalies.reduce((m, a) => Math.max(m, a.sigma ?? 0), 0);
    const hoursToStress = maxSigma > 2 ? 6 : maxSigma > 1.5 ? 18 : 36;

    return (
        <div className="w-full border-2 border-amber-500 bg-amber-50 p-4 flex flex-col gap-2 mb-2">
            <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">
                    Anomaly Detected — {city.toUpperCase()}
                </span>
            </div>
            <div className="flex flex-col gap-1.5 pl-6">
                {anomalies.map((a, i) => (
                    <div key={i}>
                        <div className="text-xs font-bold text-amber-800">{a.label}</div>
                        <div className="text-[10px] text-amber-600">{a.detail}</div>
                    </div>
                ))}
            </div>
            <div className="pl-6 text-[10px] font-black uppercase tracking-wide text-amber-700 border-t border-amber-300 pt-2 mt-1">
                → Infrastructure stress expected within {hoursToStress} hours
            </div>
        </div>
    );
}

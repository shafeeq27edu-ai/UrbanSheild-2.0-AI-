import { NextResponse } from "next/server";
import { calculateRiskMetrics } from "@/engines/predictionEngine";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "12.9716");
    const lon = parseFloat(searchParams.get("lon") || "77.5946");
    const city = searchParams.get("city") || "Bengaluru";

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,relative_humidity_2m&forecast_days=3&timezone=Asia/Kolkata`;

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Open-Meteo returned ${res.status}`);
        }
        const data = await res.json();

        const hours = data.hourly.time as string[];
        const temps = data.hourly.temperature_2m as number[];
        const rains = data.hourly.precipitation as number[];
        const humidity = data.hourly.relative_humidity_2m as number[];

        // Sample every 3 hours → 24 data points for 72hr
        const forecast = hours
            .filter((_: string, i: number) => i % 3 === 0)
            .map((_: string, idx: number) => {
                const i = idx * 3;
                const metrics = calculateRiskMetrics({
                    rainfall: rains[i] * 6, // hourly → 6hr accumulation
                    temperature: temps[i],
                    humidity: humidity[i],
                    populationDensity: 5000,
                    drainageCapacity: 35,
                    imperviousSurface: 75,
                });
                return {
                    time: hours[i],
                    rain: rains[i],
                    temp: temps[i],
                    compound_risk: metrics.compound_risk_index,
                    category: metrics.risk_category,
                };
            });

        const peakRisk = forecast.reduce(
            (max: any, f: any) => (f.compound_risk > max.compound_risk ? f : max),
            forecast[0]
        );

        return NextResponse.json({ success: true, forecast, peak: peakRisk, city });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "Forecast data unavailable", message: error.message },
            { status: 500 }
        );
    }
}

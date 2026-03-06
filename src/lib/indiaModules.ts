export interface IndiaRiskResult {
    score: number;
    category: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Extreme';
    explanation: string;
    details: Record<string, number | string>;
}

export function monsoonFloodModule(
    rainfall_mm: number,
    drainageCapacity: number,
    riverLevel: number // percentage 0-100
): IndiaRiskResult {
    const rainScore = Math.min(100, (rainfall_mm / 300) * 100);
    const drainageScore = (100 - drainageCapacity);

    // Formula tailored for monsoon impacts: high rainfall + full rivers + poor drainage = disaster
    const baseScore = (rainScore * 0.5) + (riverLevel * 0.3) + (drainageScore * 0.2);
    const score = Math.round(Math.min(100, Math.max(0, baseScore)));

    let category: IndiaRiskResult['category'] = 'Low';
    if (score > 85) category = 'Critical';
    else if (score > 65) category = 'High';
    else if (score > 40) category = 'Moderate';

    return {
        score,
        category,
        explanation: `Calculated monsoon risk based on ${rainfall_mm}mm precipitation and current river capacity.`,
        details: {
            rainfall: rainfall_mm,
            drainage_efficiency: drainageCapacity,
            river_level: riverLevel
        }
    };
}

export function heatwaveModule(
    temperature_c: number,
    humidity_percent: number,
    urbanHeatIslandScore: number // 0-100
): IndiaRiskResult {
    // Wet-bulb approximation influence
    const heatIndex = temperature_c + (0.5555 * (6.11 * Math.pow(10, (7.5 * temperature_c) / (237.7 + temperature_c)) * (humidity_percent / 100) - 10));

    // UHI significantly amplifies local perceived temp
    const effectiveTemp = heatIndex + (urbanHeatIslandScore * 0.05);

    const baseScore = ((effectiveTemp - 30) / 20) * 100; // normalize around 30-50+ effective C
    const score = Math.round(Math.min(100, Math.max(0, baseScore)));

    let category: IndiaRiskResult['category'] = 'Low';
    if (score > 90) category = 'Extreme';
    else if (score > 75) category = 'Critical';
    else if (score > 60) category = 'High';
    else if (score > 40) category = 'Moderate';

    return {
        score,
        category,
        explanation: `Extreme heat analysis incorporating wet-bulb temperatures and urban heat island effects.`,
        details: {
            base_temp: temperature_c,
            humidity: humidity_percent,
            heat_index: Math.round(heatIndex),
            effective_temp: Math.round(effectiveTemp * 10) / 10
        }
    };
}

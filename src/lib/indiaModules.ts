export interface IndiaRiskResult {
    score: number;
    category: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Extreme';
    explanation: string;
    details: Record<string, number | string>;
}

export function monsoonFloodModule(
    rainfall_mm: number,
    drainageCapacity: number,
    populationDensity: number,
    imperviousSurface: number
): IndiaRiskResult {
    const rainScore = Math.min(100, (rainfall_mm / 300) * 100);
    const drainageScore = Math.min(100, Math.max(0, 100 - drainageCapacity));
    const densityScore = Math.min(100, (populationDensity / 25000) * 100);
    const imperviousScore = imperviousSurface; // Assuming 0-100%

    // Formula: 0.4 rainfall + 0.2 drainage + 0.2 density + 0.2 impervious
    const baseScore = (rainScore * 0.4) + (drainageScore * 0.2) + (densityScore * 0.2) + (imperviousScore * 0.2);
    const score = Math.round(Math.min(100, Math.max(0, baseScore)));

    let category: IndiaRiskResult['category'] = 'Low';
    if (score > 85) category = 'Critical';
    else if (score > 65) category = 'High';
    else if (score > 40) category = 'Moderate';

    return {
        score,
        category,
        explanation: `Calculated monsoon risk incorporating defensible metrics: rainfall intensity (40%), city drainage (20%), density (20%), and urban impervious surfaces (20%).`,
        details: {
            rainfall_mm: Math.round(rainfall_mm),
            drainage_stress: Math.round(drainageScore),
            urban_density: Math.round(densityScore),
            impervious_surface: Math.round(imperviousScore)
        }
    };
}

export function heatwaveModule(
    temperature_c: number,
    humidity_percent: number,
    green_cover_percent: number
): IndiaRiskResult {
    // Wet-bulb approximation influence
    const heatIndex = temperature_c + (0.5555 * (6.11 * Math.pow(10, (7.5 * temperature_c) / (237.7 + temperature_c)) * (humidity_percent / 100) - 10));

    // Less green cover = higher urban heat island effect
    const uhiPenalty = Math.max(0, (50 - green_cover_percent) * 0.2);

    const effectiveTemp = heatIndex + uhiPenalty;

    const baseScore = ((effectiveTemp - 30) / 20) * 100;
    const score = Math.round(Math.min(100, Math.max(0, baseScore)));

    let category: IndiaRiskResult['category'] = 'Low';
    if (score > 90) category = 'Extreme';
    else if (score > 75) category = 'Critical';
    else if (score > 60) category = 'High';
    else if (score > 40) category = 'Moderate';

    return {
        score,
        category,
        explanation: `Extreme heat analysis assessing wet-bulb temperatures against baseline urban green cover.`,
        details: {
            base_temp: temperature_c,
            humidity: humidity_percent,
            green_cover: green_cover_percent,
            effective_temp: Math.round(effectiveTemp * 10) / 10
        }
    };
}

export function getCityRecommendations(cityName: string, type: 'flood' | 'heat'): string[] {
    const defaultCity = "Bengaluru";
    const mappedBase = ["Bengaluru", "Mumbai", "Delhi", "Chennai", "Hyderabad"].find(c => (cityName || "").includes(c)) || defaultCity;
    const recs: Record<string, { flood: string[], heat: string[] }> = {
        "Bengaluru": {
            flood: [
                "Avoid Bellandur Lake Road (frequent overflow zone).",
                "Use Outer Ring Road (East) evacuation corridor.",
                "Shelter: BBMP Disaster Relief Center, Indiranagar.",
                "Emergency: Karnataka State Disaster Helpline 1070."
            ],
            heat: [
                "Activate cooling centers in high-density wards (Shivajinagar, Chickpet).",
                "Increase water supply pressure during peak hours (12PM - 4PM).",
                "Issue public advisory to suspend outdoor labor."
            ]
        },
        "Mumbai": {
            flood: [
                "Avoid Hindmata, Dadar and Milan Subway (severe waterlogging).",
                "Keep local train lifelines operational via elevated tracks.",
                "Shelter: BMC Evacuation Centers, Andheri Sports Complex.",
                "Emergency: BMC Helpline 1916."
            ],
            heat: [
                "Deploy mobile hydration units at major railway terminuses.",
                "Monitor grid loads in dense suburbs to prevent AC-induced blackouts.",
                "Issue advisory for coastal humidity combined with high temperatures."
            ]
        },
        "Delhi": {
            flood: [
                "Evacuate low-lying Yamuna floodplains immediately.",
                "Monitor barrage discharge rates closely.",
                "Shelter: DDMA Relief Camps, East Delhi.",
                "Emergency: Delhi Disaster Control Room 1077."
            ],
            heat: [
                "Establish shaded corridors in high-footfall markets (Connaught Place).",
                "Suspend construction activities; mandate electrolyte distribution.",
                "Prepare for severe dry-bulb spikes >45°C."
            ]
        },
        "Chennai": {
            flood: [
                "Deploy high-capacity pumps at Velachery and Pallikaranai.",
                "Clear Buckingham Canal choke points immediately.",
                "Shelter: GCC Multi-purpose Evacuation Shelters.",
                "Emergency: State Emergency Operation Center 1070."
            ],
            heat: [
                "Issue high-humidity heat exhaustion warnings for coastal wards.",
                "Extend operating hours of public shaded parks.",
                "Monitor grid stability during high AC demand."
            ]
        },
        "Hyderabad": {
            flood: [
                "Alert downstream populations near Musi river basin.",
                "Clear stormwater drains in low-lying IT corridors.",
                "Shelter: GHMC Emergency Camps.",
                "Emergency: GHMC Helpline 040-21111111."
            ],
            heat: [
                "Activate 'Cool Roof' protocols for vulnerable communities.",
                "Establish temporary ORS distribution centers in transit hubs.",
                "Restrict outdoor commercial activities between 11AM - 4PM."
            ]
        }
    };
    return recs[mappedBase][type];
}

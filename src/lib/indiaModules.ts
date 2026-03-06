export interface IndiaRiskResult {
    score: number;
    category: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Extreme';
    explanation: string;
    details: Record<string, number | string>;
}

// REMOVED: Duplicate monsoonFloodModule. Using src/modules/india/monsoonFloodModule.ts instead.

export function heatwaveModule(
    temperature_c: number,
    humidity_percent: number,
    green_cover_percent: number,
    cityName?: string
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

    const riskFactor = score > 80 ? "Extreme thermal saturation" : score > 60 ? "Significant Urban Heat Island effect" : "Accumulating thermal stress";

    return {
        score,
        category,
        explanation: `${cityName || 'Region'}'s thermal profile shows ${riskFactor.toLowerCase()}. With base temperature at ${temperature_c}°C and ${humidity_percent}% humidity, combined with ${green_cover_percent}% green cover, significant health risks may peak within 2-4 hours.`,
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
    const mappedBase = ["Bengaluru", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Patna", "Guwahati", "Kolkata", "Ahmedabad", "Surat", "Wayanad", "Kozhikode"].find(c => (cityName || "").includes(c)) || defaultCity;
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
        },
        "Patna": {
            flood: [
                "Evacuate low-lying areas near Ganga and Punpun river banks.",
                "Monitor embankment stability in rural outskirts.",
                "Shelter: Gandhi Maidan Relief Camps.",
                "Emergency: Bihar State Disaster Helpline 1070."
            ],
            heat: [
                "Issue red alerts for heatwaves exceeding 44°C.",
                "Mandate breaks for outdoor workers during 1-4 PM.",
                "Establish ORS centers in busy transit points."
            ]
        },
        "Guwahati": {
            flood: [
                "Monitor Brahmaputra water levels at DC Court ghat.",
                "Activate pumps in Anil Nagar and Nabin Nagar zones.",
                "Shelter: Guwahati Refinery High School Evacuation Center.",
                "Emergency: ASDMA Helpline 1070."
            ],
            heat: [
                "Issue humidity-weighted heat exhaustion warnings.",
                "Maintain power grid stability for cooling in dense wards.",
                "Promote hydration among the floating population."
            ]
        },
        "Wayanad": {
            flood: [
                "Monitor for tension cracks in hill slopes during heavy rain.",
                "Evacuate households in mudflow-prone landslide zones.",
                "Shelter: Government Vocational Higher Secondary School, Meppadi.",
                "Emergency: Wayanad Collectorate Helpline 04936-202251."
            ],
            heat: [
                "Monitor forest fire risk in dry belts during heat spikes.",
                "Provide shaded rest areas for plantation labor.",
                "Issue advisory on dehydration for tourists."
            ]
        },
        "Kolkata": {
            flood: [
                "Activate major pumping stations in Ballygunge and Topsia.",
                "Monitor Hooghly tidal surge levels against drainage gates.",
                "Shelter: KMC Community Halls in low-lying wards.",
                "Emergency: KMC Helpline 2286-1212."
            ],
            heat: [
                "Implement Urban Heat Island mitigation in Burrabazar area.",
                "Deploy mobile hydration vans in primary markets.",
                "Issue advisory on high-humidity respiratory stress."
            ]
        },
        "Ahmedabad": {
            flood: [
                "Monitor Sabarmati river discharge and barrage gates.",
                "Clear stormwater blockages in underpasses (Milan, Mithakhali).",
                "Shelter: AMC Evacuation Shelters near Riverfront.",
                "Emergency: AMC Helpline 155300."
            ],
            heat: [
                "Activate Ahmedabad Heat Action Plan (HAP) protocols.",
                "Coordinate with hospitals for increased heat-stroke admissions.",
                "White-paint roofs in low-income housing clusters."
            ]
        },
        "Surat": {
            flood: [
                "Closely monitor Ukai Dam discharge and Tapi river level.",
                "Deploy emergency boats to low-lying Adajan and Rander areas.",
                "Shelter: SMC Community Centers.",
                "Emergency: SMC Control Room 1800-123-8000."
            ],
            heat: [
                "Monitor humidity levels from Arabian Sea during heat spikes.",
                "Issue heat advisory for industrial workers in textile zones.",
                "Establish cooling stations near major transit hubs."
            ]
        },
        "Kozhikode": {
            flood: [
                "Alert coastal communities regarding tidal flooding.",
                "Monitor Chaliyar river basin for rapid water level rise.",
                "Shelter: Government Ganapath School Evacuation Zone.",
                "Emergency: District Disaster Control Room 1077."
            ],
            heat: [
                "Issue warnings for salt-water intrusion during dry heat spikes.",
                "Monitor humidity-driven health risks in coastal wards.",
                "Prepare public health centers for heat-related illnesses."
            ]
        }
    };
    if (!recs[mappedBase]) {
        return recs[defaultCity][type];
    }
    return recs[mappedBase][type];
}

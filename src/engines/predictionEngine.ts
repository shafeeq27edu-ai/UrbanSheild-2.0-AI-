import { FeatureCollection, Point } from 'geojson';
import { CITIES } from './cityProfiles';

export interface RiskOutput {
    score: number;
    category: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Mild' | 'Severe' | 'Extreme' | 'Emergency';
    uncertainty: number;
    explanation: string;
    delta?: number;
    anomaly?: number;
    collapseProb?: number;
    riskVelocity?: number;
    humanitarianImpact?: number;
}

export interface PredictionResults {
    flood_risk_index: number;
    heat_risk_index: number;
    compound_risk_index: number;
    risk_category: 'Low' | 'Moderate' | 'High' | 'Critical';
    model_confidence: number;
}

/**
 * PHASE 4: Hybrid Disaster Scoring Model (Advanced Fallback Version)
 * Provides explainable indices based on environmental and urban parameters.
 * Ported from Python UrbanRiskEngine for defensive fallback reliability.
 */
export function calculateRiskMetrics(inputs: {
    rainfall: number;
    temperature: number;
    humidity: number;
    populationDensity: number;
    drainageCapacity: number;
    imperviousSurface?: number;
    elevationIndex?: number;
    infrastructureStrength?: number;
}): PredictionResults {
    const rainfall = inputs.rainfall;
    const temp = inputs.temperature;
    const humidity = inputs.humidity;
    const drainage = inputs.drainageCapacity;
    const popDensity = inputs.populationDensity;
    const impervious = inputs.imperviousSurface ?? 50; // Default baseline

    // 1. Defensible Flood Score (Standardized Formula)
    // rainScore: normalized mm to 0-100 (cap at 300mm)
    const rainScore = Math.min(100, (rainfall / 300) * 100);
    // drainageStress: 0-100 (inverting drainage capacity)
    const drainageStress = 100 - (drainage <= 1 ? drainage * 100 : drainage);
    // densityScore: normalized to 0-100 (cap at 25k)
    const densityScore = Math.min(100, (popDensity / 25000) * 100);
    const imperviousScore = impervious;

    // Formula: 0.4 rainfall + 0.2 drainage + 0.2 density + 0.2 impervious
    let flood_risk_index = (rainScore * 0.4) + (drainageStress * 0.2) + (densityScore * 0.2) + (imperviousScore * 0.2);
    flood_risk_index = Math.min(100, Math.max(0, flood_risk_index));

    // 2. Heat Risk Index (Wet Bulb approximated)
    const tempFactor = ((temp - 15) / 35) * 45;
    const tempPenalty = Math.min(Math.max(0, (temp - 38) * 2.0), 30);
    const humidityPenalty = Math.max(0, (humidity - 70) * 0.5);

    let heat_risk_index = Math.min(100, tempFactor + tempPenalty + humidityPenalty);

    // 3. Compound Interaction & Upgrade 15: Stress Synergy
    const interactionTerm = (rainfall * temp) / 2500;
    let compound_risk_index = (flood_risk_index * 0.55) + (heat_risk_index * 0.35) + (interactionTerm * 1.5);

    if (flood_risk_index > 65 && heat_risk_index > 65) {
        compound_risk_index += 12; // Synergy penalty
    }
    compound_risk_index = Math.round(Math.min(100, compound_risk_index));

    // Risk Categorization
    let risk_category: PredictionResults['risk_category'] = 'Low';
    if (compound_risk_index > 85) risk_category = 'Critical';
    else if (compound_risk_index > 65) risk_category = 'High';
    else if (compound_risk_index > 35) risk_category = 'Moderate';

    // Uncertainty Estimation
    const baseConfidence = 96.0;

    // Penalize if optional precise metrics like elevation are missing (using defaults)
    const missingDataPenalty = (!inputs.elevationIndex || !inputs.infrastructureStrength) ? 8.5 : 0;

    // Weather variability penalty (extreme weather is inherently harder to predict with high confidence)
    const weatherUncertaintyPenalty = (rainfall > 200 || temp > 40) ? 12.0 : (rainfall > 100 || temp > 35) ? 4.5 : 0.0;

    const modelVariance = Math.abs(flood_risk_index - heat_risk_index) * 0.03;

    const model_confidence = Math.max(10.0, baseConfidence - missingDataPenalty - weatherUncertaintyPenalty - modelVariance);

    return {
        flood_risk_index: Math.round(flood_risk_index),
        heat_risk_index: Math.round(heat_risk_index),
        compound_risk_index,
        risk_category,
        model_confidence: Math.round(model_confidence * 10) / 10
    };
}

export interface FloodInputs {
    rainfall_mm: number;
    drainage_index: number;
    elevation_index: number;
    soil_absorption: number;
    historical_flood_factor: number;
    pop_density?: number;
}

export interface HeatInputs {
    temperature_c: number;
    humidity_percent: number;
    urban_heat_index: number;
    population_density_index: number;
    green_cover?: number;
}

export interface ZoneData {
    id: string;
    name: string;
    rainfall_mm: number;
    temperature_c: number;
    humidity_percent: number;
    drainage_index: number;
    elevation_index: number;
    soil_absorption: number;
    population_density_index: number;
    urban_heat_index: number;
}

// Upgrade 8: Seasonal Baselines for Anomaly Detection
const SEASONAL_RAIN_MEAN = 85;
const SEASONAL_RAIN_STD = 87;

/**
 * Calculates flood risk based on hydrological and infrastructure factors.
 */
export const calculateFloodRisk = (inputs: FloodInputs): RiskOutput => {
    const anomaly = (inputs.rainfall_mm - SEASONAL_RAIN_MEAN) / SEASONAL_RAIN_STD;
    const anomalyPenalty = Math.max(0, anomaly * 0.12);

    const soilSaturation = Math.min(1.0, (inputs.rainfall_mm / 200) * 0.8);
    const z = (0.03 * inputs.rainfall_mm) + (0.05 * soilSaturation * 100) - (0.04 * inputs.drainage_index * 100) - 2.0;
    const collapseProb = 1 / (1 + Math.exp(-z));

    const rainFactor = (inputs.rainfall_mm / 250);
    const elevationWeight = 1 - inputs.elevation_index;
    const absorptionOffset = inputs.soil_absorption * 0.15;

    let score = (
        (rainFactor * 0.40) +
        ((1 - inputs.drainage_index) * 0.20) +
        (elevationWeight * 0.15) +
        (inputs.historical_flood_factor * 0.05) +
        anomalyPenalty
    );

    if (collapseProb > 0.6) {
        score += 0.15;
    }

    score = Math.min(1.0, Math.max(0, score - absorptionOffset));

    let category: RiskOutput['category'] = 'Low';
    if (score > 0.85) category = 'Critical';
    else if (score > 0.65) category = 'High';
    else if (score > 0.35) category = 'Moderate';

    const uncertainty = 0.05 + (inputs.rainfall_mm > 150 ? 0.1 : 0.02) - (inputs.historical_flood_factor * 0.03);

    const explanation = score > 0.7
        ? `CRITICAL SATURATION: ${inputs.rainfall_mm.toFixed(0)}mm rainfall exceeds drainage capacity. Anomaly: +${anomaly.toFixed(1)}σ.`
        : `Hydrological stress within manageable limits. Elevation leverage: ${(inputs.elevation_index * 100).toFixed(0)}%.`;

    return { score, category, uncertainty: Math.max(0, uncertainty), explanation, anomaly, collapseProb };
};

/**
 * Calculates heat risk based on thermal and urban density factors.
 */
export const calculateHeatRisk = (inputs: HeatInputs): RiskOutput => {
    const tempFactor = (inputs.temperature_c / 50);
    const humidityLoad = (inputs.humidity_percent / 100) * 0.15;

    let score = (
        (tempFactor * 0.50) +
        (inputs.urban_heat_index * 0.30) +
        (inputs.population_density_index * 0.20)
    );

    score += humidityLoad;
    score = Math.min(1.0, Math.max(0, score));

    let category: RiskOutput['category'] = 'Mild';
    if (score > 0.85) category = 'Emergency';
    else if (score > 0.65) category = 'Extreme';
    else if (score > 0.45) category = 'Severe';

    const uncertainty = 0.02 + (inputs.temperature_c > 35 ? 0.05 : 0.01);

    const explanation = score > 0.8
        ? `THERMAL EMERGENCY: ${inputs.temperature_c.toFixed(1)}°C dangerous in high-density zones.`
        : `Ambient thermal load ${inputs.temperature_c.toFixed(1)}°C nominal.`;

    return { score, category, uncertainty, explanation };
};

/**
 * Generates an intelligence report based on combined risks.
 */
export const generateIntelligenceReport = (flood: RiskOutput, heat: RiskOutput, compound: number, velocity: number): string => {
    const insights: string[] = [];

    if (flood.anomaly && flood.anomaly > 2.0) {
        insights.push("Rainfall levels are critically above seasonal norms (Extreme Anomaly).");
    } else if (flood.anomaly && flood.anomaly > 1.0) {
        insights.push("Precipitation is trending significantly higher than historical averages.");
    }

    if (flood.collapseProb && flood.collapseProb > 0.7) {
        insights.push("CRITICAL: Drainage infrastructure is likely to fail under current hydraulic load.");
    } else if (flood.collapseProb && flood.collapseProb > 0.4) {
        insights.push("Warning: Infrastructure stress detected; drainage efficiency declining.");
    }

    if (velocity > 0.5) {
        insights.push("Risk levels are accelerating rapidly; immediate intervention recommended.");
    }

    if (heat.score > 0.75) {
        insights.push("Extreme thermal stress detected; potential for urban heat island amplification.");
    }

    if (insights.length === 0) {
        insights.push("Urban systems performing within stable operational parameters.");
    }

    return insights.join(" ");
};

/**
 * Standardizes zone adjustments for climate scenarios.
 */
export function applyScenarioAdjustment(
    baseZone: ZoneData,
    rainfallChangePercent: number,
    temperatureChangePercent: number
): ZoneData {
    return {
        ...baseZone,
        rainfall_mm: baseZone.rainfall_mm * (1 + rainfallChangePercent / 100),
        temperature_c: baseZone.temperature_c + temperatureChangePercent,
        humidity_percent: Math.min(100, baseZone.humidity_percent + (rainfallChangePercent * 0.2))
    };
}

/**
 * Generates synthetic urban zones with risk data for mapping.
 */
export const generateSyntheticZones = (cityName?: string): FeatureCollection<Point> => {
    const city = (cityName && CITIES[cityName]) ? CITIES[cityName] : CITIES['Bengaluru'];
    const neighborhoods = city?.neighborhoods || ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6'];

    const features = neighborhoods.map((name, index) => {
        const angle = (index / neighborhoods.length) * Math.PI * 2;
        const radius = 0.02 + (index % 3) * 0.03; // Dynamic offset

        const latOffset = Math.sin(angle) * radius;
        const lonOffset = Math.cos(angle) * radius;

        return {
            type: 'Feature' as const,
            properties: { id: `Z${index + 1}`, risk: 0.1 + (index % 5) * 0.15, name },
            geometry: { type: 'Point' as const, coordinates: [city.lon + lonOffset, city.lat + latOffset] }
        };
    });

    return {
        type: 'FeatureCollection',
        features
    };
};

export const INITIAL_ZONES: ZoneData[] = [
    { id: 'Z1', name: 'Koramangala', rainfall_mm: 80, temperature_c: 32, humidity_percent: 65, drainage_index: 0.1, elevation_index: 0.1, soil_absorption: 0.1, population_density_index: 0.9, urban_heat_index: 0.8 },
    { id: 'Z2', name: 'Whitefield', rainfall_mm: 75, temperature_c: 34, humidity_percent: 60, drainage_index: 0.4, elevation_index: 0.4, soil_absorption: 0.2, population_density_index: 0.6, urban_heat_index: 0.9 },
    { id: 'Z3', name: 'Bellandur', rainfall_mm: 90, temperature_c: 30, humidity_percent: 75, drainage_index: 0.2, elevation_index: 0.05, soil_absorption: 0.3, population_density_index: 0.7, urban_heat_index: 0.5 },
    { id: 'Z4', name: 'Indiranagar', rainfall_mm: 65, temperature_c: 28, humidity_percent: 55, drainage_index: 0.8, elevation_index: 0.8, soil_absorption: 0.7, population_density_index: 0.4, urban_heat_index: 0.3 },
    { id: 'Z5', name: 'Electronic City', rainfall_mm: 70, temperature_c: 31, humidity_percent: 62, drainage_index: 0.6, elevation_index: 0.5, soil_absorption: 0.5, population_density_index: 0.5, urban_heat_index: 0.6 },
    { id: 'Z6', name: 'Yelahanka', rainfall_mm: 60, temperature_c: 26, humidity_percent: 50, drainage_index: 0.9, elevation_index: 0.9, soil_absorption: 0.9, population_density_index: 0.2, urban_heat_index: 0.1 }
];

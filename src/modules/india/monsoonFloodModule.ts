/**
 * Monsoon Flood Prediction Module
 * Uses rainfall intensity, river basin stress index, drainage capacity, and precipitation patterns
 * to estimate flood risk.
 */

export interface FloodRiskInputs {
    rainfallIntensity: number; // mm/hr
    riverBasinStressIndex: number; // 0-100
    drainageCapacity: number; // 0-100
    precipitationPatternAnomaly: number; // -1.0 to 1.0
    cityName?: string;
}

export interface FloodRiskOutput {
    riskScore: number; // 0-100
    category: 'Low' | 'Moderate' | 'High' | 'Critical';
    insights: string[];
}

export const calculateMonsoonFloodRisk = (inputs: FloodRiskInputs): FloodRiskOutput => {
    // Basic normalized formulas
    const rainFactor = Math.min(100, (inputs.rainfallIntensity / 50) * 100);
    const stressFactor = inputs.riverBasinStressIndex;
    const drainagePenalty = (100 - inputs.drainageCapacity);
    const anomalyFactor = Math.max(0, inputs.precipitationPatternAnomaly * 20); // Add up to 20 points for positive anomaly

    let baseScore = (rainFactor * 0.4) + (stressFactor * 0.3) + (drainagePenalty * 0.2) + anomalyFactor;
    const riskScore = Math.round(Math.min(100, Math.max(0, baseScore)));

    let category: FloodRiskOutput['category'] = 'Low';
    if (riskScore > 85) category = 'Critical';
    else if (riskScore > 65) category = 'High';
    else if (riskScore > 40) category = 'Moderate';

    const insights: string[] = [];
    if (inputs.rainfallIntensity > 30) insights.push('Heavy rainfall detected, flash flood potential.');
    if (inputs.riverBasinStressIndex > 80) insights.push('River basin near capacity.');
    if (inputs.drainageCapacity < 40) insights.push('Poor drainage infrastructure exacerbates risk.');

    return { riskScore, category, insights };
};

/**
 * Heatwave Vulnerability Module
 * Calculates heatwave exposure based on temperature, urban heat island effect, population density, and green cover.
 */

export interface HeatwaveInputs {
    temperatureC: number;
    urbanHeatIslandEffect: number; // 0-100
    populationDensity: number; // 0-100
    greenCoverPercent: number; // 0-100
}

export interface HeatwaveOutput {
    vulnerabilityScore: number; // 0-100
    category: 'Low' | 'Moderate' | 'High' | 'Extreme';
    insights: string[];
}

export const calculateHeatwaveVulnerability = (inputs: HeatwaveInputs): HeatwaveOutput => {
    // Normalize temperature around 35C to 50C for extreme ranges
    const tempFactor = Math.min(100, Math.max(0, ((inputs.temperatureC - 35) / 15) * 100));
    const uhiFactor = inputs.urbanHeatIslandEffect;
    const popFactor = inputs.populationDensity;
    const coolingBenefit = inputs.greenCoverPercent * 0.5; // Green cover acts as a reduction delta

    let baseScore = (tempFactor * 0.5) + (uhiFactor * 0.3) + (popFactor * 0.2) - coolingBenefit;
    const vulnerabilityScore = Math.round(Math.min(100, Math.max(0, baseScore)));

    let category: HeatwaveOutput['category'] = 'Low';
    if (vulnerabilityScore > 85) category = 'Extreme';
    else if (vulnerabilityScore > 65) category = 'High';
    else if (vulnerabilityScore > 40) category = 'Moderate';

    const insights: string[] = [];
    if (inputs.temperatureC > 42) insights.push('Life-threatening temperatures recorded.');
    if (inputs.urbanHeatIslandEffect > 75) insights.push('Severe heat retention in urban core due to low albedo/surface sealing.');
    if (inputs.greenCoverPercent < 15) insights.push('Lack of green infrastructure amplifies thermal stress.');

    return { vulnerabilityScore, category, insights };
};

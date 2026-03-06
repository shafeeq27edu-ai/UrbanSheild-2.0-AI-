import { calculateMonsoonFloodRisk, FloodRiskInputs, FloodRiskOutput } from '../modules/india/monsoonFloodModule';
import { calculateHeatwaveVulnerability, HeatwaveInputs, HeatwaveOutput } from '../modules/india/heatwaveModule';

export interface IndiaIntelligenceReport {
    timestamp: string;
    region: string;
    floodRisk: FloodRiskOutput;
    heatwaveVulnerability: HeatwaveOutput;
    overallRiskStatus: 'Stable' | 'Elevated' | 'Severe' | 'Critical';
}

/**
 * Standardizes inputs from regional Indian parameters and outputs a unified risk intelligence payload.
 * Serves as the analytical middleware.
 */
export const generateIndiaIntelligenceReport = (
    region: string,
    floodInputs: FloodRiskInputs,
    heatwaveInputs: HeatwaveInputs
): IndiaIntelligenceReport => {
    const floodRisk = calculateMonsoonFloodRisk(floodInputs);
    const heatwaveVulnerability = calculateHeatwaveVulnerability(heatwaveInputs);

    // Determines overall system risk by prioritizing the most extreme outlier
    const maxScore = Math.max(floodRisk.riskScore, heatwaveVulnerability.vulnerabilityScore);

    let overallRiskStatus: IndiaIntelligenceReport['overallRiskStatus'] = 'Stable';
    if (maxScore > 85) overallRiskStatus = 'Critical';
    else if (maxScore > 65) overallRiskStatus = 'Severe';
    else if (maxScore > 40) overallRiskStatus = 'Elevated';

    return {
        timestamp: new Date().toISOString(),
        region,
        floodRisk,
        heatwaveVulnerability,
        overallRiskStatus
    };
};

import { getTransportOptions, CityTransportData } from '@/modules/india/transportModule';
import { generateLocalizedAlerts, AlertMessage } from '@/modules/india/alertTranslationModule';

export interface EvacuationPlan {
    city: string;
    riskLevel: 'HIGH' | 'CRITICAL' | 'MODERATE' | 'LOW';
    primaryThreat: 'flood' | 'heat' | 'compound';
    populationAtRisk: number;
    transport: CityTransportData;
    alerts: AlertMessage[];
    sheltersAvailable: number;
    isEvacuationRequired: boolean;
}

export function generateEvacuationPlan(
    city: string,
    floodIndex: number,
    heatIndex: number,
    compoundIndex: number,
    basePopulationDensity: number // normalized 0-1
): EvacuationPlan | null {
    if (!city || typeof city !== 'string') {
        return null;
    }

    // Only generate plans for High or Critical scenarios
    if (compoundIndex < 65 && floodIndex < 65 && heatIndex < 75) {
        return null;
    }

    let riskLevel: EvacuationPlan['riskLevel'] = 'HIGH';
    if (compoundIndex >= 85 || floodIndex >= 85 || heatIndex >= 90) {
        riskLevel = 'CRITICAL';
    }

    let primaryThreat: EvacuationPlan['primaryThreat'] = 'compound';
    if (floodIndex > heatIndex && floodIndex > 65) primaryThreat = 'flood';
    if (heatIndex > floodIndex && heatIndex > 75) primaryThreat = 'heat';

    // Estimate population at risk based on density and risk severity
    // Example: A highly dense city (0.8) with High risk (80) might have 800,000 * 0.8 * 0.8 = ~500k at risk
    // We scale it down to make it look realistic for a targeted zone
    const basePop = 2000000; // Baseline 2 million for a generic urban zone
    const riskFactor = Math.max(floodIndex, heatIndex, compoundIndex) / 100;
    const estimatedImpactZone = 0.15; // Assume 15% of city area is directly hit
    const populationAtRisk = Math.round(basePop * basePopulationDensity * riskFactor * estimatedImpactZone);

    const transportData = getTransportOptions(city);
    const alerts = generateLocalizedAlerts(primaryThreat);

    return {
        city,
        riskLevel,
        primaryThreat,
        populationAtRisk,
        transport: transportData,
        alerts,
        sheltersAvailable: Math.max(3, Math.round(populationAtRisk / 5000)), // 1 shelter per 5k people
        isEvacuationRequired: true
    };
}

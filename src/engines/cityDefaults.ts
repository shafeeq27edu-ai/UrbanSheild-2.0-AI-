export const BENGALURU_DEFAULT_METRICS = {
    rainfall: 180,
    temperature: 26,
    humidity: 60,
    populationDensity: 4600,
    drainageCapacity: 0.58,
    greenCover: 0.14
};

export const BENGALURU_RISK_FALLBACK = {
    flood_risk_index: 42,
    heat_risk_index: 38,
    compound_risk_index: 40,
    risk_category: 'Moderate',
    model_confidence: 94.5,
    engine_status: "CORE_RESILIENCE",
    urban_profile: {
        population_density: 0.23, // Normalized
        drainage_efficiency: 0.58
    }
};

import { DisasterScenario } from './bengaluruFlood2022';

export const bengaluruHeatwaveScenario: DisasterScenario = {
    id: "blr_heatwave_scenario",
    title: "Bengaluru Thermal Stress",
    date: "April Projection",
    type: "Heatwave",
    summary: "A severe dry heatwave exacerbated by expanding concrete cover, significantly depleting groundwater and stressing power grids.",
    timeline: [
        {
            hour: 1,
            title: "Morning UHI Accumulation",
            description: "Temperature climbs unusually fast. Concrete structures retain overnight heat.",
            metrics: { temperature: 34, populationAffected: "2M", infrastructureStress: 55, evacuationDemand: "None" },
            mapState: {
                center: [12.9716, 77.5946],
                zoom: 12,
                overlays: [
                    { id: "heat_zone", type: "circle", coordinates: [12.9716, 77.5946], color: "orange", label: "Elevated Heat" }
                ]
            }
        },
        {
            hour: 4,
            title: "Power Grid Spike",
            description: "Surge in AC usage pushes grid to limit. Rolling blackouts commence.",
            metrics: { temperature: 38, populationAffected: "6.5M", infrastructureStress: 85, evacuationDemand: "None" },
            mapState: {
                center: [12.9716, 77.5946],
                zoom: 12,
                overlays: [
                    { id: "heat_zone", type: "circle", coordinates: [12.9716, 77.5946], color: "red", label: "Danger Heat Level" },
                    { id: "power_failure", type: "polygon", coordinates: [[12.96, 77.58], [12.98, 77.58], [12.98, 77.61], [12.96, 77.61]], color: "black", label: "Grid Outage" }
                ]
            }
        },
        {
            hour: 8,
            title: "Emergency Warnings Issued",
            description: "Wet bulb temperatures cross critical thresholds. Water shortages reported.",
            metrics: { temperature: 40.5, populationAffected: "8.1M", infrastructureStress: 97, evacuationDemand: "Vulnerable Demographics Only" },
            mapState: {
                center: [12.9716, 77.5946],
                zoom: 11,
                overlays: [
                    { id: "heat_zone_massive", type: "circle", coordinates: [12.9716, 77.5946], color: "red", label: "Severe Thermal Stress" }
                ]
            }
        }
    ]
};

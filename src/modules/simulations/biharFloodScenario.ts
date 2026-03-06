import { DisasterScenario } from './bengaluruFlood2022';

export const biharFloodScenario: DisasterScenario = {
    id: "bihar_flood_scenario",
    title: "Bihar Annual Flooding Incident",
    date: "August 2024",
    type: "Riverine Flood",
    summary: "Widespread inundation across North Bihar due to heavy rainfall in the Himalayan catchment areas causing the Koshi and Gandak rivers to breach embankments.",
    timeline: [
        {
            hour: 1,
            title: "Upstream Catchment Overflow",
            description: "Massive water discharge from barrages in Nepal borders triggers early warnings.",
            metrics: { rainfall: 120, populationAffected: "900K", infrastructureStress: 50, evacuationDemand: "Watch" },
            mapState: {
                center: [25.5941, 85.1376],
                zoom: 8,
                overlays: [
                    { id: "river_warning", type: "circle", coordinates: [25.5941, 85.1376], color: "yellow", label: "River Warning Level" }
                ]
            }
        },
        {
            hour: 24,
            title: "Embankment Breaches",
            description: "Multiple embankments fail under extreme hydraulic pressure. Flash flooding begins.",
            metrics: { rainfall: 250, populationAffected: "2.8M", infrastructureStress: 80, evacuationDemand: "High" },
            mapState: {
                center: [25.5941, 85.1376],
                zoom: 8,
                overlays: [
                    { id: "flood_breach", type: "circle", coordinates: [25.5941, 85.1376], color: "red", label: "Embankment Breach" }
                ]
            }
        },
        {
            hour: 72,
            title: "Widespread Inundation",
            description: "Vast tracts of agricultural land are submerged, causing huge economic damage and displacing millions.",
            metrics: { rainfall: 350, populationAffected: "5.5M", infrastructureStress: 98, evacuationDemand: "Critical Rescue" },
            mapState: {
                center: [25.5941, 85.1376],
                zoom: 7,
                overlays: [
                    { id: "massive_inundation", type: "circle", coordinates: [25.5941, 85.1376], color: "purple", label: "Widespread Disaster Zone" }
                ]
            }
        }
    ]
};

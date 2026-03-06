import { DisasterScenario } from './bengaluruFlood2022';

export const wayanadLandslide2024: DisasterScenario = {
    id: "wayanad_landslide_2024",
    title: "Wayanad Landslide Crisis",
    date: "July 2024",
    type: "Landslide",
    summary: "On July 30, 2024, landslides in Wayanad killed more than 400 people. Environmental signals existed hours earlier. UrbanShield connects rainfall data, terrain instability, and population risk to predict disasters before they occur.",
    timeline: [
        {
            hour: 1,
            title: "Unprecedented Rainfall",
            description: "Heavy continuous downpour saturated the soil beyond its water-holding capacity.",
            metrics: { rainfall: 350, populationAffected: "High Risk Zones", infrastructureStress: 40, evacuationDemand: "Initiating" },
            mapState: {
                center: [11.6854, 76.1320],
                zoom: 11,
                overlays: [
                    { id: "rain_zone", type: "circle", coordinates: [11.6854, 76.1320], color: "blue", label: "Extreme Rainfall" }
                ]
            }
        },
        {
            hour: 6,
            title: "First Debris Flow",
            description: "Soil liquefaction causes initial slope failures. Road networks severed.",
            metrics: { rainfall: 420, populationAffected: "15K", infrastructureStress: 85, evacuationDemand: "Critical" },
            mapState: {
                center: [11.6854, 76.1320],
                zoom: 12,
                overlays: [
                    { id: "landslide_zone", type: "polygon", coordinates: [[11.67, 76.12], [11.70, 76.12], [11.70, 76.15], [11.67, 76.15]], color: "orange", label: "Debris Flow" }
                ]
            }
        },
        {
            hour: 12,
            title: "Major Infrastructure Collapse",
            description: "Multiple massive landslides wash away entire settlements and bridges.",
            metrics: { rainfall: 500, populationAffected: "45K", infrastructureStress: 100, evacuationDemand: "Rescue Operations Only" },
            mapState: {
                center: [11.6854, 76.1320],
                zoom: 12,
                overlays: [
                    { id: "disaster_epicenter", type: "circle", coordinates: [11.6854, 76.1320], color: "red", label: "Epicenter" }
                ]
            }
        }
    ]
};

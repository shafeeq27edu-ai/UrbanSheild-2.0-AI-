import { DisasterScenario } from './bengaluruFlood2022';

export const assamFlood2024: DisasterScenario = {
    id: "assam_flood_2024",
    title: "Assam Brahmaputra Floods",
    date: "July 2024",
    type: "Monsoon Flood",
    summary: "Continuous heavy rainfall in the Brahmaputra basin leading to severe riverine flooding and infrastructure submergence in Guwahati and surrounding districts.",
    timeline: [
        {
            hour: 1,
            title: "Brahmaputra Warning Level Crossed",
            description: "River water levels exceed the danger mark. Low-lying areas begin to experience waterlogging.",
            metrics: { rainfall: 150, populationAffected: "500K", infrastructureStress: 50, evacuationDemand: "Partial" },
            mapState: {
                center: [26.1445, 91.7362],
                zoom: 10,
                overlays: [
                    { id: "river_zone", type: "polygon", coordinates: [[26.10, 91.70], [26.20, 91.70], [26.20, 91.80], [26.10, 91.80]], color: "blue", label: "River Overflow" }
                ]
            }
        },
        {
            hour: 12,
            title: "National Highway Inundation",
            description: "Critical transport routes are submerged. Relief camp deployment activated.",
            metrics: { rainfall: 280, populationAffected: "1.2M", infrastructureStress: 75, evacuationDemand: "High" },
            mapState: {
                center: [26.1445, 91.7362],
                zoom: 10,
                overlays: [
                    { id: "flood_zone_1", type: "circle", coordinates: [26.1445, 91.7362], color: "blue", label: "Major Flooding" }
                ]
            }
        },
        {
            hour: 24,
            title: "Mass Displacement",
            description: "Hundreds of villages submerged. Widespread displacement requires massive humanitarian intervention.",
            metrics: { rainfall: 400, populationAffected: "2.5M", infrastructureStress: 95, evacuationDemand: "Critical" },
            mapState: {
                center: [26.1445, 91.7362],
                zoom: 9,
                overlays: [
                    { id: "catastrophic_flood", type: "circle", coordinates: [26.1445, 91.7362], color: "purple", label: "Severe Inundation" }
                ]
            }
        }
    ]
};

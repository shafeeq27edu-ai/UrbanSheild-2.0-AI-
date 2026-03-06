import { DisasterScenario } from './bengaluruFlood2022';

export const gujaratFlood2024: DisasterScenario = {
    id: "guj_flood_2024",
    title: "Gujarat Extreme Rainfall & Flood",
    date: "August 2024",
    type: "Flash Flood / Coastal Accumulation",
    summary: "A deep depression over the Arabian Sea caused extreme, unseasonal rainfall over Saurashtra and central Gujarat, leading to massive urban flooding and dam overflows.",
    timeline: [
        {
            hour: 1,
            title: "Deep Depression Landfall",
            description: "Intense rainfall begins across coastal and central districts, rapidly filling local reservoirs.",
            metrics: { rainfall: 180, populationAffected: "400K", infrastructureStress: 45, evacuationDemand: "Monitoring" },
            mapState: {
                center: [23.0225, 72.5714],
                zoom: 8,
                overlays: [
                    { id: "rain_cell", type: "circle", coordinates: [23.0225, 72.5714], color: "blue", label: "Intense Rain Cell" }
                ]
            }
        },
        {
            hour: 18,
            title: "Urban Drainage Failure",
            description: "Cities like Ahmedabad and Vadodara experience severe waterlogging as drainage networks collapse under 300mm+ accumulation.",
            metrics: { rainfall: 320, populationAffected: "1.5M", infrastructureStress: 85, evacuationDemand: "High" },
            mapState: {
                center: [23.0225, 72.5714],
                zoom: 9,
                overlays: [
                    { id: "urban_flash_flood", type: "circle", coordinates: [23.0225, 72.5714], color: "purple", label: "Urban Submergence" },
                    { id: "dam_warning", type: "circle", coordinates: [22.3, 73.2], color: "orange", label: "Dam Level Critical" }
                ]
            }
        },
        {
            hour: 36,
            title: "Dam Gate Openings",
            description: "Emergency release of water from major dams inundates downstream villages, necessitating airlift rescues.",
            metrics: { rainfall: 450, populationAffected: "3.2M", infrastructureStress: 95, evacuationDemand: "Critical Rescue" },
            mapState: {
                center: [23.0225, 72.5714],
                zoom: 7,
                overlays: [
                    { id: "mass_flood_zone", type: "polygon", coordinates: [[21.0, 70.0], [24.0, 70.0], [24.0, 74.0], [21.0, 74.0]], color: "red", label: "State-wide Emergency" }
                ]
            }
        }
    ]
};

import { DisasterScenario } from './bengaluruFlood2022';

export const bengaluruFlood2020: DisasterScenario = {
    id: "blr_flood_2020",
    title: "Bengaluru Citywide Waterlogging",
    date: "August 2020",
    type: "Flood",
    summary: "Heavy monsoon showers exposed severe drainage network failures across Whitefield, ORR, and Electronic City.",
    timeline: [
        {
            hour: 1,
            title: "Monsoon Surge",
            description: "Continuous downpour begins disrupting late evening transit.",
            metrics: { rainfall: 30, populationAffected: "100k", infrastructureStress: 50, evacuationDemand: "None" },
            mapState: {
                center: [12.9699, 77.5980], // Central Blr
                zoom: 11,
                overlays: [
                    { id: "rain_mass_1", type: "circle", coordinates: [12.9699, 77.5980], color: "blue", label: "Heavy Rain Area" }
                ]
            }
        },
        {
            hour: 3,
            title: "Primary Drain Blockage",
            description: "Storm water drains (Rajakaluves) choked with debris cause reverse flow.",
            metrics: { rainfall: 75, populationAffected: "800k", infrastructureStress: 82, evacuationDemand: "15k people" },
            mapState: {
                center: [12.9699, 77.5980],
                zoom: 11,
                overlays: [
                    { id: "rain_mass_1", type: "circle", coordinates: [12.9699, 77.5980], color: "blue", label: "Heavy Rain Area" },
                    { id: "whitefield_block", type: "polygon", coordinates: [[12.971, 77.749], [12.980, 77.755], [12.975, 77.765], [12.965, 77.755]], color: "orange", label: "Drainage Failure" }
                ]
            }
        },
        {
            hour: 5,
            title: "Gridlock & Waterlogging",
            description: "Arterial roads in Electronic City and Whitefield are impassable.",
            metrics: { rainfall: 110, populationAffected: "2.1M", infrastructureStress: 95, evacuationDemand: "45k people" },
            mapState: {
                center: [12.9699, 77.5980],
                zoom: 11,
                overlays: [
                    { id: "whitefield_block", type: "polygon", coordinates: [[12.971, 77.749], [12.980, 77.755], [12.975, 77.765], [12.965, 77.755]], color: "red", label: "Waterlogging" },
                    { id: "ecity_block", type: "circle", coordinates: [12.8399, 77.6770], color: "red", label: "Waterlogging" }
                ]
            }
        }
    ]
};

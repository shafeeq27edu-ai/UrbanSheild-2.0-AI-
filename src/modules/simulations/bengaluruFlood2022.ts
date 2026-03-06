export interface TimelineEvent {
    hour: number;
    title: string;
    description: string;
    metrics: {
        rainfall?: number; // mm
        populationAffected: string;
        infrastructureStress: number; // percentage
        evacuationDemand: string;
        temperature?: number; // C
    };
    mapState: {
        center: [number, number];
        zoom: number;
        overlays: {
            id: string;
            type: 'polygon' | 'circle';
            coordinates: any;
            color: string;
            label: string;
        }[];
    };
}

export interface DisasterScenario {
    id: string;
    title: string;
    date: string;
    type: "Flood" | "Heatwave" | "Landslide" | "Monsoon Flood" | "Riverine Flood" | "Flash Flood / Coastal Accumulation";
    summary: string;
    timeline: TimelineEvent[];
}

export const bengaluruFlood2022: DisasterScenario = {
    id: "blr_flood_2022",
    title: "Bengaluru IT Corridor Flood",
    date: "September 2022",
    type: "Flood",
    summary: "Unprecedented extreme rainfall caused severe lake overflow (Bellandur, Varthur) and sweeping drainage failure across the Outer Ring Road and Tech Parks.",
    timeline: [
        {
            hour: 1,
            title: "Rainfall Spike",
            description: "Heavy unseasonal downpour begins over East Bengaluru.",
            metrics: { rainfall: 45, populationAffected: "50k", infrastructureStress: 40, evacuationDemand: "None" },
            mapState: {
                center: [12.935, 77.666], // Near Bellandur
                zoom: 12,
                overlays: [
                    { id: "rain_zone_1", type: "circle", coordinates: [12.935, 77.666], color: "blue", label: "Warning Zone" }
                ]
            }
        },
        {
            hour: 3,
            title: "Lake Overflow Begins",
            description: "Bellandur and Varthur lakes breach their banks. Connecting drains fail to channel excess water.",
            metrics: { rainfall: 98, populationAffected: "450k", infrastructureStress: 78, evacuationDemand: "12k people" },
            mapState: {
                center: [12.935, 77.666],
                zoom: 13,
                overlays: [
                    { id: "lake_1", type: "polygon", coordinates: [[12.929, 77.658], [12.940, 77.662], [12.935, 77.680], [12.925, 77.675]], color: "blue", label: "Bellandur Overflow" }
                ]
            }
        },
        {
            hour: 5,
            title: "Urban Flooding Begins",
            description: "Outer Ring Road (ORR) completely submerged. Traffic paralyzed. Tech parks taking on water.",
            metrics: { rainfall: 131, populationAffected: "1.2M", infrastructureStress: 92, evacuationDemand: "65k people" },
            mapState: {
                center: [12.935, 77.666],
                zoom: 13,
                overlays: [
                    { id: "lake_1", type: "polygon", coordinates: [[12.929, 77.658], [12.940, 77.662], [12.935, 77.680], [12.925, 77.675]], color: "blue", label: "Bellandur Overflow" },
                    { id: "orr_flood", type: "polygon", coordinates: [[12.945, 77.680], [12.955, 77.695], [12.945, 77.705], [12.935, 77.690]], color: "red", label: "ORR Submerged" }
                ]
            }
        },
        {
            hour: 7,
            title: "Emergency Evacuation Triggered",
            description: "Tractors deployed for rescue. Airport access severely blocked. Peak systemic crisis.",
            metrics: { rainfall: 145, populationAffected: "4.2M", infrastructureStress: 98, evacuationDemand: "180k people" },
            mapState: {
                center: [12.935, 77.666],
                zoom: 12,
                overlays: [
                    { id: "lake_1", type: "polygon", coordinates: [[12.929, 77.658], [12.940, 77.662], [12.935, 77.680], [12.925, 77.675]], color: "blue", label: "Bellandur Overflow" },
                    { id: "orr_flood", type: "polygon", coordinates: [[12.945, 77.680], [12.955, 77.695], [12.945, 77.705], [12.935, 77.690]], color: "red", label: "ORR Submerged" },
                    { id: "shelter_1", type: "circle", coordinates: [12.960, 77.650], color: "green", label: "Emergency Shelter" }
                ]
            }
        }
    ]
};

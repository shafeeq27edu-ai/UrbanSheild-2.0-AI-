export interface TransportOption {
    type: 'Train' | 'Bus';
    route: string;
    departure: string;
    capacity: number;
    status: 'On Time' | 'Delayed' | 'Cancelled';
}

export interface CityTransportData {
    trains: TransportOption[];
    buses: TransportOption[];
    totalCapacity: number;
}

// Mock database for Indian tier 1/2 cities
const TRANSPORT_DATABASE: Record<string, CityTransportData> = {
    "Bengaluru": {
        trains: [
            { type: 'Train', route: 'Bengaluru → Mysuru (Shatabdi Exp)', departure: '14:30', capacity: 1200, status: 'On Time' },
            { type: 'Train', route: 'Bengaluru → Hubballi (Jan Shatabdi)', departure: '16:15', capacity: 850, status: 'On Time' }
        ],
        buses: [
            { type: 'Bus', route: 'Majestic → Tumakuru (KSRTC)', departure: '14:00', capacity: 45, status: 'On Time' },
            { type: 'Bus', route: 'Majestic → Hassan (Airavat)', departure: '15:30', capacity: 40, status: 'Delayed' },
            { type: 'Bus', route: 'Yeshwantpur → Chitradurga', departure: '16:00', capacity: 50, status: 'On Time' }
        ],
        totalCapacity: 2185
    },
    "Mumbai": {
        trains: [
            { type: 'Train', route: 'CSMT → Pune (Deccan Queen)', departure: '17:10', capacity: 1500, status: 'On Time' },
            { type: 'Train', route: 'LTT → Nashik (Panchavati Exp)', departure: '18:15', capacity: 1100, status: 'On Time' }
        ],
        buses: [
            { type: 'Bus', route: 'Dadar → Pune (Shivneri)', departure: '16:00', capacity: 40, status: 'On Time' },
            { type: 'Bus', route: 'Borivali → Surat', departure: '17:30', capacity: 45, status: 'Delayed' }
        ],
        totalCapacity: 2685
    },
    "Delhi": {
        trains: [
            { type: 'Train', route: 'NDLS → Chandigarh (Shatabdi)', departure: '17:15', capacity: 1200, status: 'On Time' },
            { type: 'Train', route: 'A.Vihar → Dehradun (AC Exp)', departure: '19:30', capacity: 900, status: 'On Time' }
        ],
        buses: [
            { type: 'Bus', route: 'ISBT Kashmiri Gate → Agra', departure: '16:45', capacity: 50, status: 'On Time' },
            { type: 'Bus', route: 'ISBT Anand Vihar → Jaipur', departure: '18:00', capacity: 45, status: 'On Time' }
        ],
        totalCapacity: 2195
    },
    "Chennai": {
        trains: [
            { type: 'Train', route: 'Chennai Central → Coimbatore (Shatabdi)', departure: '15:20', capacity: 1100, status: 'On Time' },
            { type: 'Train', route: 'Egmore → Madurai (Tejas Exp)', departure: '17:00', capacity: 950, status: 'On Time' }
        ],
        buses: [
            { type: 'Bus', route: 'CMBT → Puducherry (SETC)', departure: '16:30', capacity: 50, status: 'On Time' },
            { type: 'Bus', route: 'CMBT → Vellore', departure: '18:00', capacity: 45, status: 'On Time' }
        ],
        totalCapacity: 2145
    },
    // Generic fallback for any other city
    "Default": {
        trains: [
            { type: 'Train', route: 'Local Junction → Safe Zone A (Special Relief Train)', departure: 'Next Hour', capacity: 1500, status: 'On Time' },
            { type: 'Train', route: 'Local Junction → Safe Zone B (Express)', departure: 'T+2 Hours', capacity: 1200, status: 'On Time' }
        ],
        buses: [
            { type: 'Bus', route: 'City Bus Stand → Relief Camp Alpha', departure: 'In 30 Mins', capacity: 50, status: 'On Time' },
            { type: 'Bus', route: 'City Bus Stand → Relief Camp Beta', departure: 'In 45 Mins', capacity: 50, status: 'On Time' },
            { type: 'Bus', route: 'City Bus Stand → Evacuation Hub', departure: 'In 60 Mins', capacity: 50, status: 'On Time' },
            { type: 'Bus', route: 'District HQ → Safe Zone C', departure: 'T+2 Hours', capacity: 45, status: 'On Time' }
        ],
        totalCapacity: 2895
    }
};

export function getTransportOptions(city: string): CityTransportData {
    // Basic matching, prioritize exact match, then default
    for (const knownCity of Object.keys(TRANSPORT_DATABASE)) {
        if (city.toLowerCase().includes(knownCity.toLowerCase())) {
            return TRANSPORT_DATABASE[knownCity];
        }
    }
    return TRANSPORT_DATABASE["Default"];
}

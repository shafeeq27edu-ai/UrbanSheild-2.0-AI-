/**
 * City Profiles - Urban Infrastructure Fingerprints
 * Ported from Python backend to ensure high-fidelity fallbacks.
 */

export interface CityProfile {
    name: string;
    lat: number;
    lon: number;
    drainage_capacity_index: number; // 0-100
    elevation_index: number; // 0-1
    population_density: number;
    green_cover_percent: number;
    infrastructure_strength: number;
    emergency_response: number;
    impervious_surface: number; // 0-100% (Added for High-Fidelity Risk Calc)
    neighborhoods?: string[];
}

export const CITIES: Record<string, CityProfile> = {
    "Bengaluru": {
        "name": "Bengaluru Metropolis",
        "lat": 12.9716,
        "lon": 77.5946,
        "drainage_capacity_index": 35,
        "elevation_index": 0.5,
        "population_density": 4381,
        "green_cover_percent": 18,
        "infrastructure_strength": 65,
        "emergency_response": 75,
        "impervious_surface": 78,
        "neighborhoods": ["Koramangala", "Bellandur", "Whitefield", "Indiranagar", "Yelahanka", "Electronic City"]
    },
    "Delhi": {
        "name": "Delhi NCR",
        "lat": 28.6139,
        "lon": 77.2090,
        "drainage_capacity_index": 28,
        "elevation_index": 0.3,
        "population_density": 11320,
        "green_cover_percent": 12,
        "infrastructure_strength": 72,
        "emergency_response": 85,
        "impervious_surface": 85,
        "neighborhoods": ["Connaught Place", "Rohini", "Dwarka", "Vasant Kunj", "Karol Bagh", "Lajpat Nagar"]
    },
    "Mumbai": {
        "name": "Mumbai Coastal",
        "lat": 19.0760,
        "lon": 72.8777,
        "drainage_capacity_index": 22,
        "elevation_index": 0.1,
        "population_density": 21000,
        "green_cover_percent": 14,
        "infrastructure_strength": 60,
        "emergency_response": 70,
        "impervious_surface": 90,
        "neighborhoods": ["Andheri", "Bandra", "Colaba", "Dharavi", "Juhu", "Powai"]
    },
    "Chennai": {
        "name": "Chennai Bay",
        "lat": 13.0827,
        "lon": 80.2707,
        "drainage_capacity_index": 25,
        "elevation_index": 0.15,
        "population_density": 26000,
        "green_cover_percent": 15,
        "infrastructure_strength": 68,
        "emergency_response": 78,
        "impervious_surface": 82,
        "neighborhoods": ["T. Nagar", "Adyar", "Velachery", "Anna Nagar", "Mylapore", "Tambaram"]
    },
    "Hyderabad": {
        "name": "Hyderabad Plateau",
        "lat": 17.3850,
        "lon": 78.4867,
        "drainage_capacity_index": 42,
        "elevation_index": 0.6,
        "population_density": 18000,
        "green_cover_percent": 19,
        "infrastructure_strength": 75,
        "emergency_response": 82,
        "impervious_surface": 72,
        "neighborhoods": ["Banjara Hills", "Jubilee Hills", "HITEC City", "Kukatpally", "Madhapur", "Secunderabad"]
    },
    "Patna": {
        "name": "Patna River Basin",
        "lat": 25.5941,
        "lon": 85.1376,
        "drainage_capacity_index": 20,
        "elevation_index": 0.2,
        "population_density": 1803,
        "green_cover_percent": 22,
        "infrastructure_strength": 55,
        "emergency_response": 60,
        "impervious_surface": 65
    },
    "Guwahati": {
        "name": "Guwahati Brahmaputra",
        "lat": 26.1445,
        "lon": 91.7362,
        "drainage_capacity_index": 18,
        "elevation_index": 0.3,
        "population_density": 4300,
        "green_cover_percent": 25,
        "infrastructure_strength": 50,
        "emergency_response": 58,
        "impervious_surface": 60
    },
    "Kolkata": {
        "name": "Kolkata Delta",
        "lat": 22.5726,
        "lon": 88.3639,
        "drainage_capacity_index": 22,
        "elevation_index": 0.05,
        "population_density": 24000,
        "green_cover_percent": 16,
        "infrastructure_strength": 65,
        "emergency_response": 72,
        "impervious_surface": 88
    },
    "Ahmedabad": {
        "name": "Ahmedabad Urban",
        "lat": 23.0225,
        "lon": 72.5714,
        "drainage_capacity_index": 35,
        "elevation_index": 0.2,
        "population_density": 12000,
        "green_cover_percent": 12,
        "infrastructure_strength": 70,
        "emergency_response": 78,
        "impervious_surface": 75
    },
    "Surat": {
        "name": "Surat Coastal",
        "lat": 21.1702,
        "lon": 72.8311,
        "drainage_capacity_index": 30,
        "elevation_index": 0.1,
        "population_density": 13000,
        "green_cover_percent": 10,
        "infrastructure_strength": 68,
        "emergency_response": 75,
        "impervious_surface": 80
    },
    "Wayanad": {
        "name": "Wayanad Highlands",
        "lat": 11.6854,
        "lon": 76.1320,
        "drainage_capacity_index": 50,
        "elevation_index": 0.8,
        "population_density": 400,
        "green_cover_percent": 65,
        "infrastructure_strength": 40,
        "emergency_response": 50,
        "impervious_surface": 35
    },
    "Kozhikode": {
        "name": "Kozhikode Coastal",
        "lat": 11.2588,
        "lon": 75.7804,
        "drainage_capacity_index": 45,
        "elevation_index": 0.1,
        "population_density": 3400,
        "green_cover_percent": 22,
        "infrastructure_strength": 62,
        "emergency_response": 68,
        "impervious_surface": 55,
        "neighborhoods": ["Beypore", "Calicut Beach", "Medical College", "West Hill", "Nallalam"]
    }
};

export const getCityByCoords = (lat: number, lon: number): CityProfile | null => {
    // Simple proximity search
    for (const city of Object.values(CITIES)) {
        const dLat = Math.abs(city.lat - lat);
        const dLon = Math.abs(city.lon - lon);
        const distance = Math.sqrt(dLat * dLat + dLon * dLon);
        if (distance < 0.5) return city;
    }
    return null;
};

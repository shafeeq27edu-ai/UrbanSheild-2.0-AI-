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
        "emergency_response": 75
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
        "emergency_response": 85
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
        "emergency_response": 70
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
        "emergency_response": 78
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
        "emergency_response": 82
    }
};

export const getCityByCoords = (lat: number, lon: number): CityProfile | null => {
    // Simple proximity search
    for (const city of Object.values(CITIES)) {
        const dLat = Math.abs(city.lat - lat);
        const dLon = Math.abs(city.lon - lon);
        if (dLat < 0.1 && dLon < 0.1) return city;
    }
    return null;
};

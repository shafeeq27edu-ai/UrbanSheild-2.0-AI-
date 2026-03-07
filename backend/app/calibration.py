import numpy as np
from .config import settings

def get_adaptive_flood_score(inputs: dict, baselines: dict, stats: dict) -> float:
    """
    Calibrated flood score matching TypeScript engine v2.
    Density capped at 50 to prevent rural disaster under-prediction.
    """
    precip = inputs.get("rainfall_mm", 0)
    drainage = inputs.get("drainage_capacity_index", 50)
    elev = inputs.get("elevation_index", 50)
    impervious = inputs.get("impervious_surface", 50)
    pop_density = inputs.get("population_density", 0)

    seasonal_mean = baselines.get("rainfall_mm", 85)
    seasonal_std = stats.get("rainfall_mm", {}).get("std", 87)
    rainfall_anomaly = (precip - seasonal_mean) / max(seasonal_std, 1)
    anomaly_penalty = max(0, rainfall_anomaly * 8)

    rain_score = min(100, (precip / 300) * 100)
    drainage_stress = 100 - drainage
    # Density capped at 50: rural disasters should not be penalized
    density_score = min(50, (pop_density / 25000) * 100)

    # terrain amplification capped at 15 for severe highland events
    elev_norm = elev / 100 if elev > 1 else elev
    terrain_amp = min(15, (elev_norm - 0.6) * 50) if elev_norm > 0.6 and precip > 150 else 0

    score = (
        (rain_score * 0.40) +
        (drainage_stress * 0.24) +
        (density_score * 0.10) +
        (impervious * 0.15) +
        terrain_amp +
        anomaly_penalty
    )
    return min(100, score)

def get_adaptive_heat_score(inputs: dict) -> float:
    """Heat risk escalates sharply above 46°C (lethal zone)."""
    temp = inputs.get("avg_temperature_c", 30)
    green = inputs.get("green_cover_percent", 20)
    humidity = inputs.get("humidity_percent", 50)

    # Sharp escalation above 46°C — matches TypeScript engine
    if temp > 46:
        temp_penalty = 30 + (temp - 46) * 4
    else:
        temp_penalty = min(max(0, (temp - 38) * 2.5), 30)

    green_penalty = (60 - green) * 0.25
    humidity_penalty = max(0, (humidity - 70) * 0.5)

    base = ((temp - 15) / 35) * 45
    return min(100, base + temp_penalty + green_penalty + humidity_penalty)

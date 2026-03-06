from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="UrbanShield AI Risk Engine")

class FloodInputs(BaseModel):
    rainfall_mm: float
    drainage_index: float  # 0-100
    population_density: float # normalized as needed
    impervious_surface: float # 0-100

class HeatInputs(BaseModel):
    temperature_c: float
    humidity_percent: float
    urban_heat_index: float # 0-1
    population_density_index: float # 0-1

class SimulationScenario(BaseModel):
    rainfall_change_percent: float
    temp_change_percent: float

@app.post("/predict/flood")
async def predict_flood(inputs: FloodInputs):
    # Standardized 4-factor formula (Rainfall 40%, Drainage 20%, Density 20%, Impervious 20%)
    # Normalize inputs 0-100 baseline
    rain_score = min(100.0, (inputs.rainfall_mm / 300.0) * 100.0)
    drainage_stress = 100.0 - inputs.drainage_index
    density_score = min(100.0, (inputs.population_density / 25000.0) * 100.0)
    impervious_score = inputs.impervious_surface
    
    # Core Risk Calculation
    score = (
        (rain_score * 0.4) +
        (drainage_stress * 0.2) +
        (density_score * 0.2) +
        (impervious_score * 0.2)
    )

    # Normalize to 0-1 for API consistency
    score_normalized = min(1.0, max(0.0, score / 100.0))
    
    category = "Low"
    if score > 85: category = "Critical"
    elif score > 65: category = "High"
    elif score > 40: category = "Moderate"
    
    # Confidence estimation
    uncertainty = 0.05 + (0.1 if inputs.rainfall_mm > 150 else 0.02)

    return {
        "score": score_normalized,
        "category": category,
        "confidence": max(0.0, 1.0 - uncertainty),
        "explanation": f"CRITICAL SATURATION: {inputs.rainfall_mm:.0f}mm rainfall" if score > 70 else "Hydrological stress nominal."
    }

@app.post("/predict/heat")
async def predict_heat(inputs: HeatInputs):
    # Advanced deterministic formula
    temp_factor = (inputs.temperature_c / 50)
    humidity_load = (inputs.humidity_percent / 100) * 0.15
    
    score = (
        (temp_factor * 0.50) +
        (inputs.urban_heat_index * 0.30) +
        (inputs.population_density_index * 0.20)
    )

    # Wet Bulb correction
    score += humidity_load
    score = min(1.0, max(0.0, score))
    
    category = "Mild"
    if score > 0.85: category = "Emergency"
    elif score > 0.65: category = "Extreme"
    elif score > 0.45: category = "Severe"
    
    uncertainty = 0.02 + (0.05 if inputs.temperature_c > 35 else 0.01)

    return {
        "score": score,
        "category": category,
        "confidence": 1.0 - uncertainty,
        "explanation": f"THERMAL EMERGENCY: {inputs.temperature_c:.1f}C + {inputs.humidity_percent}% Humidity" if score > 0.8 else "Ambient thermal load nominal."
    }

@app.post("/simulate")
async def simulate_scenario(scenario: SimulationScenario):
    # High-level simulation response
    return {
        "status": "success",
        "impact_multiplier": 1.0 + (scenario.rainfall_change_percent / 100) * 0.5,
        "message": f"Simulating {scenario.temp_change_percent}% temperature shift across urban grid."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

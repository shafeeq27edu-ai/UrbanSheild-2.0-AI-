# Project Overview: UrbanShield AI

UrbanShield AI is an advanced **Smart City Command Center** and **Digital Twin** platform specializing in predictive climate risk management. It is designed to shift urban disaster response from reactive to predictive by integrating real-time environmental data with AI-driven intelligence.

---

## 🏗️ Technical Architecture (The Stack)

*   **Frontend**: Next.js 14 (App Router) with TypeScript.
*   **Styling**: Tailwind CSS with Framer Motion for cinematic, high-fidelity UI transitions.
*   **Mapping Engine**: Leaflet and Mapbox GL JS for real-time spatial data and heatmap rendering.
*   **State Management**: Zustand for synchronized command center state across components.
*   **Backend**: Python FastAPI (v1/v2) for ML model execution and optimization algorithms.
*   **ML Implementation**: Hybrid model approach using Random Forest ensembles in Python and a robust TypeScript fallback engine for high-reliability edge execution.

---

## 🧠 Core Intelligence & Features

### 1. Predictive Risk Engines
*   **Flood Analysis**: Hydrological stress modeling based on precipitation (mm), elevation data, soil absorption ratios, and drainage efficiency.
*   **Heat Analytics**: Thermal risk assessment using temperature gradients, humidity (wet-bulb approximation), and urban heat island (UHI) intensity.
*   **Compound Synergy**: Modeling risk interactions where concurrent hazards (e.g., heatwave + flood) accelerate infrastructure failure.

### 2. L3 Systemic Intelligence (Advanced Layers)
*   **Infrastructure Collapse Modeling**: Uses probabilistic sigmoid functions (`1 / (1 + exp(-z))`) to predict the likelihood of drainage failure under hydraulic load.
*   **Dynamic Anomaly Detection**: Tracks environmental drift by comparing real-time data against seasonal means and standard deviations (z-score analysis).
*   **Risk Velocity Index**: Calculates the acceleration of risk trends to provide hyper-early warnings before a critical threshold is reached.
*   **Socioeconomic Weighting**: Multiplier-based impact assessment incorporating population density and vulnerability metrics for humanitarian-centric decisions.

### 3. Features & Modules
*   **Interactive Command Center**: Glassmorphism UI with real-time risk heatmaps and zone-level drill-down capabilities.
*   **Multilingual Emergency Alerts**: Translation module for Indian regional languages (Hindi, Bengali, Tamil, Marathi) to ensure localized warning dissemination.
*   **Simulation Suite**: Includes modules for historical disaster recreation (e.g., Bengaluru 2020 Floods) and AR/VR integration for immersive impact visualization.
*   **Optimization Engine**: Resource allocation algorithms that recommend the most cost-effective mitigation actions (e.g., drainage maintenance vs. urban greening).

---

## 🔄 Operational Workflow

1.  **Ingestion**: Real-time sensor data or synthetic scenario inputs are processed.
2.  **Analysis**: The `predictionEngine` calculates core risks while the L3 layers apply anomaly filters and infrastructure stress tests.
3.  **Visualization**: Results are projected onto the Digital Twin map with dynamic overlays (e.g., River Basin Overlays).
4.  **Action**: The system generates **Explainable Narrative Intelligence Reports** and provides actionable recommendations for city authorities.

---

## 📂 Key Elements (Codebase Landmarks)
*   `/src/engines/predictionEngine.ts`: Core logic for risk and collapse probability.
*   `/src/components/map/`: Custom mapping layers and Digital Twin implementation.
*   `/src/modules/india/`: Regional adaptation and multilingual logic.
*   `/backend/app/optimization.py`: Python-based resource allocation logic.

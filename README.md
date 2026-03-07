<div align="center">

# 🛡️ Urban Shield AI

**Zone-level flood & heat risk prediction for Bangalore — up to 6 hours before disaster strikes.**

[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

![Urban Shield AI Dashboard](https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1100&h=380&fit=crop&q=80)

</div>

---

## The Problem

Bangalore's ORR corridor alone sustained **₹225 crore in damage on a single day** (September 4, 2022) — the city's worst flood in 34 years. October 2024 brought 157 mm of rain in 6 hours, killing 7. In May 2025, a pre-monsoon event flooded 500+ homes and killed 3 before the monsoon even began.

The same zones flood every year. The city responds after the damage is done.

> IMD provides city-wide forecasts. BBMP responds after streets become rivers. No system exists to give ward officers **zone-level, actionable intelligence before the flood happens.**

Urban Shield AI fills that gap.

→ **[Full disaster research, incident reports & sources](docs/bangalore-flood-history.md)**

---

## What It Does

| Feature | Detail |
|---|---|
| **Zone-Level Risk Scores** | Individual flood + heat scores for 6 Bangalore hotspots (0–100) |
| **6-Hour Lead Time** | Forecast-based prediction — acts before rainfall, not during |
| **Infrastructure Collapse Probability** | Sigmoid model estimating when drainage systems will fail |
| **Compound Risk Index** | Flood × heat interaction; synergy penalty when both exceed 65% |
| **Risk Velocity** | Rate of risk acceleration — distinguishes stable-high from rapidly-escalating |
| **Socioeconomic Weighting** | Vulnerability multiplier based on population density + slum proximity |
| **5 Indian Languages** | English, Hindi, Bengali, Tamil, Marathi |
| **Dual Engine** | Python ML backend + TypeScript fallback — system never goes dark |

---

## Monitored Zones

The 6 zones Urban Shield AI monitors are Bangalore's [documented flood hotspots](docs/bangalore-flood-history.md) — they appear in every incident report going back to 2015.

| Zone | Risk Level | Why |
|---|---|---|
| Bellandur Lake | 🔴 Critical | Receives drainage from 3 upstream lakes; Rajakaluve narrowed from 40ft → 10ft by encroachment |
| Silk Board Junction | 🟠 High | Lowest elevation on ORR; all east Bangalore surface water converges here |
| Koramangala | 🟠 High | Built on former lake areas (Agara, Ibbalur); KC Valley funnels runoff |
| Hebbal | 🟡 Medium | Northern watershed zone; lake overflow risk under intensity events |
| Whitefield IT Park | 🟡 Medium | Developed over former wetlands; high urban heat island index |
| HSR Layout | 🟢 Low | Higher elevation; better-planned drainage |

---

## Architecture

```
OpenWeatherMap API (live + 6hr forecast)
        │
        ▼
  WeatherService
  (rainfall, temp, humidity)
        │
        ▼
  Prediction Engine
  ├── Sigmoid Collapse Model      P(failure) = 1 / (1 + e^-z)
  ├── Anomaly Z-Score             (rainfall - seasonal_mean) / σ
  ├── Compound Risk Index         flood × heat + synergy penalty
  ├── Risk Velocity               Δ compound / Δ time
  └── Socioeconomic Weight        density × slum_ratio multiplier
        │
        ├── Zone Risk Cards (6 zones, CRITICAL → LOW)
        └── Intelligence Report (drivers, velocity, action)
```

**Dual engine:** Python FastAPI + RandomForest (200 estimators) is the primary engine. If unavailable, the TypeScript Core Resilience Engine runs all the same models client-side.

---

## ML Model

| Detail | Value |
|---|---|
| **Model** | RandomForest Classifier (200 estimators) |
| **Features** | Rainfall intensity, drainage index, elevation, lake proximity, humidity, soil saturation, urban heat island coefficient, socioeconomic index |
| **Target** | Flood risk category (Low / Medium / High / Critical) |
| **Training data** | IMD historical rainfall records + BBMP flood incident logs + zone-level sensor readings |
| **Validation** | 5-fold cross-validation |
| **Fallback** | Full TypeScript port of same mathematical models |

Confidence scores vary dynamically (72–96%) based on model divergence and input uncertainty — not hardcoded.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS, custom design system (`theme.css`) |
| Map | Leaflet.js + React-Leaflet |
| Animation | Framer Motion |
| State | Zustand |
| ML Backend | Python, FastAPI, scikit-learn (RandomForest) |
| Languages | i18n — 5 Indian languages |

---

## Quick Start

### Frontend (standalone demo)

```bash
# Enter the project directory
cd UrbanSheild-2.0-AI--main

# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

> The app runs fully without the Python backend via the built-in TypeScript engine.

### With ML Backend

```bash
# In a second terminal
cd backend_v2
pip install -r requirements.txt
python train.py                        # Train the RandomForest model
uvicorn main:app --host 0.0.0.0 --port 8001
```

---

## API

### `POST /api/stress-test`

```json
{ "city": "Bengaluru", "lat": 12.9716, "lng": 77.5946 }
```

```json
{
  "compound_risk_index": 62,
  "risk_category": "High",
  "model_confidence": 88.4,
  "engine_status": "INTELLIGENCE_ONLINE",
  "top_drivers": ["Rainfall_Anomaly", "Drainage_Stress", "Urban_Heat"],
  "zones": [
    {
      "name": "Bellandur Lake",
      "flood": { "score": 0.87, "category": "Critical" },
      "infrastructureCollapseProb": 0.73,
      "optimalAction": "Major Drainage Expansion"
    }
  ]
}
```

| Endpoint | Method | Description |
|---|---|---|
| `/api/stress-test` | POST | Full zone analysis |
| `/api/predict` | POST | Single zone prediction |
| `/api/health` | GET | Engine status |
| `:8001/simulate` | POST | Python ML simulation |
| `:8001/sensitivity` | POST | Parameter sensitivity analysis |

---

## Project Structure

```
UrbanSheild-2.0-AI--main/
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Dashboard
│   │   └── api/stress-test/           # Risk API
│   ├── components/
│   │   ├── map/UrbanMap.tsx           # Leaflet map
│   │   ├── ui/Header.tsx
│   │   └── IndiaDisasterPanel.tsx     # Multi-city view
│   ├── engines/
│   │   ├── predictionEngine.ts        # Sigmoid, Z-score, compound risk
│   │   └── riskEngine.ts              # Zone scoring
│   ├── hooks/useRiskIntelligence.ts   # 6-zone hook
│   └── styles/theme.css               # Design system
├── backend_v2/                        # FastAPI + RandomForest
├── docs/
│   └── bangalore-flood-history.md    # Incident research & sources
└── test_engine.py
```

---

## Research & Sources

The incident data, zone selection, and problem framing in this project are grounded in documented events and peer-reviewed research.

→ **[Full research document: Bangalore Flood History & Sources](https://docs.google.com/document/d/1GzxHEJBxQBzNIrv6kqF8bQmHadZsRmg4KGzriJFu5pk/edit?usp=sharing)**

Includes:
- September 2022 — ₹225 crore, 34-year rainfall record
- October 2024 — 7 deaths, 157mm in 6 hours
- May 2025 — pre-monsoon flooding, 500+ homes
- Bellandur Lake fire timeline (2015–2022)
- Academic sources: IISc, NIDM, ORF, Mongabay
- Investigative journalism: Newslaundry, National Geographic, The Wire

---

## Built At

**AI for Sustainability and SmartCity Hackathon** — 1st year B.Tech team — 24 hours

---

<div align="center">
<sub>Urban Shield AI — built because the same zones flood every year and no system tells you before it happens.</sub>
</div>

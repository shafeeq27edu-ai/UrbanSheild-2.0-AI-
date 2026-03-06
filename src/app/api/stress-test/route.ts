import { NextResponse } from "next/server";
import { logger } from "@/utils/logger";
import { ApiResponse } from "@/types";
import { weatherService } from "@/services/weatherService";
import { calculateRiskMetrics } from "@/engines/predictionEngine";

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
    try {
        const text = await req.text();
        if (!text) {
            return NextResponse.json({
                success: false,
                error: "Empty request body",
                code: "VALIDATION_ERROR"
            }, { status: 400 });
        }

        const body = JSON.parse(text);

        // Request Validation
        if (body.lat !== undefined && typeof body.lat !== 'number') {
            return NextResponse.json({ success: false, error: "Invalid latitude", code: "VALIDATION_ERROR" }, { status: 400 });
        }
        const lonValid = typeof body.lng === 'number' || typeof body.lon === 'number' || (body.lng === undefined && body.lon === undefined);
        if (!lonValid) {
            return NextResponse.json({ success: false, error: "Invalid longitude", code: "VALIDATION_ERROR" }, { status: 400 });
        }

        let cityStr = body.city || "Bengaluru";
        const lat = body.lat;
        const lon = body.lng || body.lon;

        logger.info(`Processing stress-test for ${cityStr} (${lat}, ${lon})`);

        // Fetch real-time weather telemetry
        const weather = await weatherService.fetchWeather(Number(lat), Number(lon));

        // Phase 3: External Intelligence Sync (Local Python Engine)
        let data: any = null;
        let isFallback = false;

        try {
            // Forward to Python hybrid engine with 2s timeout
            const pythonResponse = await fetch("http://127.0.0.1:8001/analyze-city", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    city: cityStr,
                    overrides: {
                        ...(lat !== undefined && { lat: Number(lat) }),
                        ...(lon !== undefined && { lon: Number(lon) }),
                        ...(weather && {
                            temperature: weather.temperature,
                            humidity: weather.humidity,
                            rainfall: weather.rainfall,
                            windspeed: weather.windspeed
                        })
                    }
                }),
                signal: AbortSignal.timeout(2000) // Don't hang the UI
            });

            if (pythonResponse.ok) {
                data = await pythonResponse.json();
                logger.info("Intelligence Engine: Sequential Link Established (Python Sync)");
            } else {
                logger.warn(`Python Engine returned ${pythonResponse.status}. Activating internal failover.`);
                isFallback = true;
            }
        } catch (err: any) {
            logger.warn("Python Engine Unreachable. Activating Core Resilience Fallback.", err.message);
            isFallback = true;
        }

        // Phase 4: Calculate standardized risk metrics (Internal or Hybrid)
        // If Python failed, we simulate the 'data' structure using our city profiles
        const { getCityByCoords, CITIES } = await import("@/engines/cityProfiles");
        const cityProfile = getCityByCoords(Number(lat), Number(lon)) || CITIES[cityStr as keyof typeof CITIES] || CITIES["Bengaluru"];

        if (isFallback) {
            data = {
                urban_profile: {
                    population_density: cityProfile.population_density,
                    drainage_efficiency: cityProfile.drainage_capacity_index,
                    impervious_surface: cityProfile.impervious_surface
                },
                intelligence_report: "CORE RESILIENCE MODE: Using local heuristic modeling while primary logic engine is syncing.",
                optimal_action: cityProfile.drainage_capacity_index < 30 ? "Infrastructure Hardening" : "Dynamic Resource Deployment"
            };
        }

        const riskMetrics = calculateRiskMetrics({
            rainfall: weather?.rainfall || 0,
            temperature: weather?.temperature || 28,
            humidity: weather?.humidity || 60,
            populationDensity: data?.urban_profile?.population_density || 4500,
            drainageCapacity: data?.urban_profile?.drainage_efficiency || 40,
            imperviousSurface: data?.urban_profile?.impervious_surface || 50,
            elevationIndex: cityProfile.elevation_index ?? 0.3
        });

        return NextResponse.json({
            success: true,
            data: {
                ...(data || {}),
                ...(riskMetrics || {}),
                engine_status: isFallback ? "CORE_RESILIENCE" : "PREMIUM_INTELLIGENCE"
            },
            timestamp: new Date().toISOString(),
            source: "urban-shield-core"
        });

    } catch (error: any) {
        logger.error("API error in stress-test route", error.message);
        return NextResponse.json(
            { success: false, error: "Critical System Failure: Intelligence Downlink Severed", code: "FATAL_API_ERROR" },
            { status: 500 }
        );
    }
}

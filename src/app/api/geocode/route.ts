import { NextResponse } from "next/server";

const CITY_BOUNDS: Record<string, { viewbox: string; bounded: number }> = {
    "Bengaluru": { viewbox: "77.3791,12.7343,77.8180,13.1729", bounded: 1 },
    "Delhi": { viewbox: "76.8387,28.4041,77.3481,28.8831", bounded: 1 },
    "Mumbai": { viewbox: "72.7756,18.8927,73.0263,19.2707", bounded: 1 },
    "Chennai": { viewbox: "80.0844,12.8342,80.3300,13.2268", bounded: 1 },
    "Hyderabad": { viewbox: "78.1800,17.2000,78.8500,17.6000", bounded: 1 },
    "Patna": { viewbox: "85.0000,25.5000,85.3000,25.7000", bounded: 1 },
    "Guwahati": { viewbox: "91.5500,26.0500,91.9000,26.2500", bounded: 1 },
    "Kolkata": { viewbox: "88.2000,22.4100,88.5500,22.7000", bounded: 1 },
    "Wayanad": { viewbox: "75.7000,11.4000,76.4000,11.9000", bounded: 1 },
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const city = searchParams.get("city") || "";

    if (!query) {
        return NextResponse.json([], { status: 200 });
    }

    let result: any[] = [];

    try {
        // Stage 1 — City-restricted search
        if (city && CITY_BOUNDS[city]) {
            const { viewbox, bounded } = CITY_BOUNDS[city];
            const cityUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=in&q=${encodeURIComponent(query)}&viewbox=${viewbox}&bounded=${bounded}`;
            const res = await fetch(cityUrl, {
                headers: { "User-Agent": "UrbanShield-AI/2.0 (civic.intelligence.platform)" },
            });
            result = await res.json();
        }

        // Stage 2 — India-wide fallback
        if (!result || result.length === 0) {
            const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=in&q=${encodeURIComponent(query)}&viewbox=68.0,8.0,97.5,37.5&bounded=0`;
            const res = await fetch(fallbackUrl, {
                headers: { "User-Agent": "UrbanShield-AI/2.0 (civic.intelligence.platform)" },
            });
            result = await res.json();
        }

        return NextResponse.json(result, {
            headers: { "X-Search-Source": result.length === 0 ? "no-results" : "nominatim" },
        });
    } catch (error: any) {
        return NextResponse.json([], { status: 200 });
    }
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";

interface SearchResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

interface LocationSearchProps {
    onSelectLocation: (lat: number, lng: number, displayName: string) => void;
    jurisdictionCity?: string;
}

const CITY_BOUNDS: Record<string, string> = {
    "Bengaluru": "12.7343,77.3791,13.1729,77.8180",
    "Delhi": "28.4041,76.8387,28.8831,77.3481",
    "Mumbai": "18.8927,72.7756,19.2707,73.0263",
    "Chennai": "12.8342,80.0844,13.2268,80.3300",
    "Hyderabad": "17.2000,78.1800,17.6000,78.8500",
    "Patna": "25.5000,85.0000,25.7000,85.3000",
    "Guwahati": "26.0500,91.5500,26.2500,91.9000",
    "Kolkata": "22.4100,88.2000,22.7000,88.5500",
    "Wayanad": "11.4000,75.7000,11.9000,76.4000",
};

export default function LocationSearch({ onSelectLocation, jurisdictionCity }: LocationSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isFallback, setIsFallback] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 3) {
                setResults([]);
                setIsFallback(false);
                return;
            }

            setIsLoading(true);
            setIsFallback(false);
            try {
                const base = `https://nominatim.openstreetmap.org/search?format=json&limit=8&countrycodes=in&q=${encodeURIComponent(query)}`;
                const headers = { 'User-Agent': 'UrbanShield-AI-Geospatial-Engine' };

                let searchResults = [];

                // Step 1: City restricted search
                if (jurisdictionCity && CITY_BOUNDS[jurisdictionCity]) {
                    const cityURL = `${base}&viewbox=${CITY_BOUNDS[jurisdictionCity]}&bounded=1`;
                    const response = await fetch(cityURL, { headers });
                    searchResults = await response.json();
                }

                // Step 2: Fallback to India wide search
                if (!searchResults || searchResults.length === 0) {
                    const fallbackURL = `${base}&viewbox=68.0,8.0,97.5,37.5&bounded=0`;
                    const response = await fetch(fallbackURL, { headers });
                    searchResults = await response.json();
                    if (jurisdictionCity && searchResults.length > 0) {
                        setIsFallback(true);
                    }
                }

                setResults(searchResults);
                setIsOpen(true);
            } catch (error) {
                console.error("Failed to fetch location data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimeout = setTimeout(fetchResults, 500);
        return () => clearTimeout(debounceTimeout);
    }, [query, jurisdictionCity]);

    const handleSelect = (result: SearchResult) => {
        setQuery(result.display_name.split(",")[0]); // Set to just the city name for cleaner input
        setIsOpen(false);
        onSelectLocation(parseFloat(result.lat), parseFloat(result.lon), result.display_name);
    };

    return (
        <div ref={containerRef} className="relative w-full z-[1000] mb-4">
            <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-[var(--color-navy)]/30 p-2 shadow-lg group focus-within:border-[var(--color-accent)] transition-colors">
                <Search className="text-[var(--color-navy)] w-5 h-5 ml-2 absolute" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                    placeholder={`Search within ${jurisdictionCity || 'locations'}...`}
                    className="w-full bg-transparent pl-10 pr-4 py-2 text-[var(--color-navy)] font-bold placeholder-[var(--color-navy)]/50 focus:outline-none uppercase tracking-wider text-sm"
                />
                {isLoading ? (
                    <Loader2 className="animate-spin text-[var(--color-accent)] w-5 h-5 mr-3 absolute right-0" />
                ) : query.length > 0 && (
                    <button
                        onClick={() => { setQuery(""); setResults([]); setIsFallback(false); }}
                        className="text-[var(--color-navy)]/40 hover:text-[var(--color-navy)] absolute right-4 transition-colors font-black text-xs"
                    >
                        CLEAR
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border-2 border-[var(--color-navy)] shadow-[4px_4px_0px_var(--color-navy)] max-h-60 overflow-y-auto">
                    {jurisdictionCity && (
                        isFallback ? (
                            <div className="px-4 py-2 bg-amber-50 border-b text-[9px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">
                                <span>⚠️ No matches inside {jurisdictionCity} jurisdiction. Showing results across India.</span>
                            </div>
                        ) : (
                            <div className="px-4 py-2 bg-[var(--color-navy)]/5 border-b text-[9px] font-black uppercase tracking-widest text-[var(--color-navy)]/50">
                                📍 Showing results within {jurisdictionCity} jurisdiction
                            </div>
                        )
                    )}
                    {results.length > 0 ? (
                        results.map((result) => (
                            <button
                                key={result.place_id}
                                onClick={() => handleSelect(result)}
                                className="w-full px-4 py-3 text-left hover:bg-slate-100 flex items-start gap-3 border-b border-slate-200 last:border-0 transition-colors"
                            >
                                <MapPin className="w-4 h-4 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                                <div className="flex flex-col flex-1">
                                    <span className="text-sm font-bold text-[var(--color-navy)] line-clamp-1">
                                        {result.display_name.split(",")[0]}
                                    </span>
                                    <span className="text-xs text-slate-500 line-clamp-1">
                                        {result.display_name}
                                    </span>
                                </div>
                            </button>
                        ))
                    ) : (
                        query.length >= 3 && !isLoading && (
                            <div className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                                No locations found in database
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

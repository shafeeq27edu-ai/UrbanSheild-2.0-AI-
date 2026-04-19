"use client";

import React, { useState } from "react";
import IndiaDisasterPanel from "@/components/panels/IndiaDisasterPanel";
import { CITIES } from "@/engines/cityProfiles";

export default function IndiaIntelligencePage() {
    const [selectedCity, setSelectedCity] = useState("Bengaluru");
    const cityData = CITIES[selectedCity];
    const coords: [number, number] = [cityData.lat, cityData.lon];

    return (
        <main className="min-h-screen bg-[#f8f9fa] pt-24 pb-12 px-4 sm:px-8 md:px-16 flex flex-col items-center">

            <div className="max-w-5xl w-full mb-12 animate-[fadeIn_0.5s_ease-out_forwards]">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-px bg-[var(--color-accent)]" />
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-navy)]/60">
                        REGIONAL MODULE
                    </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--color-navy)] mb-2">
                            INDIA INTELLIGENCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[#f6ad55]">SURFACE</span>
                        </h1>
                        <p className="text-lg text-[var(--color-forest)] font-medium max-w-2xl leading-relaxed">
                            Dedicated regional analysis focusing on South Asian climate extremities. This module leverages localized data inputs to predict and mitigate the impacts of monsoon flooding and severe urban heatwaves.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px]">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-navy)]/60">Focus Region</label>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="bg-white border-2 border-[var(--color-navy)] px-4 py-2 font-black uppercase tracking-wider text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        >
                            {Object.keys(CITIES).map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="w-full animate-[slideUp_0.6s_ease-out_forwards]">
                <IndiaDisasterPanel city={selectedCity || "Bengaluru"} coords={coords || [12.9716, 77.5946]} />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </main>
    );
}

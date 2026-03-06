"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { bengaluruFlood2022 } from '../modules/simulations/bengaluruFlood2022';
import { bengaluruFlood2020 } from '../modules/simulations/bengaluruFlood2020';
import { bengaluruHeatwaveScenario } from '../modules/simulations/bengaluruHeatwaveScenario';

// Dynamically import the map engine with SSR disabled to prevent Leaflet window errors
const DisasterSimulationMap = dynamic(
    () => import('./DisasterSimulationMap'),
    {
        ssr: false,
        loading: () => <div className="text-[var(--color-navy)] flex justify-center items-center w-full h-full min-h-[400px]">Initializing Map Engine...</div>
    }
);

const scenarios = [bengaluruFlood2022, bengaluruFlood2020, bengaluruHeatwaveScenario];

export default function DisasterSimulationPanel() {
    const [activeScenario, setActiveScenario] = useState(scenarios[0]);
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const playTimerRef = useRef<NodeJS.Timeout | null>(null);

    const activeStep = activeScenario.timeline[stepIndex];

    useEffect(() => {
        if (isPlaying) {
            playTimerRef.current = setInterval(() => {
                setStepIndex((prev) => {
                    if (prev < activeScenario.timeline.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        return prev;
                    }
                });
            }, 3000); // 3 seconds per timeline event during replay
        } else if (playTimerRef.current) {
            clearInterval(playTimerRef.current);
        }

        return () => {
            if (playTimerRef.current) clearInterval(playTimerRef.current);
        };
    }, [isPlaying, activeScenario.timeline.length]);

    const handleScenarioChange = (scenario: typeof scenarios[0]) => {
        setActiveScenario(scenario);
        setStepIndex(0);
        setIsPlaying(false);
    };

    return (
        <div className="w-full bg-[var(--color-navy)] rounded-xl overflow-hidden shadow-2xl border border-[var(--color-accent)]/30 text-white font-sans flex flex-col md:flex-row min-h-[600px]">

            {/* Sidebar Controls */}
            <div className="md:w-1/3 bg-[#0a192f] border-r border-white/10 flex flex-col z-20 shadow-2xl">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-black uppercase tracking-widest text-[var(--color-accent)] mb-4">Select Scenario</h2>
                    <div className="space-y-2">
                        {scenarios.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => handleScenarioChange(s)}
                                className={`w-full text-left px-4 py-3 text-sm font-bold tracking-wide rounded transition-colors ${activeScenario.id === s.id ? "bg-[var(--color-accent)] text-[#0a192f]" : "bg-white/5 hover:bg-white/10 text-white"
                                    }`}
                            >
                                {s.title} ({s.date})
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-black text-white/50 uppercase tracking-widest mb-2 border-b border-white/10 pb-2">
                            Active Incident: Hour {activeStep.hour}
                        </h3>
                        <h4 className="text-2xl font-black text-white leading-tight mb-2">
                            {activeStep.title}
                        </h4>
                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                            {activeStep.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            {activeStep.metrics.rainfall && (
                                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded">
                                    <span className="block text-[10px] uppercase font-bold text-blue-400/70 tracking-widest">Rainfall</span>
                                    <span className="block text-xl font-black text-blue-400">{activeStep.metrics.rainfall} mm</span>
                                </div>
                            )}
                            {activeStep.metrics.temperature && (
                                <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded">
                                    <span className="block text-[10px] uppercase font-bold text-orange-400/70 tracking-widest">Temperature</span>
                                    <span className="block text-xl font-black text-orange-400">{activeStep.metrics.temperature} °C</span>
                                </div>
                            )}
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded">
                                <span className="block text-[10px] uppercase font-bold text-red-400/70 tracking-widest">Stress Level</span>
                                <span className="block text-xl font-black text-red-400">{activeStep.metrics.infrastructureStress}%</span>
                            </div>
                            <div className="col-span-2 bg-white/5 border border-white/10 p-3 rounded flex justify-between items-center">
                                <div>
                                    <span className="block text-[10px] uppercase font-bold text-white/50 tracking-widest">Affected Pop.</span>
                                    <span className="block text-lg font-black">{activeStep.metrics.populationAffected}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] uppercase font-bold text-[var(--color-accent)]/70 tracking-widest">Evac Demand</span>
                                    <span className="block text-lg font-black text-[var(--color-accent)]">{activeStep.metrics.evacuationDemand}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Replay Controls & Scrubber */}
                <div className="p-6 border-t border-white/10 bg-black/20">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => {
                                if (stepIndex === activeScenario.timeline.length - 1) setStepIndex(0);
                                setIsPlaying(!isPlaying);
                            }}
                            className="bg-[var(--color-accent)] text-[#0a192f] px-6 py-2 rounded font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-colors w-full justify-center"
                        >
                            {isPlaying ? "⏸ Pause" : "▶ Start Simulation"}
                        </button>
                    </div>

                    {/* Timeline Scrubber */}
                    <div className="relative pt-6 pb-2">
                        {/* Connecting Line */}
                        <div className="absolute top-8 left-0 right-0 h-1 bg-white/20 rounded z-0" />
                        <div
                            className="absolute top-8 left-0 h-1 bg-[var(--color-accent)] rounded z-0 transition-all duration-300"
                            style={{ width: `${(stepIndex / (activeScenario.timeline.length - 1)) * 100}%` }}
                        />

                        <div className="flex justify-between items-center relative z-10 w-full px-1">
                            {activeScenario.timeline.map((event, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setIsPlaying(false); setStepIndex(i); }}
                                    className={`w-4 h-4 rounded-full border-2 transition-all ${stepIndex === i
                                        ? "bg-[var(--color-accent)] border-[#0a192f] scale-125"
                                        : stepIndex > i
                                            ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
                                            : "bg-[#0a192f] border-white/30 hover:border-white/60"
                                        }`}
                                    title={`Hour ${event.hour}: ${event.title}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Area */}
            <div className="md:w-2/3 h-[400px] md:h-auto relative bg-[#111827]">
                {/* Simulation Mode Badge */}
                <div className="absolute top-4 right-4 z-[400] bg-red-600 px-4 py-1 rounded-full border border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-white">Simulation Active</span>
                </div>

                <DisasterSimulationMap activeStep={activeStep} />
            </div>

        </div>
    );
}

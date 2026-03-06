"use client";

import React, { useMemo } from 'react';
import { generateEvacuationPlan } from '@/lib/evacuationEngine';

interface EvacuationPanelProps {
    metrics?: any;
    city?: string;
}

export default function EvacuationPanel({ metrics, city = "Bengaluru" }: EvacuationPanelProps) {
    const plan = useMemo(() => {
        if (!metrics) return null;

        const density = metrics.urban_profile?.population_density || 0.5;

        return generateEvacuationPlan(
            city,
            metrics.flood_risk_index || 0,
            metrics.heat_risk_index || 0,
            metrics.compound_risk_index || 0,
            density
        );
    }, [metrics, city]);

    if (!metrics) {
        return (
            <div className="w-full max-w-5xl mx-auto rounded-xl border border-[var(--color-navy)]/10 p-12 text-center shadow-lg bg-[var(--color-navy)]/5 backdrop-blur-sm">
                <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Evacuation & Relief Optimization Offline</h2>
                <p className="font-serif text-[var(--color-charcoal)] text-sm opacity-60 italic mt-2">Initialize Stress Test to activate impact assessment</p>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="w-full max-w-5xl mx-auto rounded-xl border-t-4 border-green-500 p-8 shadow-md bg-green-50/50">
                <h2 className="text-xl font-black uppercase text-green-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse block"></span>
                    Stable Baseline Detected
                </h2>
                <p className="font-medium text-green-700/80 mt-2">No emergency evacuation required at current threshold levels.</p>
            </div>
        );
    }

    const primaryColor = plan.riskLevel === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500';
    const borderColor = plan.riskLevel === 'CRITICAL' ? 'red-600' : 'orange-500';

    return (
        <div className={`w-full max-w-5xl mx-auto rounded-xl border border-${borderColor}/30 overflow-hidden shadow-2xl bg-white`}>
            {/* Header */}
            <div className={`p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${primaryColor}`}>
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <span className="animate-pulse">⚠</span>
                        EMERGENCY RESPONSE RECOMMENDATIONS
                    </h2>
                    <p className="text-sm uppercase tracking-widest font-bold opacity-90 mt-1">Active Threat: {plan.riskLevel} {plan.primaryThreat.toUpperCase()}</p>
                </div>
                <div className="bg-white/10 px-4 py-2 border border-white/20 text-right backdrop-blur flex-shrink-0">
                    <span className="block text-[10px] uppercase font-black tracking-widest opacity-80 mb-1">Population at Risk</span>
                    <span className="text-2xl font-black block leading-none">{plan.populationAtRisk.toLocaleString()}</span>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 bg-gradient-to-br from-white to-slate-50">
                {/* Routes */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Trains */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase text-[var(--color-navy)] tracking-widest border-b border-slate-200 pb-2">Train Evacuation Routes</h3>
                        <div className="space-y-3">
                            {plan.transport?.trains?.map((train, i) => (
                                <div key={i} className="flex justify-between items-center bg-slate-100 p-4 border-l-4 border-[var(--color-navy)]">
                                    <div>
                                        <p className="font-bold text-[var(--color-navy)] uppercase text-sm border-b border-slate-200/50 pb-1 mb-1">{train.route}</p>
                                        <p className="text-xs text-[var(--color-charcoal)] font-sans">Capacity: <span className="font-bold">{train.capacity} approx.</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Departure</p>
                                        <p className="font-black text-lg text-[var(--color-accent)]">{train.departure}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buses */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase text-[var(--color-navy)] tracking-widest border-b border-slate-200 pb-2">Bus Evacuation Routes</h3>
                        <div className="space-y-3">
                            {plan.transport?.buses?.slice(0, 2).map((bus, i) => (
                                <div key={i} className="flex justify-between items-center bg-slate-100 p-4 border-l-4 border-slate-400">
                                    <div>
                                        <p className="font-bold text-[var(--color-navy)] uppercase text-sm border-b border-slate-200/50 pb-1 mb-1">{bus.route}</p>
                                        <p className="text-xs text-[var(--color-charcoal)] font-sans">Capacity: <span className="font-bold">{bus.capacity}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Departure</p>
                                        <p className="font-black text-md text-slate-700">{bus.departure}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar (Alerts + Shelters) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Shelters */}
                    <div className="bg-[var(--color-navy)] p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest border-b border-white/20 pb-2 mb-4 text-[var(--color-accent)] relative z-10">Relief Logistics</h3>
                        <div className="relative z-10">
                            <span className="text-5xl font-black block leading-none">{plan.sheltersAvailable}</span>
                            <span className="text-xs uppercase font-bold tracking-widest block mt-1 opacity-80">Designated Shelters Available</span>
                            <p className="text-xs font-serif italic mt-4 opacity-70 border-t border-white/10 pt-4">Total evacuation capacity estimated at {plan.transport.totalCapacity}+ per cycle.</p>
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase text-[var(--color-navy)] tracking-widest border-b border-slate-200 pb-2">Localized Warnings</h3>
                        <div className="flex flex-col gap-3">
                            {plan.alerts.map((alert, i) => (
                                <div key={i} className="bg-white border border-slate-200 p-4 shadow-sm hover:border-[var(--color-accent)]/50 transition-colors">
                                    <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-2">{alert.languageName}</h4>
                                    <p className="text-sm font-bold text-[var(--color-navy)] leading-relaxed">{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

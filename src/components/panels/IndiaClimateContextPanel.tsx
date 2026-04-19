"use client";

import React from 'react';
import { ShieldCheck, AlertTriangle, Info, BrainCircuit, Activity, Navigation, Smartphone } from 'lucide-react';

export default function IndiaClimateContextPanel() {
    return (
        <div className="w-full max-w-5xl mx-auto rounded-xl border border-slate-200 overflow-hidden shadow-2xl bg-white mb-16">

            {/* Header Section */}
            <div className="bg-white p-6 md:p-8 flex flex-col items-center text-center relative border-b border-slate-200">
                <h2 className="text-3xl font-semibold text-slate-900 flex items-center justify-center gap-4">
                    <AlertTriangle className="w-8 h-8 text-[#C89B3C] animate-pulse" />
                    <span>India Climate Risk Context</span>
                    <AlertTriangle className="w-8 h-8 text-[#C89B3C] animate-pulse" />
                </h2>
                <p className="text-base text-slate-600 mt-3 max-w-2xl mx-auto font-medium">
                    The Escalating Scale of Extreme Weather & The Need for Predictive Intelligence
                </p>
            </div>

            <div className="p-8 md:p-12">

                {/* Part 1: Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {/* Stat Card 1 */}
                    <div className="bg-slate-50 p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-slate-900 mb-2">331 / 334</div>
                        <p className="text-sm text-slate-500 font-medium">
                            Days India experienced extreme weather events in 2025.
                        </p>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-slate-50 p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-slate-900 mb-2">4,419</div>
                        <p className="text-sm text-slate-500 font-medium">
                            Total deaths attributed to extreme weather in India (2025).
                        </p>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-slate-50 p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-slate-900 mb-2">2,707</div>
                        <p className="text-sm text-slate-500 font-medium">
                            Deaths caused specifically by monsoon floods and cloudbursts.
                        </p>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-slate-50 p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                        <div className="text-sm text-slate-500 mb-1 font-bold">Economic Losses (2024 Monsoon)</div>
                        <div className="text-2xl font-bold text-slate-900 mb-2">₹30,000+ Cr</div>
                        <p className="text-sm text-slate-500 font-medium">
                            Estimated financial damage from infrastructure failure and flooding.
                        </p>
                    </div>

                    {/* Stat Card 5 */}
                    <div className="bg-slate-50 p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                        <div className="text-sm text-slate-500 mb-1 font-bold">Drainage Deficit</div>
                        <div className="text-2xl font-bold text-slate-900 mb-2">70%+</div>
                        <p className="text-sm text-slate-500 font-medium">
                            Of Indian cities lack adequate stormwater drainage infrastructure.
                        </p>
                    </div>

                    {/* Stat Card 6 */}
                    <div className="bg-slate-50 p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                        <div className="text-sm text-slate-500 mb-1 font-bold">Wetland Loss</div>
                        <div className="text-2xl font-bold text-slate-900 mb-2">79-80%</div>
                        <p className="text-sm text-slate-500 font-medium">
                            Loss of vital wetlands in major cities like Bengaluru and Mumbai.
                        </p>
                    </div>
                </div>

                {/* Major Recent Events Focus */}
                <div className="mb-16 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-800 mb-6 text-center border-b border-slate-200 pb-3">
                        Recent Catastrophic Events (2024-2025)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4">
                            <h4 className="text-base font-semibold text-slate-900 mb-2">Wayanad Landslides (2024)</h4>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">Over 400 lives lost, with estimated economic damages exceeding ₹1,200 crore.</p>
                        </div>
                        <div className="text-center p-4 border-y md:border-y-0 md:border-x border-slate-200">
                            <h4 className="text-base font-semibold text-slate-900 mb-2">Gujarat Excessive Rainfall</h4>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">Received 118% of normal monsoon rainfall in 2024, devastating infrastructure.</p>
                        </div>
                        <div className="text-center p-4">
                            <h4 className="text-base font-semibold text-slate-900 mb-2">Andhra & Telangana Floods</h4>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">Extreme rainfall events hitting 200-year return periods, while Bihar floods affected 1.2M people.</p>
                        </div>
                    </div>
                </div>

                {/* Part 2: UrbanShield Solutions (Why Existing Systems Fail) */}
                <div className="bg-slate-50 -mx-8 md:-mx-12 px-8 md:px-12 py-12 border-y border-slate-200">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-semibold text-slate-900">
                            Why Existing Systems Fail
                        </h3>
                        <p className="text-lg text-slate-600 mt-2 font-medium">
                            And How UrbanShield Engine Solves It
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                        {/* Point 1 */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#0F172A] p-2 rounded text-white flex-shrink-0">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <h4 className="text-base font-bold uppercase tracking-widest text-[#0F172A]">
                                    1. Reactive Disaster Alerts
                                </h4>
                            </div>
                            <div className="pl-12 space-y-3">
                                <p className="text-sm text-slate-500 uppercase tracking-wider font-bold border-l-2 border-red-300 pl-3">
                                    <span className="text-red-500 font-black">FAIL:</span> Traditional systems like IMD and NDMA issue warnings only after thresholds are crossed.
                                </p>
                                <p className="text-sm text-[#0F172A] uppercase tracking-wider font-extrabold border-l-2 border-green-400 pl-3 bg-green-50/50 py-2">
                                    <span className="text-green-600 font-black">SOLVED:</span> UrbanShield predicts risk earlier by proactively modeling environmental variables before alerts occur.
                                </p>
                            </div>
                        </div>

                        {/* Point 2 */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#0F172A] p-2 rounded text-white flex-shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <h4 className="text-base font-bold uppercase tracking-widest text-[#0F172A]">
                                    2. Lack of Infrastructure Modeling
                                </h4>
                            </div>
                            <div className="pl-12 space-y-3">
                                <p className="text-sm text-slate-500 uppercase tracking-wider font-bold border-l-2 border-red-300 pl-3 leading-relaxed">
                                    <span className="text-red-500 font-black">FAIL:</span> Floods in cities like Bengaluru and Hyderabad are worsened by lake encroachment and loss of wetlands.
                                </p>
                                <p className="text-sm text-[#0F172A] uppercase tracking-wider font-extrabold border-l-2 border-green-400 pl-3 bg-green-50/50 py-2">
                                    <span className="text-green-600 font-black">SOLVED:</span> UrbanShield integrates urban factors natively in its high-fidelity flood risk engine.
                                </p>
                            </div>
                        </div>

                        {/* Point 3 */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#0F172A] p-2 rounded text-white flex-shrink-0">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <h4 className="text-base font-bold uppercase tracking-widest text-[#0F172A]">
                                    3. Last-Mile Alert Failures
                                </h4>
                            </div>
                            <div className="pl-12 space-y-3">
                                <p className="text-sm text-slate-500 uppercase tracking-wider font-bold border-l-2 border-red-300 pl-3">
                                    <span className="text-red-500 font-black">FAIL:</span> Many critical warnings never reach citizens in time due to poor distribution channels.
                                </p>
                                <p className="text-sm text-[#0F172A] uppercase tracking-wider font-extrabold border-l-2 border-green-400 pl-3 bg-green-50/50 py-2">
                                    <span className="text-green-600 font-black">SOLVED:</span> UrbanShield utilizes multilingual SMS and localized evacuation recommendations.
                                </p>
                            </div>
                        </div>

                        {/* Point 4 */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#0F172A] p-2 rounded text-white flex-shrink-0">
                                    <BrainCircuit className="w-5 h-5" />
                                </div>
                                <h4 className="text-base font-bold uppercase tracking-widest text-[#0F172A]">
                                    4. Compound Disaster Risks
                                </h4>
                            </div>
                            <div className="pl-12 space-y-3">
                                <p className="text-sm text-slate-500 uppercase tracking-wider font-bold border-l-2 border-red-300 pl-3">
                                    <span className="text-red-500 font-black">FAIL:</span> Traditional models treat disasters independently in silos.
                                </p>
                                <p className="text-sm text-[#0F172A] uppercase tracking-wider font-extrabold border-l-2 border-green-400 pl-3 bg-green-50/50 py-2">
                                    <span className="text-green-600 font-black">SOLVED:</span> UrbanShield computes nonlinear compound risks such as Flood + Heatwave interactions.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Data Credibility Footer */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-400">
                            <Info className="w-4 h-4 text-slate-400" />
                            Data Sources
                        </div>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                            {['NDMA', 'IMD', 'Indian Meteorological Reports', 'Government Disaster Reports'].map((source) => (
                                <span key={source} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider">
                                    {source}
                                </span>
                            ))}
                        </div>
                    </div>
                    <p className="text-[9px] uppercase font-bold text-slate-400 mt-4 tracking-widest text-center sm:text-left">
                        Data reflects recent extreme weather trends in India (2024–2025).
                    </p>
                </div>

            </div>
        </div>
    );
}

"use client";

import React from "react";
import { Ship, Code, Palette, BookOpen } from "lucide-react";
import IntelligenceMenu from "@/components/navigation/IntelligenceMenu";

const TEAM = [
    {
        name: "Shafeeq Aadhil",
        role: "Lead Developer",
        initials: "SA",
        subtitle: "Built and architected the full UrbanShield platform including backend systems, frontend integration, intelligence modules, risk models, routing structure, and system behavior."
    },
    {
        name: "Leslie Joy",
        role: "Frontend Developer & UI/UX Designer",
        initials: "LJ",
        subtitle: "Designed the interface system, user experience flow, visual hierarchy, dashboard styling, and interaction patterns across the platform."
    },
    {
        name: "Roshan Teja",
        role: "Resource Strategist",
        initials: "RT",
        subtitle: "Handled project research, supporting resources, planning inputs, and operational assistance during development."
    }
];

export default function TeamPage() {
    return (
        <main className="min-h-screen bg-[#f5f2eb] flex flex-col font-sans selection:bg-[#B8962E]/30">
            <IntelligenceMenu />
            
            {/* Header Section */}
            <div className="max-w-6xl w-full mx-auto px-8 pt-24 pb-16">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-[1px] bg-[var(--color-navy)]/30" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-navy)]/50">
                        Operational Intelligence
                    </span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black text-[var(--color-navy)] uppercase tracking-tighter leading-[0.85] mb-8">
                    Core <span className="text-[#B8962E]">Operations</span> Team
                </h1>
                
                <div className="w-full h-[1px] bg-[var(--color-navy)]/10" />
            </div>

            {/* Team Grid */}
            <div className="max-w-6xl w-full mx-auto px-8 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TEAM.map((member) => (
                        <div 
                            key={member.name}
                            className="group bg-white border border-[var(--color-navy)]/10 rounded-xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
                        >
                            {/* Gold Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#B8962E] transform origin-left transition-transform duration-500" />
                            
                            {/* Initials Badge */}
                            <div className="w-16 h-16 rounded-full bg-[var(--color-navy)] text-white flex items-center justify-center text-xl font-black mb-6 group-hover:scale-110 transition-transform duration-300">
                                {member.initials}
                            </div>
                            
                            <h3 className="text-2xl font-black text-[var(--color-navy)] uppercase tracking-tight mb-1">
                                {member.name}
                            </h3>
                            
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#B8962E] mb-6">
                                {member.role}
                            </p>
                            
                            <p className="text-sm font-medium text-[var(--color-navy)]/70 leading-relaxed mb-8">
                                {member.subtitle}
                            </p>
                            
                            {/* Tactical Icon */}
                            <div className="pt-6 border-t border-[var(--color-navy)]/5 flex justify-between items-center">
                                <span className="text-[8px] font-bold tracking-widest text-[var(--color-navy)]/30 uppercase">
                                    Status: Deployment Ready
                                </span>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Text */}
            <div className="max-w-6xl w-full mx-auto px-8 pb-32">
                <div className="bg-[var(--color-navy)] text-white p-12 rounded-xl relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-accent)_0%,_transparent_70%)]" />
                    <p className="text-lg md:text-2xl font-bold italic tracking-tight opacity-90 max-w-2xl mx-auto">
                        “Built for rapid-response civic intelligence and hackathon deployment.”
                    </p>
                </div>
                
                <div className="mt-8 flex justify-center gap-12 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--color-navy)]/40">
                    <span>UrbanShield Framework</span>
                    <span>v1.0.4 Stablilized</span>
                    <span>India Intelligence Core</span>
                </div>
            </div>
        </main>
    );
}

"use client";

import BackButton from "@/components/navigation/BackButton";
import { motion } from "framer-motion";
import { 
    Database, SlidersHorizontal, BrainCircuit, BarChart3, MonitorSmartphone,
    Code2, Palette, FileCode2, MapPin, Zap, Binary, CloudRain, Layers, Move, Map,
    ChevronRight, Waves, ThermometerSun, AlertTriangle
} from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const FADE_UP = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const STAGGER = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans">
            <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-8 py-20 pb-32">
                <BackButton />
                
                {/* HERO SECTION */}
                <motion.div 
                    initial="hidden" animate="visible" variants={STAGGER}
                    className="mb-16 border-b border-[var(--color-navy)]/10 pb-12"
                >
                    <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[var(--color-navy)] m-0 leading-[1.1] mb-6">
                        PREDICT.<br/>
                        <span className="relative inline-block">
                            PROTECT.
                            <motion.span 
                                animate={{ opacity: [0.5, 1, 0.5], boxShadow: ['0 0 10px #B8962E', '0 0 20px #B8962E', '0 0 10px #B8962E'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-1 left-0 w-full h-[4px] bg-[#B8962E] rounded-full"
                            />
                        </span><br/>
                        RESPOND.
                    </motion.h1>
                    <motion.p variants={FADE_UP} className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#B8962E] mt-4 mb-8">
                        Civic Intelligence & Risk Console v1.0
                    </motion.p>
                    
                    <motion.p variants={FADE_UP} className="text-xl md:text-2xl font-serif text-[var(--color-navy)] font-medium max-w-3xl leading-snug mb-3">
                        UrbanShield is an AI-powered climate risk platform that helps cities predict floods, heatwaves, and urban disasters before they happen.
                    </motion.p>
                    <motion.p variants={FADE_UP} className="text-sm font-sans text-[var(--color-navy)]/50 uppercase tracking-widest font-bold max-w-2xl leading-relaxed mb-10">
                        Think of it like maps + weather + AI predictions combined into one system.
                    </motion.p>

                    <motion.div variants={STAGGER} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: "Cities Monitored", value: 331, textAfter: "" },
                            { label: "Extreme Weather Days (2025)", value: 4419, textAfter: "" },
                            { label: "Cities Lack Drainage", value: 70, textAfter: "%+" },
                            { label: "ROI of Early Action", value: 400, textAfter: ":1" }
                        ].map((stat, i) => (
                            <motion.div key={i} variants={FADE_UP} className="border border-[var(--color-navy)]/20 p-5 hover:-translate-y-1 transition-transform duration-300 group bg-white/30 backdrop-blur-sm cursor-default">
                                <div className="text-3xl font-serif font-black text-[var(--color-navy)] flex items-baseline">
                                    <AnimatedCounter value={stat.value} />{stat.textAfter}
                                </div>
                                <div className="text-[9px] uppercase font-bold tracking-widest text-[#B8962E] mt-2">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Auto-scrolling ticker */}
                    <motion.div variants={FADE_UP} className="w-full overflow-hidden bg-[var(--color-navy)] text-white py-2 flex items-center border border-[var(--color-navy)]">
                        <motion.div 
                            animate={{ translateX: ["0%", "-50%"] }} 
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="flex whitespace-nowrap space-x-12 px-4 text-[10px] font-bold uppercase tracking-widest"
                        >
                            <span>LIVE: BENGALURU FLOOD RISK 42/100</span>
                            <span>•</span>
                            <span className="text-[#B8962E]">DELHI HEAT INDEX 71/100</span>
                            <span>•</span>
                            <span>CHENNAI COMPOUND RISK 55/100</span>
                            <span>•</span>
                            <span className="text-red-400">PATNA FLOOD RISK 68/100</span>
                            <span>•</span>
                            <span>LIVE: BENGALURU FLOOD RISK 42/100</span>
                            <span>•</span>
                            <span className="text-[#B8962E]">DELHI HEAT INDEX 71/100</span>
                            <span>•</span>
                            <span>CHENNAI COMPOUND RISK 55/100</span>
                            <span>•</span>
                            <span className="text-red-400">PATNA FLOOD RISK 68/100</span>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* CONTENT */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={STAGGER} className="space-y-16 text-[var(--color-charcoal)]/80 leading-relaxed font-sans mt-8">

                    {/* ML PIPELINE */}
                    <motion.section variants={FADE_UP} className="group">
                        <h2 className="font-sans text-xl font-black uppercase tracking-tight text-[var(--color-navy)] mb-8 inline-block relative">
                            1. ML Pipeline Architecture
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-[#B8962E] group-hover:w-full transition-all duration-500"></span>
                        </h2>
                        
                        <div className="bg-[#0F172A] p-8 md:p-12 border border-[#3B82F6]/30 overflow-hidden relative">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 font-sans w-full relative z-10">
                                {[
                                    { step: 1, title: "DATA COLLECTION", desc: "Open-Meteo API, historical climate, static city profiles", icon: <Database strokeWidth={2.5} size={20} className="text-[#3B82F6]"/> },
                                    { step: 2, title: "FEATURE ENGINEERING", desc: "Rainfall, temperature, humidity, drainage capacity", icon: <SlidersHorizontal strokeWidth={2.5} size={20} className="text-[#3B82F6]"/> },
                                    { step: 3, title: "HYBRID CORE MODEL", desc: "RandomForest prediction + domain rule engine", extra: "Score = (0.5 × RF_prediction) + (0.5 × Domain_rules)", icon: <BrainCircuit strokeWidth={2.5} size={20} className="text-[#3B82F6]"/> },
                                    { step: 4, title: "RISK SCORING", desc: "Flood index, heat stress index, compound risk", icon: <BarChart3 strokeWidth={2.5} size={20} className="text-[#3B82F6]"/> },
                                    { step: 5, title: "XAI OUTPUT", desc: "Risk maps, alerts, simulations, route evacuation", extra: "SHAP explainability — identifies top 3 risk drivers per prediction", icon: <MonitorSmartphone strokeWidth={2.5} size={20} className="text-[#3B82F6]"/> }
                                ].map((item, i, arr) => (
                                    <div key={i} className="flex flex-col lg:flex-row items-center flex-1 w-full lg:w-auto relative group/stage min-w-[140px] text-center lg:text-left">
                                        <div className="flex flex-col items-center">
                                            {/* Node Shape */}
                                            <div className="w-[48px] h-[48px] rounded-full bg-[#1E293B] border-2 border-[#3B82F6] flex items-center justify-center mb-4 relative z-20 hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                                <div className="absolute -top-2 -right-2 bg-[#B8962E] text-[#0F172A] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                                    {item.step}
                                                </div>
                                                {item.icon}
                                            </div>
                                            {/* Labels */}
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white mb-2 text-center h-[28px] max-w-[120px] leading-tight">{item.title}</div>
                                            <div className="text-[9px] font-medium text-slate-400 text-center max-w-[140px] leading-relaxed mb-2">{item.desc}</div>
                                            
                                            {item.extra && (
                                                <div className="mt-2 text-[8px] font-mono text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 max-w-[150px] text-center border border-[#3B82F6]/20">
                                                    {item.extra}
                                                </div>
                                            )}
                                        </div>

                                        {/* Horizontal Dash Lines (Desktop) */}
                                        {i < arr.length - 1 && (
                                            <div className="hidden lg:block absolute top-[24px] left-[50%] w-full z-0 pointer-events-none">
                                                <svg width="100%" height="2" className="overflow-visible">
                                                    <line x1="24" y1="0" x2="100%" y2="0" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" strokeOpacity="0.5" />
                                                </svg>
                                            </div>
                                        )}
                                        {/* Vertical Dash Lines (Mobile) */}
                                        {i < arr.length - 1 && (
                                            <div className="lg:hidden h-[40px] w-full flex justify-center my-2">
                                                <svg width="2" height="100%" className="overflow-visible">
                                                    <line x1="0" y1="0" x2="0" y2="100%" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" strokeOpacity="0.5" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes dash {
                            to {
                                stroke-dashoffset: -8;
                            }
                        }
                    `}} />

                    {/* TECHNOLOGY STACK */}
                    <motion.section variants={FADE_UP} className="group pt-8">
                        <div className="w-full h-px bg-[var(--color-navy)]/10 mb-12"></div>
                        <h2 className="font-sans text-xl font-black uppercase tracking-tight text-[var(--color-navy)] mb-8 inline-block relative">
                            2. Technology Stack
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-[#B8962E] group-hover:w-full transition-all duration-500"></span>
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
                            {[
                                { name: "Next.js 14", desc: "React Framework", cat: "FRONTEND", icon: <Code2 size={16} />, color: "bg-blue-500/20 text-blue-400" },
                                { name: "Tailwind CSS", desc: "Styling", cat: "FRONTEND", icon: <Palette size={16} />, color: "bg-blue-500/20 text-blue-400" },
                                { name: "TypeScript", desc: "Type Safety", cat: "FRONTEND", icon: <FileCode2 size={16} />, color: "bg-blue-500/20 text-blue-400" },
                                { name: "Leaflet.js", desc: "Mapping", cat: "FRONTEND", icon: <MapPin size={16} />, color: "bg-blue-500/20 text-blue-400" },
                                { name: "FastAPI", desc: "Backend API", cat: "BACKEND", icon: <Zap size={16} />, color: "bg-amber-500/20 text-amber-500" },
                                { name: "SQL DB", desc: "State Storage", cat: "BACKEND", icon: <Database size={16} />, color: "bg-amber-500/20 text-amber-500" },
                                { name: "RandomForest", desc: "Predictive Models", cat: "DATA SCIENCE", icon: <Binary size={16} />, color: "bg-green-500/20 text-green-400" },
                                { name: "Open-Meteo", desc: "Weather Data", cat: "INTEGRATION", icon: <CloudRain size={16} />, color: "bg-purple-500/20 text-purple-400" }
                            ].map((tech, i) => (
                                <div key={i} className="bg-[#0F172A] border border-[#3B82F6]/20 rounded-lg p-5 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(59,130,246,0.15)] hover:border-[#3B82F6]/60 transition-all duration-300 flex flex-col group/card relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-5">
                                        <div className="text-[#3B82F6]/60 group-hover/card:text-[#3B82F6] transition-colors">{tech.icon}</div>
                                        <div className={`text-[8px] uppercase font-black tracking-widest px-2 py-1 rounded-[4px] ${tech.color}`}>{tech.cat}</div>
                                    </div>
                                    <div className="text-[14px] font-bold text-white mb-1 uppercase tracking-wide font-mono">{tech.name}</div>
                                    <div className="text-[11px] font-medium text-slate-400 mb-4">{tech.desc}</div>
                                    
                                    <div className="mt-auto text-[#3B82F6] font-mono font-black text-[12px] opacity-50 group-hover/card:opacity-100 transition-opacity">
                                        {">"} <span className="animate-pulse">_</span>
                                    </div>
                                    
                                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#3B82F6] blur-[50px] opacity-0 group-hover/card:opacity-10 transition-opacity duration-500" />
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* CITY COVERAGE SECTION */}
                    <motion.section variants={FADE_UP} className="group pt-8">
                        <div className="w-full h-px bg-[var(--color-navy)]/10 mb-12"></div>
                        <h2 className="font-sans text-xl font-black uppercase tracking-tight text-[var(--color-navy)] mb-8 inline-block relative">
                            3. India City Coverage
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-[#B8962E] group-hover:w-full transition-all duration-500"></span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                            {[
                                { city: "Bengaluru", state: "Karnataka", flood: 65, heat: 40, tag: "Drainage Saturation" },
                                { city: "Delhi", state: "Delhi NCR", flood: 40, heat: 90, tag: "Extreme Thermal Stress" },
                                { city: "Mumbai", state: "Maharashtra", flood: 85, heat: 60, tag: "Coastal Inundation" },
                                { city: "Chennai", state: "Tamil Nadu", flood: 75, heat: 80, tag: "Compound Risk" },
                                { city: "Patna", state: "Bihar", flood: 85, heat: 50, tag: "River Basin Overflow" }
                            ].map((loc, i) => (
                                <div key={i} className="bg-white border border-[var(--color-navy)]/20 p-6 flex flex-col hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative group/city">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight text-[var(--color-navy)] leading-none mb-1">{loc.city}</h3>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8962E]">{loc.state}</p>
                                        </div>
                                        <div className="w-10 h-10 border border-[#3B82F6]/30 rounded-full flex items-center justify-center relative bg-[#0F172A]/5 overflow-hidden">
                                            <div className="absolute w-[3px] h-[3px] bg-red-500 rounded-full animate-ping" />
                                            <div className="absolute w-[3px] h-[3px] bg-red-600 rounded-full" />
                                            <Map size={16} className="text-[#3B82F6] opacity-30" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 w-full">
                                        <div>
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-1 text-[var(--color-navy)]/70">
                                                <span>Flood Risk</span>
                                                <span className="text-[#3B82F6]">{loc.flood}/100</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                                                <div className="h-full bg-[#3B82F6] transition-all duration-1000" style={{ width: `${loc.flood}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-1 text-[var(--color-navy)]/70">
                                                <span>Heat Risk</span>
                                                <span className="text-amber-500">{loc.heat}/100</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                                                <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${loc.heat}%` }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                                        <AlertTriangle size={12} className="text-amber-500" />
                                        KEY METRIC: {loc.tag}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* HOW THE SYSTEM WORKS */}
                    <motion.section variants={FADE_UP} className="group pt-8">
                        <div className="w-full h-px bg-[var(--color-navy)]/10 mb-12"></div>
                        <h2 className="font-sans text-xl font-black uppercase tracking-tight text-[var(--color-navy)] mb-8 inline-block relative">
                            3. How the System Works
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-accent)] group-hover:w-full transition-all duration-500"></span>
                        </h2>
                        
                        <div className="relative pl-6 ml-2 border-l-2 border-[var(--color-navy)]/20 space-y-10 font-sans mt-4">
                            {[
                                "User selects city",
                                "Weather data is fetched continuously",
                                "Risk models instantly evaluate conditions",
                                "Risk scores and indexes are generated",
                                "Dashboards update with intelligent telemetry"
                            ].map((step, i) => (
                                <div key={i} className="relative group/step">
                                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-[var(--color-bg)] border-2 border-[var(--color-accent)] rounded-full group-hover/step:scale-125 group-hover/step:bg-[var(--color-accent)] transition-all duration-300"></div>
                                    <div className="text-[9px] font-black text-[var(--color-accent)] tracking-wider uppercase mb-1 opacity-80">Step 0{i + 1}</div>
                                    <div className="text-[15px] font-bold text-[var(--color-navy)] tracking-tight">{step}</div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* FUTURE EXPANSION */}
                    <motion.section variants={FADE_UP} className="group pt-8">
                        <div className="w-full h-px bg-[var(--color-navy)]/10 mb-12"></div>
                        <h2 className="font-sans text-xl font-black uppercase tracking-tight text-[var(--color-navy)] mb-6 inline-block relative">
                            4. Future Expansion
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-accent)] group-hover:w-full transition-all duration-500"></span>
                        </h2>
                        
                        <ul className="space-y-4 font-sans max-w-2xl">
                            {[
                                "Cyclone path prediction methodologies",
                                "Citizen reporting dashboard & feedback loop",
                                "Multilingual public warning alerts",
                                "Evacuation route optimization logic",
                                "Micro-level air quality and pollution intelligence",
                                "Real-time government emergency protocol integration"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-[15px] text-[var(--color-navy)]/80 font-medium hover:text-[var(--color-navy)] transition-colors">
                                    <span className="text-[var(--color-accent)] font-black text-lg opacity-80 -mt-1.5">―</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.section>

                </motion.div>
            </div>
        </main>
    );
}

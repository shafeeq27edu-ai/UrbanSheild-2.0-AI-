"use client";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

// Risk matrix: 0=none, 1=low, 2=moderate, 3=high, 4=extreme
const CALENDAR_DATA = [
    {
        label: "NE Monsoon",
        short: "NE",
        hazard: "Flood",
        values: [0, 0, 0, 0, 0, 1, 2, 3, 4, 3, 2, 1],
    },
    {
        label: "Bay of Bengal Cyclone",
        short: "Bay",
        hazard: "Cyclone",
        values: [0, 0, 0, 0, 2, 3, 2, 2, 3, 4, 4, 1],
    },
    {
        label: "Heat Wave (Indo-Gangetic)",
        short: "Heat",
        hazard: "Heat",
        values: [0, 0, 1, 3, 4, 4, 2, 1, 1, 0, 0, 0],
    },
    {
        label: "SW Monsoon Flood",
        short: "SW",
        hazard: "Flood",
        values: [0, 0, 0, 0, 1, 3, 4, 4, 3, 2, 1, 0],
    },
    {
        label: "Landslide (Western Ghats)",
        short: "Land",
        hazard: "Landslide",
        values: [0, 0, 0, 0, 0, 2, 4, 4, 3, 1, 0, 0],
    },
    {
        label: "Drought (Central India)",
        short: "Drought",
        hazard: "Drought",
        values: [1, 1, 2, 3, 3, 1, 0, 0, 0, 1, 2, 2],
    },
];

const LEVEL_STYLES = [
    "bg-[#F5F0E8] text-slate-300",       // 0 — none
    "bg-green-500 text-white",        // 1 — low
    "bg-amber-400 text-white",      // 2 — moderate
    "bg-orange-500 text-white",      // 3 — high
    "bg-red-600 text-white animate-pulse",             // 4 — extreme
];

const LEVEL_LABELS = ["—", "Low", "Mod", "High", "Extr"];

const currentMonth = new Date().getMonth();

export default function IndiaSeasonCalendar() {
    return (
        <div className="border-2 border-[var(--color-navy)] bg-white/60 p-4">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--color-navy)]/50">
                    India Disaster Season Calendar
                </span>
                <div className="flex-1 h-px bg-[var(--color-navy)]/10" />
                <span className="text-[9px] font-bold text-[var(--color-navy)]/40">Live Month Highlighted</span>
            </div>

            {/* Month headers */}
            <div className="flex gap-1 mb-1 pl-[4.5rem]">
                {MONTHS.map((m, i) => (
                    <div
                        key={i}
                        className={`flex-1 text-center text-[8px] font-black uppercase ${i === currentMonth
                                ? "text-[var(--color-accent)]"
                                : "text-[var(--color-navy)]/40"
                            }`}
                    >
                        {m}
                    </div>
                ))}
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-2 relative">
                {CALENDAR_DATA.map((row) => (
                    <div key={row.short} className="flex items-center gap-1.5 relative group">
                        <div className="w-[4.5rem] shrink-0 text-[8px] font-black text-[var(--color-navy)] uppercase tracking-wide cursor-help">
                            {row.short}
                        </div>
                        {/* Tooltip */}
                        <div className="absolute left-[4.5rem] -top-8 bg-[var(--color-navy)] text-white text-[10px] font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 whitespace-nowrap hidden md:block">
                            {row.label}
                        </div>

                        {row.values.map((v, i) => (
                            <div
                                key={i}
                                className={`flex-1 h-6 flex items-center justify-center text-[8px] font-black rounded-lg transition-all cursor-default ${LEVEL_STYLES[v]
                                    } ${i === currentMonth ? "ring-[3px] ring-[var(--color-navy)] ring-offset-1 scale-110 z-10" : ""}`}
                            >
                                {v > 0 ? LEVEL_LABELS[v].charAt(0) : "·"}
                                {i === currentMonth && <span className="absolute -top-3 w-[26px] text-center left-1/2 -translate-x-1/2 text-[6px] bg-[var(--color-navy)] text-white px-1 py-0.5 rounded uppercase">NOW</span>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--color-navy)]/10">
                <span className="text-[8px] font-black text-[var(--color-navy)]/40 uppercase tracking-widest">Legend</span>
                {LEVEL_STYLES.slice(1).map((style, i) => (
                    <div key={i} className="flex items-center gap-1">
                        <div className={`w-3 h-3 ${style}`} />
                        <span className="text-[7px] font-bold text-[var(--color-navy)]/50">{LEVEL_LABELS[i + 1]}</span>
                    </div>
                ))}
                <div className="flex items-center gap-1 ml-auto">
                    <div className="w-3 h-3 ring-2 ring-[var(--color-accent)]" />
                    <span className="text-[7px] font-bold text-[var(--color-accent)]">Now</span>
                </div>
            </div>
        </div>
    );
}

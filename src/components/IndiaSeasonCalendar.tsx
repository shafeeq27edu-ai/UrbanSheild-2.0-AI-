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
    "bg-slate-100 text-slate-300",       // 0 — none
    "bg-green-200 text-green-700",        // 1 — low
    "bg-yellow-300 text-yellow-800",      // 2 — moderate
    "bg-orange-400 text-orange-900",      // 3 — high
    "bg-red-600 text-white",             // 4 — extreme
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
            <div className="flex flex-col gap-1">
                {CALENDAR_DATA.map((row) => (
                    <div key={row.short} className="flex items-center gap-1">
                        <div className="w-[4.5rem] shrink-0 text-[8px] font-black text-[var(--color-navy)] uppercase tracking-wide">
                            {row.short}
                        </div>
                        {row.values.map((v, i) => (
                            <div
                                key={i}
                                title={`${row.label} — ${MONTHS[i]}: ${LEVEL_LABELS[v]}`}
                                className={`flex-1 h-5 flex items-center justify-center text-[7px] font-black rounded-none transition-all cursor-default ${LEVEL_STYLES[v]
                                    } ${i === currentMonth ? "ring-2 ring-[var(--color-accent)] ring-offset-0" : ""}`}
                            >
                                {v > 0 ? LEVEL_LABELS[v].charAt(0) : "·"}
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

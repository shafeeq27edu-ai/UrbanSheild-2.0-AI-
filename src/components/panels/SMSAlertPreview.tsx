"use client";

import { Smartphone } from "lucide-react";

interface SMSAlertPreviewProps {
    city: string;
    metrics?: any;
}

const ALERTS: Array<{ lang: string; name: string; area: string; route: string; helpline: string; warning(area: string): string }> = [
    {
        lang: "hi",
        name: "हिन्दी",
        area: "कोरमंगला",
        route: "NH-648",
        helpline: "1070",
        warning: (area: string) => `गंभीर बाढ़ चेतावनी\nक्षेत्र: ${area}\nतुरंत NH-648 द्वारा निकासी करें\nहेल्पलाइन: 1070`,
    },
    {
        lang: "ta",
        name: "தமிழ்",
        area: "வேளாச்சேரி",
        route: "NH-32",
        helpline: "1077",
        warning: (area: string) => `தீவிர வெள்ள எச்சரிக்கை\nப்ரதேசம்: ${area}\nNH-32 வழியாக உடனே வெளியேறுங்கள்\nஉதவி: 1077`,
    },
    {
        lang: "bn",
        name: "বাংলা",
        area: "কসবা",
        route: "NH-12",
        helpline: "1070",
        warning: (area: string) => `গুরুতর বন্যার সতর্কতা\nএলাকা: ${area}\nNH-12 দিয়ে এখনই সরে যান\nহেল্পলাইন: 1070`,
    },
    {
        lang: "ml",
        name: "മലയാളം",
        area: "മേപ്പാടി",
        route: "SH-29",
        helpline: "1077",
        warning: (area: string) => `ഗുരുതരമായ വെള്ളപ്പൊക്ക മുന്നറിയിപ്പ്\nപ്രദേശം: ${area}\nSH-29 വഴി ഉടൻ ഒഴിഞ്ഞുമാറുക\nഹെൽപ്‌ലൈൻ: 1077`,
    },
    {
        lang: "te",
        name: "తెలుగు",
        area: "హైటెక్ సిటీ",
        route: "NH-65",
        helpline: "1100",
        warning: (area: string) => `తీవ్రమైన వరద హెచ్చరిక\nప్రాంతం: ${area}\nNH-65 ద్వారా వెంటనే తరలించండి\nహెల్ప్‌లైన్: 1100`,
    },
    {
        lang: "kn",
        name: "ಕನ್ನಡ",
        area: "ಬೆಳ್ಳಂದೂರು",
        route: "NH-44",
        helpline: "112",
        warning: (area: string) => `ತೀವ್ರ ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ\nಪ್ರದೇಶ: ${area}\nNH-44 ಮೂಲಕ ತಕ್ಷಣ ಖಾಲಿ ಮಾಡಿ\nಸಹಾಯ: 112`,
    },
    {
        lang: "mr",
        name: "मराठी",
        area: "अंधेरी",
        route: "NH-8",
        helpline: "1916",
        warning: (area: string) => `गंभीर पूर चेतावनी\nक्षेत्र: ${area}\nNH-8 मार्गे त्वरित निर्वासन करा\nहेल्पलाइन: 1916`,
    },
    {
        lang: "gu",
        name: "ગુજરાતી",
        area: "અઠ્ઠૈ",
        route: "NH-48",
        helpline: "1079",
        warning: (area: string) => `ગંભીર પૂર ચેતવણી\nવિસ્તાર: ${area}\nNH-48 દ્વારા તાત્કાલિક ખાલી કરો\nહેલ્પલાઇન: 1079`,
    },
    {
        lang: "en",
        name: "English",
        area: "Zone 1",
        route: "Ring Road",
        helpline: "112",
        warning: (area: string) => `SEVERE FLOOD WARNING\nArea: ${area}\nEvacuate immediately via Ring Road\nEmergency: 112`,
    },
];

export default function SMSAlertPreview({ city, metrics }: SMSAlertPreviewProps) {
    const score = metrics?.compound_risk_index ?? 0;
    if (score < 38) return null;

    return (
        <div className="border-2 border-[var(--color-navy)] bg-white/60 p-4">
            <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-[var(--color-navy)]" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--color-navy)]">
                    Last-Mile Alert System
                </span>
                <div className="flex-1 h-px bg-[var(--color-navy)]/10" />
                <span className="text-[10px] font-black bg-green-500 text-white px-2 py-0.5">
                    2.4M Reach
                </span>
            </div>
            <p className="text-[9px] font-bold text-[var(--color-navy)]/40 uppercase tracking-widest mb-4">
                {ALERTS.length} regional languages, zero infrastructure dependency
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ALERTS.slice(0, 9).map((a, idx) => {
                    const isSent = idx < 5;
                    return (
                        <div key={a.lang} className="bg-[var(--color-navy)] rounded-none p-0 flex flex-col items-center" style={{ fontFamily: "monospace" }}>
                            {/* Phone header */}
                            <div className="w-full bg-black rounded-t-none px-2 py-1 flex items-center justify-between">
                                <span className="text-[7px] text-white/60 font-bold">NDMA · EMERGENCY</span>
                                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-sm ${isSent ? 'bg-green-500 text-white' : 'bg-amber-400 text-black'}`}>
                                    {isSent ? 'SENT' : 'QUEUED'}
                                </span>
                            </div>
                            {/* Screen */}
                            <div className="w-full bg-slate-800 px-2 pt-2 pb-3 flex flex-col gap-1">
                                <div className="text-[7px] text-amber-400 font-black uppercase tracking-widest">⚠ {a.name}</div>
                                <div className="text-[8px] text-white/90 whitespace-pre-line leading-tight">{a.warning(a.area)}</div>
                            </div>
                            <div className="w-full bg-slate-900 px-2 py-1 text-[6px] text-white/30 text-center">
                                National Disaster Alert · Govt. of India
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, ShieldAlert, CheckCircle2, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { translationService, SupportedLanguage } from "@/services/translationService";

interface RiskAlertProps {
    score: number;
    language: SupportedLanguage;
}

export default function RiskAlert({ score, language }: RiskAlertProps) {
    const content = translationService.getAlertContent(score, language);

    const getIcon = () => {
        if (score > 75) return <ShieldAlert className="w-6 h-6 text-white" />;
        if (score > 50) return <AlertTriangle className="w-6 h-6 text-white" />;
        if (score > 25) return <Info className="w-6 h-6 text-white" />;
        return <CheckCircle2 className="w-6 h-6 text-white" />;
    };

    const [smsSent, setSmsSent] = useState(false);
    const [secondsAgo, setSecondsAgo] = useState(0);

    const handleSmsBroadcast = () => {
        setSmsSent(true);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (smsSent) {
            setSecondsAgo(0);
            interval = setInterval(() => {
                setSecondsAgo(prev => prev + 1);
            }, 1000);

            const timeout = setTimeout(() => {
                setSmsSent(false);
            }, 8000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [smsSent]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={`${score}-${language}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`w-full p-4 border-l-4 border-black/20 ${content.color} text-white shadow-lg flex items-start gap-4 transition-colors duration-500`}
            >
                <div className="bg-black/10 p-2 rounded-sm">
                    {getIcon()}
                </div>
                <div className="flex flex-col">
                    <h3 className="font-black uppercase tracking-tighter text-lg leading-tight">
                        {content.title}
                    </h3>
                    <p className="text-xs font-bold opacity-90 uppercase tracking-wide mt-1">
                        {content.advice}
                    </p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                    <span className="text-[10px] font-black opacity-50 uppercase tracking-widest">Risk Index</span>
                    <span className="text-2xl font-black leading-none mb-2">{Math.round(score)}</span>
                    <button
                        onClick={handleSmsBroadcast}
                        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors text-white text-xs font-bold uppercase tracking-widest mt-auto whitespace-nowrap"
                    >
                        <Send className="w-3 h-3" />
                        Broadcast SMS
                    </button>
                </div>
            </motion.div>

            {/* SMS Toast */}
            <AnimatePresence>
                {smsSent && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-[9999] bg-[var(--color-navy)] border border-[var(--color-accent)] text-white p-4 rounded-lg shadow-2xl flex items-center gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center">
                            <Send className="w-4 h-4 text-[var(--color-accent)]" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-wider text-[var(--color-accent)]">SMS Dispatched: {secondsAgo}s ago</p>
                            <p className="text-xs font-medium text-white/70 mt-0.5">Alert broadcasted to 45,000+ residents in <strong>{language.toUpperCase()}</strong>.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AnimatePresence>
    );
}

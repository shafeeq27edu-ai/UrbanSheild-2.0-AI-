"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, X } from "lucide-react";

export default function IntelligenceMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isBooting, setIsBooting] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);

    // Keyboard & Accessibility: Escape to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Handle open with boot sequence
    const toggleMenu = () => {
        if (!isOpen) {
            setIsOpen(true);
            setIsBooting(true);
            setTimeout(() => setIsBooting(false), 400); // 400ms intelligence boot
        } else {
            setIsOpen(false);
            setIsBooting(false);
        }
    };

    const navItems = [
        { label: "Command Center", subLabel: "Live Risk Dashboard", href: "/" },
        { label: "About Platform", subLabel: "Platform Intelligence & ML Docs", href: "/about" },
        { label: "Intelligence Engine", subLabel: "AI Inference Configuration", href: "/intelligence" },
        { label: "India Intelligence", subLabel: "Regional Context Data", href: "/india-intelligence" },
        { label: "Simulation Lab", subLabel: "Scenario Stress Testing", href: "/simulation" },
        { label: "Operations Team", subLabel: "Project Contributors", href: "/team" },
    ];

    return (
        <>
            {/* Minimal Circular Button - Floating Bottom Right */}
            <button
                onClick={toggleMenu}
                style={{ bottom: "24px", right: "24px", width: "48px", height: "48px" }}
                className="fixed z-[9999] rounded-full border border-[rgba(59,130,246,0.4)] flex flex-col items-center justify-center gap-1 bg-[#1E293B] hover:scale-[1.05] hover:border-[rgba(59,130,246,0.8)] transition-all duration-300 shadow-lg"
                aria-label="Toggle Navigation"
            >
                <div className={`w-5 h-[2px] bg-[#3B82F6] transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
                <div className={`w-5 h-[2px] bg-[#3B82F6] transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
                <div className={`w-5 h-[2px] bg-[#3B82F6] transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </button>

            {/* Full-Screen Overlay Panel */}
            <div
                className={`fixed inset-0 z-[9998] bg-[#f5f2eb] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Close Button Top Right */}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-8 right-8 z-50 w-[32px] h-[32px] flex items-center justify-center text-[var(--color-navy)] hover:text-[#3B82F6] hover:bg-slate-200/50 rounded-full transition-colors"
                >
                    <X size={24} strokeWidth={2.5} />
                </button>

                {/* Boot Sequence Animation */}
                {isBooting ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative w-48 h-[1px] bg-[var(--color-navy)]/20 overflow-hidden mb-4">
                            <div className="absolute top-0 left-0 w-full h-full bg-[#3B82F6] -translate-x-full animate-[scan_1s_ease-in-out_infinite]" />
                        </div>
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="w-12 h-12 rounded-full border border-[var(--color-navy)]/30 animate-pulse" />
                            <div className="absolute w-2 h-2 rounded-full bg-[#3B82F6] animate-ping" />
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-navy)]">
                            INITIALIZING NAVIGATION...
                        </p>
                    </div>
                ) : (
                    <div ref={menuRef} className="flex-1 flex flex-col justify-center max-w-5xl w-full mx-auto px-8 md:px-16 py-12 relative h-full overflow-y-auto overflow-x-hidden">
                        {/* Status Header inside menu */}
                        <div className="border-b border-[var(--color-navy)]/10 pb-4 mb-8 flex justify-between items-center opacity-0 animate-[fadeIn_0.5s_ease-out_0.1s_forwards] mt-8">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-navy)]/60">
                                Global Navigation Array
                            </span>
                            <span className="text-[8px] font-bold tracking-widest text-[var(--color-forest)] uppercase flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[var(--color-forest)] rounded-full animate-pulse" />
                                SYSTEM ONLINE
                            </span>
                        </div>

                        <nav className="flex flex-col flex-1">
                            {navItems.map((item, i) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group relative flex items-center justify-between min-h-[64px] px-6 border-b border-[var(--color-navy)]/5 transition-all duration-300
                                            ${isActive ? "bg-[rgba(59,130,246,0.2)] border-l-[3px] border-l-[#3B82F6]" : "hover:bg-[rgba(59,130,246,0.05)] border-l-[3px] border-l-transparent"}
                                            opacity-0 animate-[slideRight_0.4s_ease-out_forwards]`}
                                        style={{ animationDelay: `${0.15 + i * 0.05}s` }}
                                    >
                                        <div className="flex flex-col justify-center translate-x-2 group-hover:translate-x-4 transition-transform duration-300">
                                            <span className={`text-xl md:text-3xl font-black uppercase tracking-tighter transition-colors duration-300 
                                                ${isActive ? "text-[#3B82F6]" : "text-[var(--color-navy)]"} 
                                                group-hover:text-[#3B82F6]`}>
                                                {item.label}
                                            </span>
                                            <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 block
                                                ${isActive ? "text-[rgba(59,130,246,0.8)]" : "text-[var(--color-navy)]/40"}
                                                group-hover:text-[rgba(59,130,246,0.8)]`}>
                                                {item.subLabel}
                                            </span>
                                        </div>
                                        <ChevronRight size={20} className={`transform group-hover:translate-x-2 transition-transform duration-300 ${isActive ? "text-[#3B82F6]" : "text-[var(--color-navy)]/20"}`} strokeWidth={3} />
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer inside menu */}
                        <div className="mt-8 opacity-0 animate-[fadeIn_0.5s_ease-out_0.4s_forwards]">
                            <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-[var(--color-navy)]/40">
                                URBANSHIELD v1.0 | SECURE CONNECTION
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}} />
        </>
    );
}

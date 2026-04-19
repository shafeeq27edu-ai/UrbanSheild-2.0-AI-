import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import IntelligenceMenu from "@/components/navigation/IntelligenceMenu";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
    title: "UrbanShield AI | Climate Risk Intelligence",
    description: "Hyper-local urban climate risk intelligence platform.",
    manifest: "/manifest.json"
};

import ChunkErrorRecovery from "@/components/system/ChunkErrorRecovery";
import GlobalErrorBoundary from "@/components/system/GlobalErrorBoundary";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable}`}>
            <body className={`${inter.className} min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)] font-sans`}>
                <IntelligenceMenu />
                <div className="flex-1 flex flex-col fade-transition">
                    <GlobalErrorBoundary>
                        <ChunkErrorRecovery>
                            {children}
                        </ChunkErrorRecovery>
                    </GlobalErrorBoundary>
                </div>
                <footer className="w-full bg-[var(--color-navy)] text-slate-500 border-t border-slate-800/50 px-6 py-4 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase z-[1000] relative font-space-grotesk">
                    <div className="flex items-center gap-3">
                        <span className="text-slate-300">URBANSHIELD V1.1</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full hidden sm:block"></span>
                        <span className="hidden sm:block text-slate-500">CIVIC RISK INTELLIGENCE CORE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-600">SYSTEM:</span>
                        <span className="text-emerald-500/80">STABLE</span>
                    </div>
                </footer>
            </body>
        </html>
    );
}

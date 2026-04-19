"use client";

import React, { useEffect } from "react";

export default function ChunkErrorRecovery({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const handleError = (e: ErrorEvent) => {
            // Detect ChunkLoadError which typically happens when browser tries to load old chunk versions
            if (e.message && (
                e.message.toLowerCase().includes("chunkloaderror") || 
                e.message.toLowerCase().includes("loading chunk") ||
                e.message.toLowerCase().includes("failed to fetch")
            )) {
                console.warn("[UrbanShield] ChunkLoadError detected. Attempting automated recovery via refresh...");
                
                // Track reload attempts to prevent infinite loop
                const lastReload = sessionStorage.getItem("urbanshield_chunk_reload");
                const now = Date.now();
                
                // Only auto-reload if we haven't reloaded in the last 10 seconds
                if (!lastReload || (now - parseInt(lastReload)) > 10000) {
                    sessionStorage.setItem("urbanshield_chunk_reload", now.toString());
                    window.location.reload();
                } else {
                    console.error("[UrbanShield] Multiple chunk load failures detected. Auto-refresh aborted to prevent loop.");
                }
            }
        };

        window.addEventListener("error", handleError);
        return () => window.removeEventListener("error", handleError);
    }, []);

    return <>{children}</>;
}

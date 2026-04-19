"use client";

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

export default function ARVRSimulation() {
    const [mode, setMode] = useState<"Flood" | "Heatwave">("Flood");
    const [isAFrameLoaded, setIsAFrameLoaded] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Using A-Frame via CDN to avoid heavy dependency issues in Next.js
    // We only mount the immersive scene when the user clicks 'Enter Virtual Reality'

    // In React/Next, custom HTML elements (like <a-scene>) cause TS errors unless typed.
    // Instead of messing with global types for a demo, we safely inject the HTML when active.

    const floodHtml = `
        <a-scene embedded style="height: 500px; width: 100%;">
            <a-sky color="#1E293B"></a-sky>
            <a-plane position="0 0 -4" rotation="-90 0 0" width="100" height="100" color="#0f172a"></a-plane>
            
            <!-- Rising Water Plane -->
            <a-plane position="0 1 -4" rotation="-90 0 0" width="100" height="100" color="#3b82f6" opacity="0.8" material="transparent: true"
                animation="property: position; to: 0 4 -4; dur: 10000; loop: true; dir: alternate">
            </a-plane>

            <!-- Buildings representing city -->
            <a-box position="-3 2 -5" depth="2" height="10" width="2" color="#64748b"></a-box>
            <a-box position="3 2 -6" depth="3" height="15" width="2.5" color="#475569"></a-box>
            <a-box position="0 2 -8" depth="2" height="8" width="4" color="#94a3b8"></a-box>

            <!-- UI Text in VR -->
            <a-text value="URBANSHIELD ALERT:\nCRITICAL FLOOD EXPECTED" color="#ef4444" position="-2 6 -4" scale="1.5 1.5 1.5"></a-text>

            <a-entity camera look-controls position="0 1.6 0"></a-entity>
        </a-scene>
    `;

    const heatHtml = `
        <a-scene embedded style="height: 500px; width: 100%;">
            <!-- Intense red sky indicating extreme heat/haze -->
            <a-sky color="#991b1b"></a-sky> 
            <a-plane position="0 0 -4" rotation="-90 0 0" width="100" height="100" color="#fcd34d"></a-plane>
            
            <!-- Heat haze effect (simplified with oscillating opacity plane) -->
            <a-plane position="0 2 -3" width="10" height="5" color="#ef4444" opacity="0.3" material="transparent: true"
                animation="property: opacity; from: 0.1; to: 0.5; dur: 2000; loop: true; dir: alternate">
            </a-plane>

            <!-- Buildings -->
            <a-box position="-3 2 -5" depth="2" height="10" width="2" color="#b45309"></a-box>
            <a-box position="3 2 -6" depth="3" height="15" width="2.5" color="#92400e"></a-box>
            
            <a-text value="THERMAL STRESS:\n48 DEGREE C WET BULB" color="#ffffff" position="-1.5 5 -4" scale="1.5 1.5 1.5"></a-text>

            <a-entity camera look-controls position="0 1.6 0"></a-entity>
        </a-scene>
    `;

    return (
        <div className="w-full bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <Script
                src="https://aframe.io/releases/1.4.2/aframe.min.js"
                strategy="lazyOnload"
                onLoad={() => setIsAFrameLoaded(true)}
            />

            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-wider text-white">Immersive Risk Viz</h2>
                    <p className="text-xs text-red-400 uppercase tracking-widest mt-1">Experimental 360° AR/VR</p>
                </div>
                {isActive && (
                    <div className="flex gap-2">
                        <button onClick={() => setMode("Flood")} className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded ${mode === "Flood" ? "bg-blue-500 text-white" : "bg-white/5 text-white/50"}`}>Flood</button>
                        <button onClick={() => setMode("Heatwave")} className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded ${mode === "Heatwave" ? "bg-orange-500 text-white" : "bg-white/5 text-white/50"}`}>Heatwave</button>
                    </div>
                )}
            </div>

            <div className="relative w-full h-[500px] bg-black flex flex-col justify-center items-center">
                {!isActive ? (
                    <div className="text-center z-10 px-4">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full border border-[var(--color-accent)]/30 flex items-center justify-center bg-[var(--color-accent)]/5">
                            <span className="text-4xl">🥽</span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4">Enter Immersive Mode</h3>
                        <p className="text-white/60 mb-8 max-w-md mx-auto">Experience simulated disaster telemetry in full 360-degrees. Use your mouse to drag the camera, or view on a mobile device for gyroscope control.</p>

                        <button
                            onClick={() => setIsActive(true)}
                            disabled={!isAFrameLoaded}
                            className="bg-[var(--color-accent)] text-[var(--color-navy)] px-8 py-3 rounded text-sm font-black uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAFrameLoaded ? "Launch Simulation" : "Loading VR Engine..."}
                        </button>
                    </div>
                ) : (
                    <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: mode === "Flood" ? floodHtml : heatHtml }}
                    />
                )}
            </div>
        </div>
    );
}

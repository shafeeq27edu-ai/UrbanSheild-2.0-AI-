"use client";

import React from 'react';
import { GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Synthetic GeoJSON mapping for the required River Basins extending across the Indian subcontinent
const basinsGeoJSON: any = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { name: "Ganga Basin", riskLevel: "Critical" },
            geometry: {
                type: "Polygon",
                // Rough coordinate bounding polygon
                coordinates: [[[78.0, 29.0], [88.0, 25.0], [88.0, 22.0], [78.0, 25.0], [78.0, 29.0]]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Brahmaputra Basin", riskLevel: "High" },
            geometry: {
                type: "Polygon",
                coordinates: [[[88.5, 27.5], [96.0, 28.0], [94.0, 25.5], [89.0, 25.0], [88.5, 27.5]]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Godavari Basin", riskLevel: "Moderate" },
            geometry: {
                type: "Polygon",
                coordinates: [[[73.5, 19.5], [82.0, 17.5], [81.0, 16.0], [74.0, 18.0], [73.5, 19.5]]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Yamuna Basin", riskLevel: "Low" },
            geometry: {
                type: "Polygon",
                coordinates: [[[77.5, 29.5], [80.5, 26.5], [79.5, 25.5], [77.0, 28.5], [77.5, 29.5]]]
            }
        }
    ]
};

export default function IndiaRiverBasinOverlay() {
    // Dynamically style each basin according to its risk level, aligning with UrbanShield aesthetic
    const styleFunction = (feature: any) => {
        const risk = feature.properties.riskLevel;
        let color = "var(--color-navy)"; // Default boundary stroke
        let fillColor = "transparent";

        if (risk === "Critical") {
            color = "#dc2626"; // red-600
            fillColor = "#ef4444"; // red-500
        } else if (risk === "High") {
            color = "#ea580c"; // orange-600
            fillColor = "var(--color-accent)"; // gold theme
        } else if (risk === "Moderate") {
            color = "#ca8a04"; // yellow-600
            fillColor = "#facc15"; // yellow-400
        } else if (risk === "Low") {
            color = "var(--color-forest)";
            fillColor = "#4ade80"; // green-400
        }

        return {
            color: color,
            fillColor: fillColor,
            fillOpacity: 0.35,
            weight: 2,
            opacity: 0.9,
            dashArray: "4 4" // Dotted indication of risk areas
        };
    };

    // Attach interaction tooltips for visual clarity on maps
    const onEachFeature = (feature: any, layer: any) => {
        if (feature.properties && feature.properties.name) {
            const popupContent = `
                <div style="font-family: inherit; min-width: 140px;">
                    <strong style="color: var(--color-navy); font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">
                        ${feature.properties.name}
                    </strong>
                    <div style="margin-top: 4px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 4px; font-size: 11px; font-weight: bold; color: #4a5568;">
                        Hydrological Stress: <span style="color: ${feature.properties.riskLevel === 'Critical' ? '#dc2626' : 'inherit'}">${feature.properties.riskLevel}</span>
                    </div>
                </div>
            `;
            layer.bindPopup(popupContent);
        }
    };

    return (
        <GeoJSON
            data={basinsGeoJSON}
            style={styleFunction as any}
            onEachFeature={onEachFeature}
        />
    );
}

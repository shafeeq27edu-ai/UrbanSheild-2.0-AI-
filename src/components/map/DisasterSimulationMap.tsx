"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true, duration: 1.5 });
    }, [center, zoom, map]);
    return <></>;
}

export default function DisasterSimulationMap({ activeStep }: { activeStep: any }) {
    return (
        <MapContainer
            center={activeStep.mapState.center as [number, number]}
            zoom={activeStep.mapState.zoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <MapController center={activeStep.mapState.center as [number, number]} zoom={activeStep.mapState.zoom} />

            {activeStep.mapState.overlays.map((overlay: any, i: number) => {
                let colorHex = overlay.color;
                if (overlay.color === 'blue') colorHex = '#3b82f6';
                if (overlay.color === 'red') colorHex = '#ef4444';
                if (overlay.color === 'orange') colorHex = '#f97316';
                if (overlay.color === 'green') colorHex = '#22c55e';
                if (overlay.color === 'black') colorHex = '#000000';

                if (overlay.type === 'circle') {
                    return (
                        <Circle
                            key={`${activeStep.hour}-${i}`}
                            center={overlay.coordinates as [number, number]}
                            radius={1500}
                            pathOptions={{ color: colorHex, fillColor: colorHex, fillOpacity: 0.4, weight: 2 }}
                        />
                    );
                } else if (overlay.type === 'polygon') {
                    return (
                        <Polygon
                            key={`${activeStep.hour}-${i}`}
                            positions={overlay.coordinates as [number, number][]}
                            pathOptions={{ color: colorHex, fillColor: colorHex, fillOpacity: 0.5, weight: 2 }}
                        />
                    );
                }
                return null;
            })}
        </MapContainer>
    );
}

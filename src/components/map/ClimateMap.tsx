"use client";

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSimulationStore } from '@/store/useSimulationStore';
import { useRiskIntelligence } from '@/hooks/useRiskIntelligence';
import { generateSyntheticZones } from '@/engines/predictionEngine';
import { FeatureCollection, Point } from 'geojson';

// placeholder token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function ClimateMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const { viewMode, focusedZoneId } = useSimulationStore();
    const { results } = useRiskIntelligence();

    const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
        'urban': true,
        'flood': true,
        'ndvi': false,
        'river': false,
        'historical': false
    });

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v12', // Upgraded to satellite imagery
            center: [77.59, 12.97], // Fixed Credibility Bug: Bengaluru default instead of NYC (-74.006, 40.7128)
            zoom: 11,
            pitch: 45,
            bearing: -17.6,
            antialias: true
        });

        map.current.on('load', () => {
            if (!map.current) return;

            // Add 3D buildings
            const layers = map.current.getStyle()?.layers;
            const labelLayerId = layers?.find(
                (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
            )?.id;

            map.current.addLayer(
                {
                    'id': 'add-3d-buildings',
                    'source': 'composite',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'minzoom': 15,
                    'paint': {
                        'fill-extrusion-color': '#334155',
                        'fill-extrusion-height': ['get', 'height'],
                        'fill-extrusion-base': ['get', 'min_height'],
                        'fill-extrusion-opacity': 0.6
                    }
                },
                labelLayerId
            );

            // Add dynamic risk source
            map.current.addSource('risk-zones', {
                type: 'geojson',
                data: generateSyntheticZones()
            });

            map.current.addLayer({
                id: 'risk-heat',
                type: 'heatmap',
                source: 'risk-zones',
                paint: {
                    'heatmap-weight': ['get', 'risk'],
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        1,
                        15,
                        3
                    ],
                    'heatmap-radius': 60,
                    'heatmap-opacity': 0.8
                }
            });
        });

        map.current.on('click', (e) => {
            if (!map.current) return;
            const features = map.current.queryRenderedFeatures(e.point, {
                layers: ['risk-heat']
            });

            if (features.length > 0) {
                const zoneId = features[0].properties?.id;
                const coords = features[0].geometry as any;
                if (zoneId && coords.coordinates) {
                    useSimulationStore.getState().setFocusedZoneId(zoneId);
                    map.current.flyTo({
                        center: coords.coordinates,
                        zoom: 14,
                        pitch: 60,
                        duration: 2000,
                        essential: true
                    });
                }
            } else {
                // handle desalination of focused zone when clicking empty space
                useSimulationStore.getState().setFocusedZoneId(null);
                map.current.flyTo({
                    center: [77.59, 12.97],
                    zoom: 11,
                    pitch: 45,
                    duration: 1500
                });
            }
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    // Update heatmap based on simulation intelligence
    useEffect(() => {
        if (!map.current || !map.current.isStyleLoaded()) return;

        // Update data with latest scores from results hook
        const updatedData: FeatureCollection<Point> = generateSyntheticZones();
        updatedData.features = updatedData.features.map(f => {
            const zoneData = results.find(r => r.id === f.properties?.id);
            return {
                ...f,
                properties: {
                    ...f.properties,
                    risk: viewMode === 'flood' ? zoneData?.flood.score || 0 : zoneData?.heat.score || 0
                }
            };
        });

        (map.current.getSource('risk-zones') as mapboxgl.GeoJSONSource).setData(updatedData);

        // Selection Highlight Layer
        if (!map.current.getLayer('zone-highlight')) {
            map.current.addLayer({
                id: 'zone-highlight',
                type: 'circle',
                source: 'risk-zones',
                paint: {
                    'circle-radius': 120,
                    'circle-color': 'transparent',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#3b82f6',
                    'circle-stroke-opacity': [
                        'case',
                        ['==', ['get', 'id'], focusedZoneId || ''],
                        1,
                        0
                    ],
                }
            });
        } else {
            map.current.setPaintProperty('zone-highlight', 'circle-stroke-opacity', [
                'case',
                ['==', ['get', 'id'], focusedZoneId || ''],
                1,
                0
            ]);
        }

        // Dynamic color scaling
        const colorScale: any = viewMode === 'flood'
            ? [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(0,0,255,0)',
                0.2, 'rgba(0,120,255,0.4)',
                0.5, 'rgba(0,255,255,0.7)',
                0.8, 'rgba(255,255,255,0.8)',
                1, 'rgba(255,255,255,1)'
            ]
            : [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(255,0,0,0)',
                0.2, 'rgba(255,100,0,0.4)',
                0.5, 'rgba(255,50,0,0.7)',
                0.8, 'rgba(255,255,0,0.8)',
                1, 'rgba(255,255,255,1)'
            ];

        map.current.setPaintProperty('risk-heat', 'heatmap-color', colorScale);
    }, [results, viewMode, focusedZoneId]);

    // Layer Visibility Sync
    useEffect(() => {
        if (!map.current || !map.current.isStyleLoaded()) return;

        const toggleLayer = (layerId: string, isVisible: boolean) => {
            if (map.current?.getLayer(layerId)) {
                map.current.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
            }
        };

        toggleLayer('add-3d-buildings', activeLayers['urban']);
        toggleLayer('risk-heat', activeLayers['flood']);

        // Ensure Highlight layer exists before toggling
        if (map.current.getLayer('zone-highlight')) {
            toggleLayer('zone-highlight', activeLayers['flood']);
        }

        // Lazy load NDVI Layer
        if (!map.current.getSource('ndvi-source') && activeLayers['ndvi']) {
            map.current.addSource('ndvi-source', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[77.5, 12.8], [77.7, 12.8], [77.7, 13.1], [77.5, 13.1], [77.5, 12.8]]] } }]
                }
            });
            map.current.addLayer({
                id: 'ndvi-layer',
                type: 'fill',
                source: 'ndvi-source',
                paint: { 'fill-color': '#22c55e', 'fill-opacity': 0.15 }
            });
        }
        toggleLayer('ndvi-layer', activeLayers['ndvi']);

        // Lazy load River Basins Layer
        if (!map.current.getSource('river-source') && activeLayers['river']) {
            map.current.addSource('river-source', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[77.52, 13.05], [77.55, 12.95], [77.50, 12.85], [77.45, 12.75]] } }]
                }
            });
            map.current.addLayer({
                id: 'river-layer',
                type: 'line',
                source: 'river-source',
                paint: { 'line-color': '#3b82f6', 'line-width': 4, 'line-opacity': 0.8 }
            });
        }
        toggleLayer('river-layer', activeLayers['river']);

        // Lazy load Historical Flood Layer
        if (!map.current.getSource('historical-source') && activeLayers['historical']) {
            map.current.addSource('historical-source', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[77.64, 12.91], [77.69, 12.91], [77.69, 12.96], [77.64, 12.96], [77.64, 12.91]]] } }]
                }
            });
            map.current.addLayer({
                id: 'historical-layer',
                type: 'fill',
                source: 'historical-source',
                paint: { 'fill-color': '#1d4ed8', 'fill-opacity': 0.3 }
            });
        }
        toggleLayer('historical-layer', activeLayers['historical']);

    }, [activeLayers]);

    return (
        <div className="relative h-full w-full">
            <div ref={mapContainer} id="map-container" className="h-full w-full" />

            {/* Layers Control Panel */}
            <div className="absolute top-4 right-4 z-20 bg-[var(--color-navy)]/90 backdrop-blur border border-[var(--color-accent)]/30 p-4 rounded-lg shadow-xl w-64 pointer-events-auto">
                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-accent)] mb-3 border-b border-[var(--color-accent)]/20 pb-2">Map Layers</h3>
                <div className="space-y-2">
                    {Object.entries({
                        'urban': 'Urban Map (3D Buildings)',
                        'flood': 'Risk & Flood Zones',
                        'ndvi': 'NDVI Vegetation Stress',
                        'river': 'Major River Basins',
                        'historical': 'Historical Flood Extents'
                    }).map(([key, label]) => (
                        <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={activeLayers[key]}
                                    onChange={() => setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }))}
                                />
                                <div className={`w-8 h-4 bg-black/50 rounded-full border ${activeLayers[key] ? 'border-[var(--color-accent)]' : 'border-white/20'} transition-colors`}>
                                    <div className={`w-3 h-3 bg-[var(--color-accent)] rounded-full absolute top-0.5 transition-transform ${activeLayers[key] ? 'translate-x-4' : 'translate-x-0.5 opacity-30'}`} />
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeLayers[key] ? 'text-white' : 'text-white/50 group-hover:text-white/70'} transition-colors`}>
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.3)_100%)]" />
        </div>
    );
}

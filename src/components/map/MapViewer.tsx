"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Map as MapLibreMap,
  NavigationControl,
  ScaleControl,
  AttributionControl,
  GeoJSONSource,
  StyleSpecification
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { FortyGuardReading } from '../../types/fortyguard';
import { AuditedBuilding } from '../../types/simulation';
import { H3Service } from '../../server/services/h3-service';
import { getThermalColorRgba, CityPreset } from '../../lib/map-presets';
import Map3DControls from './Map3DControls';

interface MapViewerProps {
  selectedCity: CityPreset;
  readings: FortyGuardReading[];
  buildings: AuditedBuilding[];
  activeLayers: {
    ambientThermal: boolean;
    buildings3D: boolean;
    treeCanopy: boolean;
    satellite: boolean;
    curingRisk: boolean;
  };
  onSelectHex?: (reading: FortyGuardReading) => void;
  onSelectBuilding?: (building: AuditedBuilding) => void;
}

// -------------------------------------------------------------
// Google Earth 3D Photorealistic Satellite & Realistic Textured Structures
// -------------------------------------------------------------
const GOOGLE_EARTH_3D_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics'
    },
    'openmaptiles': {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet'
    }
  },
  light: {
    anchor: 'map',
    color: '#fffbeb',
    intensity: 0.65,
    position: [1.4, 140, 48]
  },
  layers: [
    {
      id: 'satellite-basemap',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 20
    },
    {
      id: 'city-3d-buildings',
      type: 'fill-extrusion',
      source: 'openmaptiles',
      'source-layer': 'building',
      minzoom: 9, // Visible from zoom 9 all the way in to zoom 20!
      paint: {
        'fill-extrusion-color': [
          'case',
          ['has', 'colour'], ['get', 'colour'],
          ['has', 'building:colour'], ['get', 'building:colour'],
          [
            'match',
            ['coalesce', ['get', 'building:material'], ['get', 'material'], ''],
            'glass', '#38bdf8',
            'mirror', '#7dd3fc',
            'brick', '#b45309',
            'stone', '#94a3b8',
            'concrete', '#cbd5e1',
            'wood', '#d97706',
            'metal', '#64748b',
            [
              'interpolate', ['linear'], ['coalesce', ['get', 'render_height'], ['get', 'height'], 15],
              0, '#f1f5f9',
              15, '#e2e8f0',
              35, '#cbd5e1',
              80, '#94a3b8',
              150, '#38bdf8',
              300, '#0284c7',
              500, '#0369a1'
            ]
          ]
        ],
        'fill-extrusion-height': [
          'coalesce',
          ['get', 'render_height'],
          ['get', 'height'],
          ['*', ['get', 'levels'], 3.5],
          12
        ],
        'fill-extrusion-base': [
          'coalesce',
          ['get', 'render_min_height'],
          ['get', 'min_height'],
          0
        ],
        'fill-extrusion-opacity': 0.94
      }
    }
  ]
};

// -------------------------------------------------------------
// Dark Matter 3D Thermal Twin Style
// -------------------------------------------------------------
const DARK_MATTER_3D_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    },
    'openmaptiles': {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet'
    }
  },
  light: {
    anchor: 'viewport',
    color: '#93c5fd',
    intensity: 0.50,
    position: [1.2, 210, 55]
  },
  layers: [
    {
      id: 'carto-dark-basemap',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20
    },
    {
      id: 'city-3d-buildings',
      type: 'fill-extrusion',
      source: 'openmaptiles',
      'source-layer': 'building',
      minzoom: 9, // Visible from zoom 9 all the way in to zoom 20!
      paint: {
        'fill-extrusion-color': [
          'interpolate', ['linear'], ['coalesce', ['get', 'render_height'], ['get', 'height'], 15],
          0, '#1e293b',
          30, '#334155',
          80, '#475569',
          180, '#0f766e',
          350, '#06b6d4'
        ],
        'fill-extrusion-height': [
          'coalesce',
          ['get', 'render_height'],
          ['get', 'height'],
          ['*', ['get', 'levels'], 3.5],
          12
        ],
        'fill-extrusion-base': [
          'coalesce',
          ['get', 'render_min_height'],
          ['get', 'min_height'],
          0
        ],
        'fill-extrusion-opacity': 0.88
      }
    }
  ]
};

export default function MapViewer({
  selectedCity,
  readings,
  buildings,
  activeLayers,
  onSelectHex,
  onSelectBuilding
}: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const isInitialMount = useRef(true);
  const orbitFrameId = useRef<number | null>(null);

  // 3D Camera & Viewer State (Smoothly clamped between 0° and 60° max)
  const [is3D, setIs3D] = useState(true);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [currentPitch, setCurrentPitch] = useState(60);

  // Hover Tooltip Info
  const [hoveredInfo, setHoveredInfo] = useState<{
    x: number;
    y: number;
    type: 'hex' | 'building';
    data: any;
  } | null>(null);

  // Helper to synchronize all thermal and asset layers
  const syncMapLayers = useCallback((
    m: MapLibreMap,
    thermalReadings: FortyGuardReading[],
    auditedBuildings: AuditedBuilding[],
    layers: typeof activeLayers
  ) => {
    if (!m.isStyleLoaded()) return;

    // Toggle 3D city vector buildings
    if (m.getLayer('city-3d-buildings')) {
      m.setLayoutProperty(
        'city-3d-buildings',
        'visibility',
        layers.buildings3D ? 'visible' : 'none'
      );
    }

    // -------------------------------------------------------------
    // 1. Build H3 Thermal Hexagon Prisms GeoJSON
    // -------------------------------------------------------------
    const hexFeatures: GeoJSON.Feature[] = thermalReadings.map(r => {
      const polygonCoords = H3Service.cellToGeoJSONPolygon(r.h3Index);
      const color = getThermalColorRgba(r.temp2mF);
      const colorRgbaStr = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${r.isHotspot ? 0.90 : 0.65})`;

      return {
        type: 'Feature',
        id: r.h3Index,
        geometry: {
          type: 'Polygon',
          coordinates: [polygonCoords]
        },
        properties: {
          h3Index: r.h3Index,
          temp2mF: r.temp2mF,
          temp2mC: r.temp2mC,
          surfaceTempF: r.surfaceTempF,
          disparityF: r.disparityF,
          isHotspot: r.isHotspot,
          spikeDeltaF: r.spikeDeltaF,
          color: colorRgbaStr,
          height: r.isHotspot ? 110 : 35
        }
      };
    });

    const hexGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: hexFeatures
    };

    const existingHexSource = m.getSource('h3-thermal-source') as GeoJSONSource | undefined;
    if (existingHexSource) {
      existingHexSource.setData(hexGeoJSON);
    } else {
      m.addSource('h3-thermal-source', {
        type: 'geojson',
        data: hexGeoJSON
      });

      // 3D Extruded H3 Hexagon Columns
      m.addLayer({
        id: 'h3-thermal-extrusion',
        type: 'fill-extrusion',
        source: 'h3-thermal-source',
        paint: {
          'fill-extrusion-color': ['get', 'color'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.88
        }
      });

      // Hexagon Outline Layer
      m.addLayer({
        id: 'h3-thermal-outline',
        type: 'line',
        source: 'h3-thermal-source',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.4,
          'line-opacity': 0.65
        }
      });

      // Mouse events for H3 tooltips
      m.on('mousemove', 'h3-thermal-extrusion', (e) => {
        if (!e.features || !e.features[0]) return;
        m.getCanvas().style.cursor = 'pointer';
        const props = e.features[0].properties as any;
        setHoveredInfo({
          x: e.point.x,
          y: e.point.y,
          type: 'hex',
          data: props
        });
      });

      m.on('mouseleave', 'h3-thermal-extrusion', () => {
        m.getCanvas().style.cursor = '';
        setHoveredInfo(null);
      });

      m.on('click', 'h3-thermal-extrusion', (e) => {
        if (!e.features || !e.features[0]) return;
        const hexId = e.features[0].properties?.h3Index;
        const found = thermalReadings.find(r => r.h3Index === hexId);
        if (found && onSelectHex) onSelectHex(found);
      });
    }

    if (m.getLayer('h3-thermal-extrusion')) {
      m.setLayoutProperty(
        'h3-thermal-extrusion',
        'visibility',
        layers.ambientThermal ? 'visible' : 'none'
      );
    }
    if (m.getLayer('h3-thermal-outline')) {
      m.setLayoutProperty(
        'h3-thermal-outline',
        'visibility',
        layers.ambientThermal ? 'visible' : 'none'
      );
    }

    // -------------------------------------------------------------
    // 2. Build FortyGuard Audited Asset Envelopes GeoJSON
    // -------------------------------------------------------------
    const buildingFeatures: GeoJSON.Feature[] = auditedBuildings.map(b => {
      const size = Math.sqrt(b.roofAreaSqm) / 105000;
      const poly = [
        [b.lng - size / 2, b.lat - size / 2],
        [b.lng + size / 2, b.lat - size / 2],
        [b.lng + size / 2, b.lat + size / 2],
        [b.lng - size / 2, b.lat + size / 2],
        [b.lng - size / 2, b.lat - size / 2]
      ];

      const roofColor = b.currentAlbedo < 0.15 
        ? '#ef4444' 
        : b.currentAlbedo < 0.25 
        ? '#f97316' 
        : '#06b6d4';

      return {
        type: 'Feature',
        id: b.id,
        geometry: {
          type: 'Polygon',
          coordinates: [poly]
        },
        properties: {
          id: b.id,
          name: b.name,
          height: b.heightMeters,
          roofAreaSqm: b.roofAreaSqm,
          currentAlbedo: b.currentAlbedo,
          canopy50mCoveragePct: b.canopy50mCoveragePct,
          priorityScore: b.priorityScore,
          hvacPenaltyKw: b.hvacPenaltyKw,
          recommendedAction: b.recommendedAction,
          color: roofColor
        }
      };
    });

    const buildingGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: buildingFeatures
    };

    const existingBuildingSource = m.getSource('osm-audited-buildings') as GeoJSONSource | undefined;
    if (existingBuildingSource) {
      existingBuildingSource.setData(buildingGeoJSON);
    } else {
      m.addSource('osm-audited-buildings', {
        type: 'geojson',
        data: buildingGeoJSON
      });

      // Prominent 3D Extrusion for Audited High-Risk Assets
      m.addLayer({
        id: 'audited-buildings-extrusion',
        type: 'fill-extrusion',
        source: 'osm-audited-buildings',
        paint: {
          'fill-extrusion-color': ['get', 'color'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.96
        }
      });

      m.on('mousemove', 'audited-buildings-extrusion', (e) => {
        if (!e.features || !e.features[0]) return;
        m.getCanvas().style.cursor = 'pointer';
        const props = e.features[0].properties as any;
        setHoveredInfo({
          x: e.point.x,
          y: e.point.y,
          type: 'building',
          data: props
        });
      });

      m.on('mouseleave', 'audited-buildings-extrusion', () => {
        m.getCanvas().style.cursor = '';
        setHoveredInfo(null);
      });

      m.on('click', 'audited-buildings-extrusion', (e) => {
        if (!e.features || !e.features[0]) return;
        const bldgId = e.features[0].properties?.id;
        const found = auditedBuildings.find(b => b.id === bldgId);
        if (found && onSelectBuilding) onSelectBuilding(found);
      });
    }

    if (m.getLayer('audited-buildings-extrusion')) {
      m.setLayoutProperty(
        'audited-buildings-extrusion',
        'visibility',
        layers.buildings3D ? 'visible' : 'none'
      );
    }

    // -------------------------------------------------------------
    // 3. Build 50m Tree Canopy Buffers GeoJSON
    // -------------------------------------------------------------
    const canopyFeatures: GeoJSON.Feature[] = auditedBuildings.map(b => {
      const radiusDeg = 0.00055;
      const points = 24;
      const ring: [number, number][] = [];
      for (let i = 0; i <= points; i++) {
        const theta = (i / points) * (2 * Math.PI);
        ring.push([
          b.lng + radiusDeg * Math.cos(theta),
          b.lat + radiusDeg * 0.85 * Math.sin(theta)
        ]);
      }

      return {
        type: 'Feature',
        id: `canopy-${b.id}`,
        geometry: {
          type: 'Polygon',
          coordinates: [ring]
        },
        properties: {
          bldgId: b.id,
          coveragePct: b.canopy50mCoveragePct
        }
      };
    });

    const canopyGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: canopyFeatures
    };

    const existingCanopySource = m.getSource('tree-canopy-source') as GeoJSONSource | undefined;
    if (existingCanopySource) {
      existingCanopySource.setData(canopyGeoJSON);
    } else {
      m.addSource('tree-canopy-source', {
        type: 'geojson',
        data: canopyGeoJSON
      });

      m.addLayer({
        id: 'tree-canopy-fill',
        type: 'fill',
        source: 'tree-canopy-source',
        paint: {
          'fill-color': '#10b981',
          'fill-opacity': 0.30
        }
      });

      m.addLayer({
        id: 'tree-canopy-outline',
        type: 'line',
        source: 'tree-canopy-source',
        paint: {
          'line-color': '#34d399',
          'line-width': 1.8,
          'line-dasharray': [2, 2],
          'line-opacity': 0.85
        }
      });
    }

    if (m.getLayer('tree-canopy-fill')) {
      m.setLayoutProperty(
        'tree-canopy-fill',
        'visibility',
        layers.treeCanopy ? 'visible' : 'none'
      );
    }
    if (m.getLayer('tree-canopy-outline')) {
      m.setLayoutProperty(
        'tree-canopy-outline',
        'visibility',
        layers.treeCanopy ? 'visible' : 'none'
      );
    }
  }, [onSelectHex, onSelectBuilding]);

  // Initialize MapLibre GL Map Instance (With pitch clamped to 60° max)
  useEffect(() => {
    if (!mapContainer.current) return;

    const initialStyle = activeLayers.satellite ? GOOGLE_EARTH_3D_STYLE : DARK_MATTER_3D_STYLE;

    const mapInstance = new MapLibreMap({
      container: mapContainer.current,
      style: initialStyle,
      center: [selectedCity.coordinates.longitude, selectedCity.coordinates.latitude],
      zoom: selectedCity.coordinates.zoom,
      pitch: 60, // locked to 60 degrees default
      maxPitch: 60, // strictly clamp maximum pitch to 60 degrees
      minPitch: 0,
      bearing: selectedCity.coordinates.bearing || -25,
      attributionControl: false,
      dragRotate: true,
      touchPitch: true,
      pitchWithRotate: true
    });

    mapInstance.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');
    mapInstance.addControl(new ScaleControl(), 'bottom-right');
    mapInstance.addControl(new AttributionControl({ compact: true }), 'bottom-left');

    mapInstance.on('load', () => {
      syncMapLayers(mapInstance, readings, buildings, activeLayers);
    });

    mapInstance.on('pitch', () => {
      const p = Math.min(60, Math.round(mapInstance.getPitch()));
      setCurrentPitch(p);
    });

    map.current = mapInstance;

    return () => {
      if (orbitFrameId.current) {
        cancelAnimationFrame(orbitFrameId.current);
      }
      mapInstance.remove();
    };
  }, []);

  // Update camera center smoothly when the selected city changes
  const cityId = selectedCity.id;
  const lng = selectedCity.coordinates.longitude;
  const lat = selectedCity.coordinates.latitude;
  const zoom = selectedCity.coordinates.zoom;
  const bearing = selectedCity.coordinates.bearing || -25;

  useEffect(() => {
    if (!map.current) return;
    map.current.flyTo({
      center: [lng, lat],
      zoom,
      pitch: 60,
      bearing,
      essential: true,
      duration: 2000
    });
  }, [cityId, lng, lat, zoom, bearing]);

  // Handle dynamic map style switching (Google Earth 3D Satellite vs Dark Matter Thermal)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!map.current) return;

    const targetStyle = activeLayers.satellite ? GOOGLE_EARTH_3D_STYLE : DARK_MATTER_3D_STYLE;

    const handleStyleLoad = () => {
      if (map.current) {
        syncMapLayers(map.current, readings, buildings, activeLayers);
      }
    };

    map.current.once('style.load', handleStyleLoad);
    map.current.setStyle(targetStyle);

    return () => {
      if (map.current) {
        map.current.off('style.load', handleStyleLoad);
      }
    };
  }, [activeLayers.satellite, syncMapLayers, readings, buildings, activeLayers]);

  // Update layers when data or layer toggles change
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    syncMapLayers(map.current, readings, buildings, activeLayers);
  }, [readings, buildings, activeLayers, syncMapLayers]);

  // 3D Perspective Mode Toggle (0° Orthographic Plan vs 60° 3D Google Earth Tilt)
  const handleToggle3D = () => {
    if (!map.current) return;
    const nextIs3D = !is3D;
    setIs3D(nextIs3D);

    map.current.easeTo({
      pitch: nextIs3D ? 60 : 0, // stops strictly at 60 degrees
      duration: 800
    });
  };

  // Street Level Drone View (Immersive 3D Urban Canyon, smoothly locked to 60°)
  const handleStreetLevelView = () => {
    if (!map.current) return;
    setIs3D(true);
    map.current.flyTo({
      pitch: 60, // smoothly stops at 60 degrees
      zoom: 16.2,
      bearing: map.current.getBearing() + 35,
      duration: 1500
    });
  };

  // Adjust Pitch Tilt (smoothly clamped between 0° and 60°)
  const handleAdjustPitch = (delta: number) => {
    if (!map.current) return;
    const newPitch = Math.min(60, Math.max(0, map.current.getPitch() + delta));
    map.current.easeTo({
      pitch: newPitch,
      duration: 350
    });
    setCurrentPitch(newPitch);
    setIs3D(newPitch > 10);
  };

  // Reset North Compass
  const handleResetNorth = () => {
    if (!map.current) return;
    map.current.easeTo({
      bearing: 0,
      duration: 500
    });
  };

  // Cinematic 360 Orbit Animation
  const handleToggleOrbit = () => {
    if (!map.current) return;
    const nextOrbit = !isOrbiting;
    setIsOrbiting(nextOrbit);

    if (nextOrbit) {
      const rotateCamera = () => {
        if (!map.current) return;
        const currentBearing = map.current.getBearing();
        map.current.setBearing((currentBearing + 0.16) % 360);
        orbitFrameId.current = requestAnimationFrame(rotateCamera);
      };
      orbitFrameId.current = requestAnimationFrame(rotateCamera);
    } else {
      if (orbitFrameId.current) {
        cancelAnimationFrame(orbitFrameId.current);
        orbitFrameId.current = null;
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* WebGL Canvas Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating Google Earth 3D Navigation Controls */}
      <div className="absolute top-20 left-6 z-20 hidden md:block">
        <Map3DControls
          is3D={is3D}
          isOrbiting={isOrbiting}
          currentPitch={currentPitch}
          onToggle3D={handleToggle3D}
          onToggleOrbit={handleToggleOrbit}
          onAdjustPitch={handleAdjustPitch}
          onResetNorth={handleResetNorth}
          onStreetLevelView={handleStreetLevelView}
        />
      </div>

      {/* Interactive 3D Tooltip */}
      {hoveredInfo && (
        <div
          className="absolute z-40 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4 transition-all duration-75"
          style={{ left: hoveredInfo.x, top: hoveredInfo.y }}
        >
          <div className="bg-slate-950/95 text-white text-xs p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-xl min-w-[240px] ring-1 ring-white/10">
            {hoveredInfo.type === 'hex' ? (
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-bold text-blue-400">H3 Hex {hoveredInfo.data.h3Index?.slice(-6)}</span>
                  </div>
                  {hoveredInfo.data.isHotspot && (
                    <span className="bg-red-500/20 text-red-300 font-extrabold px-2 py-0.5 rounded-full text-[10px] border border-red-500/40">
                      HOTSPOT
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">2m Ambient Air:</span>
                    <span className="font-extrabold text-amber-300">{hoveredInfo.data.temp2mF}°F ({hoveredInfo.data.temp2mC}°C)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Satellite Skin LST:</span>
                    <span className="text-slate-300">{hoveredInfo.data.surfaceTempF}°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Surface Disparity:</span>
                    <span className="text-red-400 font-bold">+{hoveredInfo.data.disparityF}°F</span>
                  </div>
                  {hoveredInfo.data.isHotspot && (
                    <div className="flex justify-between text-[11px] pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Spike Anomaly:</span>
                      <span className="text-orange-300 font-semibold">+{hoveredInfo.data.spikeDeltaF}°F</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="font-bold text-emerald-400">{hoveredInfo.data.name || 'Building Envelope'}</span>
                  </div>
                  <span className="bg-orange-500/20 text-orange-300 font-bold px-2 py-0.5 rounded-full text-[10px] border border-orange-500/40">
                    Priority {hoveredInfo.data.priorityScore}/100
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Roof Footprint:</span>
                    <span className="font-semibold text-slate-200">{hoveredInfo.data.roofAreaSqm?.toLocaleString()} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Building Height:</span>
                    <span className="font-semibold text-slate-200">{hoveredInfo.data.height}m (3D Extruded)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Albedo:</span>
                    <span className="font-bold text-red-300">{hoveredInfo.data.currentAlbedo} (Low)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">50m Tree Canopy:</span>
                    <span className="font-bold text-amber-300">{hoveredInfo.data.canopy50mCoveragePct}% (Deficit)</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Cooling Penalty:</span>
                    <span className="font-extrabold text-red-400">+{hoveredInfo.data.hvacPenaltyKw} kW</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

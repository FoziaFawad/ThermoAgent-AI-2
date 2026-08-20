"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Map as MapLibreMap,
  GeoJSONSource,
  StyleSpecification,
  Marker
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { FortyGuardReading } from '../../types/fortyguard';
import { AuditedBuilding } from '../../types/simulation';
import { H3Service } from '../../server/services/h3-service';
import { getThermalColorRgba, CityPreset } from '../../lib/map-presets';
import { getLandmark3DGeoJSON, CITY_GOOGLE_EARTH_BADGES } from '../../lib/landmarks-3d';
import { getCitySkylines3DGeoJSON } from '../../lib/city-skylines-3d';
import { CITY_3D_BUILDINGS_LAYER } from './Building3DLayer';
import GoogleEarthHUD from './GoogleEarthHUD';

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
// Google Earth 3D Photorealistic Satellite & Natural Material Shading
// Real-World Materials, Vertical Shading Gradients & Ambient Occlusion
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
      maxzoom: 22,
      attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics'
    },
    'carto-labels': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      maxzoom: 22,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    },
    'openmaptiles': {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet'
    }
  },
  light: {
    anchor: 'viewport',
    color: '#fffaf0',
    intensity: 0.85,
    position: [1.3, 215, 45]
  },
  layers: [
    {
      id: 'satellite-basemap',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 24
    },
    // Photorealistic 3D Building Layer from Building3DLayer.tsx
    CITY_3D_BUILDINGS_LAYER,
    {
      id: 'map-labels-overlay',
      type: 'raster',
      source: 'carto-labels',
      minzoom: 0,
      maxzoom: 24,
      paint: {
        'raster-opacity': 0.95
      }
    }
  ]
};

// -------------------------------------------------------------
// Dark Matter 3D Thermal Twin Style With Labels
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
      maxzoom: 22,
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
    intensity: 0.65,
    position: [1.2, 210, 55]
  },
  layers: [
    {
      id: 'carto-dark-basemap',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 24
    },
    {
      id: 'city-3d-buildings',
      type: 'fill-extrusion',
      source: 'openmaptiles',
      'source-layer': 'building',
      minzoom: 9,
      maxzoom: 24,
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
        'fill-extrusion-opacity': 0.95,
        'fill-extrusion-vertical-gradient': true
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
  const poiMarkersRef = useRef<Marker[]>([]);

  // Latest props stored in ref for stable access
  const propsRef = useRef({
    selectedCity,
    readings,
    buildings,
    activeLayers,
    onSelectHex,
    onSelectBuilding
  });

  useEffect(() => {
    propsRef.current = {
      selectedCity,
      readings,
      buildings,
      activeLayers,
      onSelectHex,
      onSelectBuilding
    };
  });

  // 3D Camera & Viewer Telemetry State (Exact Google Earth HUD values)
  const [is3D, setIs3D] = useState(true);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [currentPitch, setCurrentPitch] = useState(60);
  const [currentBearing, setCurrentBearing] = useState(selectedCity.coordinates.bearing || -25);
  const [currentZoom, setCurrentZoom] = useState(selectedCity.coordinates.zoom || 14.5);

  // Hover Tooltip Info
  const [hoveredInfo, setHoveredInfo] = useState<{
    x: number;
    y: number;
    type: 'hex' | 'building' | 'landmark';
    data: any;
  } | null>(null);

  // Core synchronization function that updates map layers based on current state
  const syncMapLayers = useCallback(() => {
    const m = map.current;
    if (!m || !m.isStyleLoaded()) return;

    const {
      readings: thermalReadings,
      buildings: auditedBuildings,
      activeLayers: layers,
      selectedCity: currentLocation
    } = propsRef.current;

    // Toggle 3D city vector buildings
    if (m.getLayer('city-3d-buildings')) {
      m.setLayoutProperty(
        'city-3d-buildings',
        'visibility',
        layers.buildings3D ? 'visible' : 'none'
      );
    }

    // Toggle Labels
    if (m.getLayer('map-labels-overlay')) {
      m.setLayoutProperty('map-labels-overlay', 'visibility', 'visible');
    }

    // -------------------------------------------------------------
    // 0. Architectural 12-Tier Stepped Meshes for Iconic Landmarks (Empire State, Chrysler, 1 WTC)
    // -------------------------------------------------------------
    const landmarksGeoJSON = getLandmark3DGeoJSON();
    const existingLandmarkSource = m.getSource('iconic-landmarks-source') as GeoJSONSource | undefined;
    if (existingLandmarkSource) {
      existingLandmarkSource.setData(landmarksGeoJSON);
    } else {
      m.addSource('iconic-landmarks-source', {
        type: 'geojson',
        data: landmarksGeoJSON
      });

      m.addLayer({
        id: 'iconic-landmarks-3d-mesh',
        type: 'fill-extrusion',
        source: 'iconic-landmarks-source',
        minzoom: 0,
        maxzoom: 24,
        paint: {
          'fill-extrusion-color': ['get', 'color'],
          'fill-extrusion-base': ['get', 'minHeight'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-opacity': 1.0,
          'fill-extrusion-vertical-gradient': true
        }
      });

      // Mouse events for iconic landmark 3D inspection
      m.on('mousemove', 'iconic-landmarks-3d-mesh', (e) => {
        if (!e.features || !e.features[0]) return;
        m.getCanvas().style.cursor = 'pointer';
        const props = e.features[0].properties as any;
        setHoveredInfo({
          x: e.point.x,
          y: e.point.y,
          type: 'landmark',
          data: props
        });
      });

      m.on('mouseleave', 'iconic-landmarks-3d-mesh', () => {
        m.getCanvas().style.cursor = '';
        setHoveredInfo(null);
      });
    }

    if (m.getLayer('iconic-landmarks-3d-mesh')) {
      m.setLayoutProperty(
        'iconic-landmarks-3d-mesh',
        'visibility',
        layers.buildings3D ? 'visible' : 'none'
      );
    }

    // -------------------------------------------------------------
    // 1. Build H3 Thermal Hexagon Prisms GeoJSON (Seamless Heatmap Blending)
    // -------------------------------------------------------------
    const hexFeatures: GeoJSON.Feature[] = thermalReadings.map(r => {
      const polygonCoords = H3Service.cellToGeoJSONPolygon(r.h3Index);
      const color = getThermalColorRgba(r.temp2mF);
      const colorRgbaStr = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${r.isHotspot ? 0.85 : 0.55})`;

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
          height: r.isHotspot ? 100 : 30
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

      // 3D Extruded H3 Hexagon Columns with Smooth Blending
      m.addLayer({
        id: 'h3-thermal-extrusion',
        type: 'fill-extrusion',
        source: 'h3-thermal-source',
        paint: {
          'fill-extrusion-color': ['get', 'color'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.75,
          'fill-extrusion-vertical-gradient': true
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
        const found = propsRef.current.readings.find(r => r.h3Index === hexId);
        if (found && propsRef.current.onSelectHex) propsRef.current.onSelectHex(found);
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
        : '#0ea5e9';

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
          'fill-extrusion-opacity': 0.98,
          'fill-extrusion-vertical-gradient': true
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
        const found = propsRef.current.buildings.find(b => b.id === bldgId);
        if (found && propsRef.current.onSelectBuilding) propsRef.current.onSelectBuilding(found);
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

    // -------------------------------------------------------------
    // 4. Exact Google Earth Landmark POI Badges (Camera, Church, Zoo, University)
    // -------------------------------------------------------------
    poiMarkersRef.current.forEach(marker => marker.remove());
    poiMarkersRef.current = [];

    const cityBadges = CITY_GOOGLE_EARTH_BADGES.filter(b => b.cityId === currentLocation.id);
    const badgesToRender = cityBadges.length > 0 ? cityBadges : [
      { id: currentLocation.id, name: currentLocation.name, lat: currentLocation.coordinates.latitude, lng: currentLocation.coordinates.longitude, type: 'camera' as const, color: '#9333ea' }
    ];

    badgesToRender.forEach((badge) => {
      const el = document.createElement('div');
      el.className = 'group pointer-events-auto cursor-pointer flex items-center gap-1.5 bg-slate-900/85 hover:bg-slate-900 text-white shadow-2xl rounded-full pl-1.5 pr-3 py-1 border border-white/20 backdrop-blur-md transition-transform hover:scale-110';

      let iconSvg = '';
      if (badge.type === 'camera') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;
      } else if (badge.type === 'zoo') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><path d="M12 18c-3 0-5-2-5-4 0-2 2-3 5-3s5 1 5 3c0 2-2 4-5 4z"/></svg>`;
      } else if (badge.type === 'church') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="6" y1="8" x2="18" y2="8"/></svg>`;
      } else if (badge.type === 'university') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
      } else {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      }

      el.innerHTML = `
        <div class="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm" style="background-color: ${badge.color}">
          ${iconSvg}
        </div>
        <span class="text-[11px] font-semibold tracking-tight text-white/95 whitespace-nowrap drop-shadow-md">${badge.name}</span>
      `;

      const mkr = new Marker({ element: el, anchor: 'center' })
        .setLngLat([badge.lng, badge.lat])
        .addTo(m);

      poiMarkersRef.current.push(mkr);
    });

  }, []);

  // Initialize MapLibre GL Map Instance (With pitch clamped to 60° max and high-zoom nearZ tuning)
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
      pitchWithRotate: true,
      maxZoom: 24, // High-zoom up to 24 without clipping
      minZoom: 2
    });

    mapInstance.on('load', () => {
      syncMapLayers();
    });

    // Real-time telemetry tracking for HUD
    mapInstance.on('pitch', () => {
      const p = Math.min(60, Math.round(mapInstance.getPitch()));
      setCurrentPitch(p);
    });

    mapInstance.on('rotate', () => {
      setCurrentBearing(Math.round(mapInstance.getBearing()));
    });

    mapInstance.on('zoom', () => {
      setCurrentZoom(mapInstance.getZoom());
    });

    map.current = mapInstance;

    return () => {
      if (orbitFrameId.current) {
        cancelAnimationFrame(orbitFrameId.current);
      }
      poiMarkersRef.current.forEach(m => m.remove());
      mapInstance.remove();
    };
  }, [syncMapLayers]);

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
  const isSatellite = activeLayers.satellite;
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!map.current) return;

    const targetStyle = isSatellite ? GOOGLE_EARTH_3D_STYLE : DARK_MATTER_3D_STYLE;

    const handleStyleLoad = () => {
      syncMapLayers();
    };

    map.current.once('style.load', handleStyleLoad);
    map.current.setStyle(targetStyle);

    return () => {
      if (map.current) {
        map.current.off('style.load', handleStyleLoad);
      }
    };
  }, [isSatellite, syncMapLayers]);

  // Update layers when data or layer toggles change
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    syncMapLayers();
  }, [readings, buildings, activeLayers, selectedCity, syncMapLayers]);

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
      zoom: 16.5,
      bearing: map.current.getBearing() + 35,
      duration: 1500
    });
  };

  // Recenter Camera on Selected Landmark
  const handleRecenter = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: [selectedCity.coordinates.longitude, selectedCity.coordinates.latitude],
      zoom: selectedCity.coordinates.zoom || 15.5,
      pitch: 60,
      bearing: selectedCity.coordinates.bearing || -25,
      duration: 1500
    });
  };

  // Reset North Compass
  const handleResetNorth = () => {
    if (!map.current) return;
    map.current.easeTo({
      bearing: 0,
      duration: 500
    });
    setCurrentBearing(0);
  };

  // Zoom In / Out
  const handleZoomIn = () => {
    if (!map.current) return;
    map.current.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    if (!map.current) return;
    map.current.zoomOut({ duration: 300 });
  };

  // Cinematic 360 Orbit Animation
  const handleToggleOrbit = () => {
    if (!map.current) return;
    const nextOrbit = !isOrbiting;
    setIsOrbiting(nextOrbit);

    if (nextOrbit) {
      const rotateCamera = () => {
        if (!map.current) return;
        const currentB = map.current.getBearing();
        map.current.setBearing((currentB + 0.16) % 360);
        setCurrentBearing(Math.round(map.current.getBearing()));
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

      {/* Google Earth Style 3D Navigation Controls Dock & Telemetry HUD */}
      <GoogleEarthHUD
        selectedCity={selectedCity}
        is3D={is3D}
        currentPitch={currentPitch}
        currentBearing={currentBearing}
        currentZoom={currentZoom}
        onToggle3D={handleToggle3D}
        onStreetLevelView={handleStreetLevelView}
        onRecenter={handleRecenter}
        onResetNorth={handleResetNorth}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleOrbit={handleToggleOrbit}
        isOrbiting={isOrbiting}
      />

      {/* Interactive 3D Tooltip */}
      {hoveredInfo && (
        <div
          className="absolute z-40 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4 transition-all duration-75"
          style={{ left: hoveredInfo.x, top: hoveredInfo.y }}
        >
          <div className="bg-white/95 text-slate-900 text-xs p-3.5 rounded-2xl shadow-2xl border border-slate-200/90 backdrop-blur-xl min-w-[240px] ring-1 ring-slate-900/5 font-sans">
            {hoveredInfo.type === 'hex' ? (
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="font-bold text-blue-600">H3 Hex {hoveredInfo.data.h3Index?.slice(-6)}</span>
                  </div>
                  {hoveredInfo.data.isHotspot && (
                    <span className="bg-red-50 text-red-600 font-extrabold px-2 py-0.5 rounded-full text-[10px] border border-red-200">
                      HOTSPOT
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">2m Ambient Air:</span>
                    <span className="font-extrabold text-amber-600">{hoveredInfo.data.temp2mF}°F ({hoveredInfo.data.temp2mC}°C)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Satellite Skin LST:</span>
                    <span className="text-slate-700 font-medium">{hoveredInfo.data.surfaceTempF}°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Surface Disparity:</span>
                    <span className="text-red-600 font-bold">+{hoveredInfo.data.disparityF}°F</span>
                  </div>
                  {hoveredInfo.data.isHotspot && (
                    <div className="flex justify-between text-[11px] pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Spike Anomaly:</span>
                      <span className="text-orange-600 font-semibold">+{hoveredInfo.data.spikeDeltaF}°F</span>
                    </div>
                  )}
                </div>
              </div>
            ) : hoveredInfo.type === 'landmark' ? (
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                    <span className="font-bold text-purple-700">{hoveredInfo.data.name || 'Iconic Landmark'}</span>
                  </div>
                  <span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full text-[10px] border border-purple-200">
                    3D LANDMARK
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Architectural Tier:</span>
                    <span className="font-semibold text-slate-800">{hoveredInfo.data.tierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Elevation Span:</span>
                    <span className="font-bold text-slate-900">{hoveredInfo.data.minHeight}m – {hoveredInfo.data.height}m</span>
                  </div>
                  <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 italic">
                    {hoveredInfo.data.description}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-emerald-700">{hoveredInfo.data.name || 'Building Envelope'}</span>
                  </div>
                  <span className="bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded-full text-[10px] border border-orange-200">
                    Priority {hoveredInfo.data.priorityScore}/100
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Roof Footprint:</span>
                    <span className="font-semibold text-slate-800">{hoveredInfo.data.roofAreaSqm?.toLocaleString()} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Building Height:</span>
                    <span className="font-semibold text-slate-800">{hoveredInfo.data.height}m (3D Extruded)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Albedo:</span>
                    <span className="font-bold text-red-600">{hoveredInfo.data.currentAlbedo} (Low)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">50m Tree Canopy:</span>
                    <span className="font-bold text-amber-600">{hoveredInfo.data.canopy50mCoveragePct}% (Deficit)</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Cooling Penalty:</span>
                    <span className="font-extrabold text-red-600">+{hoveredInfo.data.hvacPenaltyKw} kW</span>
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

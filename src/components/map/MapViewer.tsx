"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { FortyGuardReading } from '../../types/fortyguard';
import { AuditedBuilding } from '../../types/simulation';
import { H3Service } from '../../server/services/h3-service';
import { getThermalColorRgba, CityPreset } from '../../lib/map-presets';

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

export default function MapViewer({
  selectedCity,
  readings,
  buildings,
  activeLayers,
  onSelectHex,
  onSelectBuilding
}: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const isInitialMount = useRef(true);
  const [hoveredInfo, setHoveredInfo] = useState<{
    x: number;
    y: number;
    type: 'hex' | 'building';
    data: any;
  } | null>(null);

  // Initialize MapTiler Map
  useEffect(() => {
    if (!mapContainer.current) return;

    const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY || process.env.NEXT_PUBLIC_MAPTILER_API_KEY || '';
    maptilersdk.config.apiKey = mapTilerKey;

    const initialStyle = activeLayers.satellite
      ? maptilersdk.MapStyle.HYBRID
      : maptilersdk.MapStyle.DATAVIZ.DARK;

    const mapInstance = new maptilersdk.Map({
      container: mapContainer.current,
      style: initialStyle,
      center: [selectedCity.coordinates.longitude, selectedCity.coordinates.latitude],
      zoom: selectedCity.coordinates.zoom,
      pitch: selectedCity.coordinates.pitch,
      bearing: selectedCity.coordinates.bearing
    });

    mapInstance.addControl(new maptilersdk.NavigationControl({ visualizePitch: true }), 'top-right');
    mapInstance.addControl(new maptilersdk.ScaleControl(), 'bottom-right');

    mapInstance.on('load', () => {
      updateMapLayers(mapInstance, readings, buildings, activeLayers);
    });

    map.current = mapInstance;

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Update center when selected city changes
  useEffect(() => {
    if (!map.current) return;
    map.current.flyTo({
      center: [selectedCity.coordinates.longitude, selectedCity.coordinates.latitude],
      zoom: selectedCity.coordinates.zoom,
      pitch: selectedCity.coordinates.pitch,
      bearing: selectedCity.coordinates.bearing,
      essential: true,
      duration: 2500
    });
  }, [selectedCity]);

  // Handle dynamic map style switching (Satellite vs Dark)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!map.current) return;

    const targetStyle = activeLayers.satellite
      ? maptilersdk.MapStyle.HYBRID
      : maptilersdk.MapStyle.DATAVIZ.DARK;

    const handleStyleLoad = () => {
      if (map.current) {
        updateMapLayers(map.current, readings, buildings, activeLayers);
      }
    };

    map.current.once('style.load', handleStyleLoad);
    map.current.setStyle(targetStyle);

    return () => {
      if (map.current) {
        map.current.off('style.load', handleStyleLoad);
      }
    };
  }, [activeLayers.satellite]);

  // Update layers when data or toggles change
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    updateMapLayers(map.current, readings, buildings, activeLayers);
  }, [readings, buildings, activeLayers]);


  function updateMapLayers(
    m: maptilersdk.Map,
    thermalReadings: FortyGuardReading[],
    auditedBuildings: AuditedBuilding[],
    layers: typeof activeLayers
  ) {
    // 1. Build H3 Hexagons GeoJSON FeatureCollection
    const hexFeatures: GeoJSON.Feature[] = thermalReadings.map(r => {
      const polygonCoords = H3Service.cellToGeoJSONPolygon(r.h3Index);
      const color = getThermalColorRgba(r.temp2mF);
      const colorRgbaStr = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${r.isHotspot ? 0.78 : 0.45})`;

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
          height: r.isHotspot ? 85 : 25
        }
      };
    });

    const hexGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: hexFeatures
    };

    // Update or Add H3 Source & Layers
    if (m.getSource('h3-thermal-source')) {
      (m.getSource('h3-thermal-source') as maptilersdk.GeoJSONSource).setData(hexGeoJSON);
    } else {
      m.addSource('h3-thermal-source', {
        type: 'geojson',
        data: hexGeoJSON
      });

      // Extruded 3D Hexagons Layer
      m.addLayer({
        id: 'h3-thermal-extrusion',
        type: 'fill-extrusion',
        source: 'h3-thermal-source',
        paint: {
          'fill-extrusion-color': ['get', 'color'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.85
        }
      });

      // Hexagon Outline Layer
      m.addLayer({
        id: 'h3-thermal-outline',
        type: 'line',
        source: 'h3-thermal-source',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.5,
          'line-opacity': 0.6
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

    // Set Visibility based on activeLayers
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

    // 2. Build 3D Buildings GeoJSON FeatureCollection
    const buildingFeatures: GeoJSON.Feature[] = auditedBuildings.map(b => {
      const size = Math.sqrt(b.roofAreaSqm) / 111000;
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

    if (m.getSource('osm-buildings-source')) {
      (m.getSource('osm-buildings-source') as maptilersdk.GeoJSONSource).setData(buildingGeoJSON);
    } else {
      m.addSource('osm-buildings-source', {
        type: 'geojson',
        data: buildingGeoJSON
      });

      m.addLayer({
        id: 'osm-buildings-extrusion',
        type: 'fill-extrusion',
        source: 'osm-buildings-source',
        paint: {
          'fill-extrusion-color': ['get', 'color'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.92
        }
      });

      m.on('mousemove', 'osm-buildings-extrusion', (e) => {
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

      m.on('mouseleave', 'osm-buildings-extrusion', () => {
        m.getCanvas().style.cursor = '';
        setHoveredInfo(null);
      });

      m.on('click', 'osm-buildings-extrusion', (e) => {
        if (!e.features || !e.features[0]) return;
        const bldgId = e.features[0].properties?.id;
        const found = auditedBuildings.find(b => b.id === bldgId);
        if (found && onSelectBuilding) onSelectBuilding(found);
      });
    }

    if (m.getLayer('osm-buildings-extrusion')) {
      m.setLayoutProperty(
        'osm-buildings-extrusion',
        'visibility',
        layers.buildings3D ? 'visible' : 'none'
      );
    }
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Interactive Tooltip */}
      {hoveredInfo && (
        <div
          className="absolute z-40 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: hoveredInfo.x, top: hoveredInfo.y }}
        >
          <div className="bg-slate-950/90 text-white text-xs p-3 rounded-lg shadow-2xl border border-white/20 backdrop-blur-md min-w-[210px]">
            {hoveredInfo.type === 'hex' ? (
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                  <span className="font-semibold text-blue-400">H3 Hex {hoveredInfo.data.h3Index?.slice(-6)}</span>
                  {hoveredInfo.data.isHotspot && (
                    <span className="bg-red-500/30 text-red-300 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      HOTSPOT
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">2m Ambient Air:</span>
                    <span className="font-bold text-amber-300">{hoveredInfo.data.temp2mF}°F ({hoveredInfo.data.temp2mC}°C)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Satellite Skin LST:</span>
                    <span className="text-slate-200">{hoveredInfo.data.surfaceTempF}°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Surface Disparity:</span>
                    <span className="text-red-400 font-semibold">+{hoveredInfo.data.disparityF}°F</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                  <span className="font-semibold text-emerald-400">{hoveredInfo.data.name || 'Building Envelope'}</span>
                  <span className="bg-orange-500/30 text-orange-300 font-bold px-1.5 py-0.5 rounded text-[10px]">
                    Priority {hoveredInfo.data.priorityScore}/100
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Roof Footprint:</span>
                    <span className="font-medium text-slate-200">{hoveredInfo.data.roofAreaSqm?.toLocaleString()} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Albedo:</span>
                    <span className="font-medium text-red-300">{hoveredInfo.data.currentAlbedo} (Low)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">50m Tree Canopy:</span>
                    <span className="font-medium text-amber-300">{hoveredInfo.data.canopy50mCoveragePct}% (Deficit)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cooling Penalty:</span>
                    <span className="font-bold text-red-400">+{hoveredInfo.data.hvacPenaltyKw} kW</span>
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

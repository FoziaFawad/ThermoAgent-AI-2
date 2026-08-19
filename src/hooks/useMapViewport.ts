"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import { CityPreset } from '../lib/map-presets';

export interface ViewportState {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  is3D: boolean;
  isOrbiting: boolean;
}

export function useMapViewport(initialCity: CityPreset) {
  const mapRef = useRef<MapLibreMap | null>(null);
  const orbitFrameRef = useRef<number | null>(null);

  const [viewport, setViewport] = useState<ViewportState>({
    center: [initialCity.coordinates.longitude, initialCity.coordinates.latitude],
    zoom: initialCity.coordinates.zoom || 14.5,
    pitch: initialCity.coordinates.pitch || 60,
    bearing: initialCity.coordinates.bearing || -25,
    is3D: true,
    isOrbiting: false
  });

  // Attach Map Instance
  const setMapInstance = useCallback((map: MapLibreMap | null) => {
    mapRef.current = map;
    if (map) {
      // Prevent near-plane geometry slicing when zoomed in
      const canvas = map.getCanvas();
      if (canvas) {
        canvas.style.imageRendering = 'crisp-edges';
      }
    }
  }, []);

  // Update telemetry on camera movements
  const handleCameraChange = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();
    setViewport(prev => ({
      ...prev,
      center: [center.lng, center.lat],
      zoom: Number(map.getZoom().toFixed(2)),
      pitch: Math.round(map.getPitch()),
      bearing: Math.round(map.getBearing())
    }));
  }, []);

  // 2D Orthographic vs 3D Angled Perspective Toggle
  const toggle3D = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    setViewport(prev => {
      const next3D = !prev.is3D;
      map.easeTo({
        pitch: next3D ? 60 : 0,
        duration: 800
      });
      return { ...prev, is3D: next3D, pitch: next3D ? 60 : 0 };
    });
  }, []);

  // Street Level Drone Perspective View (Pitch up to 65-75° with zero clipping)
  const flyToStreetLevel = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
      pitch: 65,
      zoom: 17.2,
      bearing: map.getBearing() + 30,
      duration: 1600,
      essential: true
    });
    setViewport(prev => ({ ...prev, is3D: true, pitch: 65, zoom: 17.2 }));
  }, []);

  // Recenter to Landmark Focus Coordinates
  const recenter = useCallback((city: CityPreset) => {
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
      center: [city.coordinates.longitude, city.coordinates.latitude],
      zoom: city.coordinates.zoom || 15.5,
      pitch: 60,
      bearing: city.coordinates.bearing || -25,
      duration: 1500,
      essential: true
    });
  }, []);

  // Reset North
  const resetNorth = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    map.easeTo({
      bearing: 0,
      duration: 500
    });
    setViewport(prev => ({ ...prev, bearing: 0 }));
  }, []);

  // Adjust Pitch
  const adjustPitch = useCallback((delta: number) => {
    const map = mapRef.current;
    if (!map) return;

    const currentP = map.getPitch();
    const nextP = Math.max(0, Math.min(85, currentP + delta));
    map.easeTo({ pitch: nextP, duration: 300 });
  }, []);

  // Cinematic 360 Orbit Animation
  const toggleOrbit = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    setViewport(prev => {
      const nextOrbit = !prev.isOrbiting;
      if (nextOrbit) {
        const rotate = () => {
          if (!mapRef.current) return;
          const b = mapRef.current.getBearing();
          mapRef.current.setBearing((b + 0.16) % 360);
          orbitFrameRef.current = requestAnimationFrame(rotate);
        };
        orbitFrameRef.current = requestAnimationFrame(rotate);
      } else {
        if (orbitFrameRef.current) {
          cancelAnimationFrame(orbitFrameRef.current);
          orbitFrameRef.current = null;
        }
      }
      return { ...prev, isOrbiting: nextOrbit };
    });
  }, []);

  // Zoom helpers
  const zoomIn = useCallback(() => {
    mapRef.current?.zoomIn({ duration: 300 });
  }, []);

  const zoomOut = useCallback(() => {
    mapRef.current?.zoomOut({ duration: 300 });
  }, []);

  useEffect(() => {
    return () => {
      if (orbitFrameRef.current) {
        cancelAnimationFrame(orbitFrameRef.current);
      }
    };
  }, []);

  return {
    viewport,
    setMapInstance,
    handleCameraChange,
    toggle3D,
    flyToStreetLevel,
    recenter,
    resetNorth,
    adjustPitch,
    toggleOrbit,
    zoomIn,
    zoomOut
  };
}

"use client";

import React from 'react';
import {
  User,
  LocateFixed,
  Plus,
  Minus,
  RotateCw,
  Flame
} from 'lucide-react';
import { CityPreset } from '../../lib/map-presets';

interface GoogleEarthHUDProps {
  selectedCity: CityPreset;
  is3D: boolean;
  currentPitch: number;
  currentBearing: number;
  currentZoom: number;
  onToggle3D: () => void;
  onStreetLevelView: () => void;
  onRecenter: () => void;
  onResetNorth: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleOrbit: () => void;
  isOrbiting: boolean;
}

// Convert decimal degrees to GPS DMS string format (e.g. 40°44'56.26"N 73°59'02.36"W)
function toDMS(lat: number, lng: number): string {
  const formatDMS = (deg: number, isLat: boolean) => {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
    const direction = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  return `${formatDMS(lat, true)}  ${formatDMS(lng, false)}`;
}

// Approximate camera altitude from zoom level
function zoomToAltitudeMeters(zoom: number): number {
  return Math.round(591657550.5 / Math.pow(2, zoom) / 450);
}

export default function GoogleEarthHUD({
  selectedCity,
  is3D,
  currentPitch,
  currentBearing,
  currentZoom,
  onToggle3D,
  onStreetLevelView,
  onRecenter,
  onResetNorth,
  onZoomIn,
  onZoomOut,
  onToggleOrbit,
  isOrbiting
}: GoogleEarthHUDProps) {
  const dmsCoords = toDMS(selectedCity.coordinates.latitude, selectedCity.coordinates.longitude);
  const altitude = zoomToAltitudeMeters(currentZoom || 15);

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* Bottom-Right Floating 3D Navigation Dock (Google EIE Light)    */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute bottom-10 right-6 z-30 flex items-center bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 rounded-full px-2 py-1.5 text-slate-700 ring-1 ring-slate-900/5 gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
        {/* Pegman Street Level View */}
        <button
          onClick={onStreetLevelView}
          title="Street Level 3D Drone View"
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
        >
          <User size={16} className="text-amber-500" />
        </button>

        {/* Locate / Recenter */}
        <button
          onClick={onRecenter}
          title="Recenter on Selected Landmark"
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
        >
          <LocateFixed size={15} />
        </button>

        {/* 2D / 3D Mode Toggle */}
        <button
          onClick={onToggle3D}
          title={is3D ? "Switch to 2D Top-Down View" : "Switch to 3D Google Earth Perspective"}
          className="px-3 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all border border-blue-200"
        >
          {is3D ? "2D" : "3D"}
        </button>

        {/* Cinematic 360 Orbit */}
        <button
          onClick={onToggleOrbit}
          title="360° Cinematic Orbit Animation"
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isOrbiting
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
              : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
          }`}
        >
          <RotateCw size={14} className={isOrbiting ? "animate-spin" : ""} />
        </button>

        {/* Dynamic Rotating Magnetic Compass Needle */}
        <button
          onClick={onResetNorth}
          title="Click to Reset North (Bearing: 0°)"
          className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all group"
        >
          <div
            className="w-6 h-6 flex items-center justify-center transition-transform duration-100"
            style={{ transform: `rotate(${-currentBearing}deg)` }}
          >
            <div className="relative w-1.5 h-5 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[9px] border-b-red-600" />
              <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[9px] border-t-slate-400" />
            </div>
          </div>
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center border-l border-slate-200 pl-1">
          <button
            onClick={onZoomOut}
            title="Zoom Out"
            className="w-7 h-8 rounded-l-full flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={onZoomIn}
            title="Zoom In"
            className="w-7 h-8 rounded-r-full flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Bottom Telemetry Status Bar (Google EIE Light Theme)          */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-1.5 bg-white/90 backdrop-blur-xl border-t border-slate-200/90 text-[11px] font-mono text-slate-600 flex items-center justify-between pointer-events-none select-none shadow-sm">
        
        {/* Left: Attribution & Location Tag */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 tracking-tight font-sans">ThermoAgent.AI</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-sans">FortyGuard 2m Thermal Stream</span>
          </div>
          <span className="hidden md:inline text-[10px] text-slate-400 font-sans">
            Imagery &copy; Esri, Maxar &bull; OpenMapTiles 3D
          </span>
        </div>

        {/* Right: Live GPS Telemetry & Altitude Scale */}
        <div className="flex items-center gap-4 text-[11px] pointer-events-auto">
          <div className="hidden sm:flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-slate-900 font-bold font-sans">{selectedCity.name}</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Scale */}
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-1 bg-slate-400 border-b border-slate-700" />
            <span>200 m</span>
          </div>

          {/* Camera Altitude */}
          <span>Camera: <strong className="text-slate-800">{altitude.toLocaleString()} m</strong></span>

          {/* Real-time DMS Coordinates */}
          <span className="hidden md:inline text-slate-700 font-semibold">{dmsCoords}</span>

          {/* Pitch */}
          <span>Tilt: <strong className="text-blue-600 font-bold">{Math.round(currentPitch)}°</strong></span>

          {/* 2m Air Temp Peak */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 text-amber-800 font-bold">
            <Flame size={10} className="text-amber-600" />
            <span>{selectedCity.baselineAirTempF}°F</span>
          </div>
        </div>
      </div>
    </>
  );
}

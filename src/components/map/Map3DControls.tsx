"use client";

import React from 'react';
import { Box, RotateCw, Compass, ArrowUp, ArrowDown, Building, Eye } from 'lucide-react';

interface Map3DControlsProps {
  is3D: boolean;
  isOrbiting: boolean;
  currentPitch: number;
  onToggle3D: () => void;
  onToggleOrbit: () => void;
  onAdjustPitch: (delta: number) => void;
  onResetNorth: () => void;
  onStreetLevelView?: () => void;
}

export default function Map3DControls({
  is3D,
  isOrbiting,
  currentPitch,
  onToggle3D,
  onToggleOrbit,
  onAdjustPitch,
  onResetNorth,
  onStreetLevelView
}: Map3DControlsProps) {
  return (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-2xl p-2.5 flex flex-col gap-1.5 text-slate-800 min-w-[170px] ring-1 ring-slate-900/5">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 pb-1 border-b border-slate-100 flex items-center gap-1.5">
        <Building size={12} className="text-blue-600" />
        <span>Google Earth 3D</span>
      </div>

      {/* 3D / 2D Mode Toggle */}
      <button
        onClick={onToggle3D}
        title={is3D ? "Switch to 2D Top-Down View" : "Switch to 3D Angled Perspective View"}
        className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          is3D
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <Box size={14} className={is3D ? "text-white animate-pulse" : "text-slate-500"} />
          <span>{is3D ? "3D Buildings" : "2D Ortho"}</span>
        </div>
        <span className={`w-1.5 h-1.5 rounded-full ${is3D ? "bg-cyan-300" : "bg-slate-400"}`} />
      </button>

      {/* Street Level Drone View */}
      {onStreetLevelView && (
        <button
          onClick={onStreetLevelView}
          title="Zoom to Immersive 3D Street Level Canyon View"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 transition-all shadow-sm"
        >
          <Eye size={14} className="text-indigo-600" />
          <span>Street 3D View</span>
        </button>
      )}

      {/* Cinematic 360 Orbit Inspection */}
      <button
        onClick={onToggleOrbit}
        title="Toggle 360° Cinematic Orbit Animation"
        className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          isOrbiting
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <RotateCw size={14} className={isOrbiting ? "animate-spin text-white" : "text-slate-500"} />
          <span>{isOrbiting ? "Orbiting" : "360° Orbit"}</span>
        </div>
        {isOrbiting && <span className="w-1.5 h-1.5 rounded-full bg-amber-200 animate-ping" />}
      </button>

      {/* Pitch Angle Tilt Controls */}
      <div className="flex items-center justify-between bg-slate-50 rounded-xl px-2.5 py-1.5 border border-slate-100">
        <span className="text-[11px] font-mono text-slate-600">Pitch: <strong className="text-blue-600">{Math.round(currentPitch)}°</strong></span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAdjustPitch(15)}
            title="Tilt Up (+15°)"
            disabled={currentPitch >= 80}
            className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
          >
            <ArrowUp size={12} />
          </button>
          <button
            onClick={() => onAdjustPitch(-15)}
            title="Tilt Down (-15°)"
            disabled={currentPitch <= 0}
            className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
          >
            <ArrowDown size={12} />
          </button>
        </div>
      </div>

      {/* Reset Compass North */}
      <button
        onClick={onResetNorth}
        title="Reset North Orientation"
        className="flex items-center justify-center gap-1.5 px-2 py-1 rounded-xl text-[11px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
      >
        <Compass size={13} className="text-blue-500" />
        <span>Reset North</span>
      </button>
    </div>
  );
}

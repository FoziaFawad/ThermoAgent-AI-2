"use client";

import React from 'react';
import { Layers, Building2, Trees, Flame, Globe2, ShieldAlert } from 'lucide-react';

interface LayerControlPanelProps {
  activeLayers: {
    ambientThermal: boolean;
    buildings3D: boolean;
    treeCanopy: boolean;
    satellite: boolean;
    curingRisk: boolean;
  };
  onToggleLayer: (layer: keyof LayerControlPanelProps['activeLayers']) => void;
}

export default function LayerControlPanel({
  activeLayers,
  onToggleLayer
}: LayerControlPanelProps) {
  const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY || process.env.NEXT_PUBLIC_MAPTILER_API_KEY || '';
  const hasValidMapTilerKey = mapTilerKey && !mapTilerKey.includes('your_') && mapTilerKey.length > 10 && !mapTilerKey.includes('dummy');

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg rounded-2xl p-3 flex flex-col gap-2">
      <div className="flex items-center gap-2 px-1 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-1.5">
        <Layers size={14} className="text-blue-600" />
        <span>GIS Map Layers</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {/* FortyGuard 2m Ambient Thermal Heatmap */}
        <button
          onClick={() => onToggleLayer('ambientThermal')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            activeLayers.ambientThermal
              ? 'bg-amber-500/10 text-amber-900 border border-amber-300 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Flame size={14} className={activeLayers.ambientThermal ? 'text-amber-600' : 'text-slate-400'} />
            <span>2m Ambient Heat (H3)</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${activeLayers.ambientThermal ? 'bg-amber-500' : 'bg-slate-300'}`} />
        </button>

        {/* 3D OSM Building Envelopes */}
        <button
          onClick={() => onToggleLayer('buildings3D')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            activeLayers.buildings3D
              ? 'bg-blue-500/10 text-blue-900 border border-blue-300 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 size={14} className={activeLayers.buildings3D ? 'text-blue-600' : 'text-slate-400'} />
            <span>3D Buildings & Albedo</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${activeLayers.buildings3D ? 'bg-blue-500' : 'bg-slate-300'}`} />
        </button>

        {/* Tree Canopy Buffer */}
        <button
          onClick={() => onToggleLayer('treeCanopy')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            activeLayers.treeCanopy
              ? 'bg-emerald-500/10 text-emerald-900 border border-emerald-300 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trees size={14} className={activeLayers.treeCanopy ? 'text-emerald-600' : 'text-slate-400'} />
            <span>50m Tree Canopy Buffers</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${activeLayers.treeCanopy ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        </button>

        {/* Satellite Imagery Basemap */}
        <button
          onClick={() => onToggleLayer('satellite')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            activeLayers.satellite
              ? 'bg-purple-500/10 text-purple-900 border border-purple-300 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe2 size={14} className={activeLayers.satellite ? 'text-purple-600' : 'text-slate-400'} />
            <span>{hasValidMapTilerKey ? 'MapTiler Satellite Hybrid' : 'Satellite Hybrid View'}</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${activeLayers.satellite ? 'bg-purple-500' : 'bg-slate-300'}`} />
        </button>
      </div>
    </div>
  );
}

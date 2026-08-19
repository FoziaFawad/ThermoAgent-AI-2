"use client";

import React from 'react';
import { Layers, Building2, Trees, Flame, Globe2 } from 'lucide-react';

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
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl p-3.5 flex flex-col gap-2.5 text-white">
      <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-cyan-400" />
          <span>GIS Digital Twin Layers</span>
        </div>
        <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border border-cyan-500/30">
          3D Active
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {/* Basemap Switcher: Google Earth 3D Satellite vs Dark Matter */}
        <button
          onClick={() => onToggleLayer('satellite')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeLayers.satellite
              ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/25 border border-blue-400/40'
              : 'text-slate-300 hover:bg-slate-800/80 bg-slate-950/40 border border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Globe2 size={14} className={activeLayers.satellite ? 'text-cyan-200' : 'text-blue-400'} />
            <span>{activeLayers.satellite ? 'Google Earth 3D Satellite' : 'Dark Matter Night Mode'}</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${activeLayers.satellite ? 'bg-cyan-300 animate-pulse shadow-sm shadow-cyan-300' : 'bg-slate-600'}`} />
        </button>

        {/* 3D City Buildings & Extrusions */}
        <button
          onClick={() => onToggleLayer('buildings3D')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeLayers.buildings3D
              ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/80 bg-slate-950/40 border border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Building2 size={14} className={activeLayers.buildings3D ? 'text-indigo-400' : 'text-slate-500'} />
            <span>3D Buildings & Structures</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${activeLayers.buildings3D ? 'bg-indigo-400 shadow-sm shadow-indigo-400' : 'bg-slate-600'}`} />
        </button>

        {/* FortyGuard 2m Ambient Thermal Heatmap (3D Hex Prisms) */}
        <button
          onClick={() => onToggleLayer('ambientThermal')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeLayers.ambientThermal
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/80 bg-slate-950/40 border border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Flame size={14} className={activeLayers.ambientThermal ? 'text-amber-400' : 'text-slate-500'} />
            <span>2m Ambient Heat (3D H3)</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${activeLayers.ambientThermal ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-slate-600'}`} />
        </button>

        {/* Tree Canopy Buffer */}
        <button
          onClick={() => onToggleLayer('treeCanopy')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeLayers.treeCanopy
              ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/80 bg-slate-950/40 border border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Trees size={14} className={activeLayers.treeCanopy ? 'text-emerald-400' : 'text-slate-500'} />
            <span>50m Tree Canopy Buffers</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${activeLayers.treeCanopy ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-600'}`} />
        </button>
      </div>
    </div>
  );
}

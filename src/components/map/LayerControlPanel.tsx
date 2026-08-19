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
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-2xl p-4 flex flex-col gap-3 text-slate-800 font-sans">
      <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-blue-600" />
          <span>GIS Digital Twin Layers</span>
        </div>
        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
          3D Active
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {/* Basemap Switcher: Google Earth 3D Satellite vs Dark Matter */}
        <button
          onClick={() => onToggleLayer('satellite')}
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeLayers.satellite
              ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 bg-slate-50 border border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Globe2 size={15} className={activeLayers.satellite ? 'text-blue-600' : 'text-slate-400'} />
            <span>{activeLayers.satellite ? 'Google Earth 3D Satellite' : 'Dark Matter Night Mode'}</span>
          </div>
          <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.satellite ? 'bg-blue-600' : 'bg-slate-300'}`} />
        </button>

        {/* 3D City Buildings & Structures */}
        <button
          onClick={() => onToggleLayer('buildings3D')}
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeLayers.buildings3D
              ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 bg-slate-50 border border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Building2 size={15} className={activeLayers.buildings3D ? 'text-indigo-600' : 'text-slate-400'} />
            <span>3D Buildings & Structures</span>
          </div>
          <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.buildings3D ? 'bg-indigo-600' : 'bg-slate-300'}`} />
        </button>

        {/* FortyGuard 2m Ambient Thermal Heatmap (3D Hex Prisms) */}
        <button
          onClick={() => onToggleLayer('ambientThermal')}
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeLayers.ambientThermal
              ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 bg-slate-50 border border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Flame size={15} className={activeLayers.ambientThermal ? 'text-amber-600' : 'text-slate-400'} />
            <span>2m Ambient Heat (3D H3)</span>
          </div>
          <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.ambientThermal ? 'bg-amber-500' : 'bg-slate-300'}`} />
        </button>

        {/* Tree Canopy Buffer */}
        <button
          onClick={() => onToggleLayer('treeCanopy')}
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeLayers.treeCanopy
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 bg-slate-50 border border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Trees size={15} className={activeLayers.treeCanopy ? 'text-emerald-600' : 'text-slate-400'} />
            <span>50m Tree Canopy Buffers</span>
          </div>
          <span className={`w-2.5 h-2.5 rounded-full ${activeLayers.treeCanopy ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        </button>
      </div>
    </div>
  );
}

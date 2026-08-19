"use client";

import React from 'react';
import { Trees } from 'lucide-react';

interface CanopyDensityProps {
  canopyAreaSqm: number;
  onChange: (value: number) => void;
}

export default function CanopyDensity({ canopyAreaSqm, onChange }: CanopyDensityProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl p-3.5 flex flex-col gap-2 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Trees size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Vegetative Canopy Expansion</h4>
            <p className="text-[10px] text-slate-400">Evapotranspirative Tree Shade Buffer</p>
          </div>
        </div>
        <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
          +{canopyAreaSqm.toLocaleString()} m²
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="15000"
        step="500"
        value={canopyAreaSqm}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1"
      />

      <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
        <span>0 m² (Baseline)</span>
        <span className="text-emerald-400 font-semibold">+15,000 m² (Forest)</span>
      </div>
    </div>
  );
}

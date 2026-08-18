"use client";

import React from 'react';
import { Trees } from 'lucide-react';

interface CanopyDensityProps {
  canopyAreaSqm: number;
  onChange: (value: number) => void;
}

export default function CanopyDensity({ canopyAreaSqm, onChange }: CanopyDensityProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md rounded-2xl p-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Trees size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Vegetative Canopy Expansion</h4>
            <p className="text-[10px] text-slate-500">Evapotranspirative Bioswales & Urban Trees</p>
          </div>
        </div>
        <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
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
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
      />

      <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
        <span>0 m² (Baseline)</span>
        <span className="text-emerald-600 font-semibold">+15,000 m² (Forest Corridors)</span>
      </div>
    </div>
  );
}

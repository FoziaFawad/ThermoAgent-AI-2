"use client";

import React from 'react';
import { Trees } from 'lucide-react';

interface CanopyDensityProps {
  canopyAreaSqm: number;
  onChange: (value: number) => void;
}

export default function CanopyDensity({ canopyAreaSqm, onChange }: CanopyDensityProps) {
  return (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-2xl p-4 flex flex-col gap-2.5 text-slate-800 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Trees size={15} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Vegetative Canopy Expansion</h4>
            <p className="text-[10px] text-slate-500">Evapotranspirative Tree Shade Buffer</p>
          </div>
        </div>
        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
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
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-1"
      />

      <div className="flex justify-between text-[10px] text-slate-500 font-medium px-0.5">
        <span>0 m² (Baseline)</span>
        <span className="text-emerald-700 font-bold">+15,000 m² (Urban Forest)</span>
      </div>
    </div>
  );
}

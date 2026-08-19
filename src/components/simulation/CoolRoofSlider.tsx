"use client";

import React from 'react';
import { Sun } from 'lucide-react';

interface CoolRoofSliderProps {
  albedo: number;
  onChange: (value: number) => void;
}

export default function CoolRoofSlider({ albedo, onChange }: CoolRoofSliderProps) {
  return (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-2xl p-4 flex flex-col gap-2.5 text-slate-800 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Sun size={15} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Cool Roof Albedo (SRI)</h4>
            <p className="text-[10px] text-slate-500">Solar Reflectivity Index (0.15 → 0.85)</p>
          </div>
        </div>
        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono">
          {albedo.toFixed(2)}
        </span>
      </div>

      <input
        type="range"
        min="0.15"
        max="0.85"
        step="0.05"
        value={albedo}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-1"
      />

      <div className="flex justify-between text-[10px] text-slate-500 font-medium px-0.5">
        <span>0.15 (Dark Asphalt)</span>
        <span className="text-blue-600 font-bold">0.85 (CRRC Cool Roof)</span>
      </div>
    </div>
  );
}

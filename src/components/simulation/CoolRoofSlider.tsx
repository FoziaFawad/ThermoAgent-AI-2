"use client";

import React from 'react';
import { Sun } from 'lucide-react';

interface CoolRoofSliderProps {
  albedo: number;
  onChange: (value: number) => void;
}

export default function CoolRoofSlider({ albedo, onChange }: CoolRoofSliderProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl p-3.5 flex flex-col gap-2 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sun size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Cool Roof Albedo (SRI)</h4>
            <p className="text-[10px] text-slate-400">Solar Reflectivity Index (0.15 → 0.85)</p>
          </div>
        </div>
        <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
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
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-1"
      />

      <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
        <span>0.15 (Dark Asphalt)</span>
        <span className="text-cyan-400 font-semibold">0.85 (CRRC Cool Roof)</span>
      </div>
    </div>
  );
}

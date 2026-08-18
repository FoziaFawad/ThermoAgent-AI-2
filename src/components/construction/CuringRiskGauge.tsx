"use client";

import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Droplets, Wind, ThermometerSun } from 'lucide-react';
import { CuringRiskLevel } from '../../types/construction';

interface CuringRiskGaugeProps {
  evaporationRate: number; // kg/m2/hr (ACI 305R limit: 1.0)
  riskLevel: CuringRiskLevel;
  ambientAirTempC: number;
  concreteTempC: number;
  relativeHumidityPct: number;
  windSpeedKmh: number;
}

export default function CuringRiskGauge({
  evaporationRate,
  riskLevel,
  ambientAirTempC,
  concreteTempC,
  relativeHumidityPct,
  windSpeedKmh
}: CuringRiskGaugeProps) {
  const getBadgeStyle = () => {
    switch (riskLevel) {
      case 'CRITICAL':
        return 'bg-red-500 text-white border-red-600';
      case 'HIGH':
        return 'bg-orange-500 text-white border-orange-600';
      case 'MODERATE':
        return 'bg-amber-500 text-white border-amber-600';
      default:
        return 'bg-emerald-600 text-white border-emerald-700';
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Plastic Shrinkage Evaporation Index</h3>
            <p className="text-[11px] text-slate-500">ACI 305R Microclimate Rate Nomograph</p>
          </div>
        </div>
        <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-sm ${getBadgeStyle()}`}>
          {riskLevel} RISK
        </span>
      </div>

      {/* Main Rate Display */}
      <div className="flex items-baseline justify-between bg-slate-50 border border-slate-200/80 rounded-xl p-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Surface Evaporation Rate
          </span>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {evaporationRate.toFixed(2)}{' '}
            <span className="text-sm font-semibold text-slate-500">kg/m²/hr</span>
          </div>
        </div>
        <div className="text-right text-xs">
          <div className="text-slate-500">Critical ACI Limit:</div>
          <div className="font-bold text-red-600 text-sm">1.00 kg/m²/hr</div>
        </div>
      </div>

      {/* Ambient Sensor Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
            <ThermometerSun size={12} className="text-amber-500" />
            <span>2m Ambient Air</span>
          </div>
          <div className="text-base font-bold text-slate-800 mt-1">{ambientAirTempC}°C ({(ambientAirTempC * 1.8 + 32).toFixed(1)}°F)</div>
        </div>

        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
            <ThermometerSun size={12} className="text-red-500" />
            <span>Concrete Mix Temp</span>
          </div>
          <div className="text-base font-bold text-slate-800 mt-1">{concreteTempC}°C</div>
        </div>

        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
            <Droplets size={12} className="text-blue-500" />
            <span>Relative Humidity</span>
          </div>
          <div className="text-base font-bold text-slate-800 mt-1">{relativeHumidityPct}%</div>
        </div>

        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
            <Wind size={12} className="text-cyan-500" />
            <span>Surface Wind</span>
          </div>
          <div className="text-base font-bold text-slate-800 mt-1">{windSpeedKmh} km/h</div>
        </div>
      </div>
    </div>
  );
}

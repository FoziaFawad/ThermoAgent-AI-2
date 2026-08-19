"use client";

import React from 'react';
import { DollarSign, TrendingDown, Zap, Leaf, Clock } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../lib/utils';

interface ROIAnalysisCardProps {
  deltaCoolingF: number;
  coolRoofDeltaF: number;
  canopyDeltaF: number;
  annualHvacSavingsUsd: number;
  annualKwhSaved: number;
  paybackPeriodYears: number;
  co2ReductionTons: number;
  totalRoofAreaSqm: number;
}

export default function ROIAnalysisCard({
  deltaCoolingF,
  coolRoofDeltaF,
  canopyDeltaF,
  annualHvacSavingsUsd,
  annualKwhSaved,
  paybackPeriodYears,
  co2ReductionTons,
  totalRoofAreaSqm
}: ROIAnalysisCardProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl p-3.5 flex flex-col gap-3 text-white">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
            <DollarSign size={14} />
          </div>
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Quantified Mitigation Impact
          </h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
          ASHRAE & CRRC
        </span>
      </div>

      {/* Hero Metric: Net 2m Ambient Cooling ΔT */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 rounded-xl p-3 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-blue-100 font-semibold flex items-center gap-1">
              <TrendingDown size={12} />
              Net 2m Ambient Air Cooling (ΔT)
            </span>
            <div className="text-xl font-black tracking-tight mt-0.5">
              -{deltaCoolingF.toFixed(2)}°F <span className="text-xs font-semibold text-cyan-200">(-{(deltaCoolingF * (5/9)).toFixed(2)}°C)</span>
            </div>
          </div>
          <div className="text-right text-[10px] text-blue-100 bg-black/20 px-2 py-1 rounded-lg border border-white/10">
            <div>Roof: -{coolRoofDeltaF}°F</div>
            <div>Canopy: -{canopyDeltaF}°F</div>
          </div>
        </div>
      </div>

      {/* Financial & Operational KPI Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Annual Chiller OpEx Offset */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
            <DollarSign size={12} className="text-emerald-400" />
            <span>Annual HVAC Savings</span>
          </div>
          <div className="text-sm font-extrabold text-emerald-400 mt-1 font-mono">
            {formatCurrency(annualHvacSavingsUsd)} <span className="text-[10px] font-normal text-slate-400">/yr</span>
          </div>
        </div>

        {/* Capital Payback Period */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
            <Clock size={12} className="text-amber-400" />
            <span>Capital Payback</span>
          </div>
          <div className="text-sm font-extrabold text-amber-300 mt-1 font-mono">
            {paybackPeriodYears} <span className="text-[10px] font-normal text-slate-400">Years</span>
          </div>
        </div>

        {/* Peak Grid Load Relief */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
            <Zap size={12} className="text-cyan-400" />
            <span>Grid Energy Saved</span>
          </div>
          <div className="text-sm font-extrabold text-cyan-300 mt-1 font-mono">
            {formatNumber(annualKwhSaved)} <span className="text-[10px] font-normal text-slate-400">kWh</span>
          </div>
        </div>

        {/* Carbon Abatement */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
            <Leaf size={12} className="text-emerald-400" />
            <span>CO₂ Abatement</span>
          </div>
          <div className="text-sm font-extrabold text-emerald-300 mt-1 font-mono">
            {co2ReductionTons} <span className="text-[10px] font-normal text-slate-400">MT/yr</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from 'react';
import { DollarSign, TrendingDown, Zap, Leaf, Clock, ArrowUpRight } from 'lucide-react';
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
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg rounded-2xl p-4 flex flex-col gap-3.5 transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <DollarSign size={15} />
          </div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Quantified Mitigation Impact
          </h3>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          ASHRAE 90.1 & CRRC Standard
        </span>
      </div>

      {/* Hero Metric: Net 2m Ambient Cooling ΔT */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 rounded-xl p-3.5 text-white shadow-md shadow-blue-500/20">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] text-blue-100 font-medium flex items-center gap-1">
              <TrendingDown size={13} />
              Net 2m Ambient Cooling Drop
            </span>
            <div className="text-2xl font-extrabold tracking-tight mt-0.5">
              -{deltaCoolingF.toFixed(2)}°F <span className="text-sm font-semibold text-blue-200">(-{(deltaCoolingF * (5/9)).toFixed(2)}°C)</span>
            </div>
          </div>
          <div className="text-right text-[10px] text-blue-100 bg-white/10 px-2 py-1 rounded-lg border border-white/20">
            <div>Cool Roof: -{coolRoofDeltaF}°F</div>
            <div>Canopy: -{canopyDeltaF}°F</div>
          </div>
        </div>
      </div>

      {/* Financial & Operational KPI Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Annual Chiller OpEx Offset */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold">
            <DollarSign size={12} className="text-emerald-600" />
            <span>Annual HVAC Offset</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 mt-1">
            {formatCurrency(annualHvacSavingsUsd)} <span className="text-[10px] font-medium text-slate-500">/ yr</span>
          </div>
        </div>

        {/* Capital Payback Period */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold">
            <Clock size={12} className="text-amber-600" />
            <span>Capital Payback</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 mt-1">
            {paybackPeriodYears} <span className="text-[10px] font-medium text-slate-500">Years</span>
          </div>
        </div>

        {/* Peak Grid Load Relief */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold">
            <Zap size={12} className="text-blue-600" />
            <span>Grid Energy Saved</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 mt-1">
            {formatNumber(annualKwhSaved)} <span className="text-[10px] font-medium text-slate-500">kWh/yr</span>
          </div>
        </div>

        {/* Carbon Abatement */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold">
            <Leaf size={12} className="text-emerald-600" />
            <span>CO₂ Abatement</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 mt-1">
            {co2ReductionTons} <span className="text-[10px] font-medium text-slate-500">MT/yr</span>
          </div>
        </div>
      </div>
    </div>
  );
}

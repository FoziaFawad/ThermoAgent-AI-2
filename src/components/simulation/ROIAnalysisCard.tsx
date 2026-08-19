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
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-2xl p-4 flex flex-col gap-3 text-slate-800 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <DollarSign size={15} />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Quantified Mitigation Impact
          </h3>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
          ASHRAE & CRRC
        </span>
      </div>

      {/* Hero Metric: Net 2m Ambient Cooling ΔT */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-3.5 text-white shadow-lg shadow-blue-500/20">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] text-blue-100 font-bold flex items-center gap-1">
              <TrendingDown size={13} />
              Net 2m Ambient Air Cooling (ΔT)
            </span>
            <div className="text-2xl font-black tracking-tight mt-0.5">
              -{deltaCoolingF.toFixed(2)}°F <span className="text-xs font-semibold text-blue-200">(-{(deltaCoolingF * (5/9)).toFixed(2)}°C)</span>
            </div>
          </div>
          <div className="text-right text-[10px] text-blue-100 bg-white/15 px-2.5 py-1 rounded-xl backdrop-blur-sm border border-white/20 font-medium">
            <div>Roof: -{coolRoofDeltaF}°F</div>
            <div>Canopy: -{canopyDeltaF}°F</div>
          </div>
        </div>
      </div>

      {/* Financial & Operational KPI Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Annual Chiller OpEx Offset */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-bold">
            <DollarSign size={13} className="text-emerald-600" />
            <span>Annual HVAC Savings</span>
          </div>
          <div className="text-sm font-extrabold text-emerald-700 mt-1 font-mono">
            {formatCurrency(annualHvacSavingsUsd)} <span className="text-[10px] font-normal text-slate-500">/yr</span>
          </div>
        </div>

        {/* Capital Payback Period */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-bold">
            <Clock size={13} className="text-amber-600" />
            <span>Capital Payback</span>
          </div>
          <div className="text-sm font-extrabold text-amber-700 mt-1 font-mono">
            {paybackPeriodYears} <span className="text-[10px] font-normal text-slate-500">Years</span>
          </div>
        </div>

        {/* Peak Grid Load Relief */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-bold">
            <Zap size={13} className="text-blue-600" />
            <span>Grid Energy Saved</span>
          </div>
          <div className="text-sm font-extrabold text-blue-700 mt-1 font-mono">
            {formatNumber(annualKwhSaved)} <span className="text-[10px] font-normal text-slate-500">kWh</span>
          </div>
        </div>

        {/* Carbon Abatement */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-bold">
            <Leaf size={13} className="text-emerald-600" />
            <span>CO₂ Abatement</span>
          </div>
          <div className="text-sm font-extrabold text-emerald-700 mt-1 font-mono">
            {co2ReductionTons} <span className="text-[10px] font-normal text-slate-500">MT/yr</span>
          </div>
        </div>
      </div>
    </div>
  );
}

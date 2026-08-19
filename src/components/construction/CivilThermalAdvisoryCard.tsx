"use client";

import React from 'react';
import { HardHat, ShieldAlert, CheckCircle2, Download, AlertTriangle, Clock, DollarSign, FlaskConical } from 'lucide-react';

interface CivilThermalAdvisoryCardProps {
  locationName?: string;
  ambientTempC?: number;
  evaporationRate?: number;
  riskLevel?: string;
  pourWindow?: string;
  avoidedPenaltyUsd?: number;
  onExportPDF?: () => void;
  isExporting?: boolean;
}

export default function CivilThermalAdvisoryCard({
  locationName = "Urban Infrastructure Corridor",
  ambientTempC = 41.8,
  evaporationRate = 1.38,
  riskLevel = "CRITICAL THERMAL CRACKING HAZARD (ACI 305R EXCEEDED)",
  pourWindow = "21:30 — 05:30 PKT (Night / Pre-dawn Window Only)",
  avoidedPenaltyUsd = 92000,
  onExportPDF,
  isExporting = false
}: CivilThermalAdvisoryCardProps) {
  const isCritical = evaporationRate >= 1.0 || riskLevel.includes("CRITICAL");

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-3xl p-6 flex flex-col gap-5 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HardHat size={22} />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Civil Infrastructure Engineering Protocol</div>
            <h2 className="text-lg font-extrabold text-white">Concrete Hydration & Curing Advisory</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
            isCritical
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            {isCritical ? 'ACI 305R CRITICAL' : 'ACI 305R COMPLIANT'}
          </span>
        </div>
      </div>

      {/* Risk Callout */}
      <div className={`p-4 rounded-2xl border ${
        isCritical 
          ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' 
          : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
      }`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`} />
          <div className="space-y-1">
            <div className="font-bold text-xs uppercase tracking-wide">
              {riskLevel}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              At peak ambient temperature (<span className="text-white font-mono font-bold">{ambientTempC}°C</span>), the calculated evaporation rate reaches <span className="text-amber-400 font-mono font-bold">{evaporationRate} kg/m²/h</span> (threshold: 1.0 kg/m²/h). Uncontrolled rapid moisture loss triggers plastic shrinkage cracks, internal voids, and severe compressive strength loss.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Clock size={15} className="text-emerald-400" />
            <span>Approved Pour Shift</span>
          </div>
          <div className="font-mono font-bold text-emerald-400 text-sm">{pourWindow}</div>
          <div className="text-[10px] text-slate-500 mt-1">Zero daytime structural casting</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <FlaskConical size={15} className="text-cyan-400" />
            <span>Hydration Admixtures</span>
          </div>
          <div className="font-mono font-bold text-cyan-300 text-sm">Type-II Slag (35%) + Retarder</div>
          <div className="text-[10px] text-slate-500 mt-1">ASTM C494 Type D + Shaved Ice</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <DollarSign size={15} className="text-amber-400" />
            <span>Capital Preservation</span>
          </div>
          <div className="font-mono font-bold text-amber-300 text-sm">${avoidedPenaltyUsd.toLocaleString()} Saved</div>
          <div className="text-[10px] text-slate-500 mt-1">Avoids reconstruction penalties</div>
        </div>
      </div>

      {/* Directives & Action button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
        <div className="text-xs text-slate-400 leading-relaxed max-w-xl">
          <strong className="text-slate-200">Onsite Constructor Directive:</strong> Apply liquid monomolecular evaporation retardant film immediately post-screeding and maintain continuous wet burlap curing with reflective polyethylene sheeting for 10 consecutive days.
        </div>

        <button
          onClick={onExportPDF}
          disabled={isExporting}
          className="px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 active:scale-95 text-black shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          <Download size={15} />
          <span>{isExporting ? 'Generating PDF...' : 'Export Technical Advisory Memo (PDF)'}</span>
        </button>
      </div>
    </div>
  );
}

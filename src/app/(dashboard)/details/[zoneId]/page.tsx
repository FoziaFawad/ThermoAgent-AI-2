"use client";

import React, { use } from 'react';
import Link from 'next/link';
import Navbar from '../../../../components/layout/Navbar';
import { ArrowLeft, Building2, Flame, Trees, Zap, ShieldCheck, DollarSign, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../../../lib/utils';

export default function ZoneDetailsPage({ params }: { params: Promise<{ zoneId: string }> }) {
  const { zoneId } = use(params);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 pt-24 pb-16 space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to 3D Digital Twin Map</span>
        </Link>

        {/* Header Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Flame size={15} />
              <span>Flagged Anomaly Zone &bull; H3 Res-9 Index</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white font-mono">{zoneId}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Structural Causality Audit & Microclimate Mitigation Schedule
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-2xl text-red-400 text-center">
              <div className="text-[10px] font-semibold uppercase">Thermal Spike</div>
              <div className="text-lg font-black">+4.8°F</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-2xl text-blue-400 text-center">
              <div className="text-[10px] font-semibold uppercase">Priority Score</div>
              <div className="text-lg font-black">88 / 100</div>
            </div>
          </div>
        </div>

        {/* Audit Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Surface Albedo Breakdown */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
              <Building2 size={16} />
              <span>Rooftop Albedo & Envelope Profile</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Roof Footprint:</span>
                <span className="font-bold text-white">4,200 m²</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Current Material:</span>
                <span className="text-red-400 font-semibold">Dark Asphalt Membrane (Albedo 0.12)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Target Coating:</span>
                <span className="text-emerald-400 font-semibold">Elastomeric Cool Roof (Albedo 0.85, SRI ≥ 80)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Expected Local ΔT Cooling:</span>
                <span className="font-extrabold text-blue-400 text-sm">-1.85°F at 2m Layer</span>
              </div>
            </div>
          </div>

          {/* 50m Canopy Deficit */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
              <Trees size={16} />
              <span>50-Meter Vegetative Buffer</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Current Canopy Coverage:</span>
                <span className="text-amber-400 font-semibold">4.2% (Extreme Deficit)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Recommended Planting:</span>
                <span className="font-bold text-white">1,500 m² Arid Bioswales / Palms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Evapotranspiration Offset:</span>
                <span className="text-emerald-400 font-semibold">+1.3°F Shade + 0.65°F Moisture</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Pedestrian Thermal Comfort Index:</span>
                <span className="text-slate-200 font-bold">+38% Improvement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
            <ShieldCheck size={16} />
            <span>Autonomous Engineering Action Plan</span>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
              <p>Issue Phase 1 RFP for 4,200 m² solar-reflective cool roof elastomeric coating (estimated capital expenditure: $60,900).</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
              <p>Install high-density drip-irrigated native canopy along the Southern structural perimeter to block peak solar thermal transfer.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
              <p>Expected municipal payback horizon: <strong>3.2 Years</strong> with $18,900/year annual chiller electricity OpEx reduction.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

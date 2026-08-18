import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import { Flame, ShieldAlert, Cpu, Layers, Compass, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 pt-24 pb-16 space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Cpu size={16} />
            <span>Master Architecture & PRD Specification</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            ThermoAgent-AI Methodology & Science
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            A physics-informed spatial artificial intelligence platform designed to detect, audit, simulate, and mitigate Urban Heat Island (UHI) vulnerabilities across metropolitan environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Flame size={18} />
              The 2-Meter Environmental Blindspot
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Conventional satellite remote sensing measures Land Surface Temperature (LST), which registers rooftop and pavement surface skin temperatures rather than the actual air temperature experienced by citizens, transit corridors, and civil structures. FortyGuard delivers hyper-local 2m ambient telemetry to close this blindspot.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <Layers size={18} />
              Deterministic Physics vs. LLM Brain
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To eliminate hallucinations while preserving strategic reasoning, LLMs act as the Cognitive Brain (intent parsing, error handling, synthesis), while deterministic mathematical engines execute spatial intersections, H3 indexing, ASHRAE thermodynamics, and ROI formulas.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/25 transition-all"
          >
            <Compass size={16} />
            <span>Explore Live 3D Digital Twin</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import { Flame, ShieldAlert, ArrowRight, Zap, Building2, Trees, BarChart3, Bot, Compass, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/20 to-cyan-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Track Badges */}
        <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-300 mb-6 shadow-md">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span>FortyGuard Hackathon &bull; Track 6 (Agentic AI) &bull; Tracks 1 & 2 (Cities & Buildings)</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.1]">
          Autonomous Microclimate Intelligence & <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Resilient Urban Asset Management</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Closing the <strong className="text-white font-semibold">2-Meter Environmental Blindspot</strong>. ThermoAgent-AI converts FortyGuard ambient air telemetry and OpenStreetMap 3D geometries into autonomous, costed engineering mitigation roadmaps.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-xl shadow-blue-500/25 transition-all"
          >
            <Compass size={18} />
            <span>Launch 3D Digital Twin Map</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/construction"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 active:scale-95 text-slate-200 font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all"
          >
            <ShieldAlert size={18} className="text-amber-400" />
            <span>Construction Thermal Guardian</span>
          </Link>
        </div>

        {/* 2-Meter Ambient vs Satellite LST Metric Comparison */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Flame size={20} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">2m Human Breathing Zone</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike satellite skin temperature (LST), FortyGuard delivers the exact air temperature where pedestrians walk, HVAC intakes pull air, and structures cure.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <Bot size={20} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Autonomous Multi-Agent DAG</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              5 dedicated agents (Sentinel, Auditor, Physicist, Synthesizer, Guardian) orchestrate spatial anomalies into validated engineering memos with zero hallucinations.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Quantified Energy & ROI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deterministic ASHRAE & CRRC thermodynamics compute instant localized cooling drops (ΔT), $4.50/m² HVAC savings, and concrete plastic shrinkage risk windows.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 px-6 text-center text-xs text-slate-500">
        <p>ThermoAgent-AI &bull; Powered by FortyGuard 2m Ambient Thermal API, Uber H3, Turf.js & Deck.gl.</p>
      </footer>
    </div>
  );
}

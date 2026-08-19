"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import HeroGlobe from '../components/globe/HeroGlobe';
import { 
  Flame, 
  ShieldAlert, 
  ArrowRight, 
  Radio, 
  Building2, 
  Trees, 
  BarChart3, 
  Bot, 
  Compass, 
  CheckCircle2,
  HardHat,
  Cpu,
  Layers,
  ChevronDown,
  ThermometerSun,
  Activity,
  Globe
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* 3D Google Earth Interactive Rotating Globe Background */}
      <HeroGlobe />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Foreground Content Stream (Scrolls smoothly over the 3D globe) */}
      <div className="relative z-10 flex flex-col">
        
        {/* ========================================================= */}
        {/* HERO VIEWPORT (100vh Front-end View) */}
        {/* ========================================================= */}
        <section className="min-h-screen flex flex-col items-center justify-between px-6 pt-28 pb-10 text-center max-w-6xl mx-auto w-full">
          {/* Top Track Badge */}
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-300 shadow-xl backdrop-blur-xl animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono text-cyan-300">FortyGuard Hackathon</span>
              <span className="text-slate-600">&bull;</span>
              <span>Track 6 (Agentic AI)</span>
              <span className="text-slate-600">&bull;</span>
              <span>Tracks 1 & 2 (Cities & Buildings)</span>
            </div>
          </div>

          {/* Main Hero Headline & CTAs */}
          <div className="my-auto py-8 max-w-4xl flex flex-col items-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-2xl">
              Autonomous Microclimate & <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Civil Infrastructure Intelligence
              </span>
            </h1>

            <p className="mt-6 text-sm sm:text-base text-slate-200/90 max-w-2xl leading-relaxed drop-shadow-md">
              Closing the <strong className="text-cyan-300 font-semibold">2-Meter Environmental Blindspot</strong>. ThermoAgent-AI converts FortyGuard ambient air streams and OpenStreetMap 3D assets into autonomous, costed engineering mitigation and ACI 305R concrete curing protocols.
            </p>

            {/* Hero Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-blue-500/25 transition-all"
              >
                <Compass size={17} />
                <span>Launch Digital Twin Map</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/construction"
                className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-lg backdrop-blur-md transition-all"
              >
                <HardHat size={17} className="text-amber-400" />
                <span>Construction Guardian</span>
              </Link>

              <Link
                href="/telemetry"
                className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-lg backdrop-blur-md transition-all"
              >
                <Radio size={17} className="text-cyan-400" />
                <span>2M Telemetry Feed</span>
              </Link>
            </div>
          </div>

          {/* Bottom Prompt: Google Earth Style Drag & Scroll Hint */}
          <div className="flex flex-col items-center gap-2 font-mono text-[11px] text-slate-400">
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>3D GOOGLE EARTH ENGINE ACTIVE &bull; DRAG TO ORBIT</span>
            </div>
            <a href="#explore-sections" className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors pt-2 animate-bounce">
              <span>Scroll to Explore Technical Architecture</span>
              <ChevronDown size={14} />
            </a>
          </div>
        </section>


        {/* ========================================================= */}
        {/* SCROLL SECTION 1: 2-METER BLINDSPOT VS SATELLITE LST */}
        {/* ========================================================= */}
        <section id="explore-sections" className="py-24 px-6 max-w-7xl mx-auto w-full space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-full">
              <Radio size={14} />
              <span>Core Environmental Breakthrough</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              The 2-Meter Environmental Blindspot
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Traditional satellites measure radiant skin temperature from space, misrepresenting true air heat. FortyGuard isolates ambient air at human breathing height (2.0m AGL).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FortyGuard Ambient Air Layer */}
            <div className="bg-slate-900/85 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>FortyGuard 2M Ground-Truth</span>
                </div>
                <span className="font-mono text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                  HUMAN CANOPY LAYER
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Pedestrian & HVAC Intake Ambient Air</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Captured at exactly 2.0 meters above ground where pedestrians walk, active concrete pours undergo hydration, and building chillers draw fresh air.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Resolution</div>
                  <div className="text-base font-bold text-cyan-300 font-mono">Uber H3 Res-9</div>
                  <div className="text-[10px] text-slate-500">~100m hex precision</div>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Update Cadence</div>
                  <div className="text-base font-bold text-emerald-400 font-mono">15-Min Live</div>
                  <div className="text-[10px] text-slate-500">Continuous telemetry</div>
                </div>
              </div>
            </div>

            {/* Satellite Skin Temperature */}
            <div className="bg-slate-900/85 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <ThermometerSun size={15} className="text-amber-400" />
                  <span>Traditional Remote Sensing</span>
                </div>
                <span className="font-mono text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  +18.2°F SKIN DISPARITY
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Satellite Land Surface Temperature (LST)</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Infrared satellite feeds measure raw roof skin heat (which can spike above 140°F), creating false alarms and failing to capture true atmospheric convection.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Pass Frequency</div>
                  <div className="text-base font-bold text-slate-300 font-mono">1–16 Days</div>
                  <div className="text-[10px] text-slate-500">Sparse orbital captures</div>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Construction Value</div>
                  <div className="text-base font-bold text-rose-400 font-mono">Zero Night Data</div>
                  <div className="text-[10px] text-slate-500">Cannot time pour shifts</div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* SCROLL SECTION 2: 4-STAGE AUTONOMOUS MULTI-AGENT DAG */}
        {/* ========================================================= */}
        <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-wider mb-2 bg-blue-950/40 border border-blue-500/30 px-3 py-1 rounded-full">
              <Cpu size={14} />
              <span>Multi-Agent System Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Autonomous 4-Stage Execution Engine
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Deterministic, mathematical orchestration without hallucinations. Converts raw thermal anomalies into certified municipal mitigation roadmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Stage 1 */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-black text-sm mb-4">
                  01
                </div>
                <div className="text-xs font-bold text-cyan-400 font-mono uppercase mb-1">Worker 1: Sentinel</div>
                <h4 className="text-base font-bold text-white mb-2">Anomaly Detection</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Continuously scans FortyGuard 2m ambient telemetry across Res-9 Uber H3 cells, flagging clusters with &ge; +3.5°F thermal delta.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                FortyGuard Ambient Feed
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-blue-500/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-black text-sm mb-4">
                  02
                </div>
                <div className="text-xs font-bold text-blue-400 font-mono uppercase mb-1">Worker 2: Auditor</div>
                <h4 className="text-base font-bold text-white mb-2">Geometric Building Audit</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Performs polygon spatial intersection on OpenStreetMap building geometries, auditing roof area, baseline albedo (α=0.18), and canopy deficits.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                Turf.js & OpenStreetMap
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-black text-sm mb-4">
                  03
                </div>
                <div className="text-xs font-bold text-emerald-400 font-mono uppercase mb-1">Worker 3: Physicist</div>
                <h4 className="text-base font-bold text-white mb-2">Thermodynamic Physics</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Applies CRRC-S100 and USDA UFORE evapotranspiration physics to compute exact 2m air cooling drops (-2.6°C) and HVAC energy savings.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                Deterministic Thermodynamics
              </div>
            </div>

            {/* Stage 4 */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-black text-sm mb-4">
                  04
                </div>
                <div className="text-xs font-bold text-amber-400 font-mono uppercase mb-1">Worker 4: Synthesizer</div>
                <h4 className="text-base font-bold text-white mb-2">Action & Report Output</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Synthesizes municipal engineering memos, generates MapTiler overlay layers, and compiles certified ReportLab PDF specifications.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                ReportLab PDF & GeoJSON
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* SCROLL SECTION 3: CIVIL INFRASTRUCTURE & ACI 305R */}
        {/* ========================================================= */}
        <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-10">
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-900/90 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                <HardHat size={14} />
                <span>Civil Infrastructure Protection Protocol</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                ACI 305R Concrete Hydration & Thermal Cracking Defense
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                High ambient heat induces excessive moisture evaporation (&gt; 1.0 kg/m²/h), producing severe plastic shrinkage cracks and internal structural defects. ThermoAgent-AI automatically locks approved night-shift pour windows (`21:30 — 05:30 PKT`) and specifies slag cement retarder packages.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 size={16} /> <b>$92,000+</b> Penalty Avoidance
                </span>
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <CheckCircle2 size={16} /> Slag (35%) Hydration Control
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/construction"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <HardHat size={17} />
                <span>Open Construction Guardian</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* SCROLL SECTION 4: PRE-INDEXED METROPOLITAN NODES */}
        {/* ========================================================= */}
        <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-full">
              <Globe size={14} />
              <span>Multi-Region Digital Twin Nodes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Pre-Indexed Hotspot Clusters
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore live microclimate nodes analyzed with fortyguard 2m ambient telemetry and OpenStreetMap 3D assets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Phoenix */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-cyan-400">NODE #FG-PHX-3012</span>
                  <span className="text-xs font-mono font-bold text-rose-400">+44.2°C</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Phoenix Downtown Corridor</h4>
                <p className="text-xs text-slate-400">Arid sun-baked transit corridor, rapid asphalt radiative heating.</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-emerald-400">-3.1°C Cooling</span>
                <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold">
                  <span>Explore</span> <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Riyadh */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-cyan-400">NODE #FG-RUH-9204</span>
                  <span className="text-xs font-mono font-bold text-rose-400">+45.9°C</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Riyadh Industrial Hub</h4>
                <p className="text-xs text-slate-400">Industrial flat roof membranes, peak summer hydration hazard.</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-emerald-400">-3.6°C Cooling</span>
                <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold">
                  <span>Explore</span> <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Abu Dhabi */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-cyan-400">NODE #FG-AUH-1102</span>
                  <span className="text-xs font-mono font-bold text-rose-400">+40.1°C</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Abu Dhabi Masdar Sector</h4>
                <p className="text-xs text-slate-400">High solar irradiance desert microclimate with active cool roof pilots.</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-emerald-400">-2.8°C Cooling</span>
                <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold">
                  <span>Explore</span> <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* FOOTER */}
        {/* ========================================================= */}
        <footer className="border-t border-slate-900 bg-slate-950/95 py-8 px-6 text-center text-xs text-slate-500 font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                TA
              </div>
              <span className="text-slate-300 font-bold">ThermoAgent.AI</span>
              <span>&bull;</span>
              <span>2.0m Human Canopy Microclimate Intelligence</span>
            </div>
            <p>Powered by FortyGuard 2M Telemetry API, Uber H3, Turf.js, Deck.gl & ReportLab.</p>
          </div>
        </footer>

      </div>
    </div>
  );
}

"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CITY_PRESETS, CityPreset } from '../../lib/map-presets';
import CitySearchBar from './CitySearchBar';
import {
  RotateCcw,
  RefreshCw,
  Layers,
  Mountain,
  Sparkles,
  ShieldAlert,
  Compass,
  Leaf
} from 'lucide-react';

interface NavbarProps {
  selectedCity?: CityPreset;
  onSelectCity?: (city: CityPreset) => void;
  isAgentRunning?: boolean;
  onToggleLayers?: () => void;
  onToggle3D?: () => void;
  onRunAgent?: () => void;
  onResetView?: () => void;
}

export default function Navbar({
  selectedCity = CITY_PRESETS[0],
  onSelectCity,
  isAgentRunning = false,
  onToggleLayers,
  onToggle3D,
  onRunAgent,
  onResetView
}: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-8 py-3 pointer-events-none">
      <div className="flex justify-between items-center pointer-events-auto bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 rounded-full px-4 sm:px-6 py-2 max-w-7xl mx-auto transition-all text-slate-800 gap-3 ring-1 ring-slate-900/5">
        
        {/* Left: Google EIE Inspired Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf size={16} className="text-white fill-white/30" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base font-sans">
                  ThermoAgent<span className="text-blue-600 font-extrabold">.AI</span>
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Insights Explorer
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Clean In-City Location Search Bar */}
        {onSelectCity && (
          <div className="flex-1 max-w-xl mx-2">
            <CitySearchBar
              selectedCity={selectedCity}
              onSelectCity={onSelectCity}
            />
          </div>
        )}

        {/* Right: Mode Switchers, AI Agent & Profile Avatar */}
        <nav className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {onRunAgent && (
            <button
              onClick={onRunAgent}
              disabled={isAgentRunning}
              className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              <Sparkles size={13} className={isAgentRunning ? "animate-spin text-amber-300" : "text-amber-300"} />
              <span>{isAgentRunning ? "Auditing DAG..." : "Run AI Audit"}</span>
            </button>
          )}

          <Link
            href="/dashboard"
            className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              pathname === '/dashboard' || pathname === '/'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass size={13} />
            <span className="hidden sm:inline">Digital Twin</span>
          </Link>

          <Link
            href="/construction"
            className={`text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
              pathname === '/construction'
                ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert size={13} />
            <span className="hidden sm:inline">Guardian</span>
          </Link>

          <Link
            href="/telemetry"
            className={`text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
              pathname === '/telemetry'
                ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">2M Telemetry</span>
          </Link>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-extrabold text-blue-600 font-sans">
              TG
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

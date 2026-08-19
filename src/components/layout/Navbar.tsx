"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CITY_PRESETS, CityPreset } from '../../lib/map-presets';
import CitySearchBar from './CitySearchBar';
import { Flame, ShieldAlert, Compass } from 'lucide-react';

interface NavbarProps {
  selectedCity?: CityPreset;
  onSelectCity?: (city: CityPreset) => void;
  isAgentRunning?: boolean;
}

export default function Navbar({
  selectedCity = CITY_PRESETS[0],
  onSelectCity,
  isAgentRunning = false
}: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-6 py-3 pointer-events-none">
      <div className="flex justify-between items-center pointer-events-auto bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl px-4 sm:px-5 py-2 max-w-7xl mx-auto transition-all text-white gap-3">
        {/* Brand & Mission */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Flame size={18} className="text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-tight text-sm sm:text-base">
                  ThermoAgent<span className="text-cyan-400 font-extrabold">.AI</span>
                </span>
                <span className="bg-blue-500/20 text-cyan-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-400/30">
                  2m Ambient
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden xl:block">Microclimate Digital Twin & Resilient Asset Management</p>
            </div>
          </Link>
        </div>

        {/* Global US City Search Bar */}
        {onSelectCity && (
          <div className="flex-1 max-w-md mx-2">
            <CitySearchBar
              selectedCity={selectedCity}
              onSelectCity={onSelectCity}
            />
          </div>
        )}

        {/* Navigation & Status Pill */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              pathname === '/dashboard' || pathname === '/'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Compass size={13} />
            <span>Digital Twin</span>
          </Link>

          <Link
            href="/construction"
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              pathname === '/construction'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ShieldAlert size={13} />
            <span className="hidden sm:inline">Construction Guardian</span>
            <span className="sm:hidden">Guardian</span>
          </Link>

          {/* Active Agent Pulse Pill */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-700">
            <div className={`w-2 h-2 rounded-full ${isAgentRunning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-[11px] font-medium text-slate-300">
              {isAgentRunning ? 'Agent DAG Active' : 'Telemetry Live'}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}

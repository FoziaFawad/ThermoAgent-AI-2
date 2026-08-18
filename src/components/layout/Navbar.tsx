"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CITY_PRESETS, CityPreset } from '../../lib/map-presets';
import { Flame, ShieldAlert, Sparkles, MapPin, Activity } from 'lucide-react';

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
    <header className="absolute top-0 left-0 right-0 z-30 px-6 py-3.5 pointer-events-none">
      <div className="flex justify-between items-center pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md rounded-2xl px-5 py-2.5 max-w-7xl mx-auto transition-all">
        {/* Brand & Mission */}
        <div className="flex items-center gap-3.5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Flame size={20} className="text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-base">ThermoAgent<span className="text-blue-600 font-extrabold">.AI</span></span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-200">2.0m Ambient</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Microclimate Digital Twin & Resilient Asset Management</p>
            </div>
          </Link>
        </div>

        {/* Global City Selector */}
        {onSelectCity && (
          <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200 rounded-xl px-3 py-1.5 shadow-inner">
            <MapPin size={14} className="text-blue-600" />
            <select
              value={selectedCity.id}
              onChange={(e) => {
                const found = CITY_PRESETS.find(c => c.id === e.target.value);
                if (found && onSelectCity) onSelectCity(found);
              }}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-2"
            >
              {CITY_PRESETS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation & Status Pill */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/dashboard"
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/dashboard' || pathname === '/'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Digital Twin Map
          </Link>

          <Link
            href="/construction"
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              pathname === '/construction'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert size={14} />
            <span className="hidden md:inline">Construction Guardian</span>
            <span className="md:hidden">Guardian</span>
          </Link>

          {/* Active Agent Pulse Pill */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className={`w-2.5 h-2.5 rounded-full ${isAgentRunning ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
            <span className="text-[11px] font-medium text-slate-600">
              {isAgentRunning ? 'Multi-Agent Stream Active' : 'FortyGuard 2m Ingest Ready'}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}

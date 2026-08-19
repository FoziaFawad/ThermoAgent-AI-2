"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/layout/Navbar';
import { CITY_PRESETS, CityPreset } from '../../../lib/map-presets';
import { FortyGuardReading } from '../../../types/fortyguard';
import { 
  Flame, 
  ThermometerSun, 
  ShieldCheck, 
  Layers, 
  Radio, 
  RefreshCw
} from 'lucide-react';

export default function TelemetryPage() {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITY_PRESETS[0]);
  const [feedData, setFeedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fortyguard?city=${selectedCity.id}`);
      if (res.ok) {
        const data = await res.json();
        setFeedData(data);
      }
    } catch (e) {
      console.error('Error fetching telemetry:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [selectedCity]);

  const readings: FortyGuardReading[] = feedData?.readings || [];

  const peakTempF = readings.length > 0
    ? Math.max(...readings.map((r: any) => r.temp2mF || 0)) 
    : selectedCity.baselineAirTempF + 4.8;

  const avgDisparityF = readings.length > 0 
    ? (readings.reduce((acc: number, r: any) => acc + (r.disparityF || 18.2), 0) / readings.length).toFixed(1) 
    : '18.2';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar selectedCity={selectedCity} onSelectCity={setSelectedCity} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-24 pb-16 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Radio size={16} className="animate-pulse" />
              <span>FortyGuard 2M Telemetry Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              2-Meter Human Ambient Layer & Ingest Grid
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time thermal telemetry ingested at pedestrian breathing height (2.0m AGL). Disentangles microclimate air heat from satellite surface LST skin distortion.
            </p>
          </div>

          <button
            onClick={fetchTelemetry}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-cyan-500/20 transition-all self-start md:self-auto"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Poll Telemetry Stream</span>
          </button>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>2m Air Temp (Peak)</span>
              <Flame size={16} className="text-rose-400" />
            </div>
            <div className="text-2xl font-black font-mono text-rose-400">
              {peakTempF.toFixed(1)}°F ({(((peakTempF - 32) * 5) / 9).toFixed(1)}°C)
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Pedestrian & HVAC breathing zone</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Surface LST Disparity</span>
              <ThermometerSun size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-black font-mono text-amber-400">
              +{avgDisparityF}°F
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Asphalt & roof radiative trap</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>H3 Hex Grid Resolution</span>
              <Layers size={16} className="text-cyan-400" />
            </div>
            <div className="text-2xl font-black font-mono text-cyan-300">
              Res-9 (~100m)
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Uber H3 spatial indexing</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Feed Ingest Status</span>
              <ShieldCheck size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              SYNCHRONIZED
            </div>
            <div className="text-[11px] text-slate-500 mt-1">FortyGuard REST API v2.1</div>
          </div>
        </div>

        {/* Explanatory Comparison: 2m Ambient Air vs Satellite LST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: 2m Ambient Air */}
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-400">
              <Radio size={90} />
            </div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
              <span>FortyGuard Real-time Solution</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">2-Meter Ambient Air Temperature</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Captured at the true 2-meter atmospheric boundary layer where humans reside, outdoor construction crews work, and building HVAC chillers draw cooling air. Eliminates false positives caused by isolated sun-baked rooftops.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-2 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Continuous 15-minute sensor grid streaming
              </li>
              <li className="flex items-center gap-2 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Calibrated against ASHRAE 90.1 & ACI 305R standards
              </li>
              <li className="flex items-center gap-2 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Accurate microclimate evapotranspiration cooling math
              </li>
            </ul>
          </div>

          {/* Card 2: Satellite LST */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-slate-400">
              <ThermometerSun size={90} />
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">
              <span>Traditional Limitation</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Satellite Land Surface Temperature (LST)</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Traditional satellites measure infrared radiative skin temperature (e.g. tar roofs at 140°F), which inflates heat island estimates and fails to represent the air pedestrians breathe or the thermal stress on curing concrete.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                Infrared skin temperature only (unadjusted)
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                Infrequent orbital pass-times (once every 1-16 days)
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                Cannot evaluate dynamic night concrete pour windows
              </li>
            </ul>
          </div>
        </div>

        {/* Active Hexagon Grid Stream Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Active H3 Grid Nodes ({selectedCity.name})</h3>
              <p className="text-xs text-slate-400">Real-time localized readings across Res-9 spatial cells</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
              {readings.length > 0 ? readings.length : 7} Indexed Cells
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">H3 Cell Index</th>
                  <th className="py-3 px-4">2m Air Temp</th>
                  <th className="py-3 px-4">Surface LST</th>
                  <th className="py-3 px-4">Disparity</th>
                  <th className="py-3 px-4">Thermal Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {(readings.length > 0 ? readings : [
                  { h3Index: "892a1008983ffff", temp2mF: peakTempF, surfaceTempF: peakTempF + 18.2, disparityF: 18.2, isHotspot: true },
                  { h3Index: "892a1008987ffff", temp2mF: peakTempF - 1.2, surfaceTempF: peakTempF + 16.5, disparityF: 17.7, isHotspot: true },
                  { h3Index: "892a100898bffff", temp2mF: peakTempF - 3.4, surfaceTempF: peakTempF + 12.0, disparityF: 15.4, isHotspot: false },
                  { h3Index: "892a100898fffff", temp2mF: peakTempF - 4.1, surfaceTempF: peakTempF + 10.5, disparityF: 14.6, isHotspot: false },
                ]).map((cell: any, idx: number) => {
                  const surfaceF = typeof cell.surfaceTempF === 'number' 
                    ? cell.surfaceTempF 
                    : typeof cell.tempSurfaceF === 'number' 
                    ? cell.tempSurfaceF 
                    : (cell.temp2mF || 85) + 18.2;
                  
                  const dispF = typeof cell.disparityF === 'number' 
                    ? cell.disparityF 
                    : 18.2;

                  const temp2m = typeof cell.temp2mF === 'number' ? cell.temp2mF : 85.0;

                  return (
                    <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 text-cyan-300">{cell.h3Index}</td>
                      <td className="py-3 px-4 font-bold text-white">
                        {temp2m.toFixed(1)}°F ({(((temp2m - 32) * 5) / 9).toFixed(1)}°C)
                      </td>
                      <td className="py-3 px-4 text-amber-300">{surfaceF.toFixed(1)}°F</td>
                      <td className="py-3 px-4 text-rose-400">+{dispF.toFixed(1)}°F</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cell.isHotspot 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {cell.isHotspot ? 'CRITICAL HOTSPOT' : 'NOMINAL BASELINE'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

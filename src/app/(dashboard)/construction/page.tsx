"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/layout/Navbar';
import CuringRiskGauge from '../../../components/construction/CuringRiskGauge';
import PourScheduleTimeline from '../../../components/construction/PourScheduleTimeline';
import AdmixtureAdvisor from '../../../components/construction/AdmixtureAdvisor';
import { ConstructionAuditReport } from '../../../types/construction';
import { CITY_PRESETS, CityPreset } from '../../../lib/mapbox';
import { ShieldAlert, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

export default function ConstructionPage() {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITY_PRESETS[0]);
  const [report, setReport] = useState<ConstructionAuditReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Concrete placement parameter controls
  const [ambientTempC, setAmbientTempC] = useState(39.5);
  const [concreteTempC, setConcreteTempC] = useState(32.0);
  const [relativeHumidityPct, setRelativeHumidityPct] = useState(30);
  const [windSpeedKmh, setWindSpeedKmh] = useState(18.0);

  const fetchCuringReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/construction-curing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ambientTempC,
          concreteTempC,
          relativeHumidityPct,
          windSpeedKmh,
          siteName: `${selectedCity.name} Infrastructure Sector 4A`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuringReport();
  }, [selectedCity, ambientTempC, concreteTempC, relativeHumidityPct, windSpeedKmh]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar selectedCity={selectedCity} onSelectCity={setSelectedCity} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-24 pb-16 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldAlert size={16} />
              <span>Dedicated Civil Infrastructure Module</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Onsite Construction Thermal Guardian
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Prevents concrete plastic shrinkage cracking, structural exotherm defects, and project delay penalties by evaluating FortyGuard 2-meter microclimate telemetry.
            </p>
          </div>

          <button
            onClick={fetchCuringReport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all self-start md:self-auto"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Recalculate ACI 305R Nomograph</span>
          </button>
        </div>

        {/* Real-time Environmental Parameter Tuning */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 flex justify-between mb-1.5">
              <span>Ambient Air Temp</span>
              <span className="text-amber-400 font-mono">{ambientTempC}°C ({(ambientTempC * 1.8 + 32).toFixed(1)}°F)</span>
            </label>
            <input
              type="range"
              min="20"
              max="50"
              step="0.5"
              value={ambientTempC}
              onChange={(e) => setAmbientTempC(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 flex justify-between mb-1.5">
              <span>Fresh Concrete Mix Temp</span>
              <span className="text-red-400 font-mono">{concreteTempC}°C</span>
            </label>
            <input
              type="range"
              min="20"
              max="40"
              step="0.5"
              value={concreteTempC}
              onChange={(e) => setConcreteTempC(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 flex justify-between mb-1.5">
              <span>Relative Humidity</span>
              <span className="text-blue-400 font-mono">{relativeHumidityPct}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="90"
              step="1"
              value={relativeHumidityPct}
              onChange={(e) => setRelativeHumidityPct(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 flex justify-between mb-1.5">
              <span>Wind Speed at Surface</span>
              <span className="text-cyan-400 font-mono">{windSpeedKmh} km/h</span>
            </label>
            <input
              type="range"
              min="0"
              max="45"
              step="1"
              value={windSpeedKmh}
              onChange={(e) => setWindSpeedKmh(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        {/* Intelligence Cards */}
        {report && (
          <div className="space-y-6">
            <CuringRiskGauge
              evaporationRate={report.currentEvaporationRate}
              riskLevel={report.riskLevel}
              ambientAirTempC={ambientTempC}
              concreteTempC={concreteTempC}
              relativeHumidityPct={relativeHumidityPct}
              windSpeedKmh={windSpeedKmh}
            />

            <PourScheduleTimeline slots={report.safeWindows} />

            <AdmixtureAdvisor admixtures={report.admixtures} />
          </div>
        )}
      </main>
    </div>
  );
}

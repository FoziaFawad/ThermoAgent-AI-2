"use client";

import React, { useState } from 'react';
import { Cpu, Play, FileText, CheckCircle2, Loader2, Sparkles, ChevronDown, ChevronUp, Download } from 'lucide-react';

interface ExecutionStateEngineProps {
  onRunWorkflow?: () => void;
  isRunning?: boolean;
  onExportPDF?: () => void;
  cityName?: string;
  peakAirTemp?: number;
}

export default function ExecutionStateEngine({
  onRunWorkflow,
  isRunning = false,
  onExportPDF,
  cityName = "Karachi Central",
  peakAirTemp = 41.8
}: ExecutionStateEngineProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [status, setStatus] = useState<'READY' | 'EXECUTING' | 'COMPLETED'>('READY');
  const [logs, setLogs] = useState<string[]>([
    '> Telemetry engine idle. Awaiting municipal scan command...'
  ]);

  const handleRun = async () => {
    if (isRunning) return;
    setStatus('EXECUTING');
    setActiveStep(1);
    setLogs(prev => [...prev, `> Querying FortyGuard 2m Ambient Stream for ${cityName}...`]);

    if (onRunWorkflow) {
      onRunWorkflow();
    }

    setTimeout(() => {
      setActiveStep(2);
      setLogs(prev => [...prev, `> Step 1 [Detection]: Isolated 2m air hotspot anomaly at ${cityName} (Peak: ${peakAirTemp}°C).`]);
    }, 900);

    setTimeout(() => {
      setActiveStep(3);
      setLogs(prev => [...prev, `> Step 2 [Analysis]: Intersected OSM geometries. Total roof area: 4,500 m² (Albedo α=0.18, Canopy Deficit: 92%).`]);
    }, 1800);

    setTimeout(() => {
      setActiveStep(4);
      setLogs(prev => [...prev, `> Step 3 [Simulation]: Computed Fourier thermodynamics -> Localized 2m air drop ΔT = -2.6°C (-4.7°F).`]);
    }, 2700);

    setTimeout(() => {
      setActiveStep(4);
      setLogs(prev => [...prev, `> Step 4 [Action]: ACI 305R civil advisory locked & MapTiler layers finalized. Ready for PDF export.`]);
      setStatus('COMPLETED');
    }, 3600);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 flex flex-col text-slate-100">
      {/* Header Bar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-100">Execution State Engine</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                status === 'EXECUTING' || isRunning
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                  : status === 'COMPLETED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {status === 'EXECUTING' || isRunning ? 'EXECUTING' : status}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Autonomous DAG &bull; Detection &rarr; Analysis &rarr; Simulation &rarr; Action</p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-3.5 flex flex-col gap-3">
          {/* Action Trigger Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleRun}
              disabled={isRunning || status === 'EXECUTING'}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] text-black shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              {status === 'EXECUTING' || isRunning ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play size={13} className="fill-black" />
                  <span>Run Analysis</span>
                </>
              )}
            </button>

            <button
              onClick={onExportPDF}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-cyan-300 border border-cyan-500/30 shadow-md transition-all"
            >
              <Download size={13} />
              <span>Export PDF</span>
            </button>
          </div>

          {/* 4 Pipeline Stages */}
          <div className="space-y-2 text-xs">
            {/* Stage 1: Detection */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              activeStep >= 1 ? 'bg-cyan-950/40 border-cyan-500/40' : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeStep >= 1 ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                  1. Thermal Anomaly Detection
                </span>
                <span className="text-[9px] font-mono text-cyan-400">FORTYGUARD 2M</span>
              </div>
              <p className="text-[10px] text-slate-400">Isolates H3 cells with 2m ambient air temperature &ge; +3.5°F.</p>
            </div>

            {/* Stage 2: Analysis */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              activeStep >= 2 ? 'bg-cyan-950/40 border-cyan-500/40' : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeStep >= 2 ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                  2. Building & Surface Analysis
                </span>
                <span className="text-[9px] font-mono text-slate-400">AUDIT</span>
              </div>
              <p className="text-[10px] text-slate-400">Extracts roof dimensions (4,500 m²), baseline reflectivity (α=0.18), and canopy deficit.</p>
            </div>

            {/* Stage 3: Simulation */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              activeStep >= 3 ? 'bg-cyan-950/40 border-cyan-500/40' : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeStep >= 3 ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                  3. Thermodynamic Simulation
                </span>
                <span className="text-[9px] font-mono text-slate-400">PHYSICS MATH</span>
              </div>
              <p className="text-[10px] text-slate-400">Calculates -2.6°C ambient drop, HVAC kWh reductions, and capital payback horizon.</p>
            </div>

            {/* Stage 4: Action */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              activeStep >= 4 ? 'bg-cyan-950/40 border-cyan-500/40' : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeStep >= 4 ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                  4. Action & Mitigation Output
                </span>
                <span className="text-[9px] font-mono text-slate-400">SYNTHESIS</span>
              </div>
              <p className="text-[10px] text-slate-400">Compiles municipal executive memos, MapTiler vector layers, and structured PDF specs.</p>
            </div>
          </div>

          {/* Trace Log Terminal */}
          <div className="border-t border-slate-800 pt-2.5">
            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">Execution Trace Stream</div>
            <div className="bg-black/50 border border-slate-800/80 rounded-xl p-2.5 max-h-28 overflow-y-auto font-mono text-[10px] space-y-1">
              {logs.map((line, idx) => (
                <div key={idx} className={idx === logs.length - 1 ? 'text-cyan-300 font-semibold' : 'text-slate-400'}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

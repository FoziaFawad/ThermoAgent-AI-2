"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../../../components/layout/Navbar';

const MapViewer = dynamic(() => import('../../../components/map/MapViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center animate-pulse">
        <div className="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
      <span className="text-xs font-semibold tracking-wider text-slate-300">Initializing Google Earth 3D Digital Twin...</span>
    </div>
  )
});

import LayerControlPanel from '../../../components/map/LayerControlPanel';
import AgentTerminal from '../../../components/agents/AgentTerminal';
import CoolRoofSlider from '../../../components/simulation/CoolRoofSlider';
import CanopyDensity from '../../../components/simulation/CanopyDensity';
import ROIAnalysisCard from '../../../components/simulation/ROIAnalysisCard';
import { CITY_PRESETS, CityPreset } from '../../../lib/map-presets';
import { FortyGuardReading } from '../../../types/fortyguard';
import { AuditedBuilding } from '../../../types/simulation';
import { AgentLogEntry } from '../../../types/agent';
import { calculateTotalCoolingDelta, calculateEnergyAndROI } from '../../../lib/thermal-math';
import { Flame, Building2, ThermometerSun, Sliders, Layers, ChevronRight, ChevronLeft } from 'lucide-react';

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITY_PRESETS[0]);
  const [readings, setReadings] = useState<FortyGuardReading[]>([]);
  const [buildings, setBuildings] = useState<AuditedBuilding[]>([]);
  const [agentLogs, setAgentLogs] = useState<AgentLogEntry[]>([]);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [executiveMemo, setExecutiveMemo] = useState<string | undefined>(undefined);

  // Right sidebar drawer tab and collapse state
  const [sidebarTab, setSidebarTab] = useState<'layers' | 'mitigation'>('layers');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Simulation parameters
  const [targetAlbedo, setTargetAlbedo] = useState(0.85);
  const [addedCanopySqm, setAddedCanopySqm] = useState(5000);

  // Map layer controls
  const [activeLayers, setActiveLayers] = useState({
    ambientThermal: true,
    buildings3D: true,
    treeCanopy: true,
    satellite: true,
    curingRisk: false
  });

  // Fetch baseline thermal grid when city changes
  useEffect(() => {
    async function loadCityData() {
      try {
        const queryParams = new URLSearchParams({
          city: selectedCity.id,
          lat: selectedCity.coordinates.latitude.toString(),
          lng: selectedCity.coordinates.longitude.toString(),
          name: selectedCity.name,
          temp: selectedCity.baselineAirTempF.toString()
        });

        const res = await fetch(`/api/fortyguard?${queryParams.toString()}`);
        if (res.ok) {
          const feed = await res.json();
          setReadings(feed.readings || []);

          // Load OSM buildings
          const hotspotHexes = (feed.readings || []).filter((r: any) => r.isHotspot).map((r: any) => r.h3Index);
          const bldgRes = await fetch('/api/v1/audit-structures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cityId: selectedCity.id,
              lat: selectedCity.coordinates.latitude,
              lng: selectedCity.coordinates.longitude,
              cityName: selectedCity.name,
              hotspotHexes
            })
          });
          if (bldgRes.ok) {
            const bldgData = await bldgRes.json();
            setBuildings(bldgData.buildings || []);
          }
        }
      } catch (e) {
        console.error('Error fetching initial city thermal feed:', e);
      }
    }
    loadCityData();
  }, [selectedCity]);

  // Handle SSE Multi-Agent Stream Run
  const handleRunAgentWorkflow = async () => {
    setIsAgentRunning(true);
    setAgentLogs([]);
    setExecutiveMemo(undefined);

    try {
      const response = await fetch('/api/v1/run-supervisor-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: selectedCity.id,
          lat: selectedCity.coordinates.latitude,
          lng: selectedCity.coordinates.longitude,
          cityName: selectedCity.name,
          baselineAirTempF: selectedCity.baselineAirTempF,
          targetAlbedo,
          addedCanopySqm
        })
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported on this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          const eventMatch = line.match(/^event:\s*(.+)$/m);
          const dataMatch = line.match(/^data:\s*(.+)$/m);

          if (dataMatch) {
            try {
              const data = JSON.parse(dataMatch[1]);
              const eventType = eventMatch ? eventMatch[1] : 'message';

              if (data.message) {
                setAgentLogs(prev => [
                  ...prev,
                  {
                    id: Math.random().toString(),
                    timestamp: data.timestamp || new Date().toISOString(),
                    agent: data.agent || 'supervisor',
                    agentName: data.agentName || 'Master Orchestrator',
                    status: data.status || 'running',
                    message: data.message,
                    metrics: data.data
                  }
                ]);
              }

              if (data.data?.readings) {
                setReadings(data.data.readings);
              }
              if (data.data?.buildings) {
                setBuildings(data.data.buildings);
              }
              if (eventType === 'complete' && data.executiveMemo) {
                setExecutiveMemo(data.executiveMemo);
              }
            } catch (err) {
              console.error('Failed to parse SSE line:', err);
            }
          }
        }
      }
    } catch (err) {
      console.error('Workflow error:', err);
    } finally {
      setIsAgentRunning(false);
    }
  };

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Real-time Thermodynamic & Financial ROI calculation
  const totalRoofArea = buildings.reduce((acc, b) => acc + b.roofAreaSqm, 0) || 15000;
  const cooling = calculateTotalCoolingDelta(totalRoofArea, 0.15, targetAlbedo, addedCanopySqm);
  const roi = calculateEnergyAndROI(totalRoofArea, addedCanopySqm);

  const peakAirTempF = readings.length > 0 ? Math.max(...readings.map(r => r.temp2mF)) : selectedCity.baselineAirTempF + 4.5;
  const avgDisparityF = readings.length > 0 
    ? (readings.reduce((acc, r) => acc + r.disparityF, 0) / readings.length).toFixed(1) 
    : '18.2';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* Top Floating Glass Navbar */}
      <Navbar
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        isAgentRunning={isAgentRunning}
      />

      {/* Full Viewport 3D WebGL Digital Twin Map */}
      <MapViewer
        selectedCity={selectedCity}
        readings={readings}
        buildings={buildings}
        activeLayers={activeLayers}
        onSelectHex={(hex) => console.log('Selected Hex:', hex)}
        onSelectBuilding={(bldg) => console.log('Selected Building:', bldg)}
      />

      {/* Top HUD Metric Bar (Clean, Centered/Left Minimalist Glass Pill) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden lg:block">
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl px-5 py-2 flex items-center gap-6 text-xs text-white">
          <div className="flex items-center gap-2.5 pr-4 border-r border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame size={15} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">2m Ambient Air Peak</div>
              <div className="font-extrabold text-amber-300 font-mono text-sm">{peakAirTempF}°F</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pr-4 border-r border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <ThermometerSun size={15} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">LST Surface Disparity</div>
              <div className="font-extrabold text-red-400 font-mono text-sm">+{avgDisparityF}°F</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Building2 size={15} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Audited Assets</div>
              <div className="font-extrabold text-slate-100 text-sm">{buildings.length} Envelopes ({totalRoofArea.toLocaleString()} m²)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right-Side Command Drawer (Clean Tabbed Glassmorphism Dock) */}
      <div className="absolute top-16 right-4 sm:right-6 z-20 pointer-events-none max-h-[calc(100vh-80px)] flex flex-col">
        <div className="pointer-events-auto flex flex-col gap-2 w-80 sm:w-96 max-h-[calc(100vh-80px)] overflow-y-auto pb-4 pr-1">
          {/* Tab Selector & Collapse Button */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-xl rounded-2xl p-1.5 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setSidebarTab('layers'); setIsSidebarOpen(true); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  isSidebarOpen && sidebarTab === 'layers'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers size={13} />
                <span>GIS Layers</span>
              </button>

              <button
                onClick={() => { setSidebarTab('mitigation'); setIsSidebarOpen(true); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  isSidebarOpen && sidebarTab === 'mitigation'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sliders size={13} />
                <span>Mitigation & ROI</span>
              </button>
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isSidebarOpen ? 'Minimize Drawer' : 'Expand Drawer'}
            >
              {isSidebarOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Drawer Content */}
          {isSidebarOpen && (
            <div className="flex flex-col gap-2.5 animate-in fade-in slide-in-from-right-4 duration-200">
              {sidebarTab === 'layers' ? (
                <LayerControlPanel
                  activeLayers={activeLayers}
                  onToggleLayer={toggleLayer}
                />
              ) : (
                <div className="flex flex-col gap-2.5">
                  <CoolRoofSlider
                    albedo={targetAlbedo}
                    onChange={setTargetAlbedo}
                  />

                  <CanopyDensity
                    canopyAreaSqm={addedCanopySqm}
                    onChange={setAddedCanopySqm}
                  />

                  <ROIAnalysisCard
                    deltaCoolingF={cooling.totalDeltaF}
                    coolRoofDeltaF={cooling.coolRoofDeltaF}
                    canopyDeltaF={cooling.canopyDeltaF}
                    annualHvacSavingsUsd={roi.annualHvacSavingsUsd}
                    annualKwhSaved={roi.annualKwhSaved}
                    paybackPeriodYears={roi.paybackPeriodYears}
                    co2ReductionTons={roi.co2ReductionTonsPerYear}
                    totalRoofAreaSqm={totalRoofArea}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom-Left Multi-Agent Terminal Console */}
      <div className="absolute bottom-6 left-4 sm:left-6 z-20 w-80 sm:w-96 max-w-[calc(100vw-2rem)] pointer-events-none">
        <div className="pointer-events-auto">
          <AgentTerminal
            logs={agentLogs}
            isRunning={isAgentRunning}
            onRunWorkflow={handleRunAgentWorkflow}
            executiveMemo={executiveMemo}
          />
        </div>
      </div>
    </div>
  );
}

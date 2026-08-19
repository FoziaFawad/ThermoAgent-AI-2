"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../../../components/layout/Navbar';

const MapViewer = dynamic(() => import('../../../components/map/MapViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center animate-pulse">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
      <span className="text-xs font-semibold tracking-wider text-slate-300">Initializing 3D Environmental Insights Explorer...</span>
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Collapsed by default for clean map view

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
        throw new Error('No response body from multi-agent streaming endpoint');
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

        for (const block of lines) {
          if (!block.trim()) continue;
          const eventMatch = block.match(/event: (.*)/);
          const dataMatch = block.match(/data: (.*)/);

          if (eventMatch && dataMatch) {
            const eventType = eventMatch[1];
            const data = JSON.parse(dataMatch[1]);

            if (eventType === 'agent_start' || eventType === 'agent_step') {
              setAgentLogs(prev => [
                ...prev,
                {
                  id: `log-${Date.now()}-${Math.random()}`,
                  agent: data.agent,
                  agentName: data.agentName,
                  status: data.status,
                  message: data.message,
                  timestamp: data.timestamp
                }
              ]);
            } else if (eventType === 'complete') {
              setExecutiveMemo(data.executiveMemo);
              setIsAgentRunning(false);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('SSE Stream Error:', err);
      setAgentLogs(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          agent: 'supervisor',
          agentName: 'System Error',
          status: 'failed',
          message: err.message || 'Stream connection failed.',
          timestamp: new Date().toISOString()
        }
      ]);
      setIsAgentRunning(false);
    }
  };

  // Toggle individual layers
  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  // Derived calculations
  const totalRoofArea = buildings.reduce((acc, b) => acc + b.roofAreaSqm, 0);
  const cooling = calculateTotalCoolingDelta(totalRoofArea || 20000, 0.15, targetAlbedo, addedCanopySqm);
  const roi = calculateEnergyAndROI(totalRoofArea || 20000, addedCanopySqm);

  const peakAirTempF = readings.length > 0
    ? Math.max(...readings.map(r => r.temp2mF))
    : selectedCity.baselineAirTempF;

  const avgDisparityF = readings.length > 0
    ? Number((readings.reduce((acc, r) => acc + r.disparityF, 0) / readings.length).toFixed(1))
    : 18.5;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* Google EIE Clean Light Header Navbar */}
      <Navbar
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        isAgentRunning={isAgentRunning}
        onToggleLayers={() => setIsSidebarOpen(prev => !prev)}
        onToggle3D={() => toggleLayer('buildings3D')}
        onRunAgent={handleRunAgentWorkflow}
        onResetView={() => setSelectedCity({ ...selectedCity })}
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

      {/* Top HUD Metric Bar (Google EIE Clean White Pill) */}
      <div className="absolute top-20 left-8 z-20 pointer-events-none hidden lg:block">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-slate-900/5 rounded-2xl px-4 py-2 flex items-center gap-5 text-xs text-slate-800 ring-1 ring-slate-900/5 font-sans">
          <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
            <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Flame size={14} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">2m Ambient Air Peak</div>
              <div className="font-extrabold text-amber-700 font-mono text-sm">{peakAirTempF}°F</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
            <div className="w-7 h-7 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <ThermometerSun size={14} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">LST Surface Disparity</div>
              <div className="font-extrabold text-red-600 font-mono text-sm">+{avgDisparityF}°F</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Building2 size={14} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">Audited Assets</div>
              <div className="font-extrabold text-slate-900 text-sm">{buildings.length} Envelopes ({totalRoofArea.toLocaleString()} m²)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right-Side Command Drawer (Google EIE Light Theme Dock) */}
      <div className="absolute top-20 right-6 z-20 pointer-events-none max-h-[calc(100vh-95px)] flex flex-col">
        <div className="pointer-events-auto flex flex-col gap-2 w-80 sm:w-96 max-h-[calc(100vh-95px)] overflow-y-auto pb-4 pr-1 font-sans">
          {/* Tab Selector & Collapse Button */}
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-2xl p-1.5 flex items-center justify-between text-xs text-slate-700 ring-1 ring-slate-900/5">
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setSidebarTab('layers'); setIsSidebarOpen(true); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  isSidebarOpen && sidebarTab === 'layers'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers size={13} />
                <span>GIS Layers</span>
              </button>

              <button
                onClick={() => { setSidebarTab('mitigation'); setIsSidebarOpen(true); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  isSidebarOpen && sidebarTab === 'mitigation'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sliders size={13} />
                <span>Mitigation & ROI</span>
              </button>
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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

      {/* Autonomous Multi-Agent Streaming Execution Terminal */}
      <AgentTerminal
        logs={agentLogs}
        isRunning={isAgentRunning}
        onRunAgent={handleRunAgentWorkflow}
        executiveMemo={executiveMemo}
      />
    </div>
  );
}

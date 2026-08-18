"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/layout/Navbar';
import MapViewer from '../../../components/map/MapViewer';
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
import { Flame, ShieldAlert, Sparkles, Building2, Trees, ThermometerSun, Zap } from 'lucide-react';

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITY_PRESETS[0]);
  const [readings, setReadings] = useState<FortyGuardReading[]>([]);
  const [buildings, setBuildings] = useState<AuditedBuilding[]>([]);
  const [agentLogs, setAgentLogs] = useState<AgentLogEntry[]>([]);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [executiveMemo, setExecutiveMemo] = useState<string | undefined>(undefined);

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
        const res = await fetch(`/api/fortyguard?city=${selectedCity.id}`);
        if (res.ok) {
          const feed = await res.json();
          setReadings(feed.readings || []);

          // Load OSM buildings
          const hotspotHexes = (feed.readings || []).filter((r: any) => r.isHotspot).map((r: any) => r.h3Index);
          const bldgRes = await fetch('/api/v1/audit-structures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cityId: selectedCity.id, hotspotHexes })
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

  // Thermodynamic & ROI Real-time Math
  const totalRoofArea = buildings.reduce((acc, b) => acc + b.roofAreaSqm, 0) || 15000;
  const cooling = calculateTotalCoolingDelta(totalRoofArea, 0.15, targetAlbedo, addedCanopySqm);
  const roi = calculateEnergyAndROI(totalRoofArea, addedCanopySqm);

  const hotspotCount = readings.filter(r => r.isHotspot).length;
  const peakAirTempF = readings.length > 0 ? Math.max(...readings.map(r => r.temp2mF)) : selectedCity.baselineAirTempF + 4.5;
  const avgDisparityF = readings.length > 0 
    ? (readings.reduce((acc, r) => acc + r.disparityF, 0) / readings.length).toFixed(1) 
    : '18.2';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* Global Brand Header */}
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

      {/* Top Floating Metric Ribbon (Google EIE Style) */}
      <div className="absolute top-20 left-6 z-20 pointer-events-none hidden md:block">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg rounded-2xl p-3 flex items-center gap-4 text-xs font-semibold text-slate-800">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
            <Flame size={16} className="text-amber-500" />
            <div>
              <div className="text-[10px] text-slate-500 font-normal">2m Ambient Air Peak</div>
              <div className="font-extrabold text-amber-600 text-sm">{peakAirTempF}°F</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
            <ThermometerSun size={16} className="text-red-500" />
            <div>
              <div className="text-[10px] text-slate-500 font-normal">Surface LST Disparity</div>
              <div className="font-extrabold text-red-600 text-sm">+{avgDisparityF}°F Skin</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-blue-500" />
            <div>
              <div className="text-[10px] text-slate-500 font-normal">Audited Envelopes</div>
              <div className="font-extrabold text-slate-900 text-sm">{buildings.length} Assets ({totalRoofArea.toLocaleString()} m²)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Simulation & Financial Controls (Right Side Drawer) */}
      <div className="absolute top-20 right-6 z-20 w-80 sm:w-96 flex flex-col gap-3 pointer-events-none max-h-[calc(100vh-100px)] overflow-y-auto pb-4">
        <div className="pointer-events-auto flex flex-col gap-3">
          {/* Layer Control Panel */}
          <LayerControlPanel
            activeLayers={activeLayers}
            onToggleLayer={toggleLayer}
          />

          {/* Dynamic Mitigation Sliders */}
          <CoolRoofSlider
            albedo={targetAlbedo}
            onChange={setTargetAlbedo}
          />

          <CanopyDensity
            canopyAreaSqm={addedCanopySqm}
            onChange={setAddedCanopySqm}
          />

          {/* Real-time Economic ROI & Cooling Result Card */}
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
      </div>

      {/* Floating Multi-Agent Terminal (Bottom-Left) */}
      <div className="absolute bottom-6 left-6 z-20 w-96 max-w-[calc(100vw-3rem)] pointer-events-none">
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

"use client";

import React from 'react';
import { CalendarClock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { PourScheduleSlot } from '../../types/construction';

interface PourScheduleTimelineProps {
  slots: PourScheduleSlot[];
}

export default function PourScheduleTimeline({ slots }: PourScheduleTimelineProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <CalendarClock size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">24-Hour Safe Concrete Pouring Windows</h3>
            <p className="text-[11px] text-slate-500">Autonomous Schedule Optimizer based on FortyGuard Microclimate</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          Live Shift Guidance
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {slots.map((slot, idx) => (
          <div
            key={idx}
            className={`border rounded-xl p-3.5 flex flex-col justify-between transition-all ${
              slot.isSafeWindow
                ? 'bg-emerald-50/60 border-emerald-200'
                : slot.riskLevel === 'CRITICAL'
                ? 'bg-red-50/70 border-red-200 shadow-sm'
                : 'bg-amber-50/60 border-amber-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-slate-800">
                  {slot.time}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    slot.isSafeWindow
                      ? 'bg-emerald-600 text-white'
                      : slot.riskLevel === 'CRITICAL'
                      ? 'bg-red-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {slot.isSafeWindow ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                  {slot.riskLevel}
                </span>
              </div>

              <div className="text-[11px] font-semibold text-slate-700 mb-1">
                {slot.date} &bull; {slot.expectedTempC}°C (RH: {slot.expectedHumidityPct}%)
              </div>

              <div className="text-[10px] text-slate-500 mb-2">
                Evaporation: <span className="font-bold text-slate-800">{slot.evaporationRateKgM2Hr} kg/m²/hr</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 italic border-t border-slate-200/60 pt-2">
              {slot.recommendation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

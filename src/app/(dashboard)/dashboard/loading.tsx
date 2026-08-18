import React from 'react';
import { Loader2, Globe2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
      <div className="relative flex items-center justify-center">
        <Globe2 size={48} className="text-blue-500 animate-pulse" />
        <Loader2 size={64} className="absolute text-cyan-400 animate-spin opacity-60" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-bold tracking-wider text-slate-200">INITIALIZING 3D DIGITAL TWIN</h3>
        <p className="text-xs text-slate-500 mt-1">Streaming FortyGuard 2m microclimate telemetry & OSM building geometries...</p>
      </div>
    </div>
  );
}

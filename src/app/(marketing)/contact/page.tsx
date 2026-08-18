import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import { Mail, Building2, Globe2 } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 pt-28 pb-16 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
            <Mail size={22} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Municipal & Infrastructure Integration
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Deploy ThermoAgent-AI across your municipal GIS, civil construction sites, or urban planning departments.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700">
              <Mail size={15} className="text-blue-400" />
              <span>partnerships@thermoagent.ai</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700">
              <Globe2 size={15} className="text-emerald-400" />
              <span>Abu Dhabi &bull; Dubai &bull; New York &bull; Riyadh</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import React from 'react';
import { FlaskConical, DollarSign, ShieldCheck } from 'lucide-react';
import { AdmixtureRecommendation } from '../../types/construction';
import { formatCurrency } from '../../lib/utils';

interface AdmixtureAdvisorProps {
  admixtures: AdmixtureRecommendation[];
}

export default function AdmixtureAdvisor({ admixtures }: AdmixtureAdvisorProps) {
  const totalRemediationSaved = admixtures.reduce((acc, a) => acc + a.savingsFromRemediationAvoidanceUsd, 0);

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <FlaskConical size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Thermal Admixture & Mix Optimizer</h3>
            <p className="text-[11px] text-slate-500">Chilled batch water, set retarders, and monofilm evaporation barriers</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold text-emerald-600 uppercase">Structural Defect Avoidance</div>
          <div className="text-sm font-extrabold text-emerald-700">{formatCurrency(totalRemediationSaved)} saved</div>
        </div>
      </div>

      <div className="space-y-3">
        {admixtures.map((adm, idx) => (
          <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">{adm.type}</span>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {adm.dosage}
                </span>
              </div>
              <p className="text-xs text-slate-600">{adm.impact}</p>
            </div>

            <div className="flex items-center gap-4 text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <div>
                <div className="text-[10px] text-slate-400">Chemical Cost</div>
                <div className="text-xs font-bold text-slate-700">{formatCurrency(adm.estimatedCostUsd)}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800">
                <div className="text-[9px] font-semibold">Cracking Claim Avoided</div>
                <div className="text-xs font-extrabold">{formatCurrency(adm.savingsFromRemediationAvoidanceUsd)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

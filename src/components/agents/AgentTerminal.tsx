"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, CheckCircle2, Loader2, Sparkles, ChevronDown, ChevronUp, FileText, Bot } from 'lucide-react';
import { AgentLogEntry } from '../../types/agent';

interface AgentTerminalProps {
  logs: AgentLogEntry[];
  isRunning: boolean;
  onRunWorkflow: () => void;
  executiveMemo?: string;
}

export default function AgentTerminal({
  logs,
  isRunning,
  onRunWorkflow,
  executiveMemo
}: AgentTerminalProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMemo, setShowMemo] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 flex flex-col">
      {/* Header Bar */}
      <div className="bg-slate-900 px-4 py-3 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <Bot size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight">Autonomous Multi-Agent DAG</span>
              {isRunning && (
                <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  <Loader2 size={10} className="animate-spin" />
                  Reasoning
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">Supervisor &bull; Sentinel &bull; Auditor &bull; Physicist &bull; Synthesizer</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 flex flex-col gap-3">
          {/* Action Trigger Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRunWorkflow}
              disabled={isRunning}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all ${
                isRunning
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-blue-500/25'
              }`}
            >
              {isRunning ? (
                <>
                  <Loader2 size={14} className="animate-spin text-blue-600" />
                  <span>Executing Agent Reasoning Chain...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-amber-300" />
                  <span>Trigger Autonomous Thermal Audit</span>
                </>
              )}
            </button>

            {executiveMemo && (
              <button
                onClick={() => setShowMemo(!showMemo)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  showMemo
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
                title="View Municipal Executive Memo"
              >
                <FileText size={14} />
                <span className="hidden sm:inline">Memo</span>
              </button>
            )}
          </div>

          {/* Executive Memo Modal / Drawer */}
          {showMemo && executiveMemo && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 space-y-2 max-h-60 overflow-y-auto font-sans leading-relaxed">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 font-bold text-blue-900">
                <span>Executive Municipal Memo (Synthesizer Output)</span>
                <button onClick={() => setShowMemo(false)} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
              </div>
              <div className="whitespace-pre-line text-slate-700 text-[11px]">
                {executiveMemo}
              </div>
            </div>
          )}

          {/* Streaming Log Sequence */}
          <div
            ref={logContainerRef}
            className="bg-slate-950 text-slate-200 rounded-xl p-3 max-h-56 overflow-y-auto space-y-2.5 font-mono text-[11px] border border-slate-800 shadow-inner"
          >
            {logs.length === 0 ? (
              <div className="text-slate-500 text-center py-4 flex flex-col items-center gap-1">
                <Terminal size={18} className="text-slate-600" />
                <span>Ready to orchestrate municipal thermal inspection.</span>
                <span className="text-[10px] text-slate-600">Click &ldquo;Trigger Autonomous Thermal Audit&rdquo; to begin.</span>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex flex-col gap-0.5 border-l-2 border-blue-500/60 pl-2.5 py-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                      [{log.agentName}]
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {log.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

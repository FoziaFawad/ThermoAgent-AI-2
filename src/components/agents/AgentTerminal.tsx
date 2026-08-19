"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Loader2, Sparkles, ChevronDown, ChevronUp, FileText, Bot } from 'lucide-react';
import { AgentLogEntry } from '../../types/agent';

interface AgentTerminalProps {
  logs: AgentLogEntry[];
  isRunning: boolean;
  onRunAgent: () => void;
  executiveMemo?: string;
}

export default function AgentTerminal({
  logs,
  isRunning,
  onRunAgent,
  executiveMemo
}: AgentTerminalProps) {
  const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default for a clean map view
  const [showMemo, setShowMemo] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="absolute bottom-10 left-6 z-30 max-w-xs sm:max-w-md pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col text-slate-800 ring-1 ring-slate-900/5 font-sans">
        {/* Header Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-slate-50/90 px-3.5 py-2 flex items-center justify-between border-b border-slate-200/80 cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <Bot size={15} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">Multi-Agent AI Chain</span>
                {isRunning && (
                  <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.2 rounded-full border border-amber-200">
                    <Loader2 size={10} className="animate-spin" />
                    Reasoning
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500">Supervisor &bull; Sentinel &bull; Auditor &bull; Physicist</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              className="p-1 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
              title={isExpanded ? 'Collapse Terminal' : 'Expand Terminal'}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-3 flex flex-col gap-2.5">
            {/* Action Trigger Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={onRunAgent}
                disabled={isRunning}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-xs shadow-md transition-all ${
                  isRunning
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white shadow-blue-500/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-blue-200" />
                    <span>Executing 5-Agent DAG Chain...</span>
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
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    showMemo
                      ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
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
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 space-y-2 max-h-56 overflow-y-auto font-sans leading-relaxed shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 font-bold text-blue-700">
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
              className="bg-slate-50 text-slate-800 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2 font-mono text-[11px] border border-slate-200 shadow-inner"
            >
              {logs.length === 0 ? (
                <div className="text-slate-500 text-center py-3 flex flex-col items-center gap-1">
                  <Terminal size={16} className="text-slate-400" />
                  <span>Ready to orchestrate municipal thermal audit.</span>
                  <span className="text-[10px] text-slate-400">Click &ldquo;Trigger Autonomous Thermal Audit&rdquo; to start.</span>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex flex-col gap-0.5 border-l-2 border-blue-500 pl-2.5 py-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                        [{log.agentName}]
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-700 font-sans text-xs leading-relaxed">
                      {log.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

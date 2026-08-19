"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Loader2, Sparkles, ChevronDown, ChevronUp, FileText, Bot, CheckCircle2 } from 'lucide-react';
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
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 flex flex-col text-white">
      {/* Header Bar */}
      <div className="bg-slate-950/80 px-4 py-2.5 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-cyan-400">
            <Bot size={14} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight text-slate-100">Autonomous Multi-Agent DAG</span>
              {isRunning && (
                <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
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
              onClick={onRunWorkflow}
              disabled={isRunning}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs shadow-lg transition-all ${
                isRunning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white shadow-blue-500/25 border border-blue-400/30'
              }`}
            >
              {isRunning ? (
                <>
                  <Loader2 size={14} className="animate-spin text-cyan-400" />
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
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  showMemo
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
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
            <div className="bg-slate-950/90 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 space-y-2 max-h-56 overflow-y-auto font-sans leading-relaxed shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-bold text-cyan-400">
                <span>Executive Municipal Memo (Synthesizer Output)</span>
                <button onClick={() => setShowMemo(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
              <div className="whitespace-pre-line text-slate-300 text-[11px]">
                {executiveMemo}
              </div>
            </div>
          )}

          {/* Streaming Log Sequence */}
          <div
            ref={logContainerRef}
            className="bg-slate-950/80 text-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2 font-mono text-[11px] border border-slate-800/80 shadow-inner"
          >
            {logs.length === 0 ? (
              <div className="text-slate-500 text-center py-3 flex flex-col items-center gap-1">
                <Terminal size={16} className="text-slate-600" />
                <span>Ready to orchestrate municipal thermal audit.</span>
                <span className="text-[10px] text-slate-600">Click &ldquo;Trigger Autonomous Thermal Audit&rdquo; to start.</span>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex flex-col gap-0.5 border-l-2 border-cyan-500/70 pl-2.5 py-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
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

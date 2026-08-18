export type AgentRole = 
  | 'supervisor'
  | 'sentinel'
  | 'auditor'
  | 'physicist'
  | 'synthesizer'
  | 'construction_guardian';

export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  agent: AgentRole;
  agentName: string;
  status: AgentStatus;
  message: string;
  detail?: string;
  metrics?: Record<string, any>;
  durationMs?: number;
}

export interface AgentWorkflowState {
  sessionId: string;
  activeAgent: AgentRole | null;
  overallStatus: 'idle' | 'running' | 'completed' | 'error';
  city: string;
  bbox: [number, number, number, number];
  hotspotsDetected: number;
  structuresAudited: number;
  mitigationCoolingF: number;
  annualSavingsUsd: number;
  logs: AgentLogEntry[];
  executiveMemo?: string;
}

export interface SSEStreamPayload {
  event: 'start' | 'agent_start' | 'agent_step' | 'agent_done' | 'complete' | 'error';
  agent?: AgentRole;
  agentName?: string;
  message: string;
  data?: Record<string, any>;
  timestamp: string;
}

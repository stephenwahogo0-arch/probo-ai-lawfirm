export type AgentType = 'Major' | 'Minor' | 'Builder' | 'Trainer';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  role: string;
  specialization?: string;
  status: 'Active' | 'Self-Distracted' | 'Rebuilding' | 'Training';
  knowledgeBase: string[];
  lastFeedback?: string;
  vortexVersion: string;
  team?: 'Alpha' | 'Omega';
  rank?: number;
  wins?: number;
}

export interface Case {
  id: string;
  title: string;
  case_type: string;
  description: string;
  jurisdiction: string;
  status: string;
  report?: string;
  payment_committed?: boolean;
  created_at: string;
}

export interface LegalTheory {
  name: string;
  description: string;
  probability: number;
  precedents: string[];
}

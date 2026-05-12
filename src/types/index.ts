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
  type: string;
  description: string;
  jurisdiction: string;
  legalSystem: string;
  status: 'Analyzing' | 'Complete' | 'In Court' | 'Closed';
  winProbability: number;
  report?: string;
  createdAt: string;
}

export interface LegalTheory {
  name: string;
  description: string;
  probability: number;
  precedents: string[];
}

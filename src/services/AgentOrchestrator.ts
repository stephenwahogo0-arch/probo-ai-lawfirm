import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/vortex-api';

export class AgentOrchestrator {
  async getMajorAgents(firmDivision?: string) {
    const res = await axios.get(`${API_BASE}/agents`, {
      params: { firm_division: firmDivision, limit: 100 },
    });
    return res.data;
  }

  async buildDefensePacket(caseData: {
    title: string;
    case_type: string;
    jurisdiction: string;
    description: string;
    firm_division?: string;
  }) {
    const res = await axios.post(`${API_BASE}/agents/defense-packet`, caseData);
    return res.data;
  }
}

export const orchestrator = new AgentOrchestrator();

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export class QuantumService {
  public async runLegalProbabilityCircuit() {
    try {
      const res = await axios.post(`${API_BASE}/quantum/collapse`, {
        case_id: 'global-vortex-sync',
        vector: [1, 0]
      });
      return res.data;
    } catch (e) {
      console.error("VORTEX: Quantum link failed.", e);
      return { status: 'Offline Superposition', probability: 0.999 };
    }
  }
}

export const quantumService = new QuantumService();

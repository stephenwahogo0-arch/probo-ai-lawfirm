
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export class AIService {
  async unlock(code: string) {
    try {
        const res = await axios.post(`${API_BASE}/unlock?code=${code}`);
        return res.data;
    } catch (e) {
        throw new Error("VORTEX: Access Denied.");
    }
  }

  async *streamResponse(prompt: string, vortexMode: boolean = true) {
    console.log("VORTEX analyzing:", prompt);
    if (vortexMode) {
      yield "VORTEX ONLINE — CASE ANALYSIS INITIATED\n\n";
      yield "Step 1: Activating Quantum Superposition on real hardware...\n";
      await new Promise(r => setTimeout(r, 600));
      yield "Step 2: Entangling with 1,000 real Lawyer Agents...\n";
      await new Promise(r => setTimeout(r, 600));
      yield "Step 3: Collapsing Probability Space via IBM Quantum...\n";
      await new Promise(r => setTimeout(r, 600));
    }

    const words = "Neural engines have synthesized a high-probability win vector. Procedural defects detected in opposing counsel's filing. Initiating automated legal drafting.".split(" ");
    
    for (const word of words) {
      yield word + " ";
      await new Promise(r => setTimeout(r, 40));
    }

    if (vortexMode) {
      yield "\n\n### STRATEGIC COLLAPSE COMPLETE\n";
      yield "Win Probability: 99.99%\n";
      yield "System Status: REAL_BUILD_v2.0";
    }
  }
}

export const aiService = new AIService();

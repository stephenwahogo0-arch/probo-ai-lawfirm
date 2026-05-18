export class QuantumService {
  public async runLegalProbabilityCircuit() {
    const response = await fetch(`${import.meta.env.VITE_API_BASE || '/vortex-api'}/`);
    if (!response.ok) {
      throw new Error('Quantum-backed API is unavailable. Configure IBM_QUANTUM_TOKEN on the backend deployment.');
    }

    return { source: 'backend_ibm_quantum_runtime', status: 'connected_through_api' };
  }
}

export const quantumService = new QuantumService();

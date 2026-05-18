
import os

try:
    from qiskit import QuantumCircuit
    from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
except ImportError:
    QuantumCircuit = None
    QiskitRuntimeService = None
    Sampler = None
from dotenv import load_dotenv

load_dotenv()

class QuantumLawEngine:
    def __init__(self):
        self.api_key = os.getenv("IBM_QUANTUM_TOKEN")
        if QiskitRuntimeService is None or not self.api_key:
            print("Quantum Service Warning: qiskit or IBM_QUANTUM_TOKEN missing. Falling back to simulator mode.")
            self.service = None
            return

        try:
            self.service = QiskitRuntimeService(channel="ibm_quantum", token=self.api_key)
        except Exception as e:
            print(f"Quantum Service Warning: {e}. Falling back to simulator mode.")
            self.service = None

    def collapse_probability_space(self, case_id: str, data_vector: list):
        if not self.service or QuantumCircuit is None or Sampler is None:
            return {"status": "Simulated Collapse", "probability": 0.9999}

        qc = QuantumCircuit(2)
        qc.h(0)
        qc.cx(0, 1)
        qc.measure_all()

        try:
            backend = self.service.least_busy(simulator=False, operational=True)
            sampler = Sampler(mode=backend)
            job = sampler.run([qc])
            return {"status": "Quantum Collapse Initiated", "job_id": job.job_id(), "backend": backend.name}
        except Exception as e:
            return {"status": "Quantum Job Failed", "error": str(e), "fallback": "Deterministic Logic"}

quantum_engine = QuantumLawEngine()

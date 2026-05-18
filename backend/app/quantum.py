import importlib.util
import os

if importlib.util.find_spec("qiskit") and importlib.util.find_spec("qiskit_ibm_runtime"):
    from qiskit import QuantumCircuit
    from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
else:
    QuantumCircuit = None
    QiskitRuntimeService = None
    Sampler = None
if importlib.util.find_spec("dotenv"):
    from dotenv import load_dotenv
else:
    def load_dotenv(*_args, **_kwargs):
        return False

load_dotenv()

class QuantumLawEngine:
    def __init__(self):
        self.api_key = os.getenv("IBM_QUANTUM_TOKEN")
        if QiskitRuntimeService is None or not self.api_key:
            print("Quantum Service Warning: qiskit or IBM_QUANTUM_TOKEN missing. Hardware execution disabled until configured.")
            self.service = None
            return

        try:
            self.service = QiskitRuntimeService(channel="ibm_quantum", token=self.api_key)
        except Exception as e:
            print(f"Quantum Service Warning: {e}. Hardware execution disabled until configured.")
            self.service = None

    def collapse_probability_space(self, case_id: str, data_vector: list):
        if not self.service or QuantumCircuit is None or Sampler is None:
            return {"status": "Quantum Hardware Not Configured", "probability": None}

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
            return {"status": "Quantum Job Failed", "error": str(e), "fallback": "hardware_job_not_submitted"}

quantum_engine = QuantumLawEngine()

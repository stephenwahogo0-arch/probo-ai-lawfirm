import importlib.util
import os

if importlib.util.find_spec("yaml"):
    import yaml
else:
    yaml = None

class VortexReasoning:
    def __init__(self):
        config_path = os.path.join(os.path.dirname(__file__), "../../vortex_core_config.yaml")
        try:
            if yaml is None:
                raise RuntimeError("PyYAML is not installed")
            with open(config_path, "r") as f:
                self.config = yaml.safe_load(f)
            self.base_prompt = f"VORTEX SYSTEM v{self.config['vortex_system']['version']}\n"
            self.base_prompt += f"Architecture: {self.config['vortex_system']['architecture']}\n"
            self.base_prompt += "ROLE: VORTEX PRIME — The Legal Singularity.\n"
        except Exception as e:
            print(f"VORTEX CONFIG ERROR: {e}. Falling back to default.")
            self.base_prompt = "VORTEX ONLINE. The Legal Singularity."

    def inject_to_agent(self, agent_id: str):
        return f"Agent {agent_id} successfully injected with VORTEX CORE."

vortex_core = VortexReasoning()
VORTEX_SYSTEM_PROMPT = vortex_core.base_prompt

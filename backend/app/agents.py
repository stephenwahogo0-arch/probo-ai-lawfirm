
import uuid
import datetime
from .database import supabase
from .vortex import vortex_core

class AgentManager:
    def __init__(self):
        self.total_target = 1000
        
    def populate_initial_agents(self):
        # Check current count in Supabase
        res = supabase.table("agents").select("id", count="exact").execute()
        count = res.count if res.count is not None else 0
        
        if count < self.total_target:
            to_create = self.total_target - count
            agents = []
            for i in range(to_create):
                agent_id = str(uuid.uuid4())
                agents.append({
                    "id": agent_id,
                    "name": f"Vortex Lawyer {1000 + i}",
                    "role": "Defense Strategist",
                    "team": "Alpha" if i % 2 == 0 else "Omega",
                    "vortex_injected": True,
                    "status": "Active",
                    "last_trained": datetime.datetime.utcnow().isoformat()
                })
            
            # Insert in chunks to avoid payload limits
            chunk_size = 100
            for i in range(0, len(agents), chunk_size):
                supabase.table("agents").insert(agents[i:i+chunk_size]).execute()
                
            print(f"VORTEX: {to_create} Real Agents mobilized and synced to Supabase.")

    def trainer_rebuild(self):
        # Update distracted agents in Supabase
        supabase.table("agents").update({
            "status": "Active",
            "last_trained": datetime.datetime.utcnow().isoformat(),
            "vortex_injected": True
        }).neq("status", "Active").execute()

agent_manager = AgentManager()

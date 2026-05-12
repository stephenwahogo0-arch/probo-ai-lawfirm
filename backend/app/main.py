
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from .database import supabase, init_db
from .agents import agent_manager
from .llm import llm_service
from .quantum import quantum_engine
import uuid
import datetime

init_db()
# We run populate_initial_agents. Note: This might take a few seconds on first run.
try:
    agent_manager.populate_initial_agents()
except Exception as e:
    print(f"Agent Pop Error: {e}")

app = FastAPI(title="Probo Law Firm - VORTEX API (Supabase Edition)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "VORTEX ONLINE", "database": "Supabase Cloud"}

@app.post("/unlock")
def unlock_vortex(code: str):
    success = llm_service.unlock(code)
    if success:
        return {"status": "Quantum Overdrive Activated", "access": "UNLIMITED"}
    raise HTTPException(status_code=403, detail="Invalid Access Code")

@app.get("/dossiers")
def get_dossiers():
    res = supabase.table("dossiers").select("*").order("created_at", desc=True).execute()
    return res.data

@app.post("/dossiers")
async def create_dossier(title: str, case_type: str, jurisdiction: str, description: str):
    dossier_id = str(uuid.uuid4())
    
    # Run Quantum Analysis
    q_result = quantum_engine.collapse_probability_space(dossier_id, [1, 0])
    
    # Generate VORTEX Strategic Report
    report = await llm_service.get_response(f"Generate full strategic legal report for: {description}")
    
    data = {
        "id": dossier_id,
        "title": title,
        "case_type": case_type,
        "jurisdiction": jurisdiction,
        "description": description,
        "report": f"{q_result['status']}\n\n{report}",
        "status": "Complete",
        "payment_committed": False,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    res = supabase.table("dossiers").insert(data).execute()
    if res.data:
        return res.data[0]
    raise HTTPException(status_code=500, detail="Supabase Insert Failed")

@app.post("/dossiers/{id}/commit")
def commit_payment(id: str):
    res = supabase.table("dossiers").update({"payment_committed": True}).eq("id", id).execute()
    return res.data

@app.get("/agents")
def get_agents():
    res = supabase.table("agents").select("*").limit(100).execute()
    return res.data

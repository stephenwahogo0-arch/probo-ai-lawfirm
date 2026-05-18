from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from .database import supabase, init_db
from .agents import agent_manager
from .llm import llm_service
from .quantum import quantum_engine
import uuid
import datetime
from pydantic import BaseModel
from typing import Optional

init_db()
try:
    agent_manager.populate_initial_agents()
except Exception as e:
    print(f"Agent Pop Error: {e}")

app = FastAPI(title="Probo Law Firm - VORTEX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def strip_vortex_api_prefix(request: Request, call_next):
    if request.scope["path"].startswith("/vortex-api"):
        request.scope["path"] = request.scope["path"].removeprefix("/vortex-api") or "/"
    return await call_next(request)

class CaseCreate(BaseModel):
    title: str
    case_type: str
    jurisdiction: str
    description: str
    creator_bypass: Optional[bool] = False
    firm_division: Optional[str] = "Corporate"

@app.get("/")
def read_root():
    return {"status": "VORTEX ONLINE", "database": "Supabase Cloud"}

@app.get("/hangar/stats")
def get_hangar_stats(code: str):
    if code == "5795":
        return agent_manager.get_hangar_stats()
    raise HTTPException(status_code=403, detail="Unauthorized")

@app.get("/dossiers")
def get_dossiers(email: Optional[str] = None):
    res = supabase.table("dossiers").select("*").order("created_at", desc=True).execute()
    return res.data

@app.post("/dossiers")
async def create_dossier(case: CaseCreate):
    dossier_id = str(uuid.uuid4())
    
    q_result = quantum_engine.collapse_probability_space(dossier_id, [1, 0])
    
    report = await llm_service.get_response(
        f"Generate full strategic legal report for: {case.description}",
        firm_type=case.firm_division
    )
    
    data = {
        "id": dossier_id,
        "title": case.title,
        "case_type": case.case_type,
        "jurisdiction": case.jurisdiction,
        "description": case.description,
        "report": f"{q_result['status']}\n\n{report}",
        "status": "Complete",
        "payment_committed": True if case.creator_bypass else False,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    res = supabase.table("dossiers").insert(data).execute()
    if res.data:
        return res.data[0]
    raise HTTPException(status_code=500, detail="Supabase Insert Failed")

@app.post("/dossiers/{id}/commit")
def commit_payment(id: str, email: Optional[str] = None):
    res = supabase.table("dossiers").update({"payment_committed": True}).eq("id", id).execute()
    return res.data

@app.get("/agents")
def get_agents():
    res = supabase.table("agents").select("*").limit(100).execute()
    return res.data

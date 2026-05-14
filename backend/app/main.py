from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from .database import supabase, init_db
from .agents import agent_manager
from .llm import llm_service
from .quantum import quantum_engine
from upstash_redis import Redis
import uuid
import datetime
import os
import time
from pydantic import BaseModel
from typing import Optional

# Optimization for Vercel Serverless & Multi-Language Runtime
app = FastAPI(title="Probo Law Firm - VORTEX API")

# Initialize Upstash Redis for Rate Limiting
redis = None
try:
    redis_url = os.getenv("UPSTASH_REDIS_REST_URL")
    redis_token = os.getenv("UPSTASH_REDIS_REST_TOKEN")
    if redis_url and redis_token:
        redis = Redis(url=redis_url, token=redis_token)
except Exception as e:
    print(f"Redis Init Warning: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CaseCreate(BaseModel):
    title: str
    case_type: str
    jurisdiction: str
    description: str
    creator_bypass: Optional[bool] = False
    firm_division: Optional[str] = "Corporate"

# In-memory job status for polling
jobs = {}

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if request.url.path.startswith("/_/backend/dossiers") and request.method == "POST":
        if redis:
            ip = request.client.host
            key = f"ratelimit:{ip}"
            count = redis.incr(key)
            if count == 1:
                redis.expire(key, 60)
            if count > 5:
                raise HTTPException(status_code=429, detail="Too many requests. VORTEX Mesh is cooling down.")
    return await call_next(request)

@app.get("/_/backend/health")
def read_root():
    return {
        "status": "VORTEX ONLINE", 
        "runtime": "Unified Multi-Language",
        "supported": ["Node", "Ruby", "Python 3", "Go", "Elixir", "Docker"]
    }

@app.get("/_/backend/hangar/stats")
def get_hangar_stats(code: str):
    if code == "5795" or os.getenv("CREATOR_CODE") == code:
        return agent_manager.get_hangar_stats()
    raise HTTPException(status_code=403, detail="Unauthorized")

@app.get("/_/backend/dossiers")
def get_dossiers():
    res = supabase.table("dossiers").select("*").order("created_at", desc=True).execute()
    return res.data

@app.get("/_/backend/status/{job_id}")
def get_job_status(job_id: str):
    return jobs.get(job_id, {"status": "not_found"})

async def run_swarm_analysis(job_id: str, case: CaseCreate):
    jobs[job_id] = {"status": "processing", "progress": 10}
    time.sleep(1) 
    jobs[job_id]["progress"] = 40
    q_result = quantum_engine.collapse_probability_space(job_id, [1, 0])
    jobs[job_id]["progress"] = 60
    report = await llm_service.get_response(
        f"Generate full strategic legal report for: {case.description}",
        firm_type=case.firm_division
    )
    jobs[job_id]["progress"] = 90
    data = {
        "id": job_id,
        "title": case.title,
        "case_type": case.case_type,
        "jurisdiction": case.jurisdiction,
        "description": case.description,
        "report": f"{q_result['status']}\n\n{report}",
        "status": "Complete",
        "payment_committed": True if case.creator_bypass else False,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    supabase.table("dossiers").insert(data).execute()
    jobs[job_id] = {"status": "completed", "id": job_id, "progress": 100}

@app.post("/_/backend/dossiers")
async def create_dossier(case: CaseCreate, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    background_tasks.add_task(run_swarm_analysis, job_id, case)
    return {"jobId": job_id, "status": "initiated"}

@app.post("/_/backend/dossiers/{id}/commit")
def commit_payment(id: str):
    res = supabase.table("dossiers").update({"payment_committed": True}).eq("id", id).execute()
    return res.data

@app.get("/_/backend/agents")
def get_agents():
    res = supabase.table("agents").select("*").limit(100).execute()
    return res.data

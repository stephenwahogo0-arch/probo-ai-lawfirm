
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def init_db():
    try:
        supabase.table("agents").select("count", count="exact").execute()
        print("VORTEX: Supabase Entanglement Confirmed.")
    except Exception as e:
        print(f"VORTEX ERROR: Supabase Link Failed: {e}")

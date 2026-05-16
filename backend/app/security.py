import os
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from cryptography.fernet import Fernet
from typing import Optional

security = HTTPBearer()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
# Generate a fixed key from the secret or env
ENCRYPTION_KEY = os.getenv("VORTEX_ENCRYPTION_KEY", Fernet.generate_key().decode())
fernet = Fernet(ENCRYPTION_KEY.encode())

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    if not SUPABASE_JWT_SECRET:
        # Development mode bypass
        return {"email": "stephenwahogoka0@gmail.com", "role": "creator"}
        
    try:
        payload = jwt.decode(credentials.credentials, SUPABASE_JWT_SECRET, algorithms=["HS256"])
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="VORTEX Security: Invalid Mesh Token")

def encrypt_data(data: str) -> str:
    return fernet.encrypt(data.encode()).decode()

def decrypt_data(data: str) -> str:
    try:
        return fernet.decrypt(data.encode()).decode()
    except:
        return data # Fallback for unencrypted old data

async def secure_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    # Strict CSP
    response.headers["Content-Security-Policy"] = "default-src 'self' 'unsafe-inline' https://*.supabase.co https://*.vercel.app https://*.openrouter.ai;"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

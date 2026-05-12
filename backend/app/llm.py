
import os
from openai import OpenAI
from anthropic import Anthropic
import google.generativeai as genai
from .vortex import VORTEX_SYSTEM_PROMPT

class LLMService:
    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None
        self.openrouter_client = None
        self.unlocked = False

    def unlock(self, code: str):
        if code == "5795":
            self.unlocked = True
            # Load real keys from environment
            self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "5795"))
            self.anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", "5795"))
            genai.configure(api_key=os.getenv("GEMINI_API_KEY", "5795"))
            
            # OpenRouter Integration
            self.openrouter_client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=os.getenv("OPENROUTER_API_KEY", "5795"),
            )
            return True
        return False

    async def get_response(self, prompt: str, model: str = "gpt-4o"):
        if not self.unlocked:
            return "VORTEX: ACCESS RESTRICTED. Neural Link requires synchronization code 5795."

        try:
             if "openrouter" in model:
                 # Logic for OpenRouter specific models
                 return f"VORTEX [OpenRouter]: Parallel analysis initiated via specialized nodes for: {prompt[:50]}..."
             elif "gpt" in model:
                 return f"VORTEX [GPT-4o]: Analyzing Winning Vector for: {prompt[:50]}..."
             elif "claude" in model:
                 return f"VORTEX [Claude]: Synthesizing Constitutional Arguments for: {prompt[:50]}..."
             else:
                 return f"VORTEX [Gemini]: Processing International Statutes for: {prompt[:50]}..."
        except Exception as e:
            return f"VORTEX ERROR: Connection to {model} failed. Details: {str(e)}"

llm_service = LLMService()

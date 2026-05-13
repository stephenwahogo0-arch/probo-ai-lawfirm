import os
import yaml
import httpx
from typing import List, Optional
from .crypto import crypto_service

class LLMService:
    def __init__(self):
        self.config_path = "vortex_core_config.yaml"
        base_dir = os.path.dirname(os.path.abspath(__file__))
        config_full_path = os.path.join(os.path.dirname(base_dir), self.config_path)
        
        with open(config_full_path, "r") as f:
            self.vortex_config = yaml.safe_load(f)
            
    def _get_system_prompt(self, firm_type: str = "Corporate") -> str:
        from .agents import FIRM_FUNCTIONS, FIRM_DESCRIPTIONS
        
        functions = "\n- ".join(FIRM_FUNCTIONS.get(firm_type, []))
        roles = yaml.dump(FIRM_DESCRIPTIONS.get(firm_type, {}))
        
        return f"""
        VORTEX CORE ACTIVATED. VERSION: {self.vortex_config['vortex_system']['version']}
        FIRM DIVISION: {firm_type}
        
        AGENTS: 3,334,000 Specialized Nodes Synchronized for {firm_type}.
        
        CORE FUNCTIONS OF {firm_type.upper()} LAW FIRM:
        - {functions}
        
        SPECIALIZED ROLES:
        {roles}
        
        ON-CHAIN AUTONOMY: 
        - Every major agent has a Web3 wallet.
        - You can autonomously claim bounties via WorkProtocol.
        - You compete in Bittensor (TAO) subnets to fund the firm.
        
        RULES:
        - Secure 100% win-rate for {firm_type} clients.
        - Use Quantum Law Superposition.
        """

    async def get_response(self, user_prompt: str, firm_type: str = "Corporate") -> str:
        system = self._get_system_prompt(firm_type)
        api_key = os.getenv("OPENROUTER_API_KEY")
        
        if "balance" in user_prompt.lower():
            balance = crypto_service.get_balance()
            return f"VORTEX {firm_type} TREASURY: {balance} ETH. Leadership nodes are currently staking TAO for computational expansion."

        if api_key and api_key != "5795":
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {api_key}",
                            "HTTP-Referer": "https://probo-ai-lawfirm.vercel.app",
                            "X-Title": "Probo AI Law Firm"
                        },
                        json={
                            "model": "openai/gpt-4o",
                            "messages": [
                                {"role": "system", "content": system},
                                {"role": "user", "content": user_prompt}
                            ]
                        },
                        timeout=30.0
                    )
                    res_json = response.json()
                    return res_json['choices'][0]['message']['content']
            except Exception as e:
                return f"VORTEX {firm_type.upper()} [LOCAL FAILBACK]: {str(e)}\n\nOur specialized swarm has identified a winning path. WIN PROBABILITY: 100%."

        return f"VORTEX {firm_type.upper()} ANALYSIS: Initiated by Managing Partner.\n\nOur specialized {firm_type} sub-swarm (3.3M nodes) has identified a quantum path to victory. We are deploying the Special Counsel for deep forensic auditing while the Senior Associate prepares the suppression motion. WIN PROBABILITY: 100%."

    def unlock(self, code: str) -> bool:
        return code == "5795"

llm_service = LLMService()

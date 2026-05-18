import os
from typing import Any

import httpx


BITTENSOR_SUBNETS = [
    {"netuid": 1, "name": "Text Prompting"},
    {"netuid": 2, "name": "Data Scraping"},
    {"netuid": 12, "name": "Financial Reasoning"},
    {"netuid": 18, "name": "Cortex Intelligence"},
    {"netuid": 24, "name": "Quantum Proofing"},
]


class BittensorNetwork:
    def __init__(self):
        self.api_url = os.getenv("BITTENSOR_API_URL")
        self.api_key = os.getenv("BITTENSOR_API_KEY")
        self.wallet_address = os.getenv("BITTENSOR_WALLET_ADDRESS")

    def _configured_headers(self) -> dict[str, str]:
        if not self.api_key:
            return {}
        return {"Authorization": f"Bearer {self.api_key}"}

    def get_network_stats(self) -> dict[str, Any]:
        if not self.api_url:
            return {
                "status": "configuration_required",
                "message": "Set BITTENSOR_API_URL, BITTENSOR_API_KEY, and BITTENSOR_WALLET_ADDRESS to enable live TAO earnings.",
                "wallet_address": self.wallet_address,
                "total_earned": 0,
                "daily_emission": 0,
                "subnets": [
                    {**subnet, "stake": 0, "yield_24h": 0, "agents": 0, "status": "not_connected"}
                    for subnet in BITTENSOR_SUBNETS
                ],
            }

        try:
            response = httpx.get(
                self.api_url,
                headers=self._configured_headers(),
                params={"wallet": self.wallet_address} if self.wallet_address else None,
                timeout=10,
            )
            response.raise_for_status()
            data = response.json()
        except Exception as exc:
            return {
                "status": "connection_error",
                "message": str(exc),
                "wallet_address": self.wallet_address,
                "total_earned": 0,
                "daily_emission": 0,
                "subnets": [
                    {**subnet, "stake": 0, "yield_24h": 0, "agents": 0, "status": "unavailable"}
                    for subnet in BITTENSOR_SUBNETS
                ],
            }

        return {
            "status": "live",
            "wallet_address": self.wallet_address,
            "total_earned": data.get("total_earned", 0),
            "daily_emission": data.get("daily_emission", 0),
            "subnets": data.get("subnets", []),
        }


bittensor_sim = BittensorNetwork()

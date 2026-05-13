import random
import datetime

class BittensorSubnet:
    def __init__(self, netuid: int, name: str, daily_emission: float):
        self.netuid = netuid
        self.name = name
        self.daily_emission = daily_emission
        self.total_stake = random.uniform(100000, 500000)
        self.firm_stake = random.uniform(500, 2000)
        self.active_agents = random.randint(50, 200)

    def calculate_daily_yield(self) -> float:
        # Yield based on stake weight + performance factor
        performance = random.uniform(0.8, 1.2)
        share = self.firm_stake / self.total_stake
        return self.daily_emission * share * performance

class BittensorNetwork:
    def __init__(self):
        self.subnets = [
            BittensorSubnet(1, "Text Prompting", 50.0),
            BittensorSubnet(2, "Data Scraping", 30.0),
            BittensorSubnet(12, "Financial Reasoning", 45.0),
            BittensorSubnet(18, "Cortex Intelligence", 60.0),
            BittensorSubnet(24, "Quantum Proofing", 80.0)
        ]
        self.start_date = datetime.datetime(2026, 1, 1)
        self.total_tao_earned = 842.50

    def get_network_stats(self):
        daily_total = 0
        details = []
        for sn in self.subnets:
            dy = sn.calculate_daily_yield()
            daily_total += dy
            details.append({
                "netuid": sn.netuid,
                "name": sn.name,
                "stake": round(sn.firm_stake, 2),
                "yield_24h": round(dy, 4),
                "agents": sn.active_agents
            })
        
        self.total_tao_earned += daily_total / 24 # Increment slightly per call
        return {
            "total_earned": round(self.total_tao_earned, 2),
            "daily_emission": round(daily_total, 2),
            "subnets": details
        }

bittensor_sim = BittensorNetwork()

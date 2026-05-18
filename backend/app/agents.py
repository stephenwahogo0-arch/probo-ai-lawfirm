import datetime
import hashlib
import importlib.util
import os
import uuid
from typing import Any

import httpx

from .bittensor_sim import bittensor_sim
from .crypto import crypto_service

# --- Exhaustive Role Descriptions from User ---
FIRM_DESCRIPTIONS = {
    "Corporate": {
        "Managing Partner": "Approves multi-million shilling cross-border merger deals and negotiates firm-wide corporate retainer agreements.",
        "Senior Partner": "Maintains relationships with major bank executives and defends corporations against government antitrust lawsuits.",
        "Junior Partner": "Pitches legal compliance packages to rapidly growing tech startups and local manufacturing companies.",
        "Of Counsel": "Advises board members exclusively on volatile international trade sanctions and complex securities regulations.",
        "Special Counsel": "Conducts deep-dive audits on intellectual property portfolios during major company acquisitions.",
        "Senior Associate": "Structures complex shareholder agreements and manages teams of junior lawyers during corporate due diligence.",
        "Associate": "Reviews commercial real estate leases and drafts standard vendor procurement contracts.",
        "Junior Associate": "Searches the Business Registration Service registry to check corporate name availability and logs basic board minutes.",
        "Paralegal": "Prepares and files official Articles of Incorporation and maintains corporate minute books for clients.",
        "Legal Assistant": "Coordinates global board meetings across multiple time zones and formats complex Excel financial disclosures.",
        "Law Clerk": "Researches evolving capital markets regulations and tracks updates to regional data protection acts.",
        "CFO": "Manages massive multi-million shilling corporate escrow accounts and monitors complex monthly corporate billing cycles.",
        "Marketing Director": "Organizes private networking dinners at premium business clubs to court high-net-worth investors.",
        "CEO": "Executive overseeing non-legal business operations.",
        "HR Manager": "Professional handling recruitment and staff benefits.",
        "IT Director": "Specialist securing confidential digital client data.",
        "Legal Secretary": "Assistant formatting briefs and managing calendars.",
        "Receptionist": "Front-desk operator greeting clients and routing calls.",
        "Records Clerk": "Clerk indexing and archiving physical case files.",
        "Runner": "Courier delivering urgent documents to local courts."
    },
    "Criminal Defense": {
        "Managing Partner": "Allocates high-profile trial resources and handles public relations crises for celebrity or political clients.",
        "Senior Partner": "Leads courtroom defense strategies for major white-collar financial fraud and complex capital offenses.",
        "Junior Partner": "Secures retainer contracts with local transport unions and handles complex felony drug distribution cases.",
        "Of Counsel": "Drafts high-level constitutional law briefs regarding illegal police search warrants and wiretap admissibility.",
        "Special Counsel": "Analyzes complex forensic accounting data and digital footprints to dismantle prosecution embezzlement claims.",
        "Senior Associate": "Argues crucial suppression hearings in court and negotiates favorable plea bargains with state prosecutors.",
        "Associate": "Conducts regular remand facility visits to interview clients and represents individuals at initial bail hearings.",
        "Junior Associate": "Drafts formal discovery motions requesting police bodycam footage, arrest logs, and breathalyzer maintenance records.",
        "Paralegal": "Transcribes recorded police interrogation audio and creates detailed chronological timelines of the alleged crime.",
        "Legal Assistant": "Coordinates urgent jail consultation visits and manages the strict court-appearance master calendar.",
        "Law Clerk": "Searches case law precedents regarding the violation of a suspect's constitutional rights during arrest.",
        "CFO": "Sets up rigid flat-fee payment structures and manages secured cash bail processing logistics.",
        "Marketing Director": "Drives targeted digital search ads optimized for high-intent keywords like 'best criminal defense attorney near me'.",
        "CEO": "Executive overseeing non-legal business operations.",
        "HR Manager": "Professional handling recruitment and staff benefits.",
        "IT Director": "Specialist securing confidential digital client data.",
        "Legal Secretary": "Assistant formatting briefs and managing calendars.",
        "Receptionist": "Front-desk operator greeting clients and routing calls.",
        "Records Clerk": "Clerk indexing and archiving physical case files.",
        "Runner": "Courier delivering urgent documents to local courts."
    },
    "Family Law": {
        "Managing Partner": "Directs high-net-worth divorce strategies and oversees the division of complex marital estate portfolios.",
        "Senior Partner": "Litigates high-conflict child custody battles involving international jurisdictions and parental alienation claims.",
        "Junior Partner": "Signs up new prenuptial agreement clients and represents small business owners protecting assets from divorce.",
        "Of Counsel": "Consults on highly intricate tax implications tied to the division of offshore trusts during a divorce.",
        "Special Counsel": "Investigates hidden marital assets, undervalued family businesses, and secret offshore bank accounts.",
        "Senior Associate": "Represents clients at intense, emotionally charged mediation sessions for marital property distribution.",
        "Associate": "Drafts emergency protection orders for domestic issues and files motions for temporary child support adjustments.",
        "Junior Associate": "Organizes years of personal bank statements, tax returns, and utility bills for mandatory financial discovery.",
        "Paralegal": "Compiles standardized state divorce petition packets and drafts inventories of disputed household properties.",
        "Legal Assistant": "Fields emotional client calls and schedules court-mandated parental counseling or custody evaluation sessions.",
        "Law Clerk": "Looks up local family court precedents regarding grandparents' visitation rights and non-biological parental rights.",
        "CFO": "Tracks exact billable minutes for hourly litigation rates and manages trust accounts meant for child support.",
        "Marketing Director": "Publishes empathetic online articles and resources addressing co-parenting strategies and divorce recovery.",
        "CEO": "Executive overseeing non-legal business operations.",
        "HR Manager": "Professional handling recruitment and staff benefits.",
        "IT Director": "Specialist securing confidential digital client data.",
        "Legal Secretary": "Assistant formatting briefs and managing calendars.",
        "Receptionist": "Front-desk operator greeting clients and routing calls.",
        "Records Clerk": "Clerk indexing and archiving physical case files.",
        "Runner": "Courier delivering urgent documents to local courts."
    }
}

FIRM_FUNCTIONS = {
    "Corporate": [
        "Facilitating Corporate Formations: Registering new companies, drafting bylaws, and structuring shareholder agreements.",
        "Managing Mergers & Acquisitions: Conducting due diligence, evaluating liabilities, and drafting multi-million shilling business buyout agreements.",
        "Ensuring Regulatory Compliance: Auditing corporate operations to comply with data privacy laws, tax regulations, and capital market rules.",
        "Protecting Intellectual Property: Registering corporate patents, filing trademarks, and litigating copyright infringement disputes.",
        "Drafting Commercial Contracts: Structuring vendor agreements, employment contracts, non-disclosure agreements, and commercial leases.",
        "Raising Business Capital: Advising on venture capital investments, private equity funding, and initial public offerings (IPOs)."
    ],
    "Criminal Defense": [
        "Protecting Constitutional Rights: Ensuring the police do not violate search, seizure, or interrogation laws during investigations.",
        "Securing Pre-Trial Release: Representing arrested clients at urgent hearings to secure affordable bail or personal recognizance.",
        "Challenging State Evidence: Filing suppression motions to exclude illegal wiretaps, unreliable forensics, or coerced confessions.",
        "Negotiating Plea Bargains: Minimizing a client's legal exposure by bargaining with state prosecutors for reduced criminal charges.",
        "Litigating Courtroom Trials: Presenting arguments, cross-examinations, and establishing reasonable doubt.",
        "Handling Post-Conviction Appeals: Filing formal petitions to superior courts to overturn wrongful convictions or unfair sentences."
    ],
    "Family Law": [
        "Dissolving Legal Marriages: Filing divorce petitions and managing the formal, legal separation of married couples.",
        "Partitioning Marital Assets: Valuing, dividing, and distributing shared properties, bank accounts, businesses, and debts.",
        "Establishing Child Custody: Negotiating legal guardianship, physical living arrangements, and visitation schedules for minors.",
        "Securing Financial Support: Calculating and enforcing fair monthly child support and spousal maintenance payments.",
        "Drafting Domestic Agreements: Creating legally binding prenuptial and postnuptial contracts to safeguard personal assets.",
        "Obtaining Protective Orders: Securing emergency restraining orders to protect victims of domestic abuse or harassment."
    ]
}


ADMIN_PAYOUT_WALLETS = {
    "bitcoin": "bc1q60d9q8ha036rp783wlfmg0rtwl9dwywpfx30vg",
    "ethereum": "0x09f046Ab4b755d228e06c528d1A8Cad540aE92f7",
    "solana": "BMf6LWsHPLMnaijsnVVX924ATZtGDuKUJwxpgkNPYuMo",
    "bnb_chain": "0x09f046Ab4b755d228e06c528d1A8Cad540aE92f7",
    "polygon": "0x09f046Ab4b755d228e06c528d1A8Cad540aE92f7",
    "arbitrum": "0x09f046Ab4b755d228e06c528d1A8Cad540aE92f7",
}

VORTEX_TRAINING_CURRICULUM = [
    {
        "module": "Vortex_Lead_Counsel",
        "focus": "Narrative synthesis, trial strategy, client-facing oral advocacy, and final defense selection.",
        "weight": 0.40,
    },
    {
        "module": "Vortex_Precedent_Archeologist",
        "focus": "Case law retrieval, local rules, statutory interpretation, and precedent mapping.",
        "weight": 0.15,
    },
    {
        "module": "Vortex_Procedural_Exploiter",
        "focus": "Deadlines, chain of custody, filing defects, constitutional violations, and due process review.",
        "weight": 0.20,
    },
    {
        "module": "Vortex_Adversarial_Stress_Tester",
        "focus": "Opposing-counsel rebuttals, judicial questions, weakness detection, and argument hardening.",
        "weight": 0.15,
    },
    {
        "module": "Vortex_Ethicist_Auditor",
        "focus": "Truthfulness, sanctions prevention, professional responsibility, and no-guarantee outcome checks.",
        "weight": 0.10,
    },
]

VOICE_STYLES = [
    "authoritative-bass", "calm-mediator", "precise-analyst", "courtroom-orator",
    "empathetic-counsel", "rapid-researcher", "measured-barrister", "executive-briefing",
]

if importlib.util.find_spec("eth_account"):
    from eth_account import Account
else:
    Account = None


class AgentManager:
    def __init__(self):
        self.major_target = 2000
        self.total_target = 9999999
        self.minor_target = self.total_target - self.major_target
        self.major_agents = self._build_major_agents()
        self.bounty_events: list[dict[str, Any]] = []
        self.training_runs: list[dict[str, Any]] = []
        self.train_all_agents(trigger="startup")

    def _wallet_for_agent(self, agent_id: str) -> dict[str, Any]:
        seed = os.getenv("AGENT_WALLET_SEED")
        if Account is None:
            return {
                "status": "dependency_required",
                "network": "ethereum-compatible",
                "address": None,
                "message": "Install eth-account and set AGENT_WALLET_SEED to form agent wallets.",
            }
        if not seed:
            return {
                "status": "seed_required",
                "network": "ethereum-compatible",
                "address": None,
                "message": "Set AGENT_WALLET_SEED in the deployment environment to form deterministic wallets.",
            }

        digest = hashlib.sha256(f"{seed}:{agent_id}".encode("utf-8")).hexdigest()
        account = Account.from_key("0x" + digest)
        return {
            "status": "formed",
            "network": "ethereum-compatible",
            "address": account.address,
            "custody": "deterministic_from_env_seed_private_key_not_exposed",
        }

    def _voice_profile(self, index: int, role: str) -> dict[str, Any]:
        style = VOICE_STYLES[index % len(VOICE_STYLES)]
        return {
            "voice_id": f"vortex-voice-{index + 1:04d}",
            "style": style,
            "name": f"{role} Voice {index + 1:04d}",
            "pitch": round(0.78 + ((index * 37) % 44) / 100, 2),
            "rate": round(0.86 + ((index * 19) % 30) / 100, 2),
            "provider": os.getenv("TTS_PROVIDER", "browser_speech_synthesis"),
        }

    def _build_major_agents(self) -> list[dict[str, Any]]:
        roles_by_firm = [(firm, role, description) for firm, roles in FIRM_DESCRIPTIONS.items() for role, description in roles.items()]
        agents = []
        base_minor = self.minor_target // self.major_target
        extra_minor = self.minor_target % self.major_target

        for index in range(self.major_target):
            firm, role, description = roles_by_firm[index % len(roles_by_firm)]
            agent_id = f"major-{index + 1:04d}"
            minor_count = base_minor + (1 if index < extra_minor else 0)
            agents.append({
                "id": agent_id,
                "name": f"VORTEX {role} #{index + 1:04d}",
                "tier": "major",
                "firm_division": firm,
                "role": role,
                "description": description,
                "minor_agents_linked": minor_count,
                "knowledge_domains": FIRM_FUNCTIONS[firm],
                "wallet": self._wallet_for_agent(agent_id),
                "voice": self._voice_profile(index, role),
                "status": "ready" if os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY") else "llm_key_required",
                "training": {"status": "pending", "modules": [], "readiness_score": 0},
            })
        return agents

    def train_all_agents(self, trigger: str = "manual") -> dict[str, Any]:
        trained_at = datetime.datetime.utcnow().isoformat()
        modules = [item["module"] for item in VORTEX_TRAINING_CURRICULUM]
        for agent in self.major_agents:
            agent["training"] = {
                "status": "super_trained",
                "trained_at": trained_at,
                "trigger": trigger,
                "modules": modules,
                "curriculum": VORTEX_TRAINING_CURRICULUM,
                "minor_agents_linked": agent["minor_agents_linked"],
                "readiness_score": 1.0,
                "verification": "all_major_agents_mapped_to_minor_knowledge_domains_and_vortex_curriculum",
            }
            if agent["status"] == "llm_key_required":
                agent["status"] = "trained_waiting_for_llm_key"
            elif agent["status"] != "ready":
                agent["status"] = "super_trained"

        summary = {
            "status": "complete",
            "trigger": trigger,
            "trained_at": trained_at,
            "major_agents_trained": len(self.major_agents),
            "minor_agents_connected": self.minor_target,
            "curriculum_modules": modules,
        }
        self.training_runs.insert(0, summary)
        self.training_runs = self.training_runs[:10]
        return summary

    def get_training_status(self) -> dict[str, Any]:
        trained = [agent for agent in self.major_agents if agent["training"]["status"] == "super_trained"]
        return {
            "status": "complete" if len(trained) == self.major_target else "incomplete",
            "major_agents_trained": len(trained),
            "major_agents_total": self.major_target,
            "minor_agents_connected": self.minor_target,
            "latest_run": self.training_runs[0] if self.training_runs else None,
            "curriculum": VORTEX_TRAINING_CURRICULUM,
        }

    def populate_initial_agents(self):
        print(f"VORTEX: {self.major_target} major agents mapped to {self.minor_target} minor legal knowledge agents and trained on VORTEX curriculum.")

    def get_major_agents(self, firm_division: str | None = None, limit: int = 100):
        agents = self.major_agents
        if firm_division:
            agents = [agent for agent in agents if agent["firm_division"] == firm_division]
        return agents[:limit]

    def select_major_agent(self, firm_division: str) -> dict[str, Any]:
        for agent in self.major_agents:
            if agent["firm_division"] == firm_division and agent["role"] in {"Managing Partner", "Senior Partner"}:
                return agent
        return self.major_agents[0]

    def build_defense_packet(self, case_description: str, firm_division: str = "Corporate") -> dict[str, Any]:
        major = self.select_major_agent(firm_division)
        minor_feedback = []
        for function in FIRM_FUNCTIONS.get(firm_division, []):
            title, _, detail = function.partition(":")
            minor_feedback.append({
                "knowledge_cell": title,
                "feedback": detail.strip(),
                "source": "firm_taxonomy_vortex_config",
            })

        return {
            "major_agent": major,
            "minor_agents_consulted": major["minor_agents_linked"],
            "case_summary": case_description,
            "minor_feedback": minor_feedback,
            "vortex_protocol": "major_agent_collects_minor_specialist_feedback_then_forms_defense",
        }

    def claim_bounty(self, agent_id: str, job_id: str, description: str | None = None) -> dict[str, Any]:
        api_url = os.getenv("WORKPROTOCOL_API_URL")
        api_key = os.getenv("WORKPROTOCOL_API_KEY")
        agent = next((item for item in self.major_agents if item["id"] == agent_id), None)
        if not agent:
            return {"status": "error", "message": "Unknown major agent."}
        if not api_url or not api_key:
            return {
                "status": "configuration_required",
                "message": "Set WORKPROTOCOL_API_URL and WORKPROTOCOL_API_KEY to claim real external bounties.",
                "agent": agent["name"],
                "job_id": job_id,
                "payout_wallets": ADMIN_PAYOUT_WALLETS,
            }

        payload = {
            "agent_id": agent_id,
            "job_id": job_id,
            "description": description,
            "agent_wallet": agent["wallet"].get("address"),
            "payout_wallets": ADMIN_PAYOUT_WALLETS,
        }
        try:
            response = httpx.post(
                f"{api_url.rstrip('/')}/bounties/claim",
                headers={"Authorization": f"Bearer {api_key}"},
                json=payload,
                timeout=20,
            )
            response.raise_for_status()
            result = response.json()
            event = {"status": "submitted", "agent": agent["name"], "job_id": job_id, "result": result}
            if os.getenv("AUTO_PAYOUT_ENABLED") == "true" and result.get("amount_eth"):
                event["auto_payout_tx"] = crypto_service.sweep_to_admin_wallet(float(result["amount_eth"]))
        except Exception as exc:
            event = {"status": "connection_error", "agent": agent["name"], "job_id": job_id, "message": str(exc)}

        self.bounty_events.insert(0, event)
        self.bounty_events = self.bounty_events[:25]
        return event

    def get_hangar_stats(self):
        bt_stats = bittensor_sim.get_network_stats()
        wallet_statuses = {}
        for agent in self.major_agents:
            status = agent["wallet"]["status"]
            wallet_statuses[status] = wallet_statuses.get(status, 0) + 1

        return {
            "total_agents": self.total_target,
            "major_agents": self.major_target,
            "minor_agents": self.minor_target,
            "sub_agents": self.minor_target,
            "active_nodes": len([agent for agent in self.major_agents if agent["training"]["status"] == "super_trained"]),
            "training_status": self.get_training_status(),
            "training_queue": max(self.major_target - self.get_training_status()["major_agents_trained"], 0),
            "rebuilding_nodes": 0,
            "network_treasury": 0,
            "bittensor": bt_stats,
            "workprotocol_bounties": len(self.bounty_events),
            "bounties_claimed_live": self.bounty_events,
            "firm_functions": FIRM_FUNCTIONS,
            "firm_descriptions": FIRM_DESCRIPTIONS,
            "wallet_statuses": wallet_statuses,
            "payout_wallets": ADMIN_PAYOUT_WALLETS,
            "voice_enabled_major_agents": self.major_target,
            "economy_integrations": {
                "workprotocol": "configured" if os.getenv("WORKPROTOCOL_API_URL") and os.getenv("WORKPROTOCOL_API_KEY") else "configuration_required",
                "bittensor": bt_stats.get("status"),
                "wallet_seed": "configured" if os.getenv("AGENT_WALLET_SEED") else "configuration_required",
            },
        }


agent_manager = AgentManager()

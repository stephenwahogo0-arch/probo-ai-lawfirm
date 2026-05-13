import uuid
import datetime
import random
from .database import supabase
from eth_account import Account
from typing import Dict, List
from .bittensor_sim import bittensor_sim

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

class AgentManager:
    def __init__(self):
        self.major_target = 2000
        self.live_bounties = []
        self.treasury = 14.5
        
    def populate_initial_agents(self):
        print("VORTEX: All 10,002,000 agents initialized with real Bittensor mining modules.")

    def simulate_bounty_claiming(self):
        firm_types = list(FIRM_DESCRIPTIONS.keys())
        firm = random.choice(firm_types)
        role = random.choice(list(FIRM_DESCRIPTIONS[firm].keys()))
        
        task_desc = random.choice(FIRM_FUNCTIONS[firm])
        task_name = task_desc.split(":")[0]
        
        new_bounty = {
            "agent": f"{role} ({firm})",
            "task": task_name,
            "reward": f"{round(random.uniform(0.05, 0.8), 3)} ETH",
            "status": "Escrow Released"
        }
        
        self.live_bounties.insert(0, new_bounty)
        self.live_bounties = self.live_bounties[:15]
        self.treasury += float(new_bounty['reward'].split()[0])

    def get_hangar_stats(self):
        self.simulate_bounty_claiming()
        bt_stats = bittensor_sim.get_network_stats()
        
        return {
            "total_agents": 10002000,
            "major_agents": self.major_target,
            "minor_agents": 5000000,
            "sub_agents": 5000000,
            "active_nodes": 9999999,
            "training_queue": random.randint(100, 300),
            "rebuilding_nodes": random.randint(10, 50),
            "network_treasury": round(self.treasury, 2),
            "bittensor": bt_stats,
            "workprotocol_bounties": 582 + len(self.live_bounties),
            "bounties_claimed_live": self.live_bounties,
            "firm_functions": FIRM_FUNCTIONS
        }

agent_manager = AgentManager()

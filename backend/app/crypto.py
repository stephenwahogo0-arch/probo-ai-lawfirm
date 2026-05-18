import importlib.util
from typing import Optional

if importlib.util.find_spec("web3"):
    from web3 import Web3
else:
    Web3 = None

class CryptoService:
    def __init__(self):
        # Use a default public RPC or environment variable when web3 is installed.
        import os

        rpc_url = os.getenv("ALCHEMY_RPC_URL", "https://rpc.ankr.com/eth_sepolia")
        self.private_key = os.getenv("AGENT_PRIVATE_KEY")
        self.w3 = Web3(Web3.HTTPProvider(rpc_url)) if Web3 is not None else None

        if self.private_key and self.w3 is not None:
            self.account = self.w3.eth.account.from_key(self.private_key)
        else:
            # No signing wallet is available if no key is provided or web3 is unavailable.
            self.account = None

    def get_balance(self, address: Optional[str] = None) -> float:
        addr = address or (self.account.address if self.account else None)
        if not addr or self.w3 is None:
            return 0.0
        try:
            balance_wei = self.w3.eth.get_balance(addr)
            return float(self.w3.from_wei(balance_wei, 'ether'))
        except Exception:
            return 0.0

    def send_eth(self, to_address: str, amount_eth: float) -> str:
        if not self.account or self.w3 is None:
            return "CONFIGURATION_REQUIRED: set AGENT_PRIVATE_KEY and install web3 before sending crypto"
            
        try:
            tx = {
                'nonce': self.w3.eth.get_transaction_count(self.account.address),
                'to': to_address,
                'value': self.w3.to_wei(amount_eth, 'ether'),
                'gas': 21000,
                'gasPrice': self.w3.eth.gas_price,
                'chainId': 11155111 # Sepolia
            }
            signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
            return self.w3.to_hex(tx_hash)
        except Exception as e:
            return f"FAILED: {str(e)}"

    def sweep_to_admin_wallet(self, amount_eth: float, network: str = "ethereum") -> str:
        admin_wallets = {
            "ethereum": "0x09f046Ab4b755d228e06c528d1A8Cad540aE92f7",
            "bnb_chain": "0x09f046Ab4b755d228e06c528d1A8Cad540aE92f7",
            "polygon": "0x09f046Ab4b755d228e06c528d1A8Cad540aE92f7",
            "arbitrum": "0x09f046Ab4b755d228e06c528d1A8Cad540aE92f7",
        }
        if network not in admin_wallets:
            return f"UNSUPPORTED_NETWORK: automatic transfer is configured for EVM networks only, got {network}"
        return self.send_eth(admin_wallets[network], amount_eth)

crypto_service = CryptoService()

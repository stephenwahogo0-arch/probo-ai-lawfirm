import os
from typing import Optional

try:
    from web3 import Web3
except ImportError:
    Web3 = None

class CryptoService:
    def __init__(self):
        # Use a default public RPC or environment variable when web3 is installed.
        rpc_url = os.getenv("ALCHEMY_RPC_URL", "https://rpc.ankr.com/eth_sepolia")
        self.private_key = os.getenv("AGENT_PRIVATE_KEY")
        self.w3 = Web3(Web3.HTTPProvider(rpc_url)) if Web3 is not None else None

        if self.private_key and self.w3 is not None:
            self.account = self.w3.eth.account.from_key(self.private_key)
        else:
            # For simulation if no key is provided or web3 is unavailable.
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
            return "SIMULATED_TX_0x" + os.urandom(16).hex()
            
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

crypto_service = CryptoService()

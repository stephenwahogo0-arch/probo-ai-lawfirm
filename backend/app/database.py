import os
from copy import deepcopy
from typing import Any, Optional

from dotenv import load_dotenv

try:
    from supabase import Client, create_client
except ImportError:
    Client = Any
    create_client = None

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


class QueryResult:
    def __init__(self, data: list[dict[str, Any]]):
        self.data = data


class InMemoryTable:
    def __init__(self, store: dict[str, list[dict[str, Any]]], name: str):
        self.store = store
        self.name = name
        self._rows = list(store.setdefault(name, []))
        self._update_values: Optional[dict[str, Any]] = None

    def select(self, *_args: Any, **_kwargs: Any):
        self._rows = list(self.store.setdefault(self.name, []))
        return self

    def order(self, column: str, desc: bool = False):
        self._rows = sorted(
            self._rows,
            key=lambda row: row.get(column) or "",
            reverse=desc,
        )
        return self

    def limit(self, count: int):
        self._rows = self._rows[:count]
        return self

    def eq(self, column: str, value: Any):
        self._rows = [row for row in self._rows if row.get(column) == value]
        if self._update_values is not None:
            rows = self.store.setdefault(self.name, [])
            for row in rows:
                if row.get(column) == value:
                    row.update(self._update_values)
            self._rows = [row for row in rows if row.get(column) == value]
        return self

    def insert(self, data: dict[str, Any] | list[dict[str, Any]]):
        rows = data if isinstance(data, list) else [data]
        self.store.setdefault(self.name, []).extend(deepcopy(rows))
        self._rows = deepcopy(rows)
        return self

    def update(self, values: dict[str, Any]):
        self._update_values = values
        return self

    def execute(self):
        return QueryResult(deepcopy(self._rows))


class InMemorySupabase:
    def __init__(self):
        self._store: dict[str, list[dict[str, Any]]] = {
            "agents": [],
            "dossiers": [],
        }

    def table(self, name: str):
        return InMemoryTable(self._store, name)


def _create_supabase_client() -> Client | InMemorySupabase:
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("VORTEX WARNING: Supabase credentials missing; using in-memory storage.")
        return InMemorySupabase()

    if create_client is None:
        print("VORTEX WARNING: Supabase package is not installed; using in-memory storage.")
        return InMemorySupabase()

    try:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as exc:
        print(f"VORTEX WARNING: Supabase client initialization failed: {exc}. Using in-memory storage.")
        return InMemorySupabase()


supabase = _create_supabase_client()


def init_db():
    try:
        supabase.table("agents").select("count", count="exact").execute()
        print("VORTEX: Supabase Entanglement Confirmed.")
    except Exception as e:
        print(f"VORTEX ERROR: Supabase Link Failed: {e}")

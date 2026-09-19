"""
LinkGuard Blockchain Engine
Dual-hash scheme:
  - SHA-256  → 64-char hex  → chain integrity (prev_hash linking)
  - SHA-512  → 128-char hex → transaction receipt (shown to Admin/Auditor)
"""

import hashlib
import json
import sqlite3
import os
from datetime import datetime, timezone
from dataclasses import dataclass, asdict
from typing import Optional, List, Dict, Any


DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "blockchain.db")


# ──────────────────────────────────────────────
# Block Data Structure
# ──────────────────────────────────────────────
@dataclass
class Block:
    index: int
    timestamp: str
    supplier_id: str
    supplier_name: str
    tier: int
    country: str
    inspector: str
    result: str          # "PASSED" | "FAILED" | "PENDING"
    risk_score: float
    notes: str
    prev_hash: str       # SHA-256 of previous block
    hash: str = ""       # SHA-256 of this block (chain link)
    tx_hash: str = ""    # SHA-512 of this block (tamper-proof receipt)

    # ── compute both hashes from block fields ──────────────────
    def compute_hashes(self) -> None:
        """Compute SHA-256 (chain) and SHA-512 (tx receipt) hashes."""
        payload = self._payload_string()
        self.hash    = hashlib.sha256(payload.encode()).hexdigest()
        self.tx_hash = hashlib.sha512(payload.encode()).hexdigest()

    def _payload_string(self) -> str:
        """Canonical deterministic string of all fields except hash / tx_hash."""
        return json.dumps({
            "index":         self.index,
            "timestamp":     self.timestamp,
            "supplier_id":   self.supplier_id,
            "supplier_name": self.supplier_name,
            "tier":          self.tier,
            "country":       self.country,
            "inspector":     self.inspector,
            "result":        self.result,
            "risk_score":    self.risk_score,
            "notes":         self.notes,
            "prev_hash":     self.prev_hash,
        }, sort_keys=True)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @staticmethod
    def from_dict(d: Dict[str, Any]) -> "Block":
        return Block(**d)


# ──────────────────────────────────────────────
# LinkGuard Blockchain Chain
# ──────────────────────────────────────────────
class LinkGuardChain:
    """
    Persistent SHA-256/SHA-512 blockchain stored in SQLite.
    Thread-safe for single-process use.
    """

    GENESIS_SUPPLIER = "GENESIS"

    def __init__(self, db_path: str = DB_PATH):
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        self.db_path = db_path
        self._init_db()
        if self._chain_length() == 0:
            self._create_genesis()

    # ── DB init ────────────────────────────────────────────────
    def _init_db(self) -> None:
        with self._connect() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS blockchain (
                    idx           INTEGER PRIMARY KEY,
                    timestamp     TEXT    NOT NULL,
                    supplier_id   TEXT    NOT NULL,
                    supplier_name TEXT    NOT NULL,
                    tier          INTEGER NOT NULL,
                    country       TEXT    NOT NULL,
                    inspector     TEXT    NOT NULL,
                    result        TEXT    NOT NULL,
                    risk_score    REAL    NOT NULL,
                    notes         TEXT    NOT NULL DEFAULT '',
                    prev_hash     TEXT    NOT NULL,
                    hash          TEXT    NOT NULL,
                    tx_hash       TEXT    NOT NULL
                )
            """)

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _chain_length(self) -> int:
        with self._connect() as conn:
            return conn.execute("SELECT COUNT(*) FROM blockchain").fetchone()[0]

    # ── Genesis block ───────────────────────────────────────────
    def _create_genesis(self) -> None:
        genesis = Block(
            index=0,
            timestamp=datetime.now(timezone.utc).isoformat(),
            supplier_id="GENESIS",
            supplier_name="LinkGuard Genesis Block",
            tier=0,
            country="N/A",
            inspector="SYSTEM",
            result="PASSED",
            risk_score=0.0,
            notes="Chain initialized",
            prev_hash="0" * 64,
        )
        genesis.compute_hashes()
        self._persist(genesis)

    # ── Public API ──────────────────────────────────────────────
    def add_block(
        self,
        supplier_id: str,
        supplier_name: str,
        tier: int,
        country: str,
        inspector: str,
        result: str,
        risk_score: float,
        notes: str = "",
    ) -> Block:
        """Add a new inspection record to the chain. Returns the new Block."""
        last = self._last_block()
        block = Block(
            index=last.index + 1,
            timestamp=datetime.now(timezone.utc).isoformat(),
            supplier_id=supplier_id,
            supplier_name=supplier_name,
            tier=tier,
            country=country,
            inspector=inspector,
            result=result,
            risk_score=round(float(risk_score), 4),
            notes=notes,
            prev_hash=last.hash,
        )
        block.compute_hashes()
        self._persist(block)
        return block

    def get_chain(self, role: str = "viewer") -> List[Dict[str, Any]]:
        """
        Return all blocks. Sensitive hash fields are stripped based on role.
          admin / auditor → full hashes included
          analyst / viewer → hashes redacted
        """
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT * FROM blockchain ORDER BY idx ASC"
            ).fetchall()

        chain = [self._row_to_block(r).to_dict() for r in rows]
        if role not in ("admin", "auditor"):
            for b in chain:
                b["hash"]    = "REDACTED"
                b["tx_hash"] = "REDACTED"
                b["prev_hash"] = "REDACTED"
        return chain

    def get_block(self, index: int, role: str = "viewer") -> Optional[Dict[str, Any]]:
        """Return a single block by index, respecting role visibility."""
        with self._connect() as conn:
            row = conn.execute(
                "SELECT * FROM blockchain WHERE idx = ?", (index,)
            ).fetchone()
        if row is None:
            return None
        block = self._row_to_block(row).to_dict()
        if role not in ("admin", "auditor"):
            block["hash"]     = "REDACTED"
            block["tx_hash"]  = "REDACTED"
            block["prev_hash"] = "REDACTED"
        return block

    def get_supplier_blocks(self, supplier_id: str, role: str = "viewer") -> List[Dict[str, Any]]:
        """Return all blocks for a specific supplier."""
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT * FROM blockchain WHERE supplier_id = ? ORDER BY idx ASC",
                (supplier_id,)
            ).fetchall()
        blocks = [self._row_to_block(r).to_dict() for r in rows]
        if role not in ("admin", "auditor"):
            for b in blocks:
                b["hash"]     = "REDACTED"
                b["tx_hash"]  = "REDACTED"
                b["prev_hash"] = "REDACTED"
        return blocks

    def validate_chain(self) -> Dict[str, Any]:
        """
        Recompute SHA-256 and SHA-512 for every block.
        Returns a dict: { valid: bool, broken_at: int|None, details: [...] }
        """
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT * FROM blockchain ORDER BY idx ASC"
            ).fetchall()

        blocks = [self._row_to_block(r) for r in rows]
        details = []
        broken_at = None

        for i, blk in enumerate(blocks):
            expected_sha256 = hashlib.sha256(blk._payload_string().encode()).hexdigest()
            expected_sha512 = hashlib.sha512(blk._payload_string().encode()).hexdigest()

            sha256_ok = blk.hash    == expected_sha256
            sha512_ok = blk.tx_hash == expected_sha512
            prev_ok   = (i == 0) or (blk.prev_hash == blocks[i - 1].hash)

            ok = sha256_ok and sha512_ok and prev_ok
            if not ok and broken_at is None:
                broken_at = blk.index

            details.append({
                "index":     blk.index,
                "valid":     ok,
                "sha256_ok": sha256_ok,
                "sha512_ok": sha512_ok,
                "prev_ok":   prev_ok,
            })

        return {
            "valid":     broken_at is None,
            "total":     len(blocks),
            "broken_at": broken_at,
            "details":   details,
        }

    def stats(self) -> Dict[str, Any]:
        """Return summary statistics for the dashboard."""
        with self._connect() as conn:
            total  = conn.execute("SELECT COUNT(*) FROM blockchain").fetchone()[0]
            passed = conn.execute("SELECT COUNT(*) FROM blockchain WHERE result='PASSED'").fetchone()[0]
            failed = conn.execute("SELECT COUNT(*) FROM blockchain WHERE result='FAILED'").fetchone()[0]
            pending= conn.execute("SELECT COUNT(*) FROM blockchain WHERE result='PENDING'").fetchone()[0]
            last   = conn.execute("SELECT timestamp FROM blockchain ORDER BY idx DESC LIMIT 1").fetchone()
        return {
            "total_blocks": total,
            "passed":       passed,
            "failed":       failed,
            "pending":      pending,
            "last_block_time": last[0] if last else None,
        }

    # ── Helpers ─────────────────────────────────────────────────
    def _last_block(self) -> Block:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT * FROM blockchain ORDER BY idx DESC LIMIT 1"
            ).fetchone()
        return self._row_to_block(row)

    def _persist(self, block: Block) -> None:
        with self._connect() as conn:
            conn.execute("""
                INSERT INTO blockchain
                  (idx, timestamp, supplier_id, supplier_name, tier, country,
                   inspector, result, risk_score, notes, prev_hash, hash, tx_hash)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (
                block.index, block.timestamp, block.supplier_id,
                block.supplier_name, block.tier, block.country,
                block.inspector, block.result, block.risk_score,
                block.notes, block.prev_hash, block.hash, block.tx_hash,
            ))

    @staticmethod
    def _row_to_block(row: sqlite3.Row) -> Block:
        return Block(
            index        = row["idx"],
            timestamp    = row["timestamp"],
            supplier_id  = row["supplier_id"],
            supplier_name= row["supplier_name"],
            tier         = row["tier"],
            country      = row["country"],
            inspector    = row["inspector"],
            result       = row["result"],
            risk_score   = row["risk_score"],
            notes        = row["notes"],
            prev_hash    = row["prev_hash"],
            hash         = row["hash"],
            tx_hash      = row["tx_hash"],
        )

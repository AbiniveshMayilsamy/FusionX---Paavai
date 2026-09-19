"""
LinkGuard Blockchain API Routes
Exposes the blockchain chain over FastAPI.
Role is read from the X-User-Role header (admin | auditor | analyst | viewer).
"""

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from blockchain import LinkGuardChain

router = APIRouter(prefix="/blockchain", tags=["Blockchain"])

# Singleton chain instance shared across requests
_chain = LinkGuardChain()


# ── Request / Response Models ──────────────────────────────────
class InspectionRecord(BaseModel):
    supplier_id:   str
    supplier_name: str
    tier:          int
    country:       str
    inspector:     str
    result:        str          # "PASSED" | "FAILED" | "PENDING"
    risk_score:    float
    notes:         Optional[str] = ""


# ── Helper: extract role from header ──────────────────────────
def _role(x_user_role: Optional[str]) -> str:
    allowed = {"admin", "auditor", "analyst", "viewer"}
    r = (x_user_role or "viewer").lower().strip()
    return r if r in allowed else "viewer"


# ── Routes ─────────────────────────────────────────────────────

@router.get("/chain")
async def get_chain(x_user_role: Optional[str] = Header(default="viewer")):
    """
    Return the full blockchain.
    - admin / auditor : hash & tx_hash fields visible
    - analyst / viewer: hash fields redacted
    """
    role = _role(x_user_role)
    return {
        "role":  role,
        "chain": _chain.get_chain(role),
    }


@router.get("/stats")
async def get_stats():
    """Return blockchain summary statistics."""
    return _chain.stats()


@router.get("/verify")
async def verify_chain():
    """
    Validate the entire chain: recomputes SHA-256 and SHA-512 for each block
    and checks prev_hash linkage. Returns a per-block integrity report.
    """
    return _chain.validate_chain()


@router.get("/block/{index}")
async def get_block(index: int, x_user_role: Optional[str] = Header(default="viewer")):
    """Return a single block by index."""
    role  = _role(x_user_role)
    block = _chain.get_block(index, role)
    if block is None:
        raise HTTPException(status_code=404, detail=f"Block {index} not found")
    return block


@router.get("/supplier/{supplier_id}")
async def get_supplier_chain(
    supplier_id: str,
    x_user_role: Optional[str] = Header(default="viewer"),
):
    """Return all blockchain records for a specific supplier."""
    role   = _role(x_user_role)
    blocks = _chain.get_supplier_blocks(supplier_id, role)
    return {
        "supplier_id": supplier_id,
        "role":        role,
        "blocks":      blocks,
        "count":       len(blocks),
    }


@router.post("/record")
async def add_record(
    record: InspectionRecord,
    x_user_role: Optional[str] = Header(default="viewer"),
):
    """
    Add a new inspection record to the chain.
    Only admin can write to the chain.
    """
    role = _role(x_user_role)
    if role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only administrators can write inspection records to the blockchain.",
        )
    result_upper = record.result.upper()
    if result_upper not in ("PASSED", "FAILED", "PENDING"):
        raise HTTPException(
            status_code=422,
            detail="result must be PASSED, FAILED, or PENDING",
        )
    block = _chain.add_block(
        supplier_id   = record.supplier_id,
        supplier_name = record.supplier_name,
        tier          = record.tier,
        country       = record.country,
        inspector     = record.inspector,
        result        = result_upper,
        risk_score    = record.risk_score,
        notes         = record.notes or "",
    )
    return {
        "message":  "Block added successfully",
        "index":    block.index,
        "hash":     block.hash,      # SHA-256
        "tx_hash":  block.tx_hash,   # SHA-512
    }

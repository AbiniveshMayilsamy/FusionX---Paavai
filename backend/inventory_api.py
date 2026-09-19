"""
LinkGuard Inventory Storage Management API
Real-time tracking of strategic defense depot utilization, SKU safety buffers,
stock movement operations, and automated stock runout risk alerts linked to supplier delay forecasts.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

router = APIRouter(prefix="/inventory", tags=["Inventory"])

# In-memory realistic defense inventory store with transactional safety
_DEPOTS = [
    {
        "id": "DEPOT-01",
        "name": "Central Strategic Depot",
        "location": "Bengaluru, India",
        "coordinates": [12.9716, 77.5946],
        "capacity_m3": 50000,
        "occupied_m3": 38400,
        "security_level": "DEFENSE-TIER-1-MAX",
        "climate_controlled": True,
        "status": "HEALTHY"
    },
    {
        "id": "DEPOT-02",
        "name": "European Forward Logistics Hub",
        "location": "Frankfurt, Germany",
        "coordinates": [50.1109, 8.6821],
        "capacity_m3": 35000,
        "occupied_m3": 24150,
        "security_level": "NATO-STANAG-LEVEL-3",
        "climate_controlled": True,
        "status": "HEALTHY"
    },
    {
        "id": "DEPOT-03",
        "name": "Indo-Pacific Buffer Depot",
        "location": "Singapore Port Logistics Hub",
        "coordinates": [1.3521, 103.8198],
        "capacity_m3": 40000,
        "occupied_m3": 33200,
        "security_level": "DEFENSE-MARITIME-CLEARANCE",
        "climate_controlled": True,
        "status": "HIGH_UTILIZATION"
    },
    {
        "id": "DEPOT-04",
        "name": "North American Defense Reserves",
        "location": "Fort Worth, Texas, USA",
        "coordinates": [32.7555, -97.3308],
        "capacity_m3": 60000,
        "occupied_m3": 41500,
        "security_level": "ITAR-COMPLIANT-MAX",
        "climate_controlled": True,
        "status": "HEALTHY"
    }
]

_INVENTORY_ITEMS = [
    {
        "sku": "SKU-RAD-901",
        "name": "AESA Radar Transceiver Modules",
        "category": "Avionics & Sensing",
        "depot_id": "DEPOT-01",
        "current_stock": 1420,
        "target_buffer": 1800,
        "min_safety_stock": 500,
        "daily_burn_rate": 28,
        "unit": "Units",
        "lead_supplier_id": "SUP_001",
        "lead_supplier_name": "Advanced Defense Systems Ltd",
        "last_inbound": "2026-09-12"
    },
    {
        "sku": "SKU-TI-440",
        "name": "Aerospace Titanium 6Al-4V Billets",
        "category": "Structural Alloys",
        "depot_id": "DEPOT-01",
        "current_stock": 8400,
        "target_buffer": 10000,
        "min_safety_stock": 2500,
        "daily_burn_rate": 180,
        "unit": "Kg",
        "lead_supplier_id": "SUP_004",
        "lead_supplier_name": "Steel & Alloy Industries",
        "last_inbound": "2026-09-15"
    },
    {
        "sku": "SKU-NEO-08",
        "name": "Samarium-Cobalt High-Temp Magnets",
        "category": "Rare Earth Precursors",
        "depot_id": "DEPOT-03",
        "current_stock": 310,
        "target_buffer": 800,
        "min_safety_stock": 250,
        "daily_burn_rate": 14,
        "unit": "Kg",
        "lead_supplier_id": "SUP_007",
        "lead_supplier_name": "Mining Corp (Congo/Katanga)",
        "last_inbound": "2026-08-28"
    },
    {
        "sku": "SKU-HYD-31",
        "name": "Fly-by-Wire Hydraulic Actuators",
        "category": "Flight Control & Hydraulics",
        "depot_id": "DEPOT-02",
        "current_stock": 680,
        "target_buffer": 950,
        "min_safety_stock": 200,
        "daily_burn_rate": 12,
        "unit": "Units",
        "lead_supplier_id": "SUP_002",
        "lead_supplier_name": "Precision Electronics Corp",
        "last_inbound": "2026-09-10"
    },
    {
        "sku": "SKU-MCU-55",
        "name": "Rad-Hardened GaN Microcontrollers",
        "category": "Defense Silicon",
        "depot_id": "DEPOT-04",
        "current_stock": 3200,
        "target_buffer": 4000,
        "min_safety_stock": 1000,
        "daily_burn_rate": 65,
        "unit": "Chips",
        "lead_supplier_id": "SUP_002",
        "lead_supplier_name": "Precision Electronics Corp",
        "last_inbound": "2026-09-14"
    }
]

class StockAdjustmentRequest(BaseModel):
    sku: str
    quantity_change: int  # Positive for inbound receipt, negative for assembly issuance
    operator: str
    reason: str

class RunoutCheckRequest(BaseModel):
    supplier_delays: Dict[str, float]  # e.g. {"SUP_007": 18.5, "SUP_002": 4.2}

@router.get("/depots")
async def get_depots():
    """Return list of strategic defense storage depots"""
    return {"depots": _DEPOTS, "count": len(_DEPOTS), "timestamp": datetime.now().isoformat()}

@router.get("/overview")
async def get_inventory_overview():
    """Return all storage depots and live SKU inventory metrics"""
    enriched_items = []
    total_val_risk = 0

    for item in _INVENTORY_ITEMS:
        days_left = round(item["current_stock"] / max(item["daily_burn_rate"], 1), 1)
        safety_days = round(item["min_safety_stock"] / max(item["daily_burn_rate"], 1), 1)
        is_below_buffer = item["current_stock"] < item["target_buffer"]
        is_critical = days_left < safety_days

        depot = next((d for d in _DEPOTS if d["id"] == item["depot_id"]), None)

        enriched_items.append({
            **item,
            "days_of_stock_left": days_left,
            "safety_buffer_days": safety_days,
            "is_below_buffer": is_below_buffer,
            "is_critical": is_critical,
            "depot_name": depot["name"] if depot else item["depot_id"],
            "depot_location": depot["location"] if depot else "Unknown"
        })

    return {
        "depots": _DEPOTS,
        "inventory": enriched_items,
        "total_skus": len(_INVENTORY_ITEMS),
        "timestamp": datetime.now().isoformat()
    }

@router.post("/adjust")
async def adjust_stock(req: StockAdjustmentRequest):
    """Perform real stock issuance or inbound receipt with safety buffer checks"""
    item = next((i for i in _INVENTORY_ITEMS if i["sku"] == req.sku), None)
    if not item:
        raise HTTPException(status_code=404, detail=f"SKU {req.sku} not found")

    new_stock = item["current_stock"] + req.quantity_change
    if new_stock < 0:
        raise HTTPException(status_code=400, detail="Cannot issue more stock than currently available in depot")

    item["current_stock"] = new_stock
    item["last_inbound"] = datetime.now().strftime("%Y-%m-%d")

    return {
        "message": f"Successfully updated stock for {item['name']}.",
        "sku": req.sku,
        "new_stock": new_stock,
        "operator": req.operator,
        "timestamp": datetime.now().isoformat()
    }

@router.post("/check_runout")
async def check_runout_risk(req: RunoutCheckRequest):
    """
    Cross-references predicted supplier delays with depot burn rates.
    If predicted delay (days) > days of stock remaining, flags immediate production halt risk!
    """
    alerts = []
    for item in _INVENTORY_ITEMS:
        sup_id = item["lead_supplier_id"]
        predicted_delay = req.supplier_delays.get(sup_id, 0.0)
        days_left = round(item["current_stock"] / max(item["daily_burn_rate"], 1), 1)

        if predicted_delay > days_left:
            alerts.append({
                "sku": item["sku"],
                "item_name": item["name"],
                "depot_id": item["depot_id"],
                "supplier_id": sup_id,
                "supplier_name": item["lead_supplier_name"],
                "predicted_delay_days": predicted_delay,
                "days_stock_remaining": days_left,
                "deficit_days": round(predicted_delay - days_left, 1),
                "severity": "CRITICAL_RUNOUT_RISK",
                "recommended_mitigation": "Immediately draw from alternate regional depot or activate defense emergency allocation."
            })
        elif (days_left - predicted_delay) < (item["min_safety_stock"] / max(item["daily_burn_rate"], 1)):
            alerts.append({
                "sku": item["sku"],
                "item_name": item["name"],
                "depot_id": item["depot_id"],
                "supplier_id": sup_id,
                "supplier_name": item["lead_supplier_name"],
                "predicted_delay_days": predicted_delay,
                "days_stock_remaining": days_left,
                "deficit_days": 0,
                "severity": "SAFETY_BUFFER_BREACH",
                "recommended_mitigation": "Alert procurement lead to expedite secondary supplier purchase order."
            })

    return {
        "runout_alerts": alerts,
        "total_alerts": len(alerts),
        "timestamp": datetime.now().isoformat()
    }

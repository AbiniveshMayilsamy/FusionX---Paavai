from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import sqlite3
import pandas as pd
import json
import pickle
from datetime import datetime
import os
import math
from typing import List, Dict, Any
from models import SupplyChainDB, RiskPredictor, GraphBuilder, ReportGenerator, TierMappingEngine, DelayPredictor, DEFAULT_DB_PATH
from blockchain_api import router as blockchain_router
from inventory_api import router as inventory_router

app = FastAPI(title="LinkGuard Supply Chain API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────
app.include_router(blockchain_router)
app.include_router(inventory_router)

# ── Seed sample inspection blocks on first run ───────────────
def _seed_blockchain():
    """Add sample inspection records so the chain is non-empty for demos."""
    from blockchain import LinkGuardChain
    chain = LinkGuardChain()
    if chain.stats()["total_blocks"] <= 1:   # only genesis exists
        samples = [
            ("SUP_001", "Advanced Defense Systems Ltd", 1, "India",   "Linkguardadmin", "PASSED",  0.23, "ISO 9001, AS9100 verified"),
            ("SUP_002", "Precision Electronics Corp",   2, "Germany", "Linkguardadmin", "PENDING", 0.45, "AS9100 key validation in progress"),
            ("SUP_003", "Rare Metals Co",               3, "China",   "Linkguardadmin", "FAILED",  0.78, "ISO 14001 expired – rejected"),
            ("SUP_004", "Steel Industries",             2, "India",   "Linkguardadmin", "PASSED",  0.29, "Batch 2026-Q3 cleared"),
            ("SUP_007", "Mining Corp",                  4, "Congo",   "Linkguardadmin", "FAILED",  0.89, "High-risk region – no certs"),
        ]
        for s in samples:
            chain.add_block(*s)

_seed_blockchain()

# ── Initialize components ────────────────────────────────────
db = SupplyChainDB()
risk_predictor = RiskPredictor()
graph_builder = GraphBuilder()
report_gen = ReportGenerator()
tier_mapping_engine = TierMappingEngine()
delay_predictor = DelayPredictor()

@app.get("/tier_mapping")
async def get_tier_mapping():
    """Run automatic graph DAG depth tier mapping algorithm"""
    try:
        results = tier_mapping_engine.compute_automatic_tiers()
        return results
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict_delay")
async def predict_supplier_delay(payload: Dict[str, Any]):
    """Compute mathematical & logistic delay prediction, confidence interval and impact"""
    try:
        prediction = delay_predictor.predict_delay(payload)
        return prediction
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/all_delays")
async def get_all_supplier_delays():
    """Return live delay predictions for all registered suppliers in supply_chain.db"""
    try:
        conn = sqlite3.connect(DEFAULT_DB_PATH)
        suppliers = pd.read_sql_query("SELECT * FROM suppliers", conn).to_dict('records')
        conn.close()

        results = []
        for s in suppliers:
            # Determine features
            pred = delay_predictor.predict_delay({
                "lead_time": s.get('lead_time', 28),
                "reliability": s.get('reliability_score', 0.85),
                "risk_score": s.get('risk_score', 0.3),
                "chokepoint_delay": 5.0 if s.get('country') in ['China', 'Congo', 'Taiwan'] else 0.0,
                "order_volume": 500,
                "tier_depth": 3 if 'mining' in str(s.get('name')).lower() else 1
            })
            results.append({
                "supplier_id": s['supplier_id'],
                "name": s['name'],
                "country": s.get('country', 'Unknown'),
                **pred
            })
        return {"predictions": results, "timestamp": datetime.now().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload_data")
async def upload_data(file: UploadFile = File(...)):
    """Upload supplier/component data with encoding fallback and dynamic schema ingestion"""
    try:
        raw_bytes = await file.read()
        # Try decoding with common encodings
        for encoding in ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']:
            try:
                decoded_str = raw_bytes.decode(encoding)
                break
            except UnicodeDecodeError:
                continue
        else:
            decoded_str = raw_bytes.decode('utf-8', errors='replace')

        df = pd.read_csv(pd.io.common.StringIO(decoded_str))
        
        # Process and insert data using schema-adaptive logic
        count = db.insert_suppliers(df)
        return {"message": f"Successfully synchronized {count} supplier records into LinkGuard database.", "status": "success", "count": count}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Data ingestion error: {str(e)}")

@app.get("/graph")
async def get_graph():
    """Return supply chain graph JSON"""
    try:
        graph_data = graph_builder.build_network_graph()
        return {"graph": graph_data, "timestamp": datetime.now().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/supplier/{supplier_id}")
async def get_supplier(supplier_id: int):
    """Fetch supplier details with risk score"""
    try:
        supplier = db.get_supplier_details(supplier_id)
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        return supplier
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/risk_summary")
async def get_risk_summary():
    """Return top risk suppliers and components"""
    try:
        high_risk = db.get_high_risk_suppliers(limit=10)
        return {"high_risk_suppliers": high_risk, "timestamp": datetime.now().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommendations/{component_id}")
async def get_recommendations(component_id: int):
    """Suggest alternate suppliers for component"""
    try:
        recommendations = risk_predictor.get_alternative_suppliers(component_id)
        return {"recommendations": recommendations, "component_id": component_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/report")
async def generate_report():
    """Export analysis report"""
    try:
        report_path = report_gen.generate_comprehensive_report()
        return FileResponse(report_path, filename=f"supply_chain_report_{datetime.now().strftime('%Y%m%d')}.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sync")
async def sync_data():
    """Trigger model retraining and data sync"""
    try:
        # Retrain risk prediction model
        metrics = risk_predictor.retrain_model()
        return {"message": "Sync completed", "model_metrics": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/db_viewer")
async def db_viewer():
    """Return all tables and rows from both SQLite databases."""
    _base = os.path.dirname(os.path.abspath(__file__))
    db_files = {
        "supply_chain": os.path.join(_base, "..", "data", "supply_chain.db"),
        "blockchain":   os.path.join(_base, "..", "data", "blockchain.db"),
    }
    result = {}
    for db_name, db_path in db_files.items():
        if not os.path.exists(db_path):
            result[db_name] = {}
            continue
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
            tables = [row[0] for row in cursor.fetchall()]
            db_data = {}
            for table in tables:
                try:
                    cursor.execute(f'SELECT * FROM "{table}" LIMIT 200')
                    columns = [desc[0] for desc in cursor.description] if cursor.description else []
                    raw_rows = cursor.fetchall()
                    cleaned_rows = []
                    for r in raw_rows:
                        cleaned_row = [
                            None if (v is None or (isinstance(v, float) and (math.isnan(v) or math.isinf(v)))) else v
                            for v in r
                        ]
                        cleaned_rows.append(cleaned_row)
                    db_data[table] = {
                        "columns": columns,
                        "rows": cleaned_rows
                    }
                except Exception as e:
                    db_data[table] = {"columns": [], "rows": [], "error": str(e)}
            conn.close()
            result[db_name] = db_data
        except Exception as e:
            result[db_name] = {"_error": str(e)}
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
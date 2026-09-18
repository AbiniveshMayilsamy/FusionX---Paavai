from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import sqlite3
import pandas as pd
import json
import pickle
from datetime import datetime
import os
from typing import List, Dict, Any
from models import SupplyChainDB, RiskPredictor, GraphBuilder, ReportGenerator

app = FastAPI(title="LinkGuard Supply Chain API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
db = SupplyChainDB()
risk_predictor = RiskPredictor()
graph_builder = GraphBuilder()
report_gen = ReportGenerator()

@app.post("/upload_data")
async def upload_data(file: UploadFile = File(...)):
    """Upload supplier/component data"""
    try:
        content = await file.read()
        df = pd.read_csv(pd.io.common.StringIO(content.decode('utf-8')))
        
        # Process and insert data
        db.insert_suppliers(df)
        return {"message": f"Successfully uploaded {len(df)} records", "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
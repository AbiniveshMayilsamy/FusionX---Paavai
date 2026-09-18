"""
LinkGuard Configuration Settings
Centralized configuration for the supply chain risk management system.
"""

import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
REPORTS_DIR = BASE_DIR / "reports"

# Database configuration
DATABASE_CONFIG = {
    "sqlite_path": DATA_DIR / "supply_chain.db",
    "postgres_url": os.getenv("DATABASE_URL", "postgresql://linkguard:linkguard123@localhost:5432/supply_chain")
}

# API configuration
API_CONFIG = {
    "host": os.getenv("API_HOST", "0.0.0.0"),
    "port": int(os.getenv("API_PORT", 8000)),
    "debug": os.getenv("DEBUG", "True").lower() == "true"
}

# Frontend configuration
FRONTEND_CONFIG = {
    "host": os.getenv("FRONTEND_HOST", "0.0.0.0"),
    "port": int(os.getenv("FRONTEND_PORT", 3000)),
    "debug": os.getenv("DEBUG", "True").lower() == "true"
}

# Machine Learning configuration
ML_CONFIG = {
    "model_path": MODELS_DIR / "risk_model.pkl",
    "feature_names_path": MODELS_DIR / "feature_names.pkl",
    "retrain_interval_hours": int(os.getenv("RETRAIN_INTERVAL", 24)),
    "risk_threshold_high": float(os.getenv("RISK_THRESHOLD_HIGH", 0.7)),
    "risk_threshold_medium": float(os.getenv("RISK_THRESHOLD_MEDIUM", 0.4))
}

# Risk assessment configuration
RISK_CONFIG = {
    "high_risk_countries": ["China", "Vietnam", "Thailand", "Myanmar", "Bangladesh"],
    "critical_components": ["Microprocessor", "Memory Module", "Power Supply"],
    "max_dependency_threshold": 0.8,  # 80% ownership threshold
    "min_reliability_score": 0.6
}

# Visualization configuration
VIZ_CONFIG = {
    "risk_colors": {
        "low": "green",
        "medium": "orange", 
        "high": "red"
    },
    "graph_layout": "spring",  # networkx layout algorithm
    "max_nodes_display": 100,
    "edge_thickness_factor": 2
}

# Report configuration
REPORT_CONFIG = {
    "max_suppliers_in_report": 50,
    "chart_dpi": 300,
    "pdf_page_size": "A4",
    "include_charts": True,
    "auto_export_csv": True
}

# System configuration
SYSTEM_CONFIG = {
    "max_upload_size_mb": 50,
    "cache_timeout_seconds": 300,  # 5 minutes
    "api_timeout_seconds": 30,
    "log_level": os.getenv("LOG_LEVEL", "INFO")
}

# Feature engineering configuration
FEATURE_CONFIG = {
    "financial_stability_weight": 0.3,
    "geographic_risk_weight": 0.2,
    "dependency_risk_weight": 0.25,
    "reliability_risk_weight": 0.15,
    "capacity_risk_weight": 0.1
}

def get_database_url():
    """Get appropriate database URL based on environment"""
    if os.getenv("USE_POSTGRES", "false").lower() == "true":
        return DATABASE_CONFIG["postgres_url"]
    else:
        return f"sqlite:///{DATABASE_CONFIG['sqlite_path']}"

def ensure_directories():
    """Ensure all required directories exist"""
    directories = [DATA_DIR, MODELS_DIR, REPORTS_DIR, DATA_DIR / "raw", DATA_DIR / "processed"]
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)

# Initialize directories on import
ensure_directories()
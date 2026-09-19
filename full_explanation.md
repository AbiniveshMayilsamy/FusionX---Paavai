# LinkGuard — Full Project Explanation

## 🧭 What is LinkGuard?

**LinkGuard** is an **AI-powered Supply Chain Risk Management System** designed for defense/aerospace industries.

It monitors a multi-tier network of suppliers (companies that provide parts/materials), scores their risk using Machine Learning, verifies them with a custom Blockchain, and gives decision-makers a real-time dashboard.

---

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      USER INTERFACES                    │
│                                                         │
│  React Frontend (port 5173)   Dash Dashboard (port 3000)│
│  ── Modern UI, 10 tabs ──     ── Analytics charts ──   │
└───────────────────┬─────────────────────┬───────────────┘
                    │  HTTP/REST           │  HTTP/REST
                    ▼                     ▼
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend  (port 8001)               │
│                                                         │
│  /upload_data   /graph   /risk_summary   /report        │
│  /blockchain/*  /supplier/*  /sync  /recommendations    │
└──────────────┬─────────────────┬───────────────────────┘
               │                 │
       ┌───────▼──────┐  ┌──────▼──────┐
       │  SQLite DB   │  │ Blockchain  │
       │supply_chain  │  │   .db file  │
       │    .db       │  │ (blockchain │
       │              │  │    .db)     │
       └──────────────┘  └─────────────┘
```

---

## 📁 Project File Structure

```
Link-Guard/
│
├── backend/                   ← Python FastAPI server
│   ├── main.py                  API entry point & all routes
│   ├── models.py                DB, ML, Graph & Report classes
│   ├── blockchain.py            Custom blockchain engine
│   └── blockchain_api.py        REST API routes for blockchain
│
├── frontend/                  ← Dash (Python) dashboard
│   └── app.py                   Charts, tables, file upload
│
├── react-frontend/            ← React/Vite modern UI
│   └── src/
│       ├── App.jsx              Main app, routing, state
│       ├── components/          Reusable UI components
│       │   ├── Login.jsx        Role-based login screen
│       │   ├── Header.jsx       Top navigation bar
│       │   ├── tabs/            10 feature tabs (see below)
│       │   └── modals/          Popups & drawers
│       ├── blockchain/          Frontend blockchain hooks
│       │   ├── BlockchainEngine.js   Client-side hash engine
│       │   └── useBlockchain.js      React hook for chain calls
│       └── data/
│           └── suppliersData.js  20 hardcoded seed suppliers
│
├── utils/
│   ├── database_setup.py      DB schema creation + seed data
│   ├── data_generator.py      Generates synthetic supplier data
│   └── report_generator.py    Advanced PDF report utility
│
├── datasets/
│   ├── suppliers_dataset.csv        Original 20 suppliers
│   ├── risk_assessment_dataset.csv  Component risk data
│   └── mock_suppliers_upload.csv    ← We created this today
│
├── data/
│   ├── supply_chain.db        SQLite: suppliers, components, links
│   └── blockchain.db          SQLite: all blockchain blocks
│
├── models/
│   └── risk_model.pkl         Trained XGBoost ML model
│
└── setup_and_run.py           One-click startup script
```

---

## ⚙️ Service 1 — FastAPI Backend (`port 8001`)

**File:** [`backend/main.py`](file:///d:/Link-Guard/backend/main.py)

This is the **brain of the whole system**. It's a REST API that all frontends talk to.

### API Endpoints

| Method | Route | What it does |
|---|---|---|
| `POST` | `/upload_data` | Accept a CSV file → insert suppliers into DB |
| `GET` | `/graph` | Build & return supply chain as node/edge graph |
| `GET` | `/risk_summary` | Return top 10 highest-risk suppliers |
| `GET` | `/supplier/{id}` | Details for a specific supplier |
| `GET` | `/recommendations/{id}` | Alternative suppliers for a component |
| `GET` | `/report` | Generate and return a PDF risk report |
| `POST` | `/sync` | Retrain the ML model with latest data |
| `GET` | `/blockchain/chain` | Full blockchain ledger |
| `GET` | `/blockchain/verify` | Integrity check of the blockchain |
| `POST` | `/blockchain/record` | Add a new inspection record (admin only) |

### On Startup
When the backend boots, it:
1. Seeds 5 sample blockchain inspection records (so the chain is never empty)
2. Initializes `SupplyChainDB`, `RiskPredictor`, `GraphBuilder`, `ReportGenerator`

---

## 🗄️ Service 2 — SQLite Databases

### `data/supply_chain.db` — Supplier Data

| Table | Purpose |
|---|---|
| `suppliers` | All suppliers with name, country, risk_score, reliability_score, revenue |
| `components` | Parts (radar, engines, sensors) with criticality level |
| `supply_links` | Which supplier → which component, tier level, lead time |
| `ownership` | Parent/subsidiary ownership relationships |
| `risk_predictions` | Historical ML-predicted risk scores |

### `data/blockchain.db` — Audit Ledger

Stores every block in the blockchain (described below).

---

## 🤖 Service 3 — ML Risk Prediction

**File:** [`backend/models.py`](file:///d:/Link-Guard/backend/models.py) → `RiskPredictor` class

The system uses **XGBoost** (a gradient boosting ML model) to predict supplier risk.

### How it works

```
Supplier Data (revenue, reliability, ownership %)
          ↓
   Feature Engineering
  ┌──────────────────────────────────────┐
  │ financial_stability = revenue / max  │
  │ geo_risk = is high-risk country?     │
  │ dependency_risk = ownership %        │
  │ reliability_risk = 1 - reliability   │
  └──────────────────────────────────────┘
          ↓
   StandardScaler (normalize features)
          ↓
   XGBoost Classifier
          ↓
   Risk Score 0.0 → 1.0
   (> 0.7 = HIGH RISK 🔴)
```

### Risk Score Thresholds
| Score | Level | Color |
|---|---|---|
| < 0.35 | Low | 🟢 Green |
| 0.35 – 0.65 | Medium | 🟡 Orange |
| > 0.65 | High | 🔴 Red |
| > 0.85 | Critical | 🚨 Critical |

Model is saved as `models/risk_model.pkl` and can be retrained via the `/sync` endpoint.

---

## ⛓️ Service 4 — Blockchain Engine

**Files:** [`backend/blockchain.py`](file:///d:/Link-Guard/backend/blockchain.py) + [`blockchain_api.py`](file:///d:/Link-Guard/backend/blockchain_api.py)

LinkGuard has its **own custom blockchain** — not Ethereum, but a purpose-built inspection ledger.

### Why blockchain?
In defense supply chains, you need a **tamper-proof audit trail** of every supplier inspection. If a block is modified, its hash changes — breaking the chain — and the tampering is instantly detected.

### Dual-Hash Scheme
Each block has **two hashes**:

| Hash | Algorithm | Purpose |
|---|---|---|
| `hash` | SHA-256 (64 chars) | Chain integrity — links block to previous block |
| `tx_hash` | SHA-512 (128 chars) | Transaction receipt — tamper-proof proof of record |

### What Each Block Records
```
Block {
  index          → block number
  timestamp      → when the inspection happened
  supplier_id    → e.g. "SUP_003"
  supplier_name  → "Rare Metals Co"
  tier           → 3
  country        → "China"
  inspector      → "Linkguardadmin"
  result         → "PASSED" | "FAILED" | "PENDING"
  risk_score     → 0.78
  notes          → "ISO 14001 expired – rejected"
  prev_hash      → SHA-256 of the previous block
  hash           → SHA-256 of this block
  tx_hash        → SHA-512 of this block
}
```

### Role-Based Access
| Role | Can See |
|---|---|
| `admin` | Full data + both hashes + can write new blocks |
| `auditor` | Full data + both hashes (read only) |
| `analyst` | Data but hashes are redacted |
| `viewer` | Data but hashes are redacted |

---

## 🖥️ Service 5 — Dash Dashboard (`port 3000`)

**File:** [`frontend/app.py`](file:///d:/Link-Guard/frontend/app.py)

A **Python Plotly Dash** app — the older analytics-focused dashboard.

### Features
| Feature | Description |
|---|---|
| **File Upload** | Drag & drop CSV → sends to backend `/upload_data` |
| **Supply Chain Network Graph** | Interactive node/edge graph colored by risk (green/orange/red) |
| **Risk Bar Chart** | Top 10 high-risk suppliers by score |
| **High Risk Table** | Sortable data table with conditional red row highlight |
| **Generate Report** | Downloads PDF from backend `/report` *(fixed today)* |
| **Sync Models** | Button to trigger ML retraining |
| **Recommendations** | Click a supplier row → see 3 alternative suppliers |

---

## ⚛️ Service 6 — React Frontend (`port 5173`)

**Files:** [`react-frontend/src/`](file:///d:/Link-Guard/react-frontend/src/)

The **modern, feature-rich UI** with 10 tabs, role-based login, and live blockchain integration.

### Login System
4 roles with different permissions:

| Role | Access |
|---|---|
| `admin` | Everything — can write blockchain records |
| `auditor` | Read-only, sees all hashes |
| `analyst` | No hash visibility |
| `viewer` | Basic read access |

### 10 Feature Tabs

| Tab | File | Purpose |
|---|---|---|
| 🗺️ Supply Chain Mapping | `SupplyChainMappingTab.jsx` | Visual map of all supplier tiers |
| 📊 Risk Analysis | `RiskAnalysisTab.jsx` | Risk scores, charts, breakdown |
| 💡 AI Recommendations | `AiRecommendationsTab.jsx` | Suggests alternative suppliers |
| 📄 Advanced Reports | `AdvancedReportsTab.jsx` | Download reports as PDF/CSV/JSON |
| ⛓️ Blockchain Verification | `BlockchainVerificationTab.jsx` | Browse chain, verify blocks, add records |
| 🌱 Sustainability | `SustainabilityTab.jsx` | ESG scores per supplier |
| 🔬 Synthetic Data | `SyntheticDataTab.jsx` | Generate test supplier data |
| 📝 Contracts | `ContractsTab.jsx` | Contract status per supplier |
| 🤖 AI Assistant | `AiAssistantTab.jsx` | Chat interface for supply chain queries |
| 🧠 ML Training | `MlTrainingTab.jsx` | Trigger model training, view metrics |

### Special UI Components
- **ExecutionOverlay** — Full-screen animation shown while AI processes a request
- **SupplierModal** — Detailed supplier info popup
- **DownloadPopup** — Format picker (PDF / CSV / JSON) before downloading
- **AiAssistantDrawer** — Slide-in chat panel for AI queries

---

## 📊 Data Flow — End to End

```
1. USER uploads CSV at localhost:3000
        ↓
2. Dash calls POST /upload_data
        ↓
3. FastAPI reads CSV → pandas DataFrame
        ↓
4. db.insert_suppliers(df) → writes to supply_chain.db
        ↓
5. User clicks Refresh Data
        ↓
6. Dash calls GET /risk_summary
        ↓
7. SQLite returns top 10 by risk_score DESC
        ↓
8. Dash renders bar chart + table
        ↓
9. User clicks Generate Report
        ↓
10. Dash calls GET /report
        ↓
11. ReportGenerator queries DB → builds PDF with reportlab
        ↓
12. PDF streams back → browser downloads it automatically
```

---

## 🔄 Setup Flow (`setup_and_run.py`)

When you run `python setup_and_run.py`:

```
1. Check all pip packages installed (pandas, fastapi, dash, sklearn, xgboost, etc.)
2. Create folders: data/raw, data/processed, models/, reports/
3. Init SQLite DB (utils/database_setup.py)
   → Creates all 5 tables
   → Generates synthetic supplier/component/link data
4. Train initial XGBoost ML model
   → Saves to models/risk_model.pkl
5. Start backend (backend/main.py) on port 8001
6. Start Dash frontend (frontend/app.py) on port 3000
```

> ⚠️ Note: This script does **NOT** start the React frontend. That requires `npm run dev` in `react-frontend/`.

---

## 🛠️ What We Did in This Session

| # | Problem | Fix |
|---|---|---|
| 1 | Port 5173 not working | `setup_and_run.py` never starts React. Ran `npm run dev` manually → ✅ |
| 2 | Needed test data for upload | Created `datasets/mock_suppliers_upload.csv` with 20 rich suppliers ✅ |
| 3 | Generate Report button did nothing | No callback existed in Dash app. Added `@app.callback` + `dcc.Download` → PDF now auto-downloads ✅ |

---

## 🌐 Live URLs

| Service | URL | Technology |
|---|---|---|
| React Dashboard | http://localhost:5173 | React + Vite |
| Dash Dashboard | http://localhost:3000 | Python Plotly Dash |
| REST API | http://localhost:8001 | FastAPI + Uvicorn |
| Swagger Docs | http://localhost:8001/docs | Auto-generated |
| Blockchain API | http://localhost:8001/blockchain/chain | FastAPI Router |

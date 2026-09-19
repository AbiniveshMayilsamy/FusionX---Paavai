# LinkGuard: Comprehensive Tech Stack & Architectural Analysis (A to Z)

> **Document Classification**: Technical Architecture & System Specification  
> **System Name**: LinkGuard (Advanced Defense Supply Chain Intelligence & Cryptographic Verification Platform)  
> **Version**: 2.0 Enterprise  
> **Target Environment**: Mission-Critical Defense Procurement, Coalition Sovereign Auditing & Depot Operations  

---

## 1. Executive Summary & Purpose

Modern defense supply chains are characterized by deep multi-tier dependencies (from prime OEMs down to raw rare-earth mineral mines), acute geopolitical exposure at maritime chokepoints, and cross-border trust deficits among coalition partners. Traditional ERP solutions and physical certification mechanisms (such as legacy physical "Red Stamps") fail due to:
1. **Lack of Deep Tier Visibility**: OEMs typically only know Tier 1 and partial Tier 2 suppliers, remaining blind to critical vulnerabilities at Tier 3 and Tier 4.
2. **Deterministic Lead-Time Illusions**: Standard logistics systems assume static transit times, failing to anticipate lead-time friction caused by maritime chokepoint closures, regional conflicts, and customs sanctions.
3. **The Coalition Trust Paradox**: Sovereign defense partners must verify supplier authenticity and batch compliance without revealing proprietary blueprints, pricing structures, or sub-contractor networks.
4. **Vulnerability to Paper Forgery**: Depot inspectors relying on manual stamps face documentation tampering, lack of auditability, and repudiation risks.

**LinkGuard** solves these challenges by uniting **Directed Acyclic Graph (DAG) Network Science**, **Predictive Machine Learning**, **Real-Time 3D Geospatial Visualization**, and **Dual-Hash Cryptographic Blockchain Verification** into a unified, air-gapped capable defense command center.

---

## 2. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT / COMMAND LAYER                                  │
│       React 19 (SPA) + Vite 8.3 + Three.js 3D WebGL Globe + OGL Particle Shaders       │
│                                  (Port 5173 / Proxy)                                   │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTP / JSON API Proxy (/api)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              API & ORCHESTRATION LAYER                                 │
│                   FastAPI (Asynchronous REST Engine) + Uvicorn ASGI                    │
│                                      (Port 8001)                                       │
└───────┬───────────────────┬───────────────────┬───────────────────┬────────────────────┘
        │                   │                   │                   │
        ▼                   ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌────────────────────────────┐
│ GRAPH ENGINE │    │  AI/ML CORE  │    │ CRYPTO CHAIN │    │   DEPOT INVENTORY ENGINE   │
│  NetworkX    │    │ Scikit-Learn │    │  Hashlib     │    │ Dynamic Runout Cross-      │
│  Topological │    │ Random Forest│    │  SHA-256     │    │ Reference Calculator       │
│  DAG Crawl   │    │ Sigmoid Cl   │    │  SHA-512     │    │                            │
└───────┬──────┘    └───────┬──────┘    └───────┬──────┘    └─────────────┬──────────────┘
        │                   │                   │                         │
        └───────────────────┼───────────────────┴─────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               PERSISTENCE & LEDGER LAYER                               │
│  ┌──────────────────────────────────────────┐  ┌────────────────────────────────────┐  │
│  │           data/supply_chain.db           │  │          data/blockchain.db        │  │
│  │  - Suppliers & Sub-tier Graph Links      │  │  - Immutable Inspection Blocks     │  │
│  │  - Components, Depots & Inventories      │  │  - Merkle Receipts & Tx Hashes     │  │
│  │  - Ownership Shares & Risk Predictions   │  │  - Digital Accountability Seals    │  │
│  └──────────────────────────────────────────┘  └────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack Breakdown (From A to Z)

### 3.1. Frontend & Client-Side Technologies

| Technology | Version | Purpose in LinkGuard | Why Chosen / Architectural Advantage |
| :--- | :--- | :--- | :--- |
| **React** | `^19.2.8` | Declarative UI component tree, responsive tab management, and state orchestration. | Industry-standard component framework; React 19 provides enhanced concurrent rendering and immediate state updates required for tactical telemetry. |
| **Vite** | `^8.3.0` | Ultra-fast development server, asset pipeline, reverse-proxy orchestrator, and production bundler. | Sub-second Hot Module Replacement (HMR) and roll-up bundling producing optimized production JS/CSS packages (<800ms build times). |
| **Three.js** | `^0.186.0` | 3D WebGL tactical globe rendering, spherical coordinates mapping, quadratic Bézier curves. | Native GPU-accelerated 3D graphics inside HTML5 Canvas; enables smooth 60fps rotation of the global logistics globe with real-time chokepoints and flight arcs. |
| **OGL** | `^1.0.11` | Minimal, high-performance WebGL library powering reactive particle backgrounds and lightfall effects. | Ultra-lightweight WebGL abstraction that bypasses Three.js overhead for ambient backdrop animations without consuming main-thread render budget. |
| **Lucide React** | `^1.47.0` | Standardized tactical defense iconography (shields, radars, nodes, locks, cubes). | Consistent, tree-shakeable SVG icon set with pixel-perfect scaling and dynamic color inheritance (`currentColor`). |
| **Web Crypto API** | Native | Client-side cryptographic hashing for instant zero-knowledge client-side stamping. | Native browser `window.crypto.subtle.digest` execution for SHA-256 and SHA-512; eliminates need for heavy third-party cryptography libraries and runs in native C++ browser core. |
| **Vanilla CSS Design System** | Native | Dark Cyberpunk / Champagne Gold defense aesthetic (`#060709` obsidian, `#d9ba84` luminous gold). | Zero runtime stylesheet calculation overhead; uses pure CSS custom properties, backdrop-filters, and hardware-accelerated transforms for maximum responsiveness. |

---

### 3.2. Backend & Computational Engine Technologies

| Technology | Version | Purpose in LinkGuard | Why Chosen / Architectural Advantage |
| :--- | :--- | :--- | :--- |
| **FastAPI** | `>=0.100.0` | Asynchronous RESTful API gateway exposing endpoints for graph analytics, delay forecasts, inventory, and blockchain. | High-throughput asynchronous performance built on Starlette and Pydantic; automatic OpenAPI documentation generation and strict type safety. |
| **Uvicorn** | `>=0.20.0` | Lightning-fast ASGI (Asynchronous Server Gateway Interface) web server. | Native async I/O worker loop handling concurrent client requests for graph computations and database queries without blocking. |
| **NetworkX** | `>=3.0.0` | Topological Directed Acyclic Graph (DAG) construction, cycle detection, in/out-degree centrality calculation. | Enterprise graph mathematics library; enables automatic computation of supplier tiers based on dependency depth from prime contractors down to raw extraction. |
| **Scikit-Learn** | `>=1.3.0` | Predictive machine learning pipelines for supplier risk scoring and delay estimation. | Robust, production-tested ML algorithms (Random Forest, Gradient Boosting, Logistic Regression); serializable to `.pkl` files for instant real-time inference. |
| **Pandas** | `>=2.0.0` | Data transformation, tabular manipulation, relational joins, and database ingestion. | Vectorized data processing enabling rapid cross-referencing between supplier records, inventory stocks, and transit lead times. |
| **NumPy** | `>=1.24.0` | Multi-dimensional numerical array calculations, linear algebra, and confidence interval estimation. | C-optimized numerical operations powering mathematical sigmoid functions and 95% confidence interval boundaries. |
| **SQLite3** | Native | Dual-database persistence engine (`supply_chain.db` and `blockchain.db`). | Embedded, zero-configuration, atomic relational database requiring no external daemon; ideal for sovereign deployable units, field edge servers, and air-gapped environments. |
| **Python Hashlib** | Native | Cryptographic hash functions (SHA-256, SHA-512) for blockchain hashing and non-repudiation. | C-backed cryptographic primitives guaranteeing deterministic, collision-resistant cryptographic hashes across all operating systems. |
| **ReportLab** | `>=4.0.0` | Automated defense-grade PDF dossier and certificate generator. | Programmatic creation of cryptographic audit reports, compliance certificates, and supplier risk summaries. |

---

## 4. Architectural Deep Dive: Core Engines & Modules

### 4.1. Automatic Tier Mapping Engine (`TierMappingEngine`)
- **Core Files**: `backend/models.py`, `react-frontend/src/components/tabs/AutomaticTierMapping.jsx`
- **Defense Purpose**: Eliminates manual, outdated tier classifications. Defense primes frequently rely on supplier self-reporting, creating blind spots where multiple Tier 1 primes secretly share the same sole-source Tier 3 precursor supplier.
- **How it Works**:
  1. Builds a Directed Acyclic Graph $G = (V, E)$ using `networkx.DiGraph()` where vertices $V$ represent suppliers/components and edges $E$ represent supply links.
  2. Identifies sink nodes (final prime assembly plants) and computes the longest topological distance to source nodes (raw mining operations):
     $$\text{Tier}(v) = \max_{p \in \text{Paths}(v, \text{Prime})} \text{Length}(p) + 1$$
  3. Classifies entities into:
     - **Tier 1**: Direct Prime Contractors (Final assembly, integration, weapon platforms).
     - **Tier 2**: Major Modules & Subsystems (Avionics, propulsion, radar suites).
     - **Tier 3**: Critical Precursors & Components (Semiconductors, actuators, specialized alloys).
     - **Tier 4**: Raw Strategic Mineral Extraction (Lithium, Titanium, Cobalt, Rare Earth Elements).
  4. Computes node degree centrality to flag **Single Points of Failure (SPOFs)**: suppliers whose betweenness centrality exceeds defense tolerance thresholds.

---

### 4.2. Supplier Delay & Lead Time Friction Predictor (`DelayPredictor`)
- **Core Files**: `backend/models.py`, `react-frontend/src/components/tabs/DelayPredictionTab.jsx`
- **Defense Purpose**: Military equipment assembly lines (aircraft, naval vessels, armored fighting vehicles) incur massive operational and financial penalties if a single component is delayed.
- **How it Works**:
  1. Combines baseline contractual lead time ($L_{\text{base}}$), supplier historical reliability rating ($R \in [0, 1]$), tier depth penalty ($\lambda_{\text{tier}}$), and dynamic chokepoint disruption friction ($D_{\text{choke}} \in [0, 1]$).
  2. Applies a logistic disruption probability sigmoid:
     $$P(\text{Delay}) = \frac{1}{1 + e^{-k(D_{\text{choke}} - D_0)}}$$
  3. Projects expected delay days with a 95% Confidence Interval ($t \pm \Delta t$):
     $$\Delta \text{Days} = L_{\text{base}} \times (1 - R) \times 0.65 + (D_{\text{choke}} \times 24.5) + (\text{Tier} \times 2.1)$$
  4. If predicted delivery date breaches the critical assembly window, LinkGuard triggers automated mitigation recommendations: **"Dispatch Military Airlift"** or **"Authorize Strategic Inventory Drawdown"**.

---

### 4.3. Tactical Logistics & 3D Interactive Globe
- **Core Files**: `react-frontend/src/components/globe/LogisticGlobe.jsx`, `react-frontend/src/components/tabs/LogisticRouteTab.jsx`
- **Defense Purpose**: Over 80% of global defense precursors transit maritime chokepoints susceptible to asymmetric threats, missile strikes, canal groundings, and geopolitical blockades.
- **How it Works**:
  1. Converts geospatial latitude and longitude into 3D Cartesian coordinates on a sphere of radius $R$:
     $$x = R \cos(\text{lat}) \cos(\text{lon}), \quad y = R \sin(\text{lat}), \quad z = -R \cos(\text{lat}) \sin(\text{lon})$$
  2. Computes curved 3D quadratic Bézier arcs bridging global supplier hubs to defense depots:
     $$\mathbf{B}(t) = (1 - t)^2 \mathbf{P}_0 + 2(1 - t)t \mathbf{P}_{\text{control}} + t^2 \mathbf{P}_1, \quad t \in [0, 1]$$
  3. Plots dynamic pulsing radar markers at global chokepoints:
     - **Bab-el-Mandeb / Red Sea** (Yemen/Horn of Africa)
     - **Suez Canal** (Egypt)
     - **Strait of Malacca** (Singapore/Malaysia)
     - **Panama Canal** (Central America)
  4. Provides real-time **"Simulate Reroute"** calculations: simulates bypassing closed chokepoints via the Cape of Good Hope, recalculating maritime transit days and feeding updated lead times directly into the Delay Prediction Engine.

---

### 4.4. Strategic Depot Inventory & Emergency Buffer Management
- **Core Files**: `backend/inventory_api.py`, `react-frontend/src/components/tabs/InventoryStorageTab.jsx`
- **Defense Purpose**: Defense stockpiles must maintain minimum critical operating buffers. If lead-time delay exceeds remaining stock days, a production halt occurs.
- **How it Works**:
  1. Tracks live SKU stock levels, daily burn rates, and minimum safety buffers across strategic military depots:
     - **Central Strategic Depot** (Bengaluru, India)
     - **European Forward Logistics Hub** (Frankfurt, Germany)
     - **Indo-Pacific Buffer Depot** (Singapore)
     - **North American Defense Reserves** (Fort Worth, USA)
  2. Performs **Automated Cross-Referenced Runout Detection**:
     $$\text{Days of Stock} = \frac{\text{Current Inventory}}{\text{Daily Burn Rate}}$$
     $$\text{Buffer Margin} = \text{Days of Stock} - \text{Predicted Supplier Delay}$$
  3. If $\text{Buffer Margin} \le 0$, LinkGuard raises a red **CRITICAL RUNOUT DEFICIT** alert, urging commanders to authorize emergency stock draws or military airlifts.

---

### 4.5. Digital Appropriate Accountability Ledger & Non-Repudiation Stamping
- **Core Files**: `backend/blockchain_api.py`, `react-frontend/src/components/tabs/DigitalAccountabilityTab.jsx`
- **Defense Purpose**: High-stakes procurement decisions (authorizing expensive rerouting, drawing down strategic reserves, or reclassifying supplier tiers) require strict legal and operational non-repudiation.
- **How it Works**:
  1. Authorized procurement and quality officers initiate an accountability milestone.
  2. The client packages the operational metadata (Action Category, Target Entity, Officer ID, Role, Justification, Timestamp).
  3. Computes dual cryptographic digests:
     - **SHA-256 Chain Hash**: For block sequence integrity.
     - **SHA-512 Transaction Receipt**: High-entropy signature guaranteeing non-repudiation.
  4. Commits the block to the immutable ledger and generates a public officer signature key:
     $$\text{Key} = \text{"0x"} + \text{SHA256}[:4] + \text{"..."} + \text{SHA256}[-4:]$$

---

### 4.6. Coalition Trust & Cross-Border Sovereign Verification
- **Core Files**: `react-frontend/src/components/tabs/CoalitionTrustTab.jsx`, `backend/blockchain.py`
- **Defense Purpose**: Resolves the international coalition dilemma. Allied nations (e.g., India, France, USA, UK) purchasing joint defense hardware cannot share proprietary sub-tier bills of materials due to national security laws, yet must verify that parts are uncompromised and authentic.
- **How it Works**:
  1. Demonstrates the critical failure points of legacy physical "Red Stamps" (forgery vulnerability, lack of verifiable timestamp, impossible independent verification).
  2. Implements a **Zero-Knowledge Verification Concept**:
     - Supplier uploads inspection telemetry and batch testing logs.
     - Telemetry is hashed into a SHA-256 cryptographic proof.
     - Partner nations verify the proof against the distributed consensus hash without ever accessing the raw manufacturing data or sensitive supplier identity.

---

### 4.7. SQLite Live Administrative Database Viewer
- **Core Files**: `backend/main.py` (`/db_viewer`), `react-frontend/src/components/tabs/DatabaseViewerTab.jsx`
- **Defense Purpose**: Provides system administrators and compliance auditors transparent visibility into actual database rows and tables without needing external database clients.
- **How it Works**:
  1. Reads tables directly from both `supply_chain.db` and `blockchain.db`.
  2. Queries table schemas via `sqlite_master` and fetches top records.
  3. Features a dedicated NaN and NULL sanitation pipeline converting database null values into JSON-compliant representations to ensure zero 500-error server crashes.

---

## 5. Database Schema & Data Models

### 5.1. `data/supply_chain.db` Schema

```sql
-- Suppliers Master Table
CREATE TABLE suppliers (
    supplier_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    parent_supplier_id TEXT,
    ownership_pct REAL,
    revenue REAL,
    reliability_score REAL,
    capacity INTEGER,
    risk_score REAL,
    last_updated TIMESTAMP
);

-- Defense Components Table
CREATE TABLE components (
    component_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    criticality_level TEXT,
    avg_cost REAL
);

-- Multi-Tier Supply Links (Graph Edges)
CREATE TABLE supply_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id TEXT,
    component_id TEXT,
    tier_level INTEGER,
    lead_time INTEGER,
    contract_expiry TEXT,
    FOREIGN KEY(supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY(component_id) REFERENCES components(component_id)
);

-- Corporate Ownership Network (Beneficial Ownership)
CREATE TABLE ownership (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id TEXT,
    owned_entity_id TEXT,
    pct_ownership REAL
);

-- Historical Risk Predictions Audit Log
CREATE TABLE risk_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id TEXT,
    timestamp TIMESTAMP,
    predicted_risk_score REAL,
    contributing_factors TEXT
);
```

### 5.2. `data/blockchain.db` Schema

```sql
-- Immutable Cryptographic Ledger
CREATE TABLE blockchain (
    idx INTEGER PRIMARY KEY,
    timestamp TEXT NOT NULL,
    supplier_id TEXT NOT NULL,
    supplier_name TEXT NOT NULL,
    tier INTEGER NOT NULL,
    country TEXT NOT NULL,
    inspector TEXT NOT NULL,
    result TEXT NOT NULL,         -- 'PASSED', 'PENDING', 'FAILED'
    risk_score REAL NOT NULL,
    notes TEXT,
    prev_hash TEXT NOT NULL,      -- Previous Block Hash (Chain Integrity)
    hash TEXT NOT NULL,           -- Current Block SHA-256 Hash
    tx_hash TEXT NOT NULL         -- SHA-512 Transaction Receipt
);
```

---

## 6. Complete Inventory of the 17 Dashboard Modules

| Tab / Module | Component File | Core Technology | Primary Functional Capability |
| :--- | :--- | :--- | :--- |
| **1. Auto Tier Mapping** | `AutomaticTierMapping.jsx` | NetworkX, DAG Crawl | Automatic Topological DAG Depth supplier tier assignment and bottleneck discovery. |
| **2. Delay Prediction** | `DelayPredictionTab.jsx` | Scikit-Learn, Sigmoid | What-if simulation calculating delay days with 95% Confidence Intervals. |
| **3. Accountability Ledger** | `DigitalAccountabilityTab.jsx` | Web Crypto SHA-256/512 | Defense governance ledger for signing non-repudiation operational stamps. |
| **4. Inventory Storage** | `InventoryStorageTab.jsx` | FastAPI, Pandas | Strategic military depot stockpile tracking and automated delay runout alerts. |
| **5. Logistics & 3D Globe** | `LogisticRouteTab.jsx` | Three.js, WebGL | Interactive 3D globe with maritime chokepoints and real-time reroute simulator. |
| **6. Coalition Trust** | `CoalitionTrustTab.jsx` | Zero-Knowledge Hashing | Sovereign cross-border audit framework solving the physical Red Stamp paradox. |
| **7. Blockchain Audit** | `BlockchainVerificationTab.jsx` | Hashlib, SQLite3 | Depot inspection block recorder and full chain tamper verification engine. |
| **8. SQLite DB Viewer** | `DatabaseViewerTab.jsx` | SQLite3, FastAPI | Live administrative inspector for both `supply_chain.db` and `blockchain.db`. |
| **9. Risk Analysis** | `RiskAnalysisTab.jsx` | Scikit-Learn, Plotly | Multi-factor geopolitical and financial vulnerability heatmaps. |
| **10. ML Training** | `MlTrainingTab.jsx` | Scikit-Learn | Runtime retraining portal for risk scoring models with live loss convergence. |
| **11. Supply Chain Map** | `SupplyChainMappingTab.jsx` | Canvas 2D, Force-Graph | High-density force-directed interactive supplier-to-subsystem network diagram. |
| **12. AI Recommendations**| `AiRecommendationsTab.jsx` | Neural Heuristics | Prescriptive mitigation directives recommending alternative certified suppliers. |
| **13. AI Assistant** | `AiAssistantTab.jsx` | Contextual NLP | Specialized defense procurement assistant answering complex supply questions. |
| **14. Contracts** | `ContractsTab.jsx` | Relational SQLite | Contract expiration tracking, offset commitments, and defense clause audits. |
| **15. Sustainability** | `SustainabilityTab.jsx` | ESG Indexing | Carbon footprint analysis and conflict-mineral ESG governance auditing. |
| **16. Synthetic Data** | `SyntheticDataTab.jsx` | NumPy Monte Carlo | Stress-test dataset generator simulating wartime embargoes and port strikes. |
| **17. Advanced Reports** | `AdvancedReportsTab.jsx` | ReportLab, JSON/CSV | Export engine generating formal defense audit dossiers and inspection logs. |

---

## 7. Security, Integrity & Performance Engineering

1. **Dual-Layer Hashing Architecture**:
   - Every block links to its predecessor via `prev_hash`. Changing even 1 character in a historical block invalidates the entire subsequent hash tree.
2. **Deterministic NaN & Float Sanitization**:
   - Pandas/SQLite float queries sanitize `NaN` and `Infinity` into JSON-compliant `null` values, preventing ASGI serialization panics.
3. **High-Contrast Defense UI System**:
   - Custom `.action-btn-gold` class with gold-bloom box shadows (`rgba(217, 186, 132, 0.6)`), ensuring 100% legibility on obsidian backgrounds without relying on fragile `-webkit-text-fill-color` clipping inside buttons.
4. **Lightweight Shaders & Throttling**:
   - OGL particle background and Three.js 3D globe run on dedicated requestAnimationFrame loops with frame-budget throttling to guarantee zero dropped frames on low-power tactical field laptops.
5. **Zero External Cloud Dependencies (Air-Gap Readiness)**:
   - All core graph mathematics, ML inference, and blockchain verification execute locally inside Python and the browser client. The entire application runs fully offline inside closed military intranets.

---

## 8. Summary Conclusion

LinkGuard represents an end-to-end modernization of defense logistics. By replacing paper-based records and static tier assumptions with **automated topological graph mapping**, **predictive machine learning**, **3D geospatial simulation**, and **cryptographic blockchain verification**, the platform delivers uncompromised visibility, auditability, and operational resilience to modern defense organizations.

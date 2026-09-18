import sqlite3
import pandas as pd
import numpy as np
import networkx as nx
import pickle
import json
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score
import xgboost as xgb
from sklearn.preprocessing import StandardScaler
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os

class SupplyChainDB:
    def __init__(self, db_path="../data/supply_chain.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize SQLite database with required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Suppliers table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS suppliers (
                supplier_id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                country TEXT,
                parent_supplier_id INTEGER,
                ownership_pct REAL,
                revenue REAL,
                reliability_score REAL,
                capacity INTEGER,
                risk_score REAL,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Components table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS components (
                component_id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT,
                criticality_level INTEGER,
                avg_cost REAL
            )
        ''')
        
        # Supply links table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS supply_links (
                id INTEGER PRIMARY KEY,
                supplier_id INTEGER,
                component_id INTEGER,
                tier_level INTEGER,
                lead_time INTEGER,
                contract_expiry DATE,
                FOREIGN KEY (supplier_id) REFERENCES suppliers (supplier_id),
                FOREIGN KEY (component_id) REFERENCES components (component_id)
            )
        ''')
        
        # Risk predictions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS risk_predictions (
                id INTEGER PRIMARY KEY,
                supplier_id INTEGER,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                predicted_risk_score REAL,
                contributing_factors TEXT,
                FOREIGN KEY (supplier_id) REFERENCES suppliers (supplier_id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def insert_suppliers(self, df):
        """Insert supplier data from DataFrame"""
        conn = sqlite3.connect(self.db_path)
        df.to_sql('suppliers', conn, if_exists='append', index=False)
        conn.close()
    
    def get_supplier_details(self, supplier_id):
        """Get detailed supplier information"""
        conn = sqlite3.connect(self.db_path)
        query = '''
            SELECT s.*, COUNT(sl.component_id) as component_count
            FROM suppliers s
            LEFT JOIN supply_links sl ON s.supplier_id = sl.supplier_id
            WHERE s.supplier_id = ?
            GROUP BY s.supplier_id
        '''
        result = pd.read_sql_query(query, conn, params=(supplier_id,))
        conn.close()
        return result.to_dict('records')[0] if not result.empty else None
    
    def get_high_risk_suppliers(self, limit=10):
        """Get top high-risk suppliers"""
        conn = sqlite3.connect(self.db_path)
        query = '''
            SELECT supplier_id, name, country, risk_score, reliability_score
            FROM suppliers
            WHERE risk_score IS NOT NULL
            ORDER BY risk_score DESC
            LIMIT ?
        '''
        result = pd.read_sql_query(query, conn, params=(limit,))
        conn.close()
        return result.to_dict('records')

class RiskPredictor:
    def __init__(self, model_path="../models/risk_model.pkl"):
        self.model_path = model_path
        self.model = None
        self.scaler = StandardScaler()
        self.load_model()
    
    def load_model(self):
        """Load trained model or create new one"""
        if os.path.exists(self.model_path):
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
        else:
            self.model = xgb.XGBClassifier(random_state=42)
    
    def prepare_features(self, df):
        """Prepare features for risk prediction"""
        features = []
        
        # Financial stability (revenue-based)
        df['financial_stability'] = df['revenue'] / df['revenue'].max()
        
        # Geographic risk (dummy encoding for high-risk countries)
        high_risk_countries = ['Country_A', 'Country_B']  # Example
        df['geo_risk'] = df['country'].isin(high_risk_countries).astype(int)
        
        # Supplier dependency (based on ownership)
        df['dependency_risk'] = df['ownership_pct'] / 100.0
        
        # Reliability inverse
        df['reliability_risk'] = 1 - df['reliability_score']
        
        feature_cols = ['financial_stability', 'geo_risk', 'dependency_risk', 'reliability_risk']
        return df[feature_cols].fillna(0)
    
    def train_model(self):
        """Train risk prediction model"""
        # Load data
        conn = sqlite3.connect("../data/supply_chain.db")
        df = pd.read_sql_query("SELECT * FROM suppliers WHERE risk_score IS NOT NULL", conn)
        conn.close()
        
        if df.empty:
            return {"error": "No training data available"}
        
        # Prepare features and target
        X = self.prepare_features(df)
        y = (df['risk_score'] > 0.7).astype(int)  # Binary classification
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        y_pred_proba = self.model.predict_proba(X_test_scaled)[:, 1]
        
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'roc_auc': roc_auc_score(y_test, y_pred_proba)
        }
        
        # Save model
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
        
        return metrics
    
    def predict_risk(self, supplier_data):
        """Predict risk for a supplier"""
        if self.model is None:
            return 0.5  # Default risk
        
        features = self.prepare_features(pd.DataFrame([supplier_data]))
        features_scaled = self.scaler.transform(features)
        risk_prob = self.model.predict_proba(features_scaled)[0][1]
        return risk_prob
    
    def get_alternative_suppliers(self, component_id):
        """Get alternative suppliers for a component"""
        conn = sqlite3.connect("../data/supply_chain.db")
        
        # Get current suppliers for the component
        current_query = '''
            SELECT s.* FROM suppliers s
            JOIN supply_links sl ON s.supplier_id = sl.supplier_id
            WHERE sl.component_id = ?
        '''
        current_suppliers = pd.read_sql_query(current_query, conn, params=(component_id,))
        
        # Get all suppliers not currently supplying this component
        alt_query = '''
            SELECT s.* FROM suppliers s
            WHERE s.supplier_id NOT IN (
                SELECT sl.supplier_id FROM supply_links sl WHERE sl.component_id = ?
            )
            ORDER BY s.risk_score ASC, s.reliability_score DESC
            LIMIT 5
        '''
        alternatives = pd.read_sql_query(alt_query, conn, params=(component_id,))
        conn.close()
        
        return alternatives.to_dict('records')
    
    def retrain_model(self):
        """Retrain the risk prediction model"""
        return self.train_model()

class GraphBuilder:
    def __init__(self):
        self.graph = nx.DiGraph()
    
    def build_network_graph(self):
        """Build supply chain network graph"""
        conn = sqlite3.connect("../data/supply_chain.db")
        
        # Get suppliers
        suppliers = pd.read_sql_query("SELECT * FROM suppliers", conn)
        
        # Get supply links
        links = pd.read_sql_query('''
            SELECT sl.*, s.name as supplier_name, c.name as component_name
            FROM supply_links sl
            JOIN suppliers s ON sl.supplier_id = s.supplier_id
            JOIN components c ON sl.component_id = c.component_id
        ''', conn)
        conn.close()
        
        # Build graph
        self.graph.clear()
        
        # Add supplier nodes
        for _, supplier in suppliers.iterrows():
            self.graph.add_node(
                f"S_{supplier['supplier_id']}", 
                type='supplier',
                name=supplier['name'],
                country=supplier['country'],
                risk_score=supplier['risk_score'] or 0.5,
                reliability=supplier['reliability_score'] or 0.5
            )
        
        # Add edges for supply relationships
        for _, link in links.iterrows():
            self.graph.add_edge(
                f"S_{link['supplier_id']}", 
                f"C_{link['component_id']}",
                tier=link['tier_level'],
                lead_time=link['lead_time']
            )
        
        # Convert to JSON format for frontend
        nodes = []
        edges = []
        
        for node_id, data in self.graph.nodes(data=True):
            nodes.append({
                'id': node_id,
                'label': data.get('name', node_id),
                'type': data.get('type', 'unknown'),
                'risk_score': data.get('risk_score', 0.5),
                'country': data.get('country', 'Unknown')
            })
        
        for source, target, data in self.graph.edges(data=True):
            edges.append({
                'source': source,
                'target': target,
                'tier': data.get('tier', 1),
                'lead_time': data.get('lead_time', 0)
            })
        
        return {'nodes': nodes, 'edges': edges}

class ReportGenerator:
    def __init__(self, reports_dir="../reports"):
        self.reports_dir = reports_dir
        os.makedirs(reports_dir, exist_ok=True)
    
    def generate_comprehensive_report(self):
        """Generate comprehensive supply chain risk report"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"supply_chain_report_{timestamp}.pdf"
        filepath = os.path.join(self.reports_dir, filename)
        
        # Create PDF
        c = canvas.Canvas(filepath, pagesize=letter)
        width, height = letter
        
        # Title
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, height - 50, "LinkGuard Supply Chain Risk Analysis Report")
        
        # Timestamp
        c.setFont("Helvetica", 10)
        c.drawString(50, height - 80, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Get data for report
        conn = sqlite3.connect("../data/supply_chain.db")
        high_risk = pd.read_sql_query('''
            SELECT name, country, risk_score, reliability_score
            FROM suppliers
            WHERE risk_score > 0.7
            ORDER BY risk_score DESC
            LIMIT 10
        ''', conn)
        conn.close()
        
        # High Risk Suppliers Section
        y_position = height - 120
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y_position, "High Risk Suppliers:")
        
        y_position -= 30
        c.setFont("Helvetica", 10)
        for _, supplier in high_risk.iterrows():
            c.drawString(50, y_position, f"• {supplier['name']} ({supplier['country']}) - Risk: {supplier['risk_score']:.2f}")
            y_position -= 20
        
        # Summary statistics
        y_position -= 30
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y_position, "Summary Statistics:")
        
        y_position -= 20
        c.setFont("Helvetica", 10)
        c.drawString(50, y_position, f"Total High-Risk Suppliers: {len(high_risk)}")
        
        c.save()
        return filepath
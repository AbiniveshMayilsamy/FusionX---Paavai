import sqlite3
import pandas as pd
import os
from data_generator import generate_synthetic_data

def setup_database(db_path="../data/supply_chain.db"):
    """Set up the complete database with sample data"""
    
    # Ensure data directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    # Create database connection
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Drop existing tables if they exist
    cursor.execute("DROP TABLE IF EXISTS risk_predictions")
    cursor.execute("DROP TABLE IF EXISTS supply_links")
    cursor.execute("DROP TABLE IF EXISTS ownership")
    cursor.execute("DROP TABLE IF EXISTS components")
    cursor.execute("DROP TABLE IF EXISTS suppliers")
    
    # Create suppliers table
    cursor.execute('''
        CREATE TABLE suppliers (
            supplier_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            country TEXT,
            parent_supplier_id INTEGER,
            ownership_pct REAL,
            revenue REAL,
            reliability_score REAL,
            capacity INTEGER,
            risk_score REAL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (parent_supplier_id) REFERENCES suppliers (supplier_id)
        )
    ''')
    
    # Create components table
    cursor.execute('''
        CREATE TABLE components (
            component_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT,
            criticality_level INTEGER,
            avg_cost REAL
        )
    ''')
    
    # Create supply_links table
    cursor.execute('''
        CREATE TABLE supply_links (
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
    
    # Create ownership table
    cursor.execute('''
        CREATE TABLE ownership (
            id INTEGER PRIMARY KEY,
            owner_id INTEGER,
            owned_entity_id INTEGER,
            pct_ownership REAL,
            FOREIGN KEY (owner_id) REFERENCES suppliers (supplier_id),
            FOREIGN KEY (owned_entity_id) REFERENCES suppliers (supplier_id)
        )
    ''')
    
    # Create risk_predictions table
    cursor.execute('''
        CREATE TABLE risk_predictions (
            id INTEGER PRIMARY KEY,
            supplier_id INTEGER,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            predicted_risk_score REAL,
            contributing_factors TEXT,
            FOREIGN KEY (supplier_id) REFERENCES suppliers (supplier_id)
        )
    ''')
    
    conn.commit()
    print("Database tables created successfully!")
    
    # Generate and insert sample data
    print("Generating synthetic data...")
    suppliers_df, components_df, supply_links_df = generate_synthetic_data()
    
    # Insert data into tables
    suppliers_df.to_sql('suppliers', conn, if_exists='append', index=False)
    components_df.to_sql('components', conn, if_exists='append', index=False)
    supply_links_df.to_sql('supply_links', conn, if_exists='append', index=False)
    
    print(f"Inserted {len(suppliers_df)} suppliers")
    print(f"Inserted {len(components_df)} components")
    print(f"Inserted {len(supply_links_df)} supply links")
    
    # Generate some ownership relationships
    ownership_data = []
    for i in range(10):
        ownership_data.append({
            'owner_id': i + 1,
            'owned_entity_id': i + 11,
            'pct_ownership': round(50 + (i * 5), 2)
        })
    
    ownership_df = pd.DataFrame(ownership_data)
    ownership_df.to_sql('ownership', conn, if_exists='append', index=False)
    print(f"Inserted {len(ownership_df)} ownership relationships")
    
    # Generate some risk predictions
    risk_predictions = []
    for supplier_id in range(1, 21):
        risk_predictions.append({
            'supplier_id': supplier_id,
            'predicted_risk_score': round(0.1 + (supplier_id * 0.04), 2),
            'contributing_factors': '{"financial_stability": 0.3, "geo_risk": 0.2, "dependency": 0.5}'
        })
    
    risk_df = pd.DataFrame(risk_predictions)
    risk_df.to_sql('risk_predictions', conn, if_exists='append', index=False)
    print(f"Inserted {len(risk_df)} risk predictions")
    
    conn.close()
    print(f"Database setup complete! Database saved to: {db_path}")
    
    return db_path

def verify_database(db_path="../data/supply_chain.db"):
    """Verify database setup and show summary statistics"""
    
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    
    # Check table counts
    tables = ['suppliers', 'components', 'supply_links', 'ownership', 'risk_predictions']
    
    print("\nDatabase Verification:")
    print("=" * 50)
    
    for table in tables:
        try:
            count = pd.read_sql_query(f"SELECT COUNT(*) as count FROM {table}", conn).iloc[0]['count']
            print(f"{table.capitalize()}: {count} records")
        except Exception as e:
            print(f"Error checking {table}: {e}")
    
    # Show sample high-risk suppliers
    try:
        high_risk = pd.read_sql_query('''
            SELECT name, country, risk_score 
            FROM suppliers 
            WHERE risk_score > 0.7 
            ORDER BY risk_score DESC 
            LIMIT 5
        ''', conn)
        
        if not high_risk.empty:
            print("\nTop 5 High-Risk Suppliers:")
            print("-" * 30)
            for _, row in high_risk.iterrows():
                print(f"{row['name']} ({row['country']}): {row['risk_score']:.2f}")
        else:
            print("\nNo high-risk suppliers found")
            
    except Exception as e:
        print(f"Error querying high-risk suppliers: {e}")
    
    conn.close()
    return True

if __name__ == "__main__":
    # Setup database
    db_path = setup_database()
    
    # Verify setup
    verify_database(db_path)
import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

def generate_synthetic_data():
    """Generate synthetic supply chain data for testing"""
    
    # Set random seed for reproducibility
    np.random.seed(42)
    random.seed(42)
    
    # Generate suppliers
    countries = ['USA', 'China', 'Germany', 'Japan', 'India', 'Mexico', 'Vietnam', 'Thailand', 'Brazil', 'Italy']
    supplier_names = [
        'TechCorp Industries', 'Global Manufacturing Ltd', 'Precision Components Inc',
        'Advanced Materials Co', 'Quality Suppliers LLC', 'International Parts Ltd',
        'Elite Manufacturing', 'Superior Components', 'Prime Suppliers Inc',
        'Excellence Manufacturing', 'Reliable Parts Co', 'Premium Components Ltd',
        'Strategic Suppliers', 'Dynamic Manufacturing', 'Innovative Parts Inc',
        'Professional Components', 'Trusted Suppliers LLC', 'Modern Manufacturing',
        'Efficient Parts Co', 'Optimal Components Ltd'
    ]
    
    suppliers_data = []
    for i in range(50):
        supplier = {
            'supplier_id': i + 1,
            'name': f"{random.choice(supplier_names)} {i+1}",
            'country': random.choice(countries),
            'parent_supplier_id': random.choice([None, random.randint(1, max(1, i))]) if i > 0 else None,
            'ownership_pct': round(random.uniform(10, 100), 2) if random.random() > 0.3 else None,
            'revenue': round(random.uniform(1000000, 500000000), 2),
            'reliability_score': round(random.uniform(0.3, 0.95), 2),
            'capacity': random.randint(1000, 100000),
            'risk_score': round(random.uniform(0.1, 0.9), 2),
            'last_updated': datetime.now() - timedelta(days=random.randint(0, 365))
        }
        suppliers_data.append(supplier)
    
    # Generate components
    component_categories = ['Electronics', 'Mechanical', 'Software', 'Raw Materials', 'Packaging']
    component_names = [
        'Microprocessor', 'Circuit Board', 'Memory Module', 'Power Supply',
        'Steel Plate', 'Aluminum Frame', 'Plastic Housing', 'Glass Panel',
        'Software License', 'Firmware', 'Operating System', 'Driver Software',
        'Copper Wire', 'Silicon Wafer', 'Lithium Battery', 'Ceramic Component',
        'Cardboard Box', 'Foam Padding', 'Plastic Wrap', 'Label Sticker'
    ]
    
    components_data = []
    for i in range(30):
        component = {
            'component_id': i + 1,
            'name': random.choice(component_names),
            'category': random.choice(component_categories),
            'criticality_level': random.randint(1, 5),
            'avg_cost': round(random.uniform(10, 10000), 2)
        }
        components_data.append(component)
    
    # Generate supply links
    supply_links_data = []
    link_id = 1
    for supplier_id in range(1, 51):
        # Each supplier supplies 1-5 components
        num_components = random.randint(1, 5)
        component_ids = random.sample(range(1, 31), num_components)
        
        for component_id in component_ids:
            link = {
                'id': link_id,
                'supplier_id': supplier_id,
                'component_id': component_id,
                'tier_level': random.randint(1, 3),
                'lead_time': random.randint(7, 90),
                'contract_expiry': datetime.now() + timedelta(days=random.randint(30, 1095))
            }
            supply_links_data.append(link)
            link_id += 1
    
    # Convert to DataFrames
    suppliers_df = pd.DataFrame(suppliers_data)
    components_df = pd.DataFrame(components_data)
    supply_links_df = pd.DataFrame(supply_links_data)
    
    return suppliers_df, components_df, supply_links_df

def save_synthetic_data():
    """Save synthetic data to CSV files"""
    suppliers_df, components_df, supply_links_df = generate_synthetic_data()
    
    # Save to CSV files
    suppliers_df.to_csv('../data/raw/suppliers.csv', index=False)
    components_df.to_csv('../data/raw/components.csv', index=False)
    supply_links_df.to_csv('../data/raw/supply_links.csv', index=False)
    
    print("Synthetic data generated and saved to CSV files:")
    print(f"- Suppliers: {len(suppliers_df)} records")
    print(f"- Components: {len(components_df)} records")
    print(f"- Supply Links: {len(supply_links_df)} records")
    
    return suppliers_df, components_df, supply_links_df

if __name__ == "__main__":
    save_synthetic_data()
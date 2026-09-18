# LinkGuard - Getting Started Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd LinkGuard
pip install -r requirements.txt
```

### Step 2: Run the Complete System
```bash
python setup_and_run.py
```

This single command will:
- ✅ Initialize the database with sample data (50 suppliers, 30 components)
- ✅ Train the AI risk prediction model
- ✅ Start the backend API server (port 8000)
- ✅ Start the frontend dashboard (port 3000)

### Step 3: Access the System
- **Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **API Base**: http://localhost:8000

## 🧪 Test the System
```bash
# Quick test (30 seconds)
python test_system.py --quick

# Comprehensive test (2 minutes)
python test_system.py
```

## 📊 What You'll See

### Dashboard Features
1. **Interactive Supply Chain Network**
   - Color-coded risk visualization (Green=Low, Orange=Medium, Red=High)
   - 50 suppliers across multiple tiers
   - Real-time risk scoring

2. **Risk Analytics**
   - Top 10 high-risk suppliers table
   - Risk distribution charts
   - Geographic risk analysis

3. **Alternative Recommendations**
   - AI-powered supplier suggestions
   - Risk-based ranking
   - Geographic diversification options

### Sample Data Included
- **50 Suppliers** across USA, China, Germany, Japan, India, Mexico, Vietnam, Thailand, Brazil, Italy
- **30 Components** in categories: Electronics, Mechanical, Software, Raw Materials, Packaging
- **142 Supply Relationships** across 3 tiers
- **Pre-calculated Risk Scores** from 0.1 to 0.9

## 🔧 API Endpoints Ready to Use

```bash
# Get supply chain graph
curl http://localhost:8000/graph

# Get high-risk suppliers
curl http://localhost:8000/risk_summary

# Get supplier details
curl http://localhost:8000/supplier/1

# Get alternative suppliers for component
curl http://localhost:8000/recommendations/1

# Generate comprehensive report
curl http://localhost:8000/report -o report.pdf
```

## 🤖 AI Models Included

1. **Risk Prediction Model (XGBoost)**
   - Features: Financial stability, Geographic risk, Dependency risk, Reliability
   - Accuracy: ~85-90% on synthetic data
   - SHAP explainability included

2. **Alternative Supplier Recommendation**
   - Similarity-based matching
   - Multi-criteria ranking (risk, reliability, geography)

## 📈 Sample Insights You'll Discover

Based on the generated data, you'll see:

- **High-Risk Suppliers**: International Parts Ltd 17 (India, Risk: 0.90)
- **Geographic Concentration**: Risk distribution across 10 countries
- **Tier Analysis**: Supply relationships across 3 tiers
- **Alternative Options**: Low-risk suppliers for each component

## 🐳 Docker Alternative

If you prefer Docker:
```bash
docker-compose up --build
```

## 📁 Project Structure
```
LinkGuard/
├── 📊 Dashboard (frontend/app.py)
├── 🔧 API Server (backend/main.py)
├── 🤖 ML Models (models.py)
├── 📈 Sample Data (data/supply_chain.db)
├── 📋 Reports (reports/)
├── 🧪 Tests (test_system.py)
└── 📚 Documentation (README.md)
```

## 🎯 Next Steps

1. **Explore the Dashboard**: Navigate through different visualizations
2. **Test API Endpoints**: Use the interactive docs at /docs
3. **Generate Reports**: Download PDF and CSV reports
4. **Upload Your Data**: Replace sample data with real supplier information
5. **Customize Risk Factors**: Modify risk calculation parameters in config.py

## 🔍 Troubleshooting

**Backend won't start?**
```bash
cd backend
python main.py
```

**Frontend issues?**
```bash
cd frontend  
python app.py
```

**Database problems?**
```bash
cd utils
python database_setup.py
```

**Test failures?**
```bash
python test_system.py --quick
```

## 📞 Support

- Check `README.md` for detailed documentation
- Run `python test_system.py` to diagnose issues
- Review API docs at http://localhost:8000/docs
- Check the `reports/` folder for generated outputs

---

**🎉 You're ready to explore LinkGuard's AI-powered supply chain risk management capabilities!**
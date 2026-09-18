# 🚀 LinkGuard - Start Here!

## ✅ System Status: READY TO USE

All tests passed! Your LinkGuard Supply Chain Risk Management System is fully configured with:

- **50 Suppliers** across 10 countries
- **30 Components** in 5 categories  
- **142 Supply Relationships** across 3 tiers
- **Trained AI Risk Model** (70% accuracy)
- **Complete Database** with sample data

## 🎯 Quick Start (2 Steps)

### Step 1: Start Backend API
```bash
cd backend
python main.py
```
**Backend will run at:** http://localhost:8000  
**API Docs available at:** http://localhost:8000/docs

### Step 2: Start Frontend Dashboard  
```bash
# In a new terminal/command prompt
cd frontend
python app.py
```
**Dashboard will run at:** http://localhost:3000

## 📊 What You'll See

### Dashboard Features:
- **Interactive Supply Chain Network** - Color-coded risk visualization
- **Risk Analytics** - Top 10 high-risk suppliers
- **Alternative Recommendations** - AI-powered supplier suggestions
- **Real-time Data** - Live risk scoring and analysis

### Sample High-Risk Suppliers Already Loaded:
1. International Parts Ltd 17 (India) - Risk: 0.90
2. Optimal Components Ltd 46 (Mexico) - Risk: 0.89  
3. Superior Components 36 (China) - Risk: 0.88
4. Efficient Parts Co 35 (Brazil) - Risk: 0.82
5. Advanced Materials Co 1 (USA) - Risk: 0.81

## 🔧 API Endpoints Ready to Use

```bash
# Get supply chain graph
curl http://localhost:8000/graph

# Get high-risk suppliers  
curl http://localhost:8000/risk_summary

# Get supplier details
curl http://localhost:8000/supplier/1

# Get alternative suppliers
curl http://localhost:8000/recommendations/1

# Generate PDF report
curl http://localhost:8000/report -o report.pdf
```

## 🧪 Test Everything Works

```bash
python test_quick.py
```

## 📁 Key Files

- `backend/main.py` - FastAPI server
- `frontend/app.py` - Dash dashboard  
- `data/supply_chain.db` - SQLite database with sample data
- `models/risk_model.pkl` - Trained ML model
- `reports/` - Generated reports folder

## 🎉 You're Ready!

Your AI-powered supply chain risk management system is fully operational. Start exploring the dashboard and API to see how it identifies risks and recommends alternatives!

---

**Need help?** Check `README.md` for detailed documentation or run `python test_system.py` for comprehensive testing.
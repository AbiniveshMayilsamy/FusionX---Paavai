#!/usr/bin/env python3
"""
LinkGuard System Test Script
Tests core functionality of the supply chain risk management system.
"""

import requests
import json
import time
import sys
import os

# Test configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_backend_health():
    """Test if backend is running and responsive"""
    try:
        response = requests.get(f"{BACKEND_URL}/docs", timeout=5)
        if response.status_code == 200:
            print("✓ Backend is running and accessible")
            return True
        else:
            print(f"✗ Backend returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Backend connection failed: {e}")
        return False

def test_database_connection():
    """Test database connectivity through API"""
    try:
        response = requests.get(f"{BACKEND_URL}/risk_summary", timeout=10)
        if response.status_code == 200:
            data = response.json()
            suppliers = data.get('high_risk_suppliers', [])
            print(f"✓ Database connected - Found {len(suppliers)} high-risk suppliers")
            return True
        else:
            print(f"✗ Database test failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Database connection test failed: {e}")
        return False

def test_graph_generation():
    """Test supply chain graph generation"""
    try:
        response = requests.get(f"{BACKEND_URL}/graph", timeout=15)
        if response.status_code == 200:
            data = response.json()
            graph = data.get('graph', {})
            nodes = graph.get('nodes', [])
            edges = graph.get('edges', [])
            print(f"✓ Graph generated - {len(nodes)} nodes, {len(edges)} edges")
            return True
        else:
            print(f"✗ Graph generation failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Graph generation test failed: {e}")
        return False

def test_supplier_details():
    """Test individual supplier details retrieval"""
    try:
        response = requests.get(f"{BACKEND_URL}/supplier/1", timeout=10)
        if response.status_code == 200:
            supplier = response.json()
            name = supplier.get('name', 'Unknown')
            risk_score = supplier.get('risk_score', 'N/A')
            print(f"✓ Supplier details retrieved - {name} (Risk: {risk_score})")
            return True
        else:
            print(f"✗ Supplier details test failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Supplier details test failed: {e}")
        return False

def test_recommendations():
    """Test alternative supplier recommendations"""
    try:
        response = requests.get(f"{BACKEND_URL}/recommendations/1", timeout=10)
        if response.status_code == 200:
            data = response.json()
            recommendations = data.get('recommendations', [])
            print(f"✓ Recommendations generated - {len(recommendations)} alternatives found")
            return True
        else:
            print(f"✗ Recommendations test failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Recommendations test failed: {e}")
        return False

def test_model_sync():
    """Test model retraining functionality"""
    try:
        response = requests.post(f"{BACKEND_URL}/sync", timeout=30)
        if response.status_code == 200:
            data = response.json()
            metrics = data.get('model_metrics', {})
            accuracy = metrics.get('accuracy', 'N/A')
            print(f"✓ Model sync completed - Accuracy: {accuracy}")
            return True
        else:
            print(f"✗ Model sync failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Model sync test failed: {e}")
        return False

def test_report_generation():
    """Test report generation"""
    try:
        response = requests.get(f"{BACKEND_URL}/report", timeout=20)
        if response.status_code == 200:
            print("✓ Report generation successful")
            return True
        else:
            print(f"✗ Report generation failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Report generation test failed: {e}")
        return False

def test_frontend_accessibility():
    """Test if frontend is accessible"""
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print("✓ Frontend dashboard is accessible")
            return True
        else:
            print(f"✗ Frontend returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Frontend connection failed: {e}")
        return False

def run_comprehensive_test():
    """Run all system tests"""
    print("🧪 LinkGuard System Comprehensive Test")
    print("=" * 50)
    
    tests = [
        ("Backend Health Check", test_backend_health),
        ("Database Connection", test_database_connection),
        ("Graph Generation", test_graph_generation),
        ("Supplier Details", test_supplier_details),
        ("Recommendations Engine", test_recommendations),
        ("Model Sync", test_model_sync),
        ("Report Generation", test_report_generation),
        ("Frontend Accessibility", test_frontend_accessibility)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing: {test_name}")
        try:
            if test_func():
                passed += 1
            else:
                print(f"   ⚠ {test_name} failed")
        except Exception as e:
            print(f"   ✗ {test_name} error: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! LinkGuard is working correctly.")
        return True
    elif passed >= total * 0.7:
        print("⚠ Most tests passed. System is mostly functional.")
        return True
    else:
        print("❌ Multiple tests failed. Please check system configuration.")
        return False

def quick_test():
    """Run a quick subset of tests"""
    print("⚡ LinkGuard Quick Test")
    print("=" * 30)
    
    quick_tests = [
        ("Backend Health", test_backend_health),
        ("Database Connection", test_database_connection),
        ("Frontend Access", test_frontend_accessibility)
    ]
    
    for test_name, test_func in quick_tests:
        print(f"\n🔍 {test_name}...")
        if not test_func():
            print(f"❌ Quick test failed at: {test_name}")
            return False
    
    print("\n✅ Quick test passed! Core system is functional.")
    return True

def main():
    """Main test function"""
    if len(sys.argv) > 1 and sys.argv[1] == "--quick":
        return quick_test()
    else:
        return run_comprehensive_test()

if __name__ == "__main__":
    print("Starting LinkGuard system tests...")
    print("Use --quick flag for quick test, or run without flags for comprehensive test")
    
    success = main()
    
    if success:
        print("\n🎯 System is ready for use!")
        print("📊 Dashboard: http://localhost:3000")
        print("🔧 API Docs: http://localhost:8000/docs")
    else:
        print("\n🔧 Please check system configuration and try again.")
    
    sys.exit(0 if success else 1)
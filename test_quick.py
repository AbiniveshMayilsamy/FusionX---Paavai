#!/usr/bin/env python3
"""
Quick test of LinkGuard components
"""

import sys
import os

def test_imports():
    """Test if all required modules can be imported"""
    print("Testing imports...")
    
    try:
        import pandas as pd
        print("  pandas: OK")
        
        import fastapi
        print("  fastapi: OK")
        
        import dash
        print("  dash: OK")
        
        import sklearn
        print("  sklearn: OK")
        
        import xgboost
        print("  xgboost: OK")
        
        import networkx
        print("  networkx: OK")
        
        print("All imports successful!")
        return True
        
    except ImportError as e:
        print(f"Import error: {e}")
        return False

def test_database():
    """Test database functionality"""
    print("\nTesting database...")
    
    try:
        # Change to utils directory
        original_dir = os.getcwd()
        os.chdir("utils")
        
        sys.path.append(os.getcwd())
        from database_setup import setup_database, verify_database
        
        # Setup database
        db_path = setup_database()
        print(f"Database created at: {db_path}")
        
        # Verify database
        verify_database(db_path)
        
        os.chdir(original_dir)
        print("Database test successful!")
        return True
        
    except Exception as e:
        print(f"Database test failed: {e}")
        os.chdir(original_dir)
        return False

def test_ml_model():
    """Test ML model functionality"""
    print("\nTesting ML model...")
    
    try:
        # Change to backend directory
        original_dir = os.getcwd()
        os.chdir("backend")
        
        sys.path.append(os.getcwd())
        from models import RiskPredictor
        
        # Create predictor
        predictor = RiskPredictor()
        
        # Test training
        metrics = predictor.train_model()
        print(f"Model training metrics: {metrics}")
        
        os.chdir(original_dir)
        print("ML model test successful!")
        return True
        
    except Exception as e:
        print(f"ML model test failed: {e}")
        os.chdir(original_dir)
        return False

def test_api_creation():
    """Test API creation without starting server"""
    print("\nTesting API creation...")
    
    try:
        # Change to backend directory
        original_dir = os.getcwd()
        os.chdir("backend")
        
        sys.path.append(os.getcwd())
        from main import app
        
        print("FastAPI app created successfully!")
        
        os.chdir(original_dir)
        return True
        
    except Exception as e:
        print(f"API creation test failed: {e}")
        os.chdir(original_dir)
        return False

def main():
    """Run all tests"""
    print("LinkGuard Quick Test Suite")
    print("=" * 40)
    
    tests = [
        ("Package Imports", test_imports),
        ("Database Setup", test_database),
        ("ML Model", test_ml_model),
        ("API Creation", test_api_creation)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n[{test_name}]")
        if test_func():
            passed += 1
            print(f"PASSED: {test_name}")
        else:
            print(f"FAILED: {test_name}")
    
    print("\n" + "=" * 40)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("All tests passed! LinkGuard is ready to use.")
        print("\nTo start the system:")
        print("1. Backend: cd backend && python main.py")
        print("2. Frontend: cd frontend && python app.py")
        return True
    else:
        print("Some tests failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
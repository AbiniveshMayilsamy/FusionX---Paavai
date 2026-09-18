#!/usr/bin/env python3
"""
LinkGuard Setup and Run Script
This script initializes the database, generates sample data, and starts the application.
"""

import os
import sys
import subprocess
import sqlite3
import time
from pathlib import Path

def check_requirements():
    """Check if required packages are installed"""
    try:
        import pandas
        import fastapi
        import dash
        import sklearn
        import xgboost
        import networkx
        print("✓ All required packages are installed")
        return True
    except ImportError as e:
        print(f"✗ Missing required package: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def setup_directories():
    """Create necessary directories"""
    directories = [
        "data/raw",
        "data/processed", 
        "models",
        "reports"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✓ Created directory: {directory}")

def initialize_database():
    """Initialize the database with sample data"""
    print("\nInitializing database...")
    
    try:
        # Change to utils directory and run database setup
        original_dir = os.getcwd()
        os.chdir("utils")
        
        # Import and run database setup
        sys.path.append(os.getcwd())
        from database_setup import setup_database, verify_database
        
        db_path = setup_database()
        verify_database(db_path)
        
        os.chdir(original_dir)
        print("✓ Database initialized successfully")
        return True
        
    except Exception as e:
        print(f"✗ Database initialization failed: {e}")
        os.chdir(original_dir)
        return False

def train_initial_model():
    """Train the initial ML model"""
    print("\nTraining initial ML model...")
    
    try:
        # Change to backend directory
        original_dir = os.getcwd()
        os.chdir("backend")
        
        sys.path.append(os.getcwd())
        from models import RiskPredictor
        
        predictor = RiskPredictor()
        metrics = predictor.train_model()
        
        if 'error' not in metrics:
            print(f"✓ Model trained successfully - Accuracy: {metrics.get('accuracy', 'N/A'):.3f}")
        else:
            print(f"⚠ Model training completed with warnings: {metrics['error']}")
        
        os.chdir(original_dir)
        return True
        
    except Exception as e:
        print(f"✗ Model training failed: {e}")
        os.chdir(original_dir)
        return False

def start_backend():
    """Start the FastAPI backend"""
    print("\nStarting backend server...")
    
    try:
        os.chdir("backend")
        # Start backend in a separate process
        backend_process = subprocess.Popen([
            sys.executable, "main.py"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait a moment for server to start
        time.sleep(3)
        
        # Check if process is still running
        if backend_process.poll() is None:
            print("✓ Backend server started successfully at http://localhost:8000")
            return backend_process
        else:
            stdout, stderr = backend_process.communicate()
            print(f"✗ Backend failed to start: {stderr.decode()}")
            return None
            
    except Exception as e:
        print(f"✗ Failed to start backend: {e}")
        return None

def start_frontend():
    """Start the Dash frontend"""
    print("\nStarting frontend dashboard...")
    
    try:
        os.chdir("../frontend")
        # Start frontend in a separate process
        frontend_process = subprocess.Popen([
            sys.executable, "app.py"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait a moment for server to start
        time.sleep(3)
        
        # Check if process is still running
        if frontend_process.poll() is None:
            print("✓ Frontend dashboard started successfully at http://localhost:3000")
            return frontend_process
        else:
            stdout, stderr = frontend_process.communicate()
            print(f"✗ Frontend failed to start: {stderr.decode()}")
            return None
            
    except Exception as e:
        print(f"✗ Failed to start frontend: {e}")
        return None

def main():
    """Main setup and run function"""
    print("LinkGuard Supply Chain Risk Management System")
    print("=" * 60)
    
    # Check requirements
    if not check_requirements():
        return False
    
    # Setup directories
    print("\nSetting up directories...")
    setup_directories()
    
    # Initialize database
    if not initialize_database():
        return False
    
    # Train initial model
    if not train_initial_model():
        print("⚠ Continuing without trained model (will use defaults)")
    
    # Start services
    backend_process = start_backend()
    if not backend_process:
        return False
    
    frontend_process = start_frontend()
    if not frontend_process:
        backend_process.terminate()
        return False
    
    # Success message
    print("\n" + "=" * 60)
    print("LinkGuard is now running!")
    print("=" * 60)
    print("Dashboard: http://localhost:3000")
    print("API Docs: http://localhost:8000/docs")
    print("API Base: http://localhost:8000")
    print("\nPress Ctrl+C to stop all services")
    print("=" * 60)
    
    try:
        # Keep the script running and monitor processes
        while True:
            time.sleep(1)
            
            # Check if processes are still running
            if backend_process.poll() is not None:
                print("\nBackend process stopped unexpectedly")
                break
                
            if frontend_process.poll() is not None:
                print("\nFrontend process stopped unexpectedly")
                break
                
    except KeyboardInterrupt:
        print("\n\nShutting down LinkGuard...")
        
        # Terminate processes
        if backend_process and backend_process.poll() is None:
            backend_process.terminate()
            print("✓ Backend stopped")
            
        if frontend_process and frontend_process.poll() is None:
            frontend_process.terminate()
            print("✓ Frontend stopped")
        
        print("LinkGuard stopped successfully")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
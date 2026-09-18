#!/usr/bin/env python3
"""
Simple LinkGuard Startup Script
"""

import os
import sys
import subprocess
import time

def main():
    print("LinkGuard Supply Chain Risk Management System")
    print("=" * 50)
    
    # Check if database exists, if not create it
    if not os.path.exists("data/supply_chain.db"):
        print("Setting up database...")
        os.chdir("utils")
        subprocess.run([sys.executable, "database_setup.py"])
        os.chdir("..")
        print("Database setup complete!")
    
    print("\nStarting backend server...")
    os.chdir("backend")
    
    # Start backend
    backend_process = subprocess.Popen([sys.executable, "main.py"])
    time.sleep(3)
    
    print("Backend started at http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    
    os.chdir("../frontend")
    
    print("\nStarting frontend dashboard...")
    frontend_process = subprocess.Popen([sys.executable, "app.py"])
    time.sleep(3)
    
    print("Dashboard started at http://localhost:3000")
    
    print("\n" + "=" * 50)
    print("LinkGuard is now running!")
    print("Dashboard: http://localhost:3000")
    print("API: http://localhost:8000")
    print("\nPress Ctrl+C to stop")
    print("=" * 50)
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping LinkGuard...")
        backend_process.terminate()
        frontend_process.terminate()
        print("LinkGuard stopped")

if __name__ == "__main__":
    main()
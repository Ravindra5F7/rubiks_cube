# PowerShell script to set up a virtual environment, install Flask and kociemba, and run the backend server

# Create virtual environment in .venv folder
python -m venv .venv

# Activate the virtual environment
.\\.venv\\Scripts\\Activate.ps1

# Install Flask and kociemba in the virtual environment
pip install flask flask-cors kociemba

# Run the backend server
python backend/app.py

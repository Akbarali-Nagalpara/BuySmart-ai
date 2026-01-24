@echo off
echo Starting Product AI Analysis Service...
cd /d "%~dp0"
uvicorn app.main:app --reload --port 5001

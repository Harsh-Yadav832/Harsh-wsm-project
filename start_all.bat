@echo off
title Launching Harsh Search Engine
echo ========================================================
echo  Launching Harsh Search Engine (Backend + Frontend)
echo  Project Guide: Prof. Rakesh Balbantaray
echo ========================================================
echo Starting Backend in a new window...
start "Harsh Search Engine - Backend" "%~dp0start_backend.bat"
timeout /t 2 /nobreak >nul
echo Starting Frontend in a new window...
start "Harsh Search Engine - Frontend" "%~dp0start_frontend.bat"
echo Done! Open http://localhost:5173 in your browser once Vite starts.
pause

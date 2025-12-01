# Quick Start Script for Windows PowerShell

Write-Host "🚀 Live Polling System - Quick Start" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Choose an option:" -ForegroundColor Cyan
Write-Host "1. Install dependencies (first time setup)"
Write-Host "2. Start backend server"
Write-Host "3. Start frontend server"
Write-Host "4. Start both (backend + frontend)"
Write-Host "5. Exit"
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
        Set-Location backend
        npm install
        
        Write-Host ""
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
        Set-Location ../frontend
        npm install
        
        Set-Location ..
        Write-Host ""
        Write-Host "✅ All dependencies installed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Run this script again and choose option 4 to start both servers"
        Write-Host "2. Open http://localhost:5173 in your browser"
    }
    
    "2" {
        Write-Host ""
        Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
        Set-Location backend
        npm run dev
    }
    
    "3" {
        Write-Host ""
        Write-Host "🚀 Starting frontend server..." -ForegroundColor Yellow
        Set-Location frontend
        npm run dev
    }
    
    "4" {
        Write-Host ""
        Write-Host "🚀 Starting both servers..." -ForegroundColor Yellow
        Write-Host ""
        
        # Start backend in new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🔧 Backend Server' -ForegroundColor Green; npm run dev"
        
        # Wait a bit for backend to start
        Start-Sleep -Seconds 2
        
        # Start frontend in new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '🎨 Frontend Server' -ForegroundColor Blue; npm run dev"
        
        Write-Host "✅ Both servers starting in separate windows!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Important:" -ForegroundColor Cyan
        Write-Host "- Backend: http://localhost:5000"
        Write-Host "- Frontend: http://localhost:5173"
        Write-Host ""
        Write-Host "Open http://localhost:5173 in your browser to use the app" -ForegroundColor Yellow
    }
    
    "5" {
        Write-Host "Goodbye! 👋" -ForegroundColor Cyan
        exit 0
    }
    
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Read-Host "Press Enter to exit"

@echo off
echo Starting SmartChef Recipe Finder...
echo.
echo This will start a local server to avoid CORS issues.
echo The app will be available at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.

REM Try Python 3 first
python -m http.server 8000 2>nul
if %errorlevel% neq 0 (
    echo Python 3 not found, trying Python 2...
    python -m SimpleHTTPServer 8000 2>nul
    if %errorlevel% neq 0 (
        echo.
        echo Python not found! Please install Python or use one of these alternatives:
        echo.
        echo 1. Install Python from https://python.org
        echo 2. Use VS Code with Live Server extension
        echo 3. Use Node.js: npm install -g http-server
        echo.
        pause
    )
)

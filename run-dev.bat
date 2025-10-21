@echo off
REM ============================================================================
REM EDUBLOCKS - Start Development Environment
REM ============================================================================
REM Quick start script to run both client and server simultaneously

setlocal enabledelayedexpansion

REM Color codes
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "CYAN=[96m"
set "RESET=[0m"

echo.
echo ============================================================================
echo EDUBLOCKS - Development Environment Starter
echo ============================================================================
echo.

set "PROJECT_ROOT=%cd%"

REM Check if required directories exist
if not exist "%PROJECT_ROOT%\client" (
    echo %RED%[ERROR] client directory not found%RESET%
    pause
    exit /b 1
)

if not exist "%PROJECT_ROOT%\server" (
    echo %RED%[ERROR] server directory not found%RESET%
    pause
    exit /b 1
)

REM Check if node_modules exist, if not, install dependencies
echo %CYAN%[INFO] Checking dependencies...%RESET%

if not exist "%PROJECT_ROOT%\client\node_modules" (
    echo %YELLOW%[WARNING] Client dependencies not found. Installing...%RESET%
    cd /d "%PROJECT_ROOT%\client"
    call npm install
    if errorlevel 1 (
        echo %RED%[ERROR] Failed to install client dependencies%RESET%
        pause
        exit /b 1
    )
)

if not exist "%PROJECT_ROOT%\server\node_modules" (
    echo %YELLOW%[WARNING] Server dependencies not found. Installing...%RESET%
    cd /d "%PROJECT_ROOT%\server"
    call npm install
    if errorlevel 1 (
        echo %RED%[ERROR] Failed to install server dependencies%RESET%
        pause
        exit /b 1
    )
)

cd /d "%PROJECT_ROOT%"

echo %GREEN%[OK] Dependencies verified!%RESET%
echo.
echo %CYAN%[INFO] Prerequisites check:%RESET%
echo.

REM Check if Ganache is running
echo Checking if Ganache is running on port 7545...
netstat -ano | findstr ":7545" >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[WARNING] Ganache does not appear to be running on port 7545%RESET%
    echo %YELLOW%         Please start Ganache before proceeding%RESET%
    echo.
    echo   Option 1: Open Ganache GUI application
    echo   Option 2: Run in another terminal: ganache-cli --host 127.0.0.1 --port 7545
    echo.
    echo %CYAN%Press any key to continue anyway, or Ctrl+C to exit%RESET%
    pause >nul
) else (
    echo %GREEN%[OK] Ganache is running!%RESET%
)

echo.
echo %CYAN%[INFO] Check if ports are available...%RESET%

netstat -ano | findstr ":3000" >nul 2>&1
if not errorlevel 1 (
    echo %YELLOW%[WARNING] Port 3000 is already in use (React client)%RESET%
)

netstat -ano | findstr ":4000" >nul 2>&1
if not errorlevel 1 (
    echo %YELLOW%[WARNING] Port 4000 is already in use (Node server)%RESET%
)

echo.
echo %GREEN%[STARTING] Launching development servers...%RESET%
echo.
echo This will open two terminal windows:
echo   - Window 1: React Client (http://localhost:3000)
echo   - Window 2: Node Server (http://localhost:4000)
echo.
echo To stop the servers, close both terminal windows or press Ctrl+C in each.
echo.
pause

REM Start client and server in separate windows
echo Launching client terminal...
start "Edublocks - Client" cmd /k "cd /d %PROJECT_ROOT%\client && npm start"

timeout /t 3 /nobreak

echo Launching server terminal...
start "Edublocks - Server" cmd /k "cd /d %PROJECT_ROOT%\server && npm start"

cd /d "%PROJECT_ROOT%"

echo.
echo %GREEN%[SUCCESS] Development servers are starting!%RESET%
echo.
echo Waiting for servers to initialize...
echo This may take 30-60 seconds on first run.
echo.
echo %CYAN%Application will be available at:%RESET%
echo   Client:  http://localhost:3000
echo   Server:  http://localhost:4000
echo   Ganache: http://127.0.0.1:7545
echo.

timeout /t 5 /nobreak

echo %CYAN%[TIP] You can minimize this window. The development servers will continue running.%RESET%
echo.
pause

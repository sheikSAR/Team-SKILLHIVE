@echo off
REM ============================================================================
REM EDUBLOCKS - Deploy Smart Contracts
REM ============================================================================
REM Script to deploy smart contracts to Ganache local blockchain

setlocal enabledelayedexpansion

REM Color codes
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "CYAN=[96m"
set "RESET=[0m"

echo.
echo ============================================================================
echo EDUBLOCKS - Smart Contract Deployment
echo ============================================================================
echo.

set "PROJECT_ROOT=%cd%"

REM Check if Ganache is running
echo %CYAN%[CHECK] Verifying Ganache is running on port 7545...%RESET%
netstat -ano | findstr ":7545" >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR] Ganache is not running on port 7545%RESET%
    echo.
    echo Please start Ganache before deploying contracts:
    echo   Option 1: Open Ganache GUI application
    echo   Option 2: Run: ganache-cli --host 127.0.0.1 --port 7545
    echo.
    pause
    exit /b 1
) else (
    echo %GREEN%[OK] Ganache is running!%RESET%
)

echo.

REM Check if truffle is installed
echo %CYAN%[CHECK] Checking Truffle installation...%RESET%
truffle --version >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[INFO] Truffle not found globally. Installing...%RESET%
    call npm install -g truffle
    if errorlevel 1 (
        echo %RED%[ERROR] Failed to install Truffle%RESET%
        pause
        exit /b 1
    )
) else (
    for /f "tokens=*" %%i in ('truffle --version') do (
        echo %GREEN%[OK] %%i%RESET%
    )
)

echo.

REM Check if contracts directory exists
if not exist "%PROJECT_ROOT%\contracts" (
    echo %RED%[ERROR] contracts directory not found%RESET%
    pause
    exit /b 1
)

REM Check if truffle-config.js exists
if not exist "%PROJECT_ROOT%\truffle-config.js" (
    echo %RED%[ERROR] truffle-config.js not found%RESET%
    pause
    exit /b 1
)

echo.
echo %CYAN%[DEPLOY] Preparing to deploy smart contracts...%RESET%
echo.
echo Network: development (Ganache at http://127.0.0.1:7545)
echo.

cd /d "%PROJECT_ROOT%"

REM Run migrations
echo %YELLOW%[INFO] Running migrations...%RESET%
echo.
call truffle migrate --network development

if errorlevel 1 (
    echo.
    echo %RED%[ERROR] Smart contract deployment failed!%RESET%
    echo.
    echo Troubleshooting tips:
    echo   1. Ensure Ganache is running and accessible
    echo   2. Check that port 7545 is not blocked by firewall
    echo   3. Verify your contracts compile without errors: truffle compile
    echo   4. Check your Internet connection
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo %GREEN%[SUCCESS] Smart contracts deployed successfully!%RESET%
    echo.
    echo Deployment Details:
    echo   - Network: development
    echo   - Provider: Ganache (http://127.0.0.1:7545)
    echo   - Contract Build Directory: client/src/contracts
    echo.
    echo Next Steps:
    echo   1. Start the development environment: run-dev.bat
    echo   2. Or run development servers manually:
    echo      - Client: cd client ^& npm start
    echo      - Server: cd server ^& npm start
    echo.
)

echo.
pause

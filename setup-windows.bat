@echo off
REM ============================================================================
REM EDUBLOCKS - Windows Installation Setup Script
REM ============================================================================
REM A robust, production-ready setup script for Windows installations
REM Features: Prerequisites check, dependency installation, smart contract setup
REM ============================================================================

setlocal enabledelayedexpansion

REM Color codes for console output
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "CYAN=[96m"
set "RESET=[0m"

REM Initialize counters
set "ERROR_COUNT=0"
set "WARNING_COUNT=0"

echo.
echo ============================================================================
echo EDUBLOCKS - Windows Installation Setup
echo ============================================================================
echo.

REM ============================================================================
REM SECTION 1: Check Prerequisites
REM ============================================================================
echo %CYAN%[SETUP] Checking Prerequisites...%RESET%
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR] Node.js is not installed or not in PATH%RESET%
    echo Please install Node.js from: https://nodejs.org/
    set /a ERROR_COUNT+=1
) else (
    for /f "tokens=*" %%i in ('node --version') do (
        echo %GREEN%[OK] Node.js found: %%i%RESET%
    )
)
echo.

REM Check if npm is installed
echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR] npm is not installed or not in PATH%RESET%
    set /a ERROR_COUNT+=1
) else (
    for /f "tokens=*" %%i in ('npm --version') do (
        echo %GREEN%[OK] npm found: %%i%RESET%
    )
)
echo.

REM Check if git is installed
echo Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[WARNING] Git is not installed (optional, but recommended)%RESET%
    set /a WARNING_COUNT+=1
) else (
    for /f "tokens=*" %%i in ('git --version') do (
        echo %GREEN%[OK] Git found: %%i%RESET%
    )
)
echo.

REM Check if Ganache is installed globally (optional warning)
echo Checking Ganache CLI installation...
ganache --version >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[WARNING] Ganache CLI not found globally (will use local version if installed locally)%RESET%
    set /a WARNING_COUNT+=1
) else (
    for /f "tokens=*" %%i in ('ganache --version') do (
        echo %GREEN%[OK] Ganache found: %%i%RESET%
    )
)
echo.

REM Report prerequisite check results
if %ERROR_COUNT% gtr 0 (
    echo %RED%[CRITICAL] %ERROR_COUNT% critical error(s) found!%RESET%
    echo Please install missing prerequisites and try again.
    echo.
    pause
    exit /b 1
)

if %WARNING_COUNT% gtr 0 (
    echo %YELLOW%[INFO] %WARNING_COUNT% warning(s) found. You may experience issues.%RESET%
    echo.
)

echo %GREEN%[SUCCESS] All prerequisites checked!%RESET%
echo.

REM ============================================================================
REM SECTION 2: Project Directory Setup
REM ============================================================================
echo %CYAN%[SETUP] Setting up project directories...%RESET%
echo.

REM Get current directory
set "PROJECT_ROOT=%cd%"
echo Project root: %PROJECT_ROOT%

REM Create necessary directories if they don't exist
if not exist "%PROJECT_ROOT%\client" (
    echo %RED%[ERROR] client directory not found in %PROJECT_ROOT%%RESET%
    set /a ERROR_COUNT+=1
)

if not exist "%PROJECT_ROOT%\server" (
    echo %RED%[ERROR] server directory not found in %PROJECT_ROOT%%RESET%
    set /a ERROR_COUNT+=1
)

if not exist "%PROJECT_ROOT%\contracts" (
    echo %RED%[ERROR] contracts directory not found in %PROJECT_ROOT%%RESET%
    set /a ERROR_COUNT+=1
)

if %ERROR_COUNT% gtr 0 (
    echo %RED%[CRITICAL] Required directories missing!%RESET%
    pause
    exit /b 1
)

echo %GREEN%[OK] All required directories found!%RESET%
echo.

REM ============================================================================
REM SECTION 3: Install Root Dependencies
REM ============================================================================
echo %CYAN%[SETUP] Installing root dependencies...%RESET%
echo.

cd /d "%PROJECT_ROOT%"
if exist "package.json" (
    echo Installing packages for root project...
    call npm install
    if errorlevel 1 (
        echo %RED%[ERROR] Failed to install root dependencies%RESET%
        set /a ERROR_COUNT+=1
    ) else (
        echo %GREEN%[OK] Root dependencies installed!%RESET%
    )
) else (
    echo %YELLOW%[WARNING] No package.json in root directory%RESET%
)
echo.

REM ============================================================================
REM SECTION 4: Install Client Dependencies
REM ============================================================================
echo %CYAN%[SETUP] Installing client dependencies...%RESET%
echo.

cd /d "%PROJECT_ROOT%\client"
if exist "package.json" (
    echo Installing packages for client...
    call npm install
    if errorlevel 1 (
        echo %RED%[ERROR] Failed to install client dependencies%RESET%
        set /a ERROR_COUNT+=1
    ) else (
        echo %GREEN%[OK] Client dependencies installed!%RESET%
    )
) else (
    echo %RED%[ERROR] package.json not found in client directory%RESET%
    set /a ERROR_COUNT+=1
)
echo.

REM ============================================================================
REM SECTION 5: Install Server Dependencies
REM ============================================================================
echo %CYAN%[SETUP] Installing server dependencies...%RESET%
echo.

cd /d "%PROJECT_ROOT%\server"
if exist "package.json" (
    echo Installing packages for server...
    call npm install
    if errorlevel 1 (
        echo %RED%[ERROR] Failed to install server dependencies%RESET%
        set /a ERROR_COUNT+=1
    ) else (
        echo %GREEN%[OK] Server dependencies installed!%RESET%
    )
) else (
    echo %RED%[ERROR] package.json not found in server directory%RESET%
    set /a ERROR_COUNT+=1
)
echo.

REM ============================================================================
REM SECTION 6: Install Truffle and Smart Contract Dependencies
REM ============================================================================
echo %CYAN%[SETUP] Setting up smart contracts...%RESET%
echo.

cd /d "%PROJECT_ROOT%"

REM Check if truffle is installed
npm list -g truffle >nul 2>&1
if errorlevel 1 (
    echo Installing Truffle globally...
    call npm install -g truffle
    if errorlevel 1 (
        echo %RED%[ERROR] Failed to install Truffle globally%RESET%
        set /a ERROR_COUNT+=1
    ) else (
        echo %GREEN%[OK] Truffle installed!%RESET%
    )
) else (
    echo %GREEN%[OK] Truffle already installed globally%RESET%
)

echo.

REM ============================================================================
REM SECTION 7: Summary and Next Steps
REM ============================================================================
echo ============================================================================
echo Installation Summary
echo ============================================================================
echo.

if %ERROR_COUNT% gtr 0 (
    echo %RED%[FAILED] Installation completed with %ERROR_COUNT% error(s)%RESET%
    echo.
    echo Please review the errors above and resolve them before proceeding.
    echo.
    pause
    exit /b 1
) else (
    echo %GREEN%[SUCCESS] Installation completed successfully!%RESET%
    echo.
)

echo %CYAN%[INFO] Next Steps:%RESET%
echo.
echo 1. Start Ganache:
echo    - Open Ganache GUI application, OR
echo    - Run: ganache-cli --host 127.0.0.1 --port 7545
echo.
echo 2. Deploy Smart Contracts:
echo    - Run: truffle migrate --network development
echo.
echo 3. Start Development Servers:
echo    - Run: npm run dev
echo    - Or separately:
echo      - Client: cd client ^& npm start
echo      - Server: cd server ^& npm start
echo.
echo 4. Access Application:
echo    - Client: http://localhost:3000
echo    - Server: http://localhost:4000
echo.
echo 5. Install MetaMask:
echo    - Download from: https://metamask.io
echo    - Add local network (http://127.0.0.1:7545)
echo.

echo %YELLOW%[TIPS]%RESET%
echo - Make sure Ganache is running before deploying contracts
echo - Check that all ports (3000, 4000, 7545) are available
echo - If you encounter module not found errors, delete node_modules and run npm install again
echo - For M1/M2 Mac users, some dependencies may need special flags
echo.

echo ============================================================================
echo Setup completed at %date% %time%
echo ============================================================================
echo.

pause
cd /d "%PROJECT_ROOT%"
exit /b 0

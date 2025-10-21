@echo off
REM ============================================================================
REM EDUBLOCKS - Project Cleanup Script
REM ============================================================================
REM Remove node_modules and reinstall dependencies to fix issues

setlocal enabledelayedexpansion

REM Color codes
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "CYAN=[96m"
set "RESET=[0m"

echo.
echo ============================================================================
echo EDUBLOCKS - Project Cleanup and Reinstall
echo ============================================================================
echo.
echo This script will:
echo   1. Remove all node_modules directories
echo   2. Clear npm cache
echo   3. Delete package-lock.json files
echo   4. Reinstall all dependencies
echo.
echo %YELLOW%WARNING: This may take 5-10 minutes depending on your internet speed%RESET%
echo.

set "PROJECT_ROOT=%cd%"

REM Ask for confirmation
set /p confirm="Do you want to continue? (y/n): "
if /i not "%confirm%"=="y" (
    echo Cleanup cancelled.
    exit /b 0
)

echo.
echo %CYAN%[CLEANUP] Starting cleanup process...%RESET%
echo.

REM Clean root directory
echo %CYAN%[CLEANUP] Cleaning root project...%RESET%
cd /d "%PROJECT_ROOT%"

if exist "node_modules" (
    echo Removing node_modules...
    rmdir /s /q node_modules
    if errorlevel 1 (
        echo %YELLOW%[WARNING] Could not remove root node_modules (may be in use)%RESET%
    ) else (
        echo %GREEN%[OK] Root node_modules removed%RESET%
    )
)

if exist "package-lock.json" (
    echo Removing package-lock.json...
    del /f /q package-lock.json
    echo %GREEN%[OK] package-lock.json removed%RESET%
)

echo.

REM Clean client directory
echo %CYAN%[CLEANUP] Cleaning client...%RESET%
cd /d "%PROJECT_ROOT%\client"

if exist "node_modules" (
    echo Removing client node_modules...
    rmdir /s /q node_modules
    if errorlevel 1 (
        echo %YELLOW%[WARNING] Could not remove client node_modules (may be in use)%RESET%
    ) else (
        echo %GREEN%[OK] Client node_modules removed%RESET%
    )
)

if exist "package-lock.json" (
    echo Removing client package-lock.json...
    del /f /q package-lock.json
    echo %GREEN%[OK] Client package-lock.json removed%RESET%
)

echo.

REM Clean server directory
echo %CYAN%[CLEANUP] Cleaning server...%RESET%
cd /d "%PROJECT_ROOT%\server"

if exist "node_modules" (
    echo Removing server node_modules...
    rmdir /s /q node_modules
    if errorlevel 1 (
        echo %YELLOW%[WARNING] Could not remove server node_modules (may be in use)%RESET%
    ) else (
        echo %GREEN%[OK] Server node_modules removed%RESET%
    )
)

if exist "package-lock.json" (
    echo Removing server package-lock.json...
    del /f /q package-lock.json
    echo %GREEN%[OK] Server package-lock.json removed%RESET%
)

echo.

REM Clear npm cache
echo %CYAN%[CLEANUP] Clearing npm cache...%RESET%
call npm cache clean --force
if errorlevel 1 (
    echo %YELLOW%[WARNING] Could not clear npm cache%RESET%
) else (
    echo %GREEN%[OK] npm cache cleared%RESET%
)

echo.

REM Reinstall dependencies
echo %CYAN%[REINSTALL] Installing dependencies...%RESET%
echo.

REM Root dependencies
cd /d "%PROJECT_ROOT%"
if exist "package.json" (
    echo Installing root dependencies...
    call npm install
    if errorlevel 1 (
        echo %RED%[ERROR] Failed to install root dependencies%RESET%
    ) else (
        echo %GREEN%[OK] Root dependencies installed%RESET%
    )
) else (
    echo %YELLOW%[SKIP] No package.json in root%RESET%
)

echo.

REM Client dependencies
cd /d "%PROJECT_ROOT%\client"
if exist "package.json" (
    echo Installing client dependencies...
    call npm install
    if errorlevel 1 (
        echo %RED%[ERROR] Failed to install client dependencies%RESET%
    ) else (
        echo %GREEN%[OK] Client dependencies installed%RESET%
    )
) else (
    echo %RED%[ERROR] package.json not found in client%RESET%
)

echo.

REM Server dependencies
cd /d "%PROJECT_ROOT%\server"
if exist "package.json" (
    echo Installing server dependencies...
    call npm install
    if errorlevel 1 (
        echo %RED%[ERROR] Failed to install server dependencies%RESET%
    ) else (
        echo %GREEN%[OK] Server dependencies installed%RESET%
    )
) else (
    echo %RED%[ERROR] package.json not found in server%RESET%
)

echo.
echo ============================================================================
echo %GREEN%[SUCCESS] Cleanup and reinstall completed!%RESET%
echo ============================================================================
echo.
echo Your project is now fresh and ready to use.
echo Run: npm run dev
echo.

cd /d "%PROJECT_ROOT%"
pause

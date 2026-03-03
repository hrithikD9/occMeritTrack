@echo off
REM ============================================
REM OCC MeritTrack - Pre-Push Security Check (Windows)
REM ============================================
REM Run this before pushing to GitHub
REM Usage: check-security.bat

echo.
echo ============================================
echo   OCC MeritTrack - Security Check
echo ============================================
echo.

SET ISSUES=0

REM ============================================
REM 1. Check for .env files in git
REM ============================================
echo [1/6] Checking for .env files...
git ls-files | findstr /C:".env" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [X] DANGER: .env files are tracked by git!
    echo     Fix: git rm --cached .env backend/.env
    SET /A ISSUES+=1
) else (
    echo [OK] No .env files tracked
)
echo.

REM ============================================
REM 2. Check for node_modules
REM ============================================
echo [2/6] Checking for node_modules...
git ls-files | findstr /C:"node_modules/" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [X] WARNING: node_modules is tracked!
    echo     Fix: git rm -r --cached node_modules
    SET /A ISSUES+=1
) else (
    echo [OK] node_modules not tracked
)
echo.

REM ============================================
REM 3. Check .gitignore exists
REM ============================================
echo [3/6] Checking .gitignore configuration...
if not exist ".gitignore" (
    echo [X] .gitignore file not found!
    SET /A ISSUES+=1
) else (
    findstr /C:".env" .gitignore >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [!] WARNING: .env not in .gitignore
        SET /A ISSUES+=1
    ) else (
        echo [OK] .gitignore properly configured
    )
)
echo.

REM ============================================
REM 4. Check for backend .env
REM ============================================
echo [4/6] Checking backend .env security...
if exist "backend\.env" (
    echo [OK] Backend .env exists (should NOT be in git)
) else (
    echo [!] WARNING: backend\.env not found
)
echo.

REM ============================================
REM 5. Check npm dependencies (if available)
REM ============================================
echo [5/6] Checking npm security...
where npm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    npm audit --audit-level=high >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] No high vulnerabilities found
    ) else (
        echo [!] Some vulnerabilities detected
        echo     Run: npm audit for details
    )
) else (
    echo [!] npm not found, skipping audit
)
echo.

REM ============================================
REM 6. Check git status
REM ============================================
echo [6/6] Checking git status...
git status >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Git repository initialized
) else (
    echo [!] Not a git repository yet
    echo     Run: git init
)
echo.

REM ============================================
REM Final Summary
REM ============================================
echo ============================================
echo   Security Check Summary
echo ============================================
echo.

if %ISSUES% EQU 0 (
    echo [OK] All checks passed! Safe to push.
    echo.
    echo Next steps:
    echo   1. git add .
    echo   2. git commit -m "Your message"
    echo   3. git push origin main
    echo.
) else (
    echo [X] Found %ISSUES% issue(s^). Fix before pushing!
    echo.
    echo Common fixes:
    echo   1. git rm --cached .env backend\.env
    echo   2. Update .gitignore
    echo   3. Remove secrets from code
    echo.
)

pause

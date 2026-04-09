@echo off
REM ============================================
REM Sentinel URL Configuration Test Script
REM Windows Version
REM ============================================

setlocal enabledelayedexpansion

echo.
echo 🔍 Sentinel Backend URL Configuration Test
echo ===========================================
echo.

REM Get configuration
set "LOCAL_HOST=localhost"
set "LOCAL_PORT=3000"

if defined VITE_API_URL (
  set "API_URL=%VITE_API_URL%"
) else (
  set "API_URL=http://%LOCAL_HOST%:%LOCAL_PORT%"
)

if defined VITE_WS_URL (
  set "WS_URL=%VITE_WS_URL%"
) else (
  set "WS_URL=ws://%LOCAL_HOST%:%LOCAL_PORT%"
)

echo Configuration Detected:
echo   API URL:       %API_URL%
echo   WebSocket URL: %WS_URL%
echo.

REM Test 1: Health Check
echo 📋 Test 1: Server Health Check
echo   Testing: %API_URL%/api/health

powershell -NoProfile -Command "try { $resp = Invoke-WebRequest -Uri '%API_URL%/api/health' -UseBasicParsing; Write-Host '   ✅ Backend is running and accessible' } catch { Write-Host '   ❌ Backend is not responding'; Write-Host '   Make sure to run: npm run dev' }"
echo.

REM Test 2: API Transactions Endpoint
echo 📋 Test 2: Transactions Endpoint
echo   Testing: %API_URL%/api/transactions

powershell -NoProfile -Command "try { $resp = Invoke-WebRequest -Uri '%API_URL%/api/transactions' -UseBasicParsing; if ($resp.StatusCode -eq 200) { Write-Host '   ✅ Transactions endpoint is responding'; $content = $resp.Content.Substring(0, [Math]::Min(100, $resp.Content.Length)); Write-Host '   Sample response (first 100 chars):'; Write-Host '   ' $content '...' } } catch { Write-Host '   ❌ Transactions endpoint not accessible' }"
echo.

REM Test 3: Environment Variables
echo 📋 Test 3: Environment Variables
if defined VITE_API_URL (
  echo   ✅ VITE_API_URL is set: %VITE_API_URL%
) else (
  echo   ⓘ  VITE_API_URL not set (using auto-detection)
)

if defined VITE_WS_URL (
  echo   ✅ VITE_WS_URL is set: %VITE_WS_URL%
) else (
  echo   ⓘ  VITE_WS_URL not set (using auto-detection)
)
echo.

REM Test 4: Port Check
echo 📋 Test 4: Port Accessibility
powershell -NoProfile -Command "if ((Get-NetTCPConnection -LocalPort %LOCAL_PORT% -ErrorAction SilentlyContinue) -ne $null) { Write-Host '   ✅ Port %LOCAL_PORT% is listening' } else { Write-Host '   ⚠️  Port %LOCAL_PORT% may not be listening' }"
echo.

echo ===========================================
echo ✨ Configuration test complete!
echo.
echo 📚 For more information:
echo   - URL Configuration: docs\BACKEND_URL_CONFIG.md
echo   - URL Reference:     docs\URL_REFERENCE.md
echo   - Setup Guide:       docs\SERVER_URL_SETUP.md
echo.
echo 🚀 To start the application:
echo   npm run dev
echo.

pause

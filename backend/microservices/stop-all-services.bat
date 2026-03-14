@echo off
echo ============================================
echo Stopping Employee Management Microservices
echo ============================================
echo.

echo Stopping all Java processes...

taskkill /F /FI "WINDOWTITLE eq Auth Service*"
taskkill /F /FI "WINDOWTITLE eq User Service*"
taskkill /F /FI "WINDOWTITLE eq Employee Service*"
taskkill /F /FI "WINDOWTITLE eq API Gateway*"

echo.
echo All services stopped!
echo ============================================
pause

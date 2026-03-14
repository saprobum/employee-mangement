@echo off
echo ============================================
echo Starting Employee Management Microservices
echo ============================================
echo.

echo [1/4] Starting Auth Service on port 8081...
start "Auth Service" cmd /k "cd auth-service && mvn spring-boot:run"

timeout /t 15 /nobreak >nul

echo [2/4] Starting User Service on port 8082...
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"

timeout /t 15 /nobreak >nul

echo [3/4] Starting Employee Service on port 8083...
start "Employee Service" cmd /k "cd employee-service && mvn spring-boot:run"

timeout /t 15 /nobreak >nul

echo [4/4] Starting API Gateway on port 8080...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"

echo.
echo ============================================
echo All services are starting...
echo ============================================
echo.
echo Services:
echo   - API Gateway:      http://localhost:8080
echo   - Auth Service:     http://localhost:8081
echo   - User Service:     http://localhost:8082
echo   - Employee Service: http://localhost:8083
echo.
echo Check the individual terminal windows for status.
echo.
echo To stop all services, close all terminal windows.
echo ============================================
pause

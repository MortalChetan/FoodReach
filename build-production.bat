@echo off
echo =======================================================
echo   FoodReach Production Build & Packaging Script
echo   Spring Boot 3.4.x (Java 21 LTS) + React + MongoDB
echo =======================================================
echo.

echo [1/2] Building Spring Boot Executable JAR (Java 21)...
cd backend
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Spring Boot backend build failed!
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo [2/2] Building React 19 Frontend Production Distribution...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] React frontend production build failed!
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo =======================================================
echo   SUCCESS! FoodReach is built and production-ready.
echo   - Backend JAR: backend\target\backend-0.0.1-SNAPSHOT.jar
echo   - Frontend Bundle: frontend\dist\
echo =======================================================

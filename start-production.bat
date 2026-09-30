@echo off
echo =======================================================
echo   Starting FoodReach Standalone Production Backend
echo   Java 21 LTS + Spring Boot 3.4 + MongoDB
echo =======================================================
echo.

if not exist "backend\target\backend-0.0.1-SNAPSHOT.jar" (
    echo Production JAR not found. Building now...
    call build-production.bat
)

echo Launching Spring Boot server on http://localhost:8080 ...
java -Xms256m -Xmx512m -jar backend\target\backend-0.0.1-SNAPSHOT.jar

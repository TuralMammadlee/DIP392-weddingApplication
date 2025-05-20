@echo off
echo Building and running Wedding Manager Application...
call mvnw.cmd clean package -DskipTests
echo.
echo Running Wedding Manager Application...
echo.
java -jar target/wedding-manager-1.0.0.jar 
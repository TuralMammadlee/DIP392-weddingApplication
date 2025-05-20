#!/bin/bash
echo "Building and running Wedding Manager Application..."
./mvnw clean package -DskipTests
echo ""
echo "Running Wedding Manager Application..."
echo ""
java -jar target/wedding-manager-1.0.0.jar 
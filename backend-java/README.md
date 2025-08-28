# Vendor Onboarding Backend - Java Spring Boot

This is the Java Spring Boot implementation of the Vendor Onboarding backend API.

## Prerequisites

- Java 17 or higher
- Maven 3.6+ or use the Maven wrapper included in the project

## How to Run

### Using Maven

1. Navigate to the backend-java directory:
   ```
   cd backend-java
   ```

2. Build the application with Maven:
   ```
   ./mvnw clean install
   ```
   or if you have Maven installed globally:
   ```
   mvn clean install
   ```

3. Run the application:
   ```
   ./mvnw spring-boot:run
   ```
   or with Maven:
   ```
   mvn spring-boot:run
   ```

### Using the JAR file

1. Build the JAR file:
   ```
   ./mvnw clean package
   ```

2. Run the JAR file:
   ```
   java -jar target/vendor-onboarding-0.0.1-SNAPSHOT.jar
   ```

## API Endpoints

The server runs on port 3001 by default. The following endpoints are available:

- GET `/api/vendors` - Get all vendors
- POST `/api/vendors` - Create a new vendor

## Database

The application uses an H2 in-memory database which is initialized with sample data on startup. The database is not persistent and will reset when the application is restarted.
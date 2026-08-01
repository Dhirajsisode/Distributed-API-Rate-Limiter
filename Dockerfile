# Stage 1: Build the React Frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
# Copy package.json and package-lock.json
COPY Frontend/package*.json ./
RUN npm install
# Copy the rest of the frontend source
COPY Frontend/ ./
# Build the frontend (Vite)
RUN npm run build

# Stage 2: Build the Spring Boot Backend
FROM eclipse-temurin:21-jdk-alpine AS backend-build
WORKDIR /app/backend
# Copy Maven wrapper and pom.xml
COPY Backend/mvnw .
COPY Backend/.mvn .mvn
COPY Backend/pom.xml .
# Make mvnw executable
RUN chmod +x ./mvnw
# Download dependencies
RUN ./mvnw dependency:go-offline -B || true

# Copy backend source
COPY Backend/src ./src
# Copy the React build output into the Spring Boot static resources directory
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

# Build the Spring Boot application, skipping tests
RUN ./mvnw clean package -DskipTests

# Stage 3: Create the runtime image
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Copy the built jar from the backend-build stage
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Expose port (Render sets the PORT environment variable)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "--enable-preview", "-jar", "app.jar"]

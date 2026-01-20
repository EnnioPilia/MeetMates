# ------------------------------------------------------------
# Stage 1: Build Spring Boot application
# ------------------------------------------------------------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven config first (cache optimization)
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn -q -DskipTests clean package

# ------------------------------------------------------------
# Stage 2: Runtime image
# ------------------------------------------------------------
FROM eclipse-temurin:17-jre

# Create non-root user (security best practice)
RUN groupadd spring && useradd -r -g spring spring

WORKDIR /app

# Copy the built JAR
COPY --from=build /app/target/*-SNAPSHOT.jar app.jar

# Drop root privileges
USER spring

# JVM options optimized for Docker
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseG1GC -Dfile.encoding=UTF-8"

EXPOSE 8080

# Start application
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]

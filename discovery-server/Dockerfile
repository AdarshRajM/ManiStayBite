FROM maven:3.9.6-eclipse-temurin-17-alpine AS build

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar discovery-server.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "discovery-server.jar"]

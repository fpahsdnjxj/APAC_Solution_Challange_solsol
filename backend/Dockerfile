# backend/Dockerfile

# 1단계: 빌드
FROM gradle:7.6.0-jdk17 AS builder
WORKDIR /app
COPY . .

RUN rm -rf /home/gradle/.gradle/caches \
    && gradle build --no-daemon --stacktrace

# 2단계: 실행
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
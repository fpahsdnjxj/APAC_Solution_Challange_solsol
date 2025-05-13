FROM openjdk:21-jdk-slim AS builder

RUN apt-get update \
 && apt-get install -y --no-install-recommends wget unzip \
 && rm -rf /var/lib/apt/lists/*

# Gradle 8.4 설치
RUN wget https://services.gradle.org/distributions/gradle-8.4-bin.zip -P /tmp \
 && unzip /tmp/gradle-8.4-bin.zip -d /opt \
 && rm /tmp/gradle-8.4-bin.zip

ENV GRADLE_HOME=/opt/gradle-8.4
ENV PATH=$PATH:$GRADLE_HOME/bin

WORKDIR /app
COPY . .

RUN gradle build --no-daemon --stacktrace

FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]

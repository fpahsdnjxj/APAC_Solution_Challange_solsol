FROM openjdk:21-jdk-slim AS builder

# Alpine용 패키지 설치
RUN apk add --no-cache wget unzip

# Gradle 설치
RUN wget https://services.gradle.org/distributions/gradle-7.6-bin.zip -P /tmp \
 && unzip /tmp/gradle-7.6-bin.zip -d /opt \
 && rm /tmp/gradle-7.6-bin.zip

ENV GRADLE_HOME=/opt/gradle-7.6
ENV PATH=$PATH:$GRADLE_HOME/bin

WORKDIR /app
COPY . .

RUN rm -rf /home/gradle/.gradle/caches \
 && gradle build --no-daemon --stacktrace

FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]

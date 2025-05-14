FROM openjdk:21-jdk-slim AS builder

# Gradle 설치
RUN apt-get update \
 && apt-get install -y --no-install-recommends wget unzip \
 && rm -rf /var/lib/apt/lists/*

RUN wget https://services.gradle.org/distributions/gradle-8.4-bin.zip -P /tmp \
 && unzip /tmp/gradle-8.4-bin.zip -d /opt \
 && rm /tmp/gradle-8.4-bin.zip

ENV GRADLE_HOME=/opt/gradle-8.4
ENV PATH=$PATH:$GRADLE_HOME/bin

# Gradle 캐시 레이어 생성
WORKDIR /app
COPY build.gradle* settings.gradle* gradle /app/
RUN gradle build --no-daemon --stacktrace -x test || true

# 전체 소스 복사 및 빌드
COPY . /app
RUN gradle bootJar --no-daemon --stacktrace -x test

# 실행용 이미지
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]


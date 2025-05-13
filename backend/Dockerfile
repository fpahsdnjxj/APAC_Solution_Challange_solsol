# 1단계: 빌드 (JDK 21을 사용하는 Gradle 이미지, JDK 21 수동 설치)
FROM openjdk:21-jdk-alpine AS builder

# Gradle 설치
RUN wget https://services.gradle.org/distributions/gradle-7.6-bin.zip -P /tmp \
    && unzip /tmp/gradle-7.6-bin.zip -d /opt \
    && rm /tmp/gradle-7.6-bin.zip

ENV GRADLE_HOME=/opt/gradle-7.6
ENV PATH=$PATH:$GRADLE_HOME/bin

WORKDIR /app
COPY . .

# 캐시 삭제 후 Gradle 빌드
RUN rm -rf /home/gradle/.gradle/caches \
    && gradle build --no-daemon --stacktrace

# 2단계: 실행 (JDK 21 기반의 eclipse-temurin 사용)
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

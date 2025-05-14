FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# 로컬에서 scp로 복사한 jar만 사용
COPY app.jar .

ENTRYPOINT ["java", "-jar", "app.jar"]
FROM python:3.11.5

WORKDIR /app

# 환경 변수 선언
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY src /app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

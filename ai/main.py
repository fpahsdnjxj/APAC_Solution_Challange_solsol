from fastapi import FastAPI
from api.ai_routes import router as ai_router
import os
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

# google.generativeai 설정
import google.generativeai as genai
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()
app.include_router(ai_router, prefix="/ai")

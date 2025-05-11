from api import ai_routes
from fastapi import FastAPI
from api.ai_routes import router as ai_router
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

# google.generativeai 설정
import google.generativeai as genai
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


app=FastAPI()
app.include_router(ai_routes.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


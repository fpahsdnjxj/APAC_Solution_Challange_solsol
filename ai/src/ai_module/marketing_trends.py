
import requests
from datetime import datetime

# 최신 마케팅 트렌드 정보를 얻기 위한 API 호출 예시
def get_latest_marketing_trends():
    # 예시: 최신 마케팅 트렌드 API에서 데이터 가져오기
    # 실제 트렌드를 얻으려면 유효한 API나 트렌드 데이터베이스를 사용해야 함
    trends = [
        "개인화 마케팅 (Personalized Marketing)",
        "비디오 콘텐츠 (Video Content Marketing)",
        "SNS 연계 마케팅 (Social Media Integration)",
        "환경 친화적 마케팅 (Eco-friendly Marketing)",
        "AI 기반 예측 마케팅 (AI-driven Predictive Marketing)"
    ]
    return trends

# 마케팅 기획서에 반영할 최신 트렌드를 제공하는 함수
def integrate_marketing_trends(prompt: str):
    trends = get_latest_marketing_trends()
    trends_summary = "\n".join([f"- {trend}" for trend in trends])
    
    return f"{prompt}\n\n### 최신 마케팅 트렌드\n{trends_summary}"


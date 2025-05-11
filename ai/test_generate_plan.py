import os
from ai.utils import generate_title_and_keywords_from_markdown
from ai.gemini_client import generate_tourism_plan

# 예시 입력 데이터
info = {
    "title": "유채꽃 관광상품 기획",
    "detail_info": "유채꽃길을 따라 걷는 산책 코스",
    "location": "제주 서귀포시",
    "image_urls": [
        "https://cdn.example.com/uploads/jeju1.jpg",
        "https://cdn.example.com/uploads/jeju2.jpg"
    ],
    "keywords": ["한옥", "전통음식"],
    "available_dates": "2025-04-20 ~ 2025-05-05",
    "duration": "2시간",
    "price": 30000,
    "policy": "하루 전까지 취소 가능"
}

# generate_tourism_plan 함수 실행
plan_text = generate_tourism_plan(info)

# 생성된 기획서 텍스트 출력
print(plan_text)

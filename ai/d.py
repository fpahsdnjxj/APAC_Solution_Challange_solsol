from ai.prompt_templates import generate_tourism_plan  # tourism_plan_prompt 사용하는 함수

# 테스트용 정보
info = {
    "title": "제주 감귤 따기 체험",
    "detail_info": "제주의 자연 속에서 직접 감귤을 따보고, 로컬 간식과 함께 사진을 남길 수 있는 체험 상품입니다.",
    "location": "제주 서귀포시 남원읍",
    "image_urls": [
        "https://example.com/images/jeju1.jpg",
        "https://example.com/images/jeju2.jpg"
    ],
    "keywords": ["#제주감귤", "#귤따기체험", "#로컬간식", "#가족여행"],
    "available_dates": "2025년 10월~12월",
    "duration": "약 2시간",
    "price": "25000",
    "policy": "이용일 3일 전까지 100% 환불, 이후 환불 불가"
}

if __name__ == "__main__":
    result = generate_tourism_plan(
        title=info["title"],
        detail_info=info["detail_info"],
        location=info["location"],
        image_urls=info["image_urls"],
        keywords=info["keywords"],
        available_dates=info["available_dates"],
        duration=info["duration"],
        price=info["price"],
        policy=info["policy"]
    )
    print(result)

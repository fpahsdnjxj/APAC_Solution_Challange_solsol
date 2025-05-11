from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ai.gemini_client import generate_tourism_plan
from ai.utils import generate_title_and_keywords_from_markdown

router = APIRouter()

class PlanningRequest(BaseModel):
    title: str
    detail_info: str
    location: str
    image_urls: list[str]
    keywords: list[str]
    available_dates: str
    duration: str
    price: int
    policy: str

@router.post("/planning")
async def planning(request: PlanningRequest):
    try:
        info = request.dict()

        # 1. 관광 기획서 마크다운 생성
        plan_markdown = generate_tourism_plan(info)

        # 2. 제목과 키워드 추출
        meta = generate_title_and_keywords_from_markdown(plan_markdown)

        # 3. 필요한 정보만 응답
        return {
            "title": meta["title"],
            "keyword": meta["keyword"]
        }

    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the plan")

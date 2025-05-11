#api 처리 흐름 예시 (fastapi)
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ai.gemini_client import generate_tourism_plan
from ai.extract_utils import generate_title_and_keywords_from_markdown

router = APIRouter()

class PlanningRequest(BaseModel):
    title: str
    detail_info: str
    location: str
    image_urls: list
    keywords: list
    available_dates: str
    duration: str
    price: int
    policy: str

@router.post("/planning")
def plan_tour(req: PlanningRequest):
    try:
        markdown_plan = generate_tourism_plan(req.dict())
        meta = generate_title_and_keywords_from_markdown(markdown_plan)

        # 기획서 전체도 저장해두고, 채팅 시작 시 반환할 수 있음
        # 예: DB에 저장하거나 캐시에 넣는 로직

        return {
            "title": meta["title"],
            "keyword": meta["keyword"]
        }

    except Exception as e:
        print("❌ Error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate tourism plan")

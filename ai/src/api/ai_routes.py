from ai_module.api_example import PlanningRequest
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ai_module.gemini_client import generate_tourism_plan
from ai_module.utils import generate_title_and_keywords_from_markdown

router = APIRouter("/ai")



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
    


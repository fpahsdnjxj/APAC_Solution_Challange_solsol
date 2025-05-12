from schema.request import MarketingRequest
from schema.request import PlanningRequest
from fastapi import APIRouter, HTTPException
from ai_module.gemini_client import generate_tourism_plan
from ai_module.utils import generate_title_and_keywords_from_markdown

router = APIRouter(prefix="/api/ai")



@router.post("/planning")
async def planning(request: PlanningRequest):
    try:
        info = request.dict()
        plan_markdown = generate_tourism_plan(info)
        meta = generate_title_and_keywords_from_markdown(plan_markdown)
        return {
            "title": meta["title"],
            "keyword": meta["keyword"]
        }

    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the plan")


@router.post("/marketing")
async def marketing(request: MarketingRequest):
    try:
        info=request.dict()
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the marketing chat")

    
    


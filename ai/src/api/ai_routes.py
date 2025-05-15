import traceback
from schema.response import Export, GenerateChat, MessageResponse
from schema.request import MarketingExportRequest, MarketingRequest, Message, PlanningExportRequest, PreviousChatInfo
from schema.request import PlanningRequest
from fastapi import APIRouter, HTTPException
from ai_module.gemini_client import generate_chat_response, generate_export_summary, generate_marketing_strategy, generate_tourism_plan
from ai_module.utils import generate_title_and_keywords_from_markdown

router = APIRouter(prefix="/api/ai")



@router.post("/planning")
async def planning(request: PlanningRequest):
    try:
        info = request.dict()
        plan_markdown = generate_tourism_plan(info)
        meta = generate_title_and_keywords_from_markdown(plan_markdown)
        return GenerateChat(title=meta["title"], keywords=meta["keyword"])
    
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the plan")


@router.post("/marketing")
async def marketing(request: MarketingRequest):
    try:
        info=request.dict()
        marketing_markdown=generate_marketing_strategy(info)
        meta = generate_title_and_keywords_from_markdown(marketing_markdown)
        return GenerateChat(title=meta["title"], keywords=meta["keyword"])

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the marketing chat")

@router.post("/message")
async def send_message(request: PreviousChatInfo):
    try:
        message = generate_chat_response(request.previous_message_list, request.current_message)
        response_message = Message(
            sender_role="ai",
            content_text=message,
            links=[],
            image_urls=[]
        )
        return MessageResponse(message=response_message)
    
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the response")
    

@router.post("/planning_export")
async def export_final(request: PlanningExportRequest):
    try:
        message=generate_export_summary(request.previous_message_list)
        return Export(content=message, image_urls=[], links=[])
    
    except Exception as e:
        error_message = f"Error: {e}\n{traceback.format_exc()}"
        print(error_message)
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the response")

@router.post("/marketing_export")
async def export_final(request: MarketingExportRequest):
    try:
        message=generate_export_summary(request.previous_message_list)
        return Export(content=message, image_urls=[], links=[])
    
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the response")


    


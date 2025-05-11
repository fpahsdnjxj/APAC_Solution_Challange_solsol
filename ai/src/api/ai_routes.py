from fastapi import APIRouter, Request, HTTPException, Header
from ai_module.gemini_client import generate_marketing_plan

router = APIRouter()

@router.post("/planing_chat")
async def planing_chat(request: Request, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Access token is missing or invalid")

    body = await request.json()

    try:
        # AI 기획서 초안 생성
        ai_response = generate_marketing_plan(body)  # body 딕셔너리를 프롬프트에 넣음

        # 채팅방 생성 (DB가 있다면 실제 ID 발급/저장 필요)
        chat_id = 123412412  # 임시 ID, 실제론 DB에서 생성
        title = body.get("title", "무제")
        keywords = extract_keywords_from_text(ai_response)

        return {
            "chat_id": chat_id,
            "title": title + " 기획서",
            "keyword": keywords
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

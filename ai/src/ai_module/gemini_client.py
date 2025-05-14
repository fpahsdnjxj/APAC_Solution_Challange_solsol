import google.generativeai as genai
import os
from ai.prompt_templates import tourism_plan_prompt
from ai.prompt_templates import marketing_strategy_prompt_template
from ai.utils import generate_title_and_keywords_from_markdown  # 이 부분을 추가

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

gemini_client = genai.GenerativeModel(model_name="gemini-1.5-pro-latest")

# 관광 상품 기획서 생성 함수 (/ai/planning)
def generate_tourism_plan(info: dict) -> str:
    from ai.prompt_templates import tourism_plan_prompt
    prompt = tourism_plan_prompt.format(
        title=info["title"],
        detail_info=info["detail_info"],
        location=info["location"],
        image_urls="\n".join(info["image_urls"]),
        keywords=", ".join(info["keywords"]),
        available_dates=info["available_dates"],
        duration=info["duration"],
        price=info["price"],
        policy=info["policy"]
    )
    try:
        response = gemini_client.generate_content(prompt)
        response_text = response.text # 이렇게 해야 오류 안발생함
        return response_text
    except Exception as e:
        print("Error generating tourism plan:", e)
        return ""

# 기획 결과물 + 사용자 질의에 대한 AI의 대화형 응답 함수 (/ai/message)

def generate_message_response(payload: dict) -> dict:
    from ai.prompt_templates import message_prompt_template
    from ai.gemini_client import gemini_client

    try:
        previous_messages = payload.get("previous_message_list", [])
        current_message = payload.get("current_message", {})

        # 대화 히스토리 정리
        history_lines = []
        for msg in previous_messages:
            role = msg["sender_role"]
            text = msg["content_text"]
            if msg.get("image_urls"):
                text += f"\n[이미지 첨부됨: {', '.join(msg['image_urls'])}]"
            history_lines.append(f"{role}: {text}")

        # 현재 메시지
        current_text = current_message.get("content_text", "")
        current_images = current_message.get("image_urls", [])
        if current_images:
            current_text += f"\n[현재 이미지: {', '.join(current_images)}]"

        full_prompt = message_prompt_template.format(
            conversation_history="\n".join(history_lines),
            current_input=current_text
        )

        response = gemini_client.generate_content(full_prompt)
        return {
            "message": {
                "sender_role": "ai",
                "content_text": response.text.strip(),
                "links": [],
                "image_urls": []
            }
        }
    except Exception as e:
        print("Error generating message response:", e)
        return {
            "message": {
                "sender_role": "ai",
                "content_text": "죄송합니다. 답변을 생성하는 중 문제가 발생했습니다.",
                "links": [],
                "image_urls": []
            }
        }


# 마케팅 전략서 생성 함수 (/ai/marketing_export용)

def generate_marketing_strategy(content: str, chat_history: list) -> str:
    # chat_history: previous_message_list
    chat_lines = ""
    for msg in chat_history:
        role = msg["sender_role"]
        text = msg["content_text"]
        if msg.get("image_urls"):
            text += f"\n[이미지 첨부됨: {', '.join(msg['image_urls'])}]"
        chat_lines += f"{role.upper()}: {text}\n"

    prompt = f"""다음 관광 기획 내용을 기반으로 마케팅 전략서를 작성해줘. 내용은 마크다운 형식으로 정리해줘.
    
무조건 markdown 형식으로 작성하기!!
[기획 내용 요약]
{content}

[사용자와의 대화 히스토리]
{chat_lines.strip()}

## [마케팅 전략서 작성 지침]

아래 항목들을 포함하여 전략서를 작성하세요:

1. **핵심 타겟 고객층**  
   - 나이, 성별, 여행 목적, 여행 스타일 등으로 세분화  
   - 어떤 고객에게 특히 매력적일지 논리적으로 설명

2. **마케팅 목표 설정**  
   - 예: 초기 3개월 내 SNS 노출 5만 회, 예약 전환율 5% 달성  
   - 이 목표를 설정한 이유와 기대 효과를 설명

3. **홍보 채널 및 활용 전략**  
   - Instagram, TikTok, YouTube, 블로그, 지역 플랫폼 등  
   - 각 채널의 특성과 활용 방식 제안 (예: 인스타 릴스 vs 블로그 리뷰)

4. **콘텐츠 전략**  
   - 타겟에 맞춘 콘텐츠 유형 제안 (예: 감성 사진, 가족 여행 브이로그 등)  
   - 콘텐츠 예시 포함 (제목, 내용 요약 형식)

5. **인플루언서/제휴 마케팅 방안**  
   - 어떤 인플루언서 또는 지역 브랜드와 협업할 수 있는지 제안  
   - 공동 마케팅 캠페인 아이디어 포함

6. **예산 계획 (간략)**  
   - 콘텐츠 제작, 광고비, 제휴 비용 등의 항목별 대략적 범위  
   - ROI(투자 대비 수익) 관점에서 효율적인 집행 방향 제시

7. **성과 지표 (KPI)**  
   - 어떤 지표로 성과를 측정할지 (예: 유입 수, 전환율, SNS 노출 수 등)  
   - 목표 수치 예시와 그 의미

---

## [형식]

- 각 항목은 제목을 달고 **명확한 문단 형식**으로 작성
- 말투는 전문가 보고서처럼 정중하고 직설적으로 유지
- 필요 시 마케팅 관련 용어와 이론적 근거 활용
"""

    try:
        response = gemini_client.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("Error generating strategy from summary:", e)
        return ""

def handle_marketing_export(payload: dict) -> dict:
    default_info = payload.get("default_info", {})
    content = default_info.get("content", "")
    image_urls = default_info.get("image_urls", [])
    links = default_info.get("links", [])
    previous_messages = payload.get("previous_message_list", [])

    generated_content = generate_marketing_strategy(content, previous_messages)

    return {
        "content": generated_content,
        "image_urls": image_urls,
        "links": links
    }

# 지금까지 대화 기반으로 답함 (/ai/message 용)
def generate_chat_response(previous_message_list: list, current_message: dict) -> str:
    chat_history = ""
    for msg in previous_message_list:
        role = msg["sender_role"]
        content = msg["content_text"]
        chat_history += f"{role.upper()}: {content}\n"

    chat_history += f"{current_message['sender_role'].upper()}: {current_message['content_text']}\n"
    prompt = chat_prompt_template.format(chat_history=chat_history.strip())

    response = gemini_client.generate_content(prompt)
    return response.text

# 대화 요약해서 기획서로 정리 (/ai/planning/export 용)
def generate_export_summary(previous_message_list: list) -> str:
    chat_history = ""
    for msg in previous_message_list:
        role = msg["sender_role"]
        content = msg["content_text"]
        chat_history += f"{role.upper()}: {content}\n"

    export_prompt = f"""다음 대화 내용을 바탕으로 관광 상품 기획서를 마크다운 형식으로 정리해줘:\n\n{chat_history.strip()}"""
    response = gemini_client.generate_content(export_prompt)
    return response.text
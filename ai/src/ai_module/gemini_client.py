import google.generativeai as genai
import os
from .utils import generate_title_and_keywords_from_markdown
from schema.request import Message
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

gemini_client = genai.GenerativeModel(model_name="gemini-1.5-pro-latest")

# 관광 상품 기획서 생성 함수
def generate_tourism_plan(info: dict) -> str:
    from .prompt_templates import tourism_plan_prompt
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
        response_text = response.text
        return response_text
    except Exception as e:
        print("Error generating tourism plan:", e)
        return ""


# 마케팅
def generate_marketing_strategy(info: dict) -> str:
    from .prompt_templates import marketing_strategy_prompt_template
    prompt = marketing_strategy_prompt_template.format(
        content=info["content"]
    )
    try:
        response = gemini_client.generate_content(prompt)
        response_text = response.text  # 이렇게 해야 오류 안 발생함
        return response_text
    except Exception as e:
        print("Error generating marketing strategy:", e)
        return ""


# 지금까지 대화 기반으로 답함 (/ai/message 용)
def generate_chat_response(previous_message_list: list, current_message: Message) -> str:
    from .prompt_templates import chat_prompt_template
    chat_history = ""
    for msg in previous_message_list:
        role = msg.sender_role
        content = msg.content_text
        chat_history += f"{role.upper()}: {content}\n"

    chat_history += f"{current_message.sender_role.upper()}: {current_message.content_text}\n"
    prompt = chat_prompt_template.format(chat_history=chat_history.strip())

    response = gemini_client.generate_content(prompt)
    return response.text

# 기획서 export 
from typing import List, Dict
import markdown
from ai_module.gemini_client import gemini_client

def generate_tour_planning_export(data: Dict) -> Dict:
    try:
        previous_message_list = data.get("previous_message_list", [])
        default_info = data.get("default_info", {})
        
        # 1. 대화 히스토리 구성
        chat_history = ""
        for msg in previous_message_list:
            role = msg["sender_role"]
            content = msg["content_text"]
            chat_history += f"{role.upper()}: {content}\n"

        # 2. 기본 정보 조립
        title = default_info.get("title", "관광 상품 기획")
        detail_info = default_info.get("detail_info", "")
        location = default_info.get("location", "")
        image_urls = default_info.get("image_urls", [])
        keywords = ", ".join(default_info.get("keywords", []))
        available_dates = default_info.get("available_dates", "")
        duration = default_info.get("duration", "")
        price = default_info.get("price", 0)
        policy = default_info.get("policy", "")

        # 3. 마크다운 기획서 생성 프롬프트 구성
        export_prompt = f"""다음 대화 내용을 참고하여 아래 정보를 포함한 관광 상품 기획서를 마크다운 형식으로 작성해줘:

### 기본 정보
- 제목: {title}
- 지역: {location}
- 설명: {detail_info}
- 키워드: {keywords}
- 운영 기간: {available_dates}
- 소요 시간: {duration}
- 가격: {price}원
- 취소 정책: {policy}

### 대화 내용
{chat_history.strip()}
"""

        # 4. AI 모델에 요청 (예: OpenAI, Gemini 등)
        response = gemini_client.generate_content(export_prompt)
        content_md = response.text.strip()

        # 5. 참조 링크 추출
        all_links = []
        for msg in previous_message_list:
            all_links.extend(msg.get("links", []))
        all_links = list(set(all_links))  # 중복 제거

        return {
            "content": content_md,
            "image_urls": image_urls,
            "links": all_links
        }

    except Exception as e:
        return {
            "error": f"An error occurred while retrieving export list: {str(e)}"
        }

# 마케팅 전략서 export

def handle_marketing_export(data: Dict) -> Dict:
    try:
        # 기본 정보 추출
        default_info = data.get("default_info", {})
        content = default_info.get("content", "")
        image_urls = default_info.get("image_urls", [])
        links = default_info.get("links", [])

        # 대화 내역에서 링크 추가 (중복 제거)
        previous_message_list = data.get("previous_message_list", [])
        for msg in previous_message_list:
            for link in msg.get("links", []):
                if link not in links:
                    links.append(link)

        return {
            "content": content,
            "image_urls": image_urls,
            "links": links
        }

    except Exception as e:
        return {
            "error": f"An error occurred while retrieving export list: {str(e)}"
        }


def generate_export_summary(previous_message_list: list) -> str:
    chat_history = ""
    for msg in previous_message_list:
        role = msg.sender_role
        content = msg.content_text
        chat_history += f"{role.upper()}: {content}\n"
    
    export_prompt = f"""다음 대화 내용을 바탕으로 관광 상품 기획서를 마크다운 형식으로 정리해줘:\n\n{chat_history.strip()}"""
    response = gemini_client.generate_content(export_prompt)
    return response.text
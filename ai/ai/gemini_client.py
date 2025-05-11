import google.generativeai as genai
import os
from ai.prompt_templates import tourism_plan_prompt
from ai.utils import generate_title_and_keywords_from_markdown  # 이 부분을 추가

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# 모델 객체 생성
gemini_client = genai.GenerativeModel(model_name="gemini-1.5-pro-latest")

# 관광 상품 기획서 생성 함수
def generate_tourism_plan(info: dict) -> str:
    # 필수 키 검증
    required_keys = ["title", "detail_info", "location", "image_urls", "keywords", "available_dates", "duration", "price", "policy"]
    missing_keys = [key for key in required_keys if key not in info]
    if missing_keys:
        return f"Error: Missing required keys: {', '.join(missing_keys)}"

    try:
        # 프롬프트 생성
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
        
        # AI 모델 호출
        response = gemini_client.generate_content(prompt)
        
        # 응답 텍스트 추출
        response_text = response["content"]
        print(response_text)
        
        # 기획서 마크다운에서 제목과 키워드 추출
        meta = generate_title_and_keywords_from_markdown(response_text)
        print(f"Title: {meta['title']}")
        print(f"Keywords: {meta['keywords']}")
        
        return response_text  # 최종적으로 생성된 기획서 내용 반환

    except Exception as e:
        print(f"Error generating tourism plan: {e}")
        return "Error generating tourism plan"



# 마케팅
def generate_marketing_strategy(info: dict) -> str:
    from ai.prompt_templates import marketing_plan_prompt
    prompt = marketing_plan_prompt.format(
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

    # 최신 마케팅 트렌드 반영
    full_prompt = integrate_marketing_trends(prompt)

    response = gemini_client.generate_content(full_prompt)
    return response.text

# PDF로 저장하는 함수
def save_marketing_plan_as_pdf(markdown_text: str, filename="marketing_strategy.pdf"):
    html = markdown2.markdown(markdown_text)
    HTML(string=html).write_pdf(filename)
    print(f"✅ PDF로 저장 완료: {filename}")

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

# 대화 요약해서 기획서로 정리리 (/ai/export 용)
def generate_export_summary(previous_message_list: list) -> str:
    chat_history = ""
    for msg in previous_message_list:
        role = msg["sender_role"]
        content = msg["content_text"]
        chat_history += f"{role.upper()}: {content}\n"

    export_prompt = f"""다음 대화 내용을 바탕으로 관광 상품 기획서를 마크다운 형식으로 정리해줘:\n\n{chat_history.strip()}"""
    response = gemini_client.generate_content(export_prompt)
    return response.text
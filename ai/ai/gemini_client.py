import google.generativeai as genai
import os

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# 모델 객체 생성
gemini_client = genai.GenerativeModel(model_name="gemini-1.5-pro-latest")

# 관광 상품 기획서 생성
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
    response = gemini_client.generate_content(prompt)
    return response.text

# 마케팅 전략서 생성
def generate_marketing_strategy(info: dict) -> str:
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
    response = gemini_client.generate_content(prompt)
    return response.text

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

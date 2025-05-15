# 텍스트 전처리 등
# 제목&키워드 반환
import re

def generate_title_and_keywords_from_markdown(markdown_text: str) -> dict:
    # 제목 추출: "# 제목"
    title_match = re.search(r"# (.+)", markdown_text)
    title = title_match.group(1).strip() if title_match else "관광 기획서"

    # 키워드 추출: "## 핵심 키워드" 섹션 아래의 "- 항목"
    keyword_block = re.search(r"## 핵심 키워드\s+(- .+\n?)+", markdown_text)
    if keyword_block:
        keywords = re.findall(r"- (.+)", keyword_block.group(0))
        keywords = keywords[:3]
    else:
        keywords = []

    return {
        "title": title,
        "keyword": keywords
    }
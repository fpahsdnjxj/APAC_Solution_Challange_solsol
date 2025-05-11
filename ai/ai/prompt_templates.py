from ai.marketing_trends import integrate_marketing_trends
from ai.gemini_client import gemini_client

#기획서 프롬프트 
tourism_plan_prompt = """
너는 관광 마케팅 전문가이자, 실제 마케팅 기획서를 작성하는 실무 담당자야.

다음 정보를 바탕으로, 실제 마케팅 회의 혹은 기관 제안서에 사용할 수 있을 만큼 **전문적이고 구체적인 관광상품 기획서**를 작성해줘.  
형식은 반드시 **Markdown 문서 형식**으로 해.

**❗중요 조건**  
- 문서답게 각 항목은 명확한 제목과 함께 작성  
- 형식은 깔끔하고 일관성 있게  
- 아무 의미 없이 말 늘리지 말고, 실질적으로 마케팅/기획에 **도움되는 정보만 포함**  
- 각 항목의 내용은 실제 관광 마케팅 실무에 기반해서 쓰기  
- 가능하면 **행동 심리, 계절성, 로컬 트렌드, 소비자 경험** 등의 배경을 근거로 써줘

---

## [관광상품 기획서] {title}

### 1. 기획 배경
- 왜 이 시기에, 이 지역에서 이 상품을 기획했는지 설명
- 트렌드(예: 계절 관광 수요, SNS 소비패턴), 지역성, 인프라 상황 등을 분석

### 2. 주요 타깃
- 나이, 여행 성향, 소비 패턴 등을 바탕으로 핵심 타깃을 정의
- 해당 타깃이 이 상품에서 어떤 만족을 얻을 수 있는지 설명

### 3. 상품 개요
- **상세 설명**: {detail_info}  
- **장소**: {location}  
- **이용 가능 날짜**: {available_dates}  
- **소요 시간**: {duration}  
- **가격**: {price}원  
- **환불 정책**: {policy}  

### 4. 상품 구성
- 전체 여정 흐름 요약 (예: 도착 → 체험 A → 간식 시간 → 마무리 포토존)
- 포함 항목 / 불포함 항목 명시
- 장소의 동선, 사진 촬영 시점 등도 고려해서 작성

### 5. 마케팅 포인트
- 어떤 점이 사람들의 선택을 끌어낼 핵심 포인트인지 제시  
- SNS 콘텐츠화 포인트, 타깃 감성 자극 포인트 등을 구체적으로 제시

### 6. 차별화 요소
- 유사 상품과 비교했을 때의 강점
- 지역 자원, 경험 콘텐츠, 시간 구성, 가격 정책 등의 차별성

### 7. 추천 키워드 (3~5개)
예: `#제주유채꽃`, `#봄날의인생샷`, `#힐링산책코스`, `#제주전통간식`, `#감성여행`

### 8. 참고 이미지
{image_urls}

---

출력은 꼭 **Markdown 형식**으로 구성해줘.
내용은 실무자나 투자자가 읽었을 때 ‘잘 썼다’, ‘쓸 수 있겠다’는 생각이 들도록 진지하게 써줘.
"""
def generate_tourism_plan(title, detail_info, location, image_urls, keywords, available_dates, duration, price, policy):

    filled_prompt = tourism_plan_prompt.format(
        title=title,
        detail_info=detail_info,
        location=location,
        image_urls=image_urls,
        keywords=keywords,
        available_dates=available_dates,
        duration=duration,
        price=price,
        policy=policy
    )

    result = gemini_client.generate_content(filled_prompt)

    return result

# 마케팅 전략서 프롬프트 (세린님이 수정하실 예정) 
# 마케팅 전략서 프롬프트
def generate_marketing_plan(title, detail_info, location, image_urls, keywords, available_dates, duration, price, policy):
    marketing_plan_prompt = """
    너는 관광 마케팅 전문가이자, 실제 마케팅 기획서를 작성하는 실무 담당자야.
    아래의 관광상품 정보를 기반으로 **SNS, 블로그, 바이럴 중심의 마케팅 전략**을
    **Markdown 문서 형식**으로 작성해 줘.

    ## 출력 형식:
    - 모든 항목은 Markdown 제목(##, ###)으로 구분
    - 표와 리스트를 활용해 가독성 있게 작성
    - 형식은 깔끔하고 일관성 있게
    - 실무자가 그대로 활용 가능한 수준으로 구체적이고 간결하게
    - 트렌드 키워드 단순 나열이 아닌, 각 트렌드를 분석하여 구체적인 마케팅 전략으로 제시
    - 전문적이고 실무적 어조 사용, 실제 제안서처럼 체계적으로 구성

    ---

    ## [관광상품 기획서] {title}

    ### 1. 타깃 고객
    - 어떤 세대/성향의 고객에게 어필할 수 있는지
    - 고객이 어떤 욕구(예: sns 감성 중시, 자연 체험 중시)로 이 상품을 선택할지 간단히 설명

    ### 2. 상품 개요
    - **상품 제목**: {title}
    - **상세 설명**: {detail_info}
    - **장소**: {location}
    - **이미지 URL**: {image_urls}
    - **키워드**: {keywords}
    - **이용 가능 날짜**: {available_dates}
    - **소요 시간**: {duration}
    - **가격**: {price}원
    - **환불 정책**: {policy}

    ### 3. 주요 홍보 채널
    | 채널 | 콘텐츠 형식 | 추천 이유 |
    |------|-------------|------------|
    | 예: Instagram | 릴스 15초 영상 | 감성 공유 욕구 자극 |

    ### 4. 운영 계획
    - 체험단 운영, 해시태그 이벤트, 타임세일 등
    - 실행 일정 예시와 목표 (KPI)가 있다면 함께 제시

    ### 5. 해시태그 추천
    - 마케팅 효과를 고려한 검색량 높은 해시태그 4~5개

    ---

    출력은 반드시 **Markdown 형식** 원본 그대로!
    기획서는 반드시 **최신 마케팅 트렌드**를 반영해줘.
    """


    # 트렌드 삽입
    prompt_with_trends = integrate_marketing_trends(marketing_plan_prompt)

    # Gemini 호출
    response = gemini_client.generate_content(prompt_with_trends)
    generated_plan = response.text 
    return generated_plan
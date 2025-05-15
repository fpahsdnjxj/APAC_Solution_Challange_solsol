from .gemini_client import gemini_client
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


# 마케팅 전략서 프롬프트
marketing_strategy_prompt_template = """
당신은 관광 마케팅 전략 전문가입니다. 아래 제공된 관광상품 정보를 바탕으로, 실무 수준의 마케팅 전략서를 작성해 주세요. 전략서는 논리적이고 구체적으로 작성되며, 실제 관계자에게 제안할 수 있는 수준으로 구성되어야 합니다.

---

## [상품 정보]

- 상품 내용: {content}

---

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

def marketing_strategy_prompt(title, detail_info, location, image_urls, keywords, available_dates, duration, price, policy):

    filled_prompt = marketing_strategy_prompt.format(
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

# 사용자기반답변 프롬프트
chat_prompt_template = """
다음은 사용자와의 대화입니다.
{chat_history}
이 대화에 이어서 답변을 생성해주세요.
"""

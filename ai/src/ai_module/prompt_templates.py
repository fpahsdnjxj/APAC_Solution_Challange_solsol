from .gemini_client import gemini_client
#기획서 프롬프트 
tourism_plan_prompt = """
You are a tourism marketing expert and a field-level professional responsible for writing actual marketing proposals.

Based on the information provided below, write a **professional and detailed tourism product proposal** that can be used in real marketing meetings or official submissions to institutions.  
The output must be written in **Markdown format**.

**❗Key Requirements**  
- Each section must have a clear and consistent title  
- Keep the format clean and uniform  
- Do not include any meaningless or wordy sentences — only include information that is **directly useful for marketing/planning**  
- The content must be based on **actual tourism marketing practices**  
- If possible, incorporate backgrounds such as **consumer behavior, seasonality, local trends, and user experience** to support your reasoning

---

## [Tourism Product Proposal] {title}

### 1. Background of Planning
- Explain why this product is planned for this time and this location  
- Analyze seasonal demand trends, SNS consumption behavior, local characteristics, and infrastructure status

### 2. Target Audience
- Define the core target based on age, travel style, spending patterns  
- Describe the kind of satisfaction or experience the audience can expect from this product

### 3. Product Overview
- **Detailed Description**: {detail_info}  
- **Location**: {location}  
- **Available Dates**: {available_dates}  
- **Duration**: {duration}  
- **Price**: {price} KRW  
- **Refund Policy**: {policy}  

### 4. Product Composition
- Provide a summarized itinerary flow (e.g., Arrival → Activity A → Snack Time → Final Photo Spot)  
- Clearly state what's included and not included  
- Consider visitor flow, photo opportunities, and on-site logistics

### 5. Marketing Highlights
- Present the core selling points that will drive customer interest  
- Be specific about what makes the product content-friendly for SNS and what emotional triggers it appeals to

### 6. Differentiation Factors
- Explain how this product stands out compared to similar products  
- Highlight differentiation in local resources, experience content, time design, or pricing policy

### 7. Recommended Hashtags (3–5)
Examples: `#JejuCanola`, `#SpringPhotoSpot`, `#HealingWalk`, `#JejuLocalSnacks`, `#EmotionalTrip`

### 8. Reference Images
{image_urls}

---

Output **must be written in Markdown format**.  
The content should read as **serious and practical**, appropriate for professionals or investors.  
**The final document must be in English.**
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
You are a tourism marketing strategy expert. Based on the tourism product information provided below, write a **professional-level marketing strategy report**. The strategy should be logically structured and specific enough to be proposed to actual stakeholders.

---

## [Product Information]

- Product Content: {content}

---

## [Instructions for Writing the Marketing Strategy]

Include the following sections in the report:

1. **Core Target Customer Segment**  
   - Segment by age, gender, travel purpose, and travel style  
   - Explain logically which customer group this product appeals to the most and why

2. **Marketing Goals**  
   - Example: Achieve 50,000 social media impressions and 5% booking conversion within the first 3 months  
   - Justify the selected goals and describe the expected impact

3. **Promotion Channels and Usage Strategy**  
   - Instagram, TikTok, YouTube, blogs, regional platforms, etc.  
   - Propose usage strategies tailored to each channel (e.g., Instagram Reels vs blog reviews)

4. **Content Strategy**  
   - Propose content types suited for the target (e.g., emotional photography, family trip vlogs)  
   - Include examples in the form of a title and brief description

5. **Influencer/Partnership Marketing Plan**  
   - Suggest relevant influencers or local brands for collaboration  
   - Include ideas for joint marketing campaigns

6. **Budget Plan (Brief)**  
   - Estimate cost ranges for content creation, ads, and partnerships  
   - Propose efficient execution with ROI (Return on Investment) in mind

7. **Performance Metrics (KPIs)**  
   - Define which metrics will be used to evaluate performance (e.g., traffic, conversion rate, SNS impressions)  
   - Include example target figures and explain their significance

---

## [Format]

- Each section must have a clear heading and be written in **well-structured paragraphs**
- Maintain a professional, direct tone as used in formal reports
- Use marketing terminology and theoretical foundations where appropriate
- **The final output must be written in English**
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
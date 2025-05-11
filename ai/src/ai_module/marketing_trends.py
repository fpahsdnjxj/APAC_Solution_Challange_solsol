
import requests
from datetime import datetime
from pytrends.request import TrendReq

from pytrends.request import TrendReq

def get_latest_marketing_trends():
    pytrends = TrendReq(hl='ko', tz=540)
    keywords = ["마케팅", "SNS", "개인화", "친환경"]
    
    try:
        pytrends.build_payload(keywords, timeframe='now 7-d', geo='KR')
        related_queries = pytrends.related_queries()
    except Exception as e:
        print(f"[WARN] pytrends 요청 실패: {e}")
        return ["개인화 마케팅", "SNS 쇼핑", "비디오 콘텐츠", "친환경 전략", "로컬 브랜딩"]

    trends = []
    for kw in keywords:
        try:
            result = related_queries.get(kw)
            if result and "top" in result and result["top"] is not None:
                df = result["top"]
                if not df.empty and "query" in df.columns:
                    top_queries = df["query"].dropna().head(2).tolist()
                    trends.extend(top_queries)
        except Exception as e:
            print(f"[WARN] '{kw}' 키워드 관련 쿼리 처리 중 오류: {e}")
            continue

    # 중복 제거 + 최대 5개 추출
    unique_trends = list(dict.fromkeys(trends))[:5]
    
    return unique_trends if unique_trends else ["개인화 마케팅", "SNS 쇼핑", "비디오 콘텐츠", "친환경 전략", "로컬 브랜딩"]

# 마케팅 기획서에 반영할 최신 트렌드를 제공하는 함수
def integrate_marketing_trends(prompt: str):
    trends = get_latest_marketing_trends()
    trends_summary = "\n".join([f"- {trend}" for trend in trends])
    return f"{prompt}\n\n### 🔍 최신 마케팅 트렌드 참고 (Google Trends 기반)\n{trends_summary}"
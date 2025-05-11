from typing import List
from pydantic import BaseModel

class PlanningRequest(BaseModel):
    title: str
    detail_info: str
    location: str
    image_urls: list[str]
    keywords: list[str]
    available_dates: str
    duration: str
    price: int
    policy: str

class MarketingRequest(BaseModel):
    content: str
    image_urls: list[str]
    links:list[str]

class Message(BaseModel):
    sender_role: str
    content_text: str
    links: list[str]
    image_urls: list[str]
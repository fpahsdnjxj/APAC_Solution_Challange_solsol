from typing import List
from pydantic import BaseModel
from .request import Message

class GenerateChat(BaseModel):
    title: str
    keywords: list[str]
class MessageResponse(BaseModel):
    message: Message

class Export(BaseModel):
    content: str
    image_urls:list[str]
    links: list[str]
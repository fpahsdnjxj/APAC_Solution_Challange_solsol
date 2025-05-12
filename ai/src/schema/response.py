from typing import List
from pydantic import BaseModel
from .request import Message

class GenerateChat:
    title: str
    keyword: list[str]
class MessageResponse:
    message: Message

class Export:
    content: str
    image_urls:list[str]
    links: list[str]
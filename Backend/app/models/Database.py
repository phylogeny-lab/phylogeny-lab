from pydantic import BaseModel, Json
from typing import Annotated, Any, Optional
from fastapi import File

class Database(BaseModel):
    name: str
    metadata: Json[Any]
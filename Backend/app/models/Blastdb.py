from pydantic import BaseModel
from typing import Annotated, Optional, List
from fastapi import File
from datetime import datetime

class Blastdb(BaseModel):
    id: Optional[str] = None
    dbname: str
    version: Optional[str] = None
    dbtype: Optional[str] = None
    description: Optional[str] = None
    numLetters: Optional[int] = None
    numSequences: Optional[int] = None
    filepath: Optional[str] = None
    lastUpdated: Optional[datetime] = None
    bytesTotal: Optional[int] = None
    status: Optional[str] = None
    ncbidb: Optional[bool] = None

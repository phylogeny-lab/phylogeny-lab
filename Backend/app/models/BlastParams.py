from pydantic import BaseModel
from typing import Annotated, Optional
from fastapi import File
from datetime import date

# If you make changes to this model 
class BlastParams(BaseModel):
    id: Optional[str] = None
    algorithm: str
    db: Optional[str] = None
    entrezQuery: Optional[str] = None
    evalue: Optional[float] = None
    gapextend: Optional[int] = None
    gapopen: Optional[int] = None
    jobTitle: str
    max_hsps: Optional[int] = None
    organism: Optional[str] = None
    penalty: Optional[int] = None
    perc_identity: Optional[float] = None
    querySequence: Optional[str] = None
    reward: Optional[int] = None
    subjectSequence: Optional[str] = None
    taxids: Optional[str] = None
    ungapped: Optional[bool] = None
    word_size: Optional[int] = None
    status: Optional[str] = None
    created_at: Optional[date] = None
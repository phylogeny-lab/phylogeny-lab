from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class DimReduction(BaseModel):
    id: Optional[str] = None # ID of celery job is inserted
    title: str
    algorithm: str
    sequences: Optional[str] = None
    sequenceFilePaths: Optional[List[str]] = None
    kmers: int
    batch_size: int
    created_at: Optional[datetime] = None
    status: Optional[str] = None
from pydantic import BaseModel
from typing import Annotated, Optional
from fastapi import File
from datetime import datetime
from .BlastParams import BlastParams

class AlignmentJobs(BlastParams):
    id: str
    status: str
    jobTitle: str
    algorithm: str 
    status: str
    created_at: datetime

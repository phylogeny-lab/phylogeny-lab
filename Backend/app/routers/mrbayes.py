from typing import Annotated, Union
from fastapi import APIRouter, Depends, Form, UploadFile
from sqlalchemy.orm import Session
from ..config.database import get_db

router = APIRouter(
    prefix="/api/mrbayes",
    tags=['mrbayes']
)

@router.post("/")
async def mrbayes(
    data: Annotated[str, Form()], 
    sequenceFile: Union[UploadFile, None] = None,
    session: Session = Depends(get_db)
):
    pass

@router.get("/")
async def fetch(
    session: Session = Depends(get_db)
):
    pass

@router.get("/{id}")
async def fetch_id(
    id: str,
    session: Session = Depends(get_db)
):
    pass
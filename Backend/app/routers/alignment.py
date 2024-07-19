from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from ..worker import worker
from ..config.database import get_db
from celery import uuid

router = APIRouter(
    prefix="/api/alignment",
    tags=['clustalw', 'muscle', 'alignment']
)

# Execute new blast query
@router.post("/clustalw")
async def clustalw(db: Session = Depends(get_db)):
    alignment_id = uuid()
    worker.clustalw.apply_async(({}, alignment_id), task_id=alignment_id)
    return Response("success", status_code=200)
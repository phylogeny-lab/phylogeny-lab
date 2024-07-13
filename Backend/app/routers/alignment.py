from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from ..worker.worker import run_clustalw
from ..config.database import get_db
from celery import uuid

router = APIRouter(
    prefix="/api/alignment",
    tags=['clustalw', 'muscle', 'alignment']
)

# Execute new blast query
@router.post("/clustalw")
def clustalw(db: Session = Depends(get_db)):
    alignment_id = uuid()
    run_clustalw.apply_async(({}, alignment_id), task_id=alignment_id)
    return Response("success", status_code=200)
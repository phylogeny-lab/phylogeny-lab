import threading
import uuid
import os
from fastapi import FastAPI, File, Request, Response, UploadFile, status, HTTPException, Depends, APIRouter, Form
from typing import Annotated, Union
from fastapi.responses import FileResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
from ..helper.utils import save_file
from ..models.BlastParams import BlastParams
from ..models.BlastJobs import BlastJobs
from ..models.BlastResults import BlastOutput
from ..config.database import get_db
from ..schemas import schemas
from ..enums.BlastQueryStatus import BlastQueryStatus
from pathlib import Path
from subprocess import Popen, PIPE
import json
import datetime
import xmltodict
from fastapi.responses import JSONResponse
from ..Blast_server.worker import run_blastn
from celery.result import AsyncResult
from celery import uuid


router = APIRouter(
    prefix="/api/blast",
    tags=['Blast']
)

# Execute new blast query
@router.post("/blastn")
async def blastn(
    data: Annotated[str, Form()], 
    subjectFile: Union[UploadFile, None] = None, 
    queryFile: Union[UploadFile, None] = None, 
    db: Session = Depends(get_db)
    ):
        
        model_dict = json.loads(data)
        blast_params =  BlastParams.model_validate(model_dict)

        # create an id based on name and timestamp: id <- id(jobTitle + now())
        now = datetime.datetime.now()
        blast_id = uuid()
        
        # set other metadata
        blast_params.id = blast_id
        blast_params.status = BlastQueryStatus.IN_PROGRESS.value
        blast_params.created_at = datetime.datetime.now()


        new_query = schemas.BlastQueries(
            **blast_params.model_dump(exclude={'subjectSequence', 'querySequence'})
        )

        # locate database
        # TODO
        
        print(blast_id)
        run_blastn.apply_async((blast_params.model_dump(), blast_id, subjectFile, queryFile), task_id=blast_id)

        db.add(new_query)
        db.commit()

        return Response(content="success", media_type="application/json", status_code=200)

@router.get("/tasks/{task_id}")
def get_status(task_id):
    task_result = AsyncResult(task_id)
    result = {
        "task_id": task_id,
        "task_status": task_result.status,
        "task_result": task_result.result
    }
    return JSONResponse(result)

@router.post("/rerun/{id}")
async def rerun(id: int, db: Session = Depends(get_db)):

    id = str(id)

    job = db.query(schemas.BlastQueries).filter(schemas.BlastQueries.id == id).first()

    return Response(content="success", status_code=200)



# Fetch all current jobs, or specific job if ID is supplied
@router.get("/")
async def blastn(req: Request, db: Session = Depends(get_db)) -> List[BlastJobs]:

    jobs = db.query(schemas.BlastQueries).all()

    return [BlastJobs(
        id=item.id,
        jobTitle=item.jobTitle, 
        algorithm=item.algorithm, 
        db=item.db, 
        status=item.status, 
        created_at=item.created_at
    ) for item in jobs]

# Fetch all information pertaining to single ID
@router.get("/{id}")
async def blast(id: int, db: Session = Depends(get_db)):

    id = str(id)

    job = db.query(schemas.BlastQueries).filter(schemas.BlastQueries.id == id).first()

    return job


# Fetch results for blast queries
@router.get("/results/{id}")
async def results(id: int, db: Session = Depends(get_db)):

    if not isinstance(id, int):
        return Response(content="Error, bad id", status_code=400)
    
    save_dir = os.getenv('BLAST_SAVE_DIR')
    results_dir = os.path.join(save_dir, str(id), "results")
    results_json = os.path.join(results_dir, "results.json")
            

    with open(results_json, "r") as f:
        json_parse = json.loads(f.read())

    return JSONResponse(content=json_parse)
    


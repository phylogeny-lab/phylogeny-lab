import uuid
import os
from fastapi import Request, Response, UploadFile, Depends, APIRouter, Form
from typing import Annotated, Union
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from typing import List
from ..models.BlastParams import BlastParams
from ..models.BlastJobs import BlastJobs
from ..worker.helper.GLPath import GLPath
from ..config.database import get_db
from ..schemas import schemas
from ..enums.enums import CeleryStatus
import json
import datetime
from fastapi.responses import JSONResponse
from ..worker.worker import blastn
from celery.result import AsyncResult
from celery import uuid
from ..utils.blast import create_new_blast_job

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
    session: Session = Depends(get_db)
    ):
        
        model_dict = json.loads(data)
        blast_params =  BlastParams.model_validate(model_dict)

        blast_params: BlastParams = create_new_blast_job(
            params=blast_params,
            subjectFile=subjectFile,
            queryFile=queryFile,
        )
        
        exclude = ['created_at', 'status']
        for (k, v) in blast_params:
            if v == '':
                exclude.append(k)

        model_json = blast_params.model_dump(exclude=exclude)
                

        blastn.apply_async((model_json, blast_params.id), task_id=blast_params.id)

        new_query = schemas.BlastQueries(
            **blast_params.model_dump(exclude={'subject', 'query'})
        )

        async with session.begin():
            session.add(new_query)
            await session.commit()

        return Response(content="success", media_type="application/json", status_code=200)

@router.get("/tasks/{task_id}")
async def get_status(task_id):
    task_result = AsyncResult(task_id)
    result = {
        "task_id": task_id,
        "task_status": task_result.status,
        "task_result": task_result.result
    }
    return JSONResponse(result)

@router.post("/rerun/{id}")
async def rerun(id: int, session: Session = Depends(get_db)):

    id = str(id)

    stmt = select(schemas.BlastQueries).where(schemas.BlastQueries.id == id)
    result = await session.execute(stmt)
    job = result.scalar_one()

    # TODO: run job again

    return Response(content="success", status_code=200)



# Fetch all current jobs, or specific job if ID is supplied
@router.get("/")
async def blastn(req: Request, session: Session = Depends(get_db)) -> List[BlastJobs]:

    stmt = select(schemas.BlastQueries)
    result = await session.execute(stmt)
    jobs = result.scalars().all()

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
async def blast(id: int, session: Session = Depends(get_db)):

    id = str(id)

    stmt = select(schemas.BlastQueries).filter(schemas.BlastQueries.id == id)
    job = await session.execute(stmt).first()

    return job


@router.put("/{task_id}")
async def update_status(task_id: str, new_status: str, session: Session = Depends(get_db)):
    stmt = update(schemas.BlastQueries).where(schemas.BlastQueries.id == task_id).values(status=new_status)
    result = await session.execute(stmt)
    await session.commit()
    return task_id


# Fetch results for blast queries
@router.get("/results/{id}")
async def results(id: str, session: Session = Depends(get_db)):
    
    save_dir = os.getenv('BLAST_SAVE_DIR')
    results_dir = os.path.join(save_dir, id, "results")
    results_json = os.path.join(results_dir, "results.json")
            
    with open(results_json, "r") as f:
        json_parse = json.loads(f.read())

    return JSONResponse(content=json_parse)
    


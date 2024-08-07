import json
import os
from typing import Annotated, Union
from fastapi import APIRouter, Form, Response, UploadFile, Depends
from celery import uuid
from fastapi.responses import JSONResponse
from ..worker.worker import dim_reduction
from ..models.DimReduction import DimReduction
from ..enums.enums import CeleryStatus
from ..schemas import schemas
from sqlalchemy.orm import Session
from ..config.database import get_db
from ..worker.helper.GLPath import GLPath
from sqlalchemy import CursorResult, delete, select, update
from ..worker.worker import dim_reduction

router = APIRouter(
    prefix="/api/pca",
    tags=['feature_selection', 'pca']
)

@router.post("/")
async def pca(
    data: Annotated[str, Form()], 
    sequenceFile: Union[UploadFile, None] = None,
    session: Session = Depends(get_db)
):
    
    model_dict = json.loads(data)
    pca_params =  DimReduction.model_validate(model_dict)
    
    id = uuid()

    # set job params
    pca_params.id = id
    pca_params.status = CeleryStatus.STARTED.value

    if sequenceFile:
        gl_infiles = GLPath(path=os.path.join(os.getenv('VOLUME_DIR'), 'pca', id, sequenceFile.filename), makedirs=True)
        gl_infiles.save_locally(file=sequenceFile)

    pca_params.sequenceFilePaths = [gl_infiles.local]
    
    dim_reduction.apply_async((pca_params.algorithm, gl_infiles.local, pca_params.kmers, pca_params.batch_size, id), task_id=id)

    new_query = schemas.DimReduction(
        **pca_params.model_dump(exclude={'sequences'})
    )

    async with session.begin():
        session.add(new_query)
        await session.commit()

    return JSONResponse(content={'task_id': id}, status_code=200)

@router.get("/{id}")
def pca(id: str):
    pass

@router.put("/{task_id}")
async def update_status(task_id: str, new_status: str, session: Session = Depends(get_db)):
    stmt = update(schemas.DimReduction).where(schemas.DimReduction.id == task_id).values(status=new_status)
    result = await session.execute(stmt)
    await session.commit()
    return task_id

@router.delete("/{task_id}")
async def delete_task(task_id: str, session: Session = Depends(get_db)):
    stmt = delete(schemas.DimReduction).where(schemas.DimReduction.id == task_id)
    result: CursorResult = await session.execute(stmt)
    await session.commit()
    if result.rowcount != 0:
        return task_id
    else:
        return Response(content="ID does not match any records", status_code=400)
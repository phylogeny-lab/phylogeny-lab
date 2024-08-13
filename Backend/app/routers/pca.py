import json
import os
from typing import Annotated, List, Union
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
from sqlalchemy import CursorResult, Result, delete, select, update
from ..worker.worker import dim_reduction
import pandas as pd

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

    pca_params.sequenceFilePath = os.path.dirname(gl_infiles.local)
    
    dim_reduction.apply_async((pca_params.algorithm, gl_infiles.local, pca_params.kmers, pca_params.batch_size, id), task_id=id)

    new_query = schemas.DimReduction(
        **pca_params.model_dump(exclude={'sequences'})
    )

    async with session.begin():
        session.add(new_query)
        await session.commit()

    return JSONResponse(content={'task_id': id}, status_code=200)

@router.get("/")
async def pca(session: Session = Depends(get_db)) -> List[DimReduction]:
    stmt = select(schemas.DimReduction)
    result: Result = await session.execute(stmt)
    all_results = result.scalars().all()
    if not all_results:
        return Response(content="No jobs found", status_code=404)
    return [DimReduction(
        id=item.id,
        title=item.title, 
        algorithm=item.algorithm, 
        sequenceFilePath=item.sequenceFilePath, 
        kmers=item.kmers,
        batch_size=item.batch_size,
        status=item.status,
        created_at=item.created_at
    ) for item in all_results]

@router.get("/{id}")
async def pca(id: str, session: Session = Depends(get_db)):
    stmt = select(schemas.DimReduction).where(schemas.DimReduction.id == id)
    result: Result = await session.execute(stmt)
    pca_result: schemas.DimReduction = result.scalar_one_or_none()
    if not pca_result:
        return Response("Job ID not found", status_code=404)
    if pca_result.status == CeleryStatus.COMPLETED.value:
        df_2d = pd.read_csv(os.path.join(pca_result.sequenceFilePath, 'pca_2.csv'))
        df_3d = pd.read_csv(os.path.join(pca_result.sequenceFilePath, 'pca_3.csv'))
        title = pca_result.title

        # 2d
        labels = df_2d['label'].unique()
        pca_2d_dict = {}
        for label in labels:
            df = df_2d[df_2d['label'] == label]
            item = {'x': df['pca1'].values.tolist(), 'y': df['pca2'].values.tolist(), 'name': label}
            pca_2d_dict[label] = item

        # 3d
        labels = df_3d['label'].unique()
        pca_3d_dict = {}
        for label in labels:
            df: pd.DataFrame = df_3d[df_3d['label'] == label]
            item = {'x': df['pca1'].values.tolist(), 'y': df['pca2'].values.tolist(), 'z': df['pca3'].values.tolist(), 'name': label}
            pca_3d_dict[label] = item

        return JSONResponse(content = {
            'title': title,
            '2d': pca_2d_dict, 
            '3d': pca_3d_dict,
            }, status_code=200)
    else:
        return Response("Job not completed", status_code=404)


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
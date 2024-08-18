from typing import Union
from celery import uuid
from fastapi import UploadFile
from ..enums.enums import CeleryStatus
import os
from pydantic import BaseModel
from ..worker.helper.GLPath import GLPath
from ..schemas import schemas
from ..worker import worker
from sqlalchemy.orm import Session
from ..schemas import schemas
    

async def add_jobs_to_db(params: BaseModel, session: Session, schema: schemas.ClustalwJobs | schemas.MuscleJobs, algorithm: str, output: str):

    # define new schema from params depending on the algorithm
    new_query = schema(
        **params.model_dump(exclude_none=True, exclude=['status', 'jobTitle'])
    )

    # define new AlignmentJob schema (stores non-algorithm specific data)
    new_alignment_job = schemas.AlignmentJobs(
        id=params.id, 
        jobTitle=params.jobTitle.replace(' ', '_'), 
        filepath=output, 
        created_at=params.created_at,
        status=params.status,
        algorithm=algorithm
    )

    # write to databases using async context manager
    async with session.begin():
        session.add(new_alignment_job)
        await session.commit()

    async with session.begin():
        session.add(new_query)
        await session.commit()

    return params.id
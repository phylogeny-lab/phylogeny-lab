import datetime
from typing import Union
from celery import uuid
from fastapi import UploadFile
from ..enums.enums import CeleryStatus
from ..schemas import schemas
from ..worker.helper.GLPath import GLPath
import os

async def create_new_blast_job(params, subjectFile: Union[UploadFile, None], queryFile: Union[UploadFile, None]):
    # create an id based on name and timestamp: id <- id(jobTitle + now())
    blast_id = uuid()
        
    # set other metadata
    params.id = blast_id
    params.status = CeleryStatus.STARTED.value
    params.created_at = datetime.datetime.now()

    if subjectFile:
        gl_subject_path = GLPath(path=os.path.join(os.getenv('VOLUME_DIR'), 'blast', blast_id, 'subject', subjectFile.filename), makedirs=True)
        params.subject = gl_subject_path.local
    if queryFile:
        gl_query_path = GLPath(path=os.path.join(os.getenv('VOLUME_DIR'), 'blast', blast_id, 'query', subjectFile.filename), makedirs=True)
        params.query = gl_query_path.local

    return params
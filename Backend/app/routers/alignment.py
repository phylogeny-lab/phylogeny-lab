import json
import os
from typing import Annotated, List, Union
from fastapi import APIRouter, Depends, Form, Request, Response, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from ..config.database import get_db
from ..models.ClustalwParams import ClustalwParams
from ..models.MuscleParams import MuscleParams
from celery import uuid
from ..schemas import schemas
from ..enums.enums import CeleryStatus
from ..models.AlignmentJobs import AlignmentJobs
from ..worker.helper.GLPath import GLPath
from ..worker import worker
from ..utils.alignment import add_jobs_to_db
from ..utils.consts import extension_map

router = APIRouter(
    prefix="/api/alignment",
    tags=['clustalw', 'muscle', 'alignment']
)

# Execute new clustal alignment
@router.post("/clustalw")
async def clustalw(
    data: Annotated[str, Form()], 
    infile: Union[UploadFile, None] = None, 
    matrixfile: Union[UploadFile, None] = None,
    dnamatrixfile: Union[UploadFile, None] = None,
    session: Session = Depends(get_db)
    ):

    try:

        if not infile:
            return Response(content="No infile", status_code=400)

        # convert raw params to dict and validate the model
        model_dict = json.loads(data)
        clustalw_params = ClustalwParams.model_validate(model_dict)

        alignment_id = uuid()
        clustalw_params.id = alignment_id
        clustalw_params.status = CeleryStatus.STARTED.value
        
        # set infile path to be stored in database, then save to tmp directory
        gl_infile_path = GLPath(path=os.path.join(os.getenv('VOLUME_DIR'), 'alignments', alignment_id, 'infiles', infile.filename), makedirs=True)
        clustalw_params.infile = gl_infile_path.local
        # if worker is running on a different machine to the api, we must upload to filestore
        if os.getenv('SEPARATE_WORKER_API_VOLUME') == 'true':
            gl_infile_path.upload_to_filestore(file=infile.file) 
        else:
            gl_infile_path.save_locally(file=infile)

        # attach extension for output file depending on user's choice
        ext = extension_map[clustalw_params.output]
        # do something similar for outfile
        gl_outfile_path = GLPath(path=os.path.join(os.getenv('VOLUME_DIR'), 'alignments', clustalw_params.id, 'outfiles', f'aligned.{ext}'), makedirs=True)
        clustalw_params.outfile = gl_outfile_path.local

        # Send job to Celery, Celery ID will be the same as ID in databases
        worker.clustalw.apply_async((
            clustalw_params.model_dump(exclude_none=True, exclude=['status', 'jobTitle', 'id']), clustalw_params.id), task_id=clustalw_params.id)

        id = await add_jobs_to_db(
            params=clustalw_params,
            session=session, 
            schema=schemas.ClustalwJobs,
            algorithm='clustalw',
            output=clustalw_params.outfile
        )

        return Response(id, status_code=200)
    
    except Exception as e:

        return Response(e, status_code=500)


# Execute new Muscle alignment
@router.post("/muscle")
async def muscle(
    data: Annotated[str, Form()], 
    infile: Union[UploadFile, None] = None, 
    session: Session = Depends(get_db)
    ):

    try:

        if not infile:
            return Response(content="No infile", status_code=400)
        
        # convert raw params to dict and validate the model
        model_dict = json.loads(data)
        muscle_params = MuscleParams.model_validate(model_dict)

        alignment_id = uuid()
        muscle_params.id = alignment_id
        muscle_params.status = CeleryStatus.STARTED.value
        
        # set infile path to be stored in database, then save to tmp directory
        gl_infile_path = GLPath(path=os.path.join(os.getenv('VOLUME_DIR'), 'alignments', alignment_id, 'infiles', infile.filename), makedirs=True)
        muscle_params.input = gl_infile_path.local
        # if worker is running on a different machine to the api, we must upload to filestore
        if os.getenv('SEPARATE_WORKER_API_VOLUME') == 'true':
            gl_infile_path.upload_to_filestore(file=infile.file) 
        else:
            gl_infile_path.save_locally(file=infile)

        # attach extension for output file depending on user's choice
        ext = extension_map[muscle_params.outformat]
        # do something similar for outfile
        gl_outfile_path = GLPath(path=os.path.join(os.getenv('VOLUME_DIR'), 'alignments', muscle_params.id, 'outfiles', f'aligned.{ext}'), makedirs=True)
        muscle_params.out = gl_outfile_path.local

        # Send job to Celery, Celery ID will be the same as ID in databases
        worker.muscle.apply_async((
            muscle_params.model_dump(exclude_none=True, exclude=['status', 'jobTitle', 'id', 'outformat']), muscle_params.id), task_id=muscle_params.id)

        id = await add_jobs_to_db(
            params=muscle_params,
            session=session, 
            schema=schemas.MuscleJobs,
            algorithm='muscle',
            output=muscle_params.out
        )

        return Response(id, status_code=200)
    
    except Exception as e:

        return Response(e, status_code=500)


# Fetch all current jobs, or specific job if ID is supplied
@router.get("/")
async def blastn(req: Request, session: Session = Depends(get_db)) -> List[AlignmentJobs]:

    stmt = select(schemas.AlignmentJobs)
    result = await session.execute(stmt)
    alignment_jobs = result.scalars().all()

    return [AlignmentJobs(
        id=item.id,
        jobTitle=item.jobTitle, 
        algorithm=item.algorithm, 
        status=item.status, 
        created_at=item.created_at
    ) for item in alignment_jobs]


@router.get("/download/{task_id}") 
async def download(task_id: str, session: Session = Depends(get_db)) -> FileResponse:

    stmt = select(schemas.AlignmentJobs).where(schemas.AlignmentJobs.id == task_id)
    result = await session.execute(stmt)
    record: schemas.AlignmentJobs = result.scalar_one()
    tmp_file = GLPath(record.filepath, makedirs=True)
    tmp_file.download_from_filestore()

    return FileResponse(
        tmp_file.local, 
        content_disposition_type="attachment",
        media_type='text/plain', 
        filename=f"{record.jobTitle}_{tmp_file.filename}"
    )


@router.put("/{task_id}")
async def update_status(task_id: str, new_status: str, session: Session = Depends(get_db)):
    stmt = update(schemas.AlignmentJobs).where(schemas.AlignmentJobs.id == task_id).values(status=new_status)
    result = await session.execute(stmt)
    await session.commit()
    return task_id
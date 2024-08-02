import json
import os
from typing import Annotated, List, Union
from fastapi import APIRouter, Depends, Form, Request, Response, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from ..worker import worker
from ..config.database import get_db
from ..models.ClustalwParams import ClustalwParams
from ..worker.helper.utils import save_file
from celery import uuid
from ..schemas import schemas
from ..enums.enums import CeleryStatus
from ..models.AlignmentJobs import AlignmentJobs
from ..worker.helper.minio_utils import upload_file, download_file
from ..worker.helper.GLPath import GLPath

router = APIRouter(
    prefix="/api/alignment",
    tags=['clustalw', 'muscle', 'alignment']
)

# Execute new blast query
@router.post("/clustalw")
async def clustalw(
    data: Annotated[str, Form()], 
    infile: Union[UploadFile, None] = None, 
    matrixfile: Union[UploadFile, None] = None,
    dnamatrixfile: Union[UploadFile, None] = None,
    session: Session = Depends(get_db)
    ):

    if not infile:
        return Response(content="No infile", status_code=400)

    # convert raw params to dict and validate the model
    model_dict = json.loads(data)
    clustalw_params = ClustalwParams.model_validate(model_dict)

    # create unique ID and add `started` status
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
    extension_map = {'CLUSTAL': 'aln', 'FASTA': 'fasta', 'NEXUS': 'nex', 'PHYLIP': 'ph', 'PIR': 'pir', 'GDE': 'gde', 'GCE': 'gce'}
    ext = extension_map[clustalw_params.output]
    # do something similar for outfile
    gl_outfile_path = GLPath(path=os.path.join(os.getenv('VOLUME_DIR'), 'alignments', alignment_id, 'outfiles', f'aligned.{ext}'), makedirs=True)
    clustalw_params.outfile = gl_outfile_path.local

    # define new ClustalwJob schema from params
    new_clustalw_query = schemas.ClustalwJobs(
        **clustalw_params.model_dump(exclude_none=True, exclude=['status', 'jobTitle'])
    )

    # define new AlignmentJob schema (stores non-algorithm specific data)
    new_alignment_job = schemas.AlignmentJobs(
        id=clustalw_params.id, 
        jobTitle=clustalw_params.jobTitle.replace(' ', '_'), 
        filepath=gl_outfile_path.minio, 
        created_at=clustalw_params.created_at,
        status=clustalw_params.status,
        algorithm='clustalw'
    )

    # Send job to Celery, Celery ID will be the same as ID in databases
    worker.clustalw.apply_async((
        clustalw_params.model_dump(exclude_none=True, exclude=['status', 'jobTitle', 'id']), alignment_id), task_id=alignment_id)

    # write to databases using async context manager
    async with session.begin():
        session.add(new_alignment_job)
        await session.commit()

    async with session.begin():
        await session.refresh(new_alignment_job)

    async with session.begin():
        session.add(new_clustalw_query)
        await session.commit()

    return Response("success", status_code=200)


# Fetch all current jobs, or specific job if ID is supplied
@router.get("/")
async def blastn(req: Request, session: Session = Depends(get_db)) -> List[AlignmentJobs]:

    stmt = select(schemas.AlignmentJobs)
    result = await session.execute(stmt)
    alignment_jobs = result.scalars().all()

    return [AlignmentJobs(
        id=item.id,
        jobTitle=item.jobTitle, 
        algorithm='clustalw', 
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
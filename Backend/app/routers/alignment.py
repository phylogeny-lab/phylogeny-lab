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
from ..helper.utils import save_file
from celery import uuid
from ..schemas import schemas
from ..enums.enums import CeleryStatus
from ..models.AlignmentJobs import AlignmentJobs

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

    model_dict = json.loads(data)

    clustalw_params = ClustalwParams.model_validate(model_dict)

    alignment_id = uuid()
    clustalw_params.id = alignment_id
    clustalw_params.status = CeleryStatus.STARTED.value

    root_path = os.getenv('ALIGNMENTS_SAVE_DIR')

    if not os.path.isdir(os.path.join(root_path, alignment_id)):
        os.makedirs(os.path.join(root_path, alignment_id, "infiles"))
        os.makedirs(os.path.join(root_path, alignment_id, "outfiles"))
    else: 
        return Response("ID already exists", status_code=500)
    
    
    infile_path = os.path.join(root_path, alignment_id, "infiles", infile.filename
    .replace(' ', '_').replace('(', '_').replace(')', '_'))
    
    await save_file(infile, infile_path)

    if matrixfile:
        matrix_path = os.path.join(root_path, alignment_id, "infiles", matrixfile.filename)
        await save_file(matrixfile, matrix_path)
        clustalw_params.matrix = matrix_path

    if dnamatrixfile:
        dnamatrix_path = os.path.join(root_path, alignment_id, "infiles", dnamatrixfile.filename)
        await save_file(dnamatrixfile, dnamatrix_path)
        clustalw_params.dnamatrix = dnamatrix_path

    clustalw_params.infile = infile_path

    extension_map = {'CLUSTAL': 'aln', 'FASTA': 'fasta', 'NEXUS': 'nex', 'PHYLIP': 'ph', 'PIR': 'pir', 'GDE': 'gde', 'GCE': 'gce'}
    ext = extension_map[clustalw_params.output]
    clustalw_params.outfile = os.path.join(root_path, alignment_id, "outfiles", f"aligned.{ext}")

    new_clustalw_query = schemas.ClustalwJobs(
        **clustalw_params.model_dump(exclude_none=True, exclude=['status', 'jobTitle'])
    )

    new_alignment_job = schemas.AlignmentJobs(
        id=clustalw_params.id, 
        jobTitle=clustalw_params.jobTitle.replace(' ', '_'), 
        filepath=clustalw_params.outfile, 
        created_at=clustalw_params.created_at,
        status=clustalw_params.status,
        algorithm='clustalw'
    )

    worker.clustalw.apply_async((clustalw_params.model_dump(exclude_none=True, exclude=['status', 'jobTitle', 'id']), alignment_id), task_id=alignment_id)

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
    return FileResponse(
        record.filepath, 
        content_disposition_type="attachment",
        media_type='text/plain', 
        filename=f"{record.jobTitle}_{record.filepath.split('/')[-1]}"
    )


@router.put("/{task_id}")
async def update_status(task_id: str, new_status: str, session: Session = Depends(get_db)):
    stmt = update(schemas.AlignmentJobs).where(schemas.AlignmentJobs.id == task_id).values(status=new_status)
    result = await session.execute(stmt)
    await session.commit()
    return task_id
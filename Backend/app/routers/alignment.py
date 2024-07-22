import json
import os
from typing import Annotated, Union
from fastapi import APIRouter, Depends, Form, Response, UploadFile
from sqlalchemy.orm import Session
from ..worker import worker
from ..config.database import get_db
from ..models.ClustalwParams import ClustalwParams
from ..helper.utils import save_file
from celery import uuid

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
    db: Session = Depends(get_db)
    ):

    if not infile:
        return Response(content="No infile", status_code=400)

    model_dict = json.loads(data)
    clustalw_params =  ClustalwParams.model_validate(model_dict)
    alignment_id = uuid()

    root_path = os.getenv('ALIGNMENTS_SAVE_DIR')

    if not os.path.isdir(os.path.join(root_path, alignment_id)):
        os.makedirs(os.path.join(root_path, alignment_id, "infiles"))
        os.makedirs(os.path.join(root_path, alignment_id, "outfiles"))
    else: 
        return Response("ID already exists", status_code=500)
    
    
    infile_path = os.path.join(root_path, alignment_id, "infiles", infile.filename.replace('(', '_').replace(')', '_'))
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

    clustalw_params.outfile = os.path.join(root_path, alignment_id, "outfiles", "aligned")

    worker.clustalw.apply_async((clustalw_params.model_dump(exclude_none=True), alignment_id), task_id=alignment_id)
    return Response("success", status_code=200)
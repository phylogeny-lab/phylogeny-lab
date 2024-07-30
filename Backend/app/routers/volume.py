import io
import uuid
from fastapi import APIRouter, Request, Response
import os

from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from ..worker.helper.utils import create_folder_structure_json, sendzipfile
from ..worker.helper.minio import upload_file, download_file, list_files
import json
import zipfile

router = APIRouter(
    prefix="/api/volume",
    tags=['Volume']
)


@router.post('/minio')
def minio_upload():
    data = {'test': 123}
    res = upload_file('123.txt', json.dumps(data))

    return JSONResponse(res)

@router.get('/request')
def minio_download(req: Request):
    files = req.query_params.get('files')
    files = json.loads(files)
    tmp_uid = uuid.uuid4().hex
    os.mkdir(f'/tmp/{tmp_uid}')

    for file in files:
        res = download_file(file.replace("\"", ""), f'/tmp/{tmp_uid}/{file}') #TODO: fix
    return JSONResponse({'request_id': tmp_uid}, status_code=200)

@router.get('/download/{request_id}')
def download(request_id):
    return sendzipfile(filepath=f"/tmp/{request_id}")
            

@router.get('/')
def volume() -> JSONResponse:
    result = list_files(prefix='', recursive=True)
    
    return JSONResponse(content=result, status_code=200)

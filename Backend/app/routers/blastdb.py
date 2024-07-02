import shlex
import subprocess
import threading
import uuid
import os
from fastapi import FastAPI, File, Query, Request, Response, UploadFile, status, HTTPException, Depends, APIRouter, Form, BackgroundTasks
from typing import Annotated, Union
from fastapi.responses import FileResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
import random

from ..models.BlastParams import BlastParams
from ..models.Blastdb import Blastdb
from ..models.Database import Database
from ..config.database import get_db
from ..schemas import schemas
from ..helper.install_databases import install_databases
from ..helper.utils import save_file
from pathlib import Path
from subprocess import Popen, PIPE
import json
import requests

router = APIRouter(
    prefix="/api/blastdb",
    tags=['ncbi', 'db']
)

# Get local blast database information from the metadata command
# @router.get("/metadata")
# async def ncbidb(req: Request) -> list[Database]:
     
#     db_name = req.query_params.get('db_name')
#     blast_db_location = os.path.join('/', os.environ['BLASTDB'])
#     metadata_list: list[Database] = []

#     if db_name:
#         path = os.path.join(blast_db_location, db_name)
#         if os.path.exists(path):
#             metadata = get_db_metadata(db_path=path, verbose=False)
#             metadata_list.append(Database(name=db_name, metadata=json.dumps(metadata)))
#         else:
#             return Response(content="Internal server error", status_code=500) 
#     else:

#         db_files = [name for name in os.listdir(blast_db_location) if os.path.isdir(os.path.join(blast_db_location, name))]
#         if len(db_files) == 0:
#             return Response(content="Internal server error", status_code=500) 
#         for db_name in db_files:
#             # db file names may differ from parent directory name, so we need to get the base 
#             cmd = ["blastdbcmd", "-list", f"{blast_db_location}/{db_name}"]
#             (stdout, stderr) = Popen(cmd, stdout=PIPE, stderr=PIPE).communicate()
#             if stdout:
#                 base_prefix = stdout.decode().split(" ")[0]

#             if stderr:
#                 print(stderr.decode())
#                 return Response(content="Internal server error", status_code=500) 

#             metadata = get_db_metadata(db_path=base_prefix, verbose=False)
#             metadata_list.append(Database(name=db_name, metadata=json.dumps(metadata)))
    
#     return metadata_list


@router.post("/custom")
async def customdb(
    data: Annotated[str, Form()], 
    sequenceFile: Union[UploadFile, None] = None,
    db: Session = Depends(get_db)):

    model_dict = json.loads(data)

    print(model_dict)
    db_params =  Blastdb.model_validate(model_dict)

    if not os.path.isdir(os.getenv('NCBI_DATABASE_DIR')):
        os.mkdir(os.getenv('NCBI_DATABASE_DIR'))
    os.chdir(os.getenv('NCBI_DATABASE_DIR'))

    filepath = db_params.dbname.replace(" ", "_").lower()
    if os.path.isdir(filepath):
        return Response("Database name exists", status_code=409)
    
    os.mkdir(db_params.dbname)


        # save files in chunked manner so as not to load entire file into memory
    if sequenceFile:
        print("found file")
        sequenceFilepath = os.path.join(db_params.dbname, sequenceFile.filename)
        await save_file(file=sequenceFile, out_file_path=sequenceFilepath)

    db_params.id = str(uuid.uuid4())
    db_params.status = 'installed'  
    db_params.ncbidb = False
    db_params.filepath = filepath

    new_db = schemas.BlastDB(**db_params.model_dump())
    db.add(new_db)
    db.commit()

    return Response("Added", status_code=200)



# Download a db
@router.post("/ncbi")
async def ncbidb(req: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):

    try:

        body = await req.body()

        databases = json.loads(body.decode())

        databases = databases['databases']

        if not os.path.isdir(os.getenv('NCBI_DATABASE_DIR')):
            os.mkdir(os.getenv('NCBI_DATABASE_DIR'))
        os.chdir(os.getenv('NCBI_DATABASE_DIR'))


        
        background_tasks.add_task(install_databases, databases, db)

        for database in databases:
            new_db = schemas.BlastDB(
                id=database,
                dbname="fll;fdm",
                status="installing",
                ncbidb=True,
            )

            db.add(new_db)
            db.commit()

        return Response("success", status_code=200)
    
    except Exception as e:
        return Response("Could not download database", status_code=500)


# Get custom databases
@router.get("/custom")
async def customdb(req: Request, db: Session = Depends(get_db)) -> List[Blastdb]:
    custom_dbs = db.query(schemas.BlastDB).where(schemas.BlastDB.ncbidb == False).all()

    return [Blastdb(id=item.id, dbname=item.dbname, status=item.status, ncbidb=item.ncbidb) for item in custom_dbs]


# Get ncbi blast database information
@router.get("/ncbi")
async def ncbidb(req: Request, db: Session = Depends(get_db)):
    
    with open('/code/app/routers/metazoa.json') as f:
        metazoa = json.load(f)

    with open('/code/app/routers/vir.json') as f:
        vir = json.load(f)
    
    
    total = metazoa['reports'] + vir['reports']

    # fetched installed NCBI databases
    ncbi_databases = db.query(schemas.BlastDB).where(schemas.BlastDB.ncbidb).all()
    for item in total:
        item['status'] = 'available'
        for ncbi_db in ncbi_databases:
            if item['accession'] == ncbi_db.id:
                item['status'] = ncbi_db.status
                
    return total


def install_databases(databases: List[str], db: Session):
    for database in databases:
        status_code = subprocess.call(shlex.split(f'/scripts/ncbi_database.install.sh {database}'))
        status = "installed" if status_code == 0 else "failed" 
        record = db.query(schemas.BlastDB).where(schemas.BlastDB.id == database).first()
        record.status = status
        db.add(record)
        db.commit()

        

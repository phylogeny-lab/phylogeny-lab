import shlex
import subprocess
import threading
import uuid
import os
from fastapi import FastAPI, File, Query, Request, Response, UploadFile, status, HTTPException, Depends, APIRouter, Form, BackgroundTasks
from typing import Annotated, Union
from fastapi.responses import FileResponse
from sqlalchemy import func, update
from sqlalchemy.orm import Session
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
import random
from sqlalchemy import select
from ..worker import worker
from ..models.BlastParams import BlastParams
from ..models.Blastdb import Blastdb
from ..models.Database import Database
from ..config.database import get_db
from ..schemas import schemas
from ..helper.utils import save_file
from pathlib import Path
from subprocess import Popen, PIPE
import json
import requests

router = APIRouter(
    prefix="/api/blastdb",
    tags=['ncbi', 'db']
)

@router.post("/custom")
async def customdb(
    data: Annotated[str, Form()], 
    sequenceFile: Union[UploadFile, None] = None,
    session: Session = Depends(get_db)):

    model_dict = json.loads(data)

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
    
    async with session.begin():
        stmt = session.add(new_db)
        await session.commit()

    return Response("Added", status_code=200)



# Download a db
@router.post("/ncbi")
async def ncbidb(req: Request, session: Session = Depends(get_db)):

    try:

        body = await req.body()

        databases = json.loads(body.decode())

        databases = databases['databases']

        if not os.path.isdir(os.getenv('NCBI_DATABASE_DIR')):
            os.mkdir(os.getenv('NCBI_DATABASE_DIR'))
        os.chdir(os.getenv('NCBI_DATABASE_DIR'))


        worker.install_ncbi_databases.delay(databases)
        

        for database in databases:
            new_db = schemas.BlastDB(
                id=database,
                dbname="fll;fdm",
                status="installing",
                ncbidb=True,
            )

            async with session.begin():
                session.add(new_db)
                await session.commit()

        return Response("success", status_code=200)
    
    except Exception as e:
        return Response("Could not download database", status_code=500)


# Get custom databases
@router.get("/custom")
async def customdb(req: Request, session: Session = Depends(get_db)) -> List[Blastdb]:
    stmt = select(schemas.BlastDB).where(schemas.BlastDB.ncbidb == False)
    result = await session.execute(stmt)
    custom_dbs = result.scalars().all()

    return [Blastdb(id=item.id, dbname=item.dbname, status=item.status, ncbidb=item.ncbidb) for item in custom_dbs]


# Get ncbi blast database information
@router.get("/ncbi")
async def ncbidb(req: Request, session: Session = Depends(get_db)):
    
    with open('/data/metazoa.json') as f:
        metazoa = json.load(f)

    with open('/data/vir.json') as f:
        vir = json.load(f)
    
    
    total = metazoa['reports'] + vir['reports']

    # fetched installed NCBI databases
    stmt = select(schemas.BlastDB).where(schemas.BlastDB.ncbidb)
    result = await session.execute(stmt)
    ncbi_databases = result.scalars().all()

    for item in total:
        item['status'] = 'available'
        if ncbi_databases:
            for ncbi_db in ncbi_databases:
                if item['accession'] == ncbi_db.id:
                    item['status'] = ncbi_db.status
                
    return total


@router.get("/installed")
async def get_installed_databases(session: Session = Depends(get_db)) -> List[Blastdb]:
    stmt = select(schemas.BlastDB).where(schemas.BlastDB.status == "installed")
    result = await session.execute(stmt)
    installed_databases = result.scalars().all()
    return [Blastdb(**item.__dict__) for item in installed_databases]

@router.put("/{database_id}")
async def update_status(database_id: str, new_status: str, session: Session = Depends(get_db)):
    stmt = update(schemas.BlastDB).where(schemas.BlastDB.id == database_id).values({'status': new_status})
    result = await session.execute(stmt)
    await session.commit()
    return database_id

        

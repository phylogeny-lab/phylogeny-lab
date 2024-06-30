import threading
import uuid
import os
from fastapi import FastAPI, File, Request, Response, UploadFile, status, HTTPException, Depends, APIRouter, Form
from typing import Annotated, Union
from fastapi.responses import FileResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
from pathlib import Path
from pydantic import BaseModel
from app.blast_python.src.blast_python.Blastn import Blastn, OutFmt
from app.blast_python.src.blast_python.utils import get_db_metadata
from typing import List, Optional
from ..helper.utils import save_file
from ..models.BlastParams import BlastParams
from ..models.BlastJobs import BlastJobs
from ..models.BlastResults import BlastOutput
from ..config.database import get_db
from ..schemas import schemas
from ..enums.BlastQueryStatus import BlastQueryStatus
from pathlib import Path
from subprocess import Popen, PIPE
import json
import datetime
import xmltodict
from fastapi.responses import JSONResponse


router = APIRouter(
    prefix="/api/blast",
    tags=['Blast']
)

# Execute new blast query
@router.post("/blastn")
async def blastn(
    data: Annotated[str, Form()], 
    subjectFile: Union[UploadFile, None] = None, 
    queryFile: Union[UploadFile, None] = None, 
    db: Session = Depends(get_db)
    ):
        
        model_dict = json.loads(data)
        blast_params =  BlastParams.model_validate(model_dict)

        # create an id based on name and timestamp: id <- id(jobTitle + now())
        now = datetime.datetime.now()
        blast_id = id(blast_params.jobTitle + str(now))
        blast_id = str(blast_id) # must be str for os.path
        
        # set other metadata
        blast_params.id = blast_id

        blast_params.status = BlastQueryStatus.IN_PROGRESS.value
        blast_params.created_at = datetime.datetime.now()

        # create root dir with id as filename
        save_dir = os.getenv('BLAST_SAVE_DIR')
        if not os.path.isdir(save_dir):
             os.mkdir(save_dir)

        # create sub directories
        os.mkdir(os.path.join(save_dir, blast_id))
        os.mkdir(os.path.join(save_dir, blast_id, "results"))
        os.mkdir(os.path.join(save_dir, blast_id, "subject"))
        os.mkdir(os.path.join(save_dir, blast_id, "query"))

        # save files in chunked manner so as not to load entire file into memory
        if subjectFile:
            subjectFilepath = os.path.join(save_dir, blast_id, "subject", subjectFile.filename)
            await save_file(file=subjectFile, out_file_path=subjectFilepath)
            subjectFile = subjectFilepath

        if queryFile:
            queryFilepath = os.path.join(save_dir, blast_id, "query", queryFile.filename)
            await save_file(file=queryFile, out_file_path=queryFilepath)
            queryFile = queryFilepath


        new_query = schemas.BlastQueries(
            **blast_params.model_dump(exclude={'subjectSequence', 'querySequence'})
        )

        db.add(new_query)

        # locate database
        # TODO
        
        def run_blast():
            try:
                results_file_xml = os.path.join(save_dir, blast_id, "results", "results.xml")
                results_file_json = os.path.join(save_dir, blast_id, "results", "results.json")

                (return_code, _) = Blastn(
                    db=blast_params.db,
                    subject=blast_params.subjectSequence or subjectFile,
                    entrez_query=blast_params.entrezQuery,
                    query=blast_params.querySequence or queryFile,
                    reward=blast_params.reward,
                    penalty=blast_params.penalty,
                    gapextend=blast_params.gapextend,
                    gapopen=blast_params.gapopen,
                    outfmt=OutFmt.XML.value,
                    word_size=blast_params.word_size,
                    out=results_file_xml,
                    ungapped=blast_params.ungapped
                ).run(verbose=True)

                if return_code == 0: # success

                    # save file in json format

                    with open(results_file_xml) as fd:
                        json_parse = xmltodict.parse(fd.read())

                        with open(results_file_json, "w") as f:
                            f.write(json.dumps(json_parse, indent=2))

                    db.query(schemas.BlastQueries) \
                    .filter(schemas.BlastQueries.id == blast_id) \
                    .update({'status': BlastQueryStatus.COMPLETED.value})

                else:
                    db.query(schemas.BlastQueries) \
                    .filter(schemas.BlastQueries.id == blast_id) \
                    .update({'status': BlastQueryStatus.FAILED.value})
                
                db.commit()

            except Exception as e:

                print(e)



        # We run the blast search in a different thread so that queries which take a long
        # time doesn't leave the client hanging. The client can poll the server for updates
        x = threading.Thread(target=run_blast, daemon=True)
        x.start()

        db.commit()

        return Response(content="success", media_type="application/json", status_code=200)


@router.post("/rerun/{id}")
async def rerun(id: int, db: Session = Depends(get_db)):

    id = str(id)

    job = db.query(schemas.BlastQueries).filter(schemas.BlastQueries.id == id).first()

    return Response(content="success", status_code=200)



# Fetch all current jobs, or specific job if ID is supplied
@router.get("/")
async def blastn(req: Request, db: Session = Depends(get_db)) -> List[BlastJobs]:

    jobs = db.query(schemas.BlastQueries).all()

    return [BlastJobs(
        id=item.id,
        jobTitle=item.jobTitle, 
        algorithm=item.algorithm, 
        db=item.db, 
        status=item.status, 
        created_at=item.created_at
    ) for item in jobs]

# Fetch all information pertaining to single ID
@router.get("/{id}")
async def blast(id: int, db: Session = Depends(get_db)):

    id = str(id)

    job = db.query(schemas.BlastQueries).filter(schemas.BlastQueries.id == id).first()

    return job


# Fetch results for blast queries
@router.get("/results/{id}")
async def results(id: int, db: Session = Depends(get_db)):

    if not isinstance(id, int):
        return Response(content="Error, bad id", status_code=400)
    
    save_dir = os.getenv('BLAST_SAVE_DIR')
    results_dir = os.path.join(save_dir, str(id), "results")
    results_json = os.path.join(results_dir, "results.json")
            

    with open(results_json, "r") as f:
        json_parse = json.loads(f.read())

    return JSONResponse(content=json_parse)
    


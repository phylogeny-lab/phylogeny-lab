import json
import os
import time
from fastapi import UploadFile
import aiofiles

from celery import Celery
from fastapi import UploadFile
import xmltodict
import sys

from blast_python.src.blast_python import Blastn
from blast_python.src.blast_python.types import OutFmt

from helper import create_job_files

#from Backend.app.models.BlastParams import BlastParams

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379")


@celery.task(name="run_blastn")
async def run_blastn(params, id, subjectFile: UploadFile, queryFile: UploadFile):

        save_dir = os.getenv('BLAST_SAVE_DIR')

        (results_file_json, results_file_xml) = create_job_files(
             job_id=id, save_dir=save_dir, subjectFile=subjectFile, queryFile=queryFile
        )
        
        (return_code, _) = Blastn(
            db=params.db,
            subject=params.subjectSequence or subjectFile,
            entrez_query=params.entrezQuery,
            query=params.querySequence or queryFile,
            reward=params.reward,
            penalty=params.penalty,
            gapextend=params.gapextend,
            gapopen=params.gapopen,
            outfmt=OutFmt.XML.value,
            word_size=params.word_size,
            out=results_file_xml,
            ungapped=params.ungapped
            ).run(verbose=True)

        if return_code == 0: # success

            # save file in json format

            with open(results_file_xml) as fd:
                json_parse = xmltodict.parse(fd.read())

            with open(results_file_json, "w") as f:
                f.write(json.dumps(json_parse, indent=2))

            return True

        else:
            return False
        



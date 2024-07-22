import asyncio
import os
import shlex
import time
from urllib.parse import urljoin
from celery import Celery

from blast_python.src.blast_python.Blastn import Blastn
from blast_python.src.blast_python.types import OutFmt
from helper import api_update_request
import subprocess

from Bio.Align.Applications import ClustalwCommandline

celery = Celery(__name__)

# Config file
default_config = 'celeryconfig'
celery.config_from_object(default_config)

API_ENDPOINT = os.getenv('API_ENDPOINT')

@celery.task(name="blastn")
def blastn(params, id):

        save_dir = os.getenv('BLAST_SAVE_DIR')
        results_file_xml = os.path.join(save_dir, id, "results", "results.xml")
        results_file_json = os.path.join(save_dir, id, "results", "results.json")
        
        
        try:
            (return_code, message) = Blastn(
                db=params['db'],
                subject=params['subject'],
                entrez_query=params['entrezQuery'],
                query=params['query'],
                reward=params['reward'],
                penalty=params['penalty'],
                gapextend=params['gapextend'],
                gapopen=params['gapopen'],
                outfmt=OutFmt.XML.value,
                word_size=params['word_size'],
                out=results_file_xml,
                ungapped=params['ungapped']
                ).run(verbose=True)
            

            
            if return_code == 0: # success

                # save file in json format

                asyncio.run(api_update_request(url = API_ENDPOINT + '/blast/' + str(id), params = {'new_status': 'Success'}))
                return True

            else:

                asyncio.run(api_update_request(url = API_ENDPOINT + '/blast/' + str(id), params = {'new_status': 'Failed'}))
                raise Exception(f"Process failed: {message}")
            
        except Exception as e:
             
            asyncio.run(api_update_request(url = API_ENDPOINT + '/blast/' + str(id), params = {'new_status': 'Failed'}))
            raise Exception(e)

        
@celery.task(name="clustalw")
def clustalw(params, id):

    clustalw_cline = ClustalwCommandline(cmd="clustalw", **params)

    proc: subprocess.CompletedProcess[str] = subprocess.run(
        str(clustalw_cline),
        capture_output=True,
        text=True,
        shell=True
    )
    data = proc.stdout
    err = proc.stderr
    return_code = proc.returncode

    if return_code == 0:
        asyncio.run(api_update_request(url = API_ENDPOINT + '/alignment/' + str(id), params = {'new_status': 'Success'}))
        return True
    
    else:
        asyncio.run(api_update_request(url = API_ENDPOINT + '/alignment/' + str(id), params = {'new_status': 'Failed'}))
        raise Exception(f"Process failed: {err}")
         
        
@celery.task(name="install_ncbi_databases", bind=True, autoretry_for=(Exception,), retry_kwargs={'max_retries': 3, 'countdown': 5})
def install_ncbi_databases(databases):

    try:
        for database in databases:

            status_code = subprocess.call(shlex.split(f'/scripts/ncbi_database.install.sh {database}'))
            
            if status_code != 0:
                raise Exception("Error installing databases") #TODO: add output from shell
            
            else:
                asyncio.run(api_update_request(url = API_ENDPOINT + '/blastdb/' + database, params = {'new_status': 'installed'}))
            
        
        return True
    
    except Exception as e:
        raise Exception(e)



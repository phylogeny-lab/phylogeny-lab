import json
import os
import time
import aiofiles
from urllib.parse import urljoin
from celery import Celery
import xmltodict
import sys
import requests

from blast_python.src.blast_python.Blastn import Blastn
from blast_python.src.blast_python.types import OutFmt
from helper import api_update_request

celery = Celery(__name__)

# Config file
default_config = 'celeryconfig'
celery.config_from_object(default_config)

@celery.task(name="run_blastn")
def run_blastn(params, id):

        save_dir = os.getenv('BLAST_SAVE_DIR')
        results_file_xml = os.path.join(save_dir, id, "results", "results.xml")
        results_file_json = os.path.join(save_dir, id, "results", "results.json")
        API_ENDPOINT = os.getenv('API_ENDPOINT')
        
        
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

            response = api_update_request(url = API_ENDPOINT + '/blast/' + str(id), params = {'new_status': 'Success'})
            
            return True

        else:
            response = api_update_request(url = API_ENDPOINT + '/blast/' + str(id), params = {'new_status': 'Failed'})
            
            raise Exception(f"Process failed: {message}")
        
@celery.task(name="run_clustalw")
def run_clustalw(params, id):
    time.sleep(640)
    return True




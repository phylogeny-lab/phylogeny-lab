import asyncio
import binascii
import os
import shlex
import shutil
import time
from typing import BinaryIO, List
from urllib.parse import urljoin
from celery import Celery

from blast_python.src.blast_python.Blastn import Blastn
from blast_python.src.blast_python.types import OutFmt
from helper.utils import api_update_request, delete_record
from helper.GLPath import GLPath
import subprocess

from Bio.Align.Applications import ClustalwCommandline

from helper.minio import download_file, upload_file

celery = Celery(__name__)

# Config file
default_config = 'celeryconfig'
celery.config_from_object(default_config)

API_ENDPOINT = os.getenv('API_ENDPOINT')

@celery.task(name="blastn")
def blastn(params, id, subjectfile: str, queryfile: str):
        
    

        results_file_xml = GLPath(parent='blast', id=id, subdir='results', filename='results.xml')

        with open(params['subject'], 'wb') as file:
            file.write(subjectfile.encode("utf-8"))

        with open(params['query'], 'wb') as file:
            file.write(queryfile.encode("utf-8"))
        
        
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

                # upload to minio
                with open(results_file_xml, 'rb') as file:
                    upload_file(results_file_xml.minio, data=file)

                asyncio.run(api_update_request(url = API_ENDPOINT + '/blast/' + str(id), params = {'new_status': 'Success'}))
                return True

            else:

                asyncio.run(api_update_request(url = API_ENDPOINT + '/blast/' + str(id), params = {'new_status': 'Failed'}))
                raise Exception(f"Process failed: {message}")
            
        except Exception as e:
             
            asyncio.run(api_update_request(url = API_ENDPOINT + '/blast/' + str(id), params = {'new_status': 'Failed'}))
            raise Exception(e)

        
@celery.task(name="clustalw")
def clustalw(params, id, infile: bytes):

    try:

        f = open(params['infile'], 'wb')
        write_chrs = f.write(infile)
        f.close()

        if write_chrs > 0:

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

                
                with open(params['outfile'], 'rb') as file:
                    gl_outfile_path = GLPath.parse(params['outfile'])
                    upload_file(file_path=gl_outfile_path.minio, data=file)
                
                with open(params['infile'], 'rb') as file:
                    gl_infile_path = GLPath.parse(params['infile'])
                    upload_file(file_path=gl_infile_path.minio, data=file)

                # TODO: matrix or DNA matrix custom files could also be upload, although these are passed into the same slots as built-in matrices

                # remove temporary files
                shutil.rmtree(os.path.join('/tmp', 'alignments', id), ignore_errors=True)

                asyncio.run(api_update_request(url = API_ENDPOINT + '/alignment/' + str(id), params = {'new_status': 'Success'}))

                return True
            
            else:
                asyncio.run(api_update_request(url = API_ENDPOINT + '/alignment/' + str(id), params = {'new_status': 'Failed'}))
                raise Exception(f"Process failed: {err}")
            
        else: # if write failed
            raise Exception(f"File write failed, {params['infile']}")
        
    except Exception as e:
        asyncio.run(api_update_request(url = API_ENDPOINT + '/alignment/' + str(id), params = {'new_status': 'Failed'}))
        raise Exception(e)
         
        
@celery.task(name="install_ncbi_databases", bind=True, autoretry_for=(Exception,), retry_kwargs={'max_retries': 2, 'countdown': 5})
def install_ncbi_databases(self, databases: List[str]):

    try:

        for database in databases:

            accession = database.split('|')[0].lstrip()

            status_code = subprocess.call(shlex.split(f'/scripts/ncbi_database.install.sh {accession}'))
            
            if status_code != 0:
                if (self.request.retries >= self.max_retries):
                    asyncio.run(delete_record(url = API_ENDPOINT + '/blastdb/' + accession))
                    raise Exception(f"Error installing database, {database}") 
                
                raise Exception(f"Error installing database {database}") 
            
            asyncio.run(api_update_request(url = API_ENDPOINT + '/blastdb/' + accession, params = {'new_status': 'installed'}))
            
        
        return True
    
    except Exception as e:
        raise Exception(e)



import asyncio
import binascii
import os
from pathlib import Path
import shlex
import shutil
import time
from typing import BinaryIO, List
from urllib.parse import urljoin
from celery import Celery

from blast_python.src.blast_python.Blastn import Blastn
from blast_python.src.blast_python.types import OutFmt
from helper.utils import api_update_request, delete_record, csv_to_json
from helper.GLPath import GLPath
from helper.ml import do_reduction
import subprocess

from Bio.Align.Applications import ClustalwCommandline, MuscleCommandline
from Bio import SeqIO

celery = Celery(__name__)

# Config file
default_config = 'celeryconfig'
celery.config_from_object(default_config)

API_ENDPOINT = os.getenv('API_ENDPOINT')

@celery.task(name="blastn")
def blastn(params, id):

        try:

            results_file_xml = GLPath(path=os.path.join(os.getenv('VOLUME_DIR'), 'blast', id, 'results', 'results.xml'))

            # if file does not exist locally, it might have been uploaded to file server
            # this would be the case if worker and api are running on different servers
            subject_path = params['subject']
            gl_subject_path = GLPath(subject_path, makedirs=True)
            if not os.path.isdir(gl_subject_path.head):
                gl_subject_path.download_from_filestore()

            # if file does not exist locally, it might have been uploaded to file server
            # this would be the case if worker and api are running on different servers
            query_path = params['query']
            gl_query_path = GLPath(query_path, makedirs=True)
            if not os.path.isdir(gl_query_path.head):
                gl_query_path.download_from_filestore()

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

                # write to minio
                with open(results_file_xml, 'rb') as file:
                    gl_outfile_path = GLPath(results_file_xml, makedirs=True)
                    gl_outfile_path.upload_to_filestore(file=file)

                asyncio.run(api_update_request(url = API_ENDPOINT + '/blast/' + id, params = {'new_status': 'Success'}))
                return True

            else:

                asyncio.run(api_update_request(url = API_ENDPOINT + '/blast/' + id, params = {'new_status': 'Failed'}))
                raise Exception(f"Process failed: {message}")
            
        except Exception as e:
            asyncio.run(api_update_request(url = API_ENDPOINT + '/blast/' + id, params = {'new_status': 'Failed'}))
            raise Exception(e)

        
@celery.task(name="clustalw")
def clustalw(params, id):

    try:

        # if file does not exist locally, it might have been uploaded to file server
        # this would be the case if worker and api are running on different servers
        infile_path = params['infile']
        gl_infile_path = GLPath(infile_path, makedirs=True)
        if not os.path.isdir(gl_infile_path.head):
            gl_infile_path.download_from_filestore()

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

            outfile_path = params['outfile']
            with open(outfile_path, 'rb') as file:
                gl_outfile_path = GLPath(outfile_path, makedirs=True)
                gl_outfile_path.upload_to_filestore(file=file)

            # remove temporary files
            shutil.rmtree(os.path.join(os.getenv('VOLUME_DIR'), 'alignments', id), ignore_errors=True)

            asyncio.run(api_update_request(url = API_ENDPOINT + '/alignment/' + str(id), params = {'new_status': 'Success'}))

            return True
             
        else:
            asyncio.run(api_update_request(url = API_ENDPOINT + '/alignment/' + str(id), params = {'new_status': 'Failed'}))
            raise Exception(f"Process failed: {err}")
        
    except Exception as e:
        asyncio.run(api_update_request(url = API_ENDPOINT + '/alignment/' + str(id), params = {'new_status': 'Failed'}))
        raise Exception(e)
    

@celery.task(name="muscle")
def muscle(params, id):
    
    try:

        # if file does not exist locally, it might have been uploaded to file server
        # this would be the case if worker and api are running on different servers
        infile_path = params['input']
        gl_infile_path = GLPath(infile_path, makedirs=True)
        if not os.path.isdir(gl_infile_path.head):
            gl_infile_path.download_from_filestore()

        muscle_cline = f"muscle -align {params['input']} -output {params['out']} -threads {params['threads']} -perturb {params['perturb']}"

        proc: subprocess.CompletedProcess[str] = subprocess.run(
            str(muscle_cline),
            capture_output=True,
            text=True,
            shell=True
        )
        data = proc.stdout
        err = proc.stderr
        return_code = proc.returncode

        if return_code == 0:

            outfile_path = params['out']
            with open(outfile_path, 'rb') as file:
                gl_outfile_path = GLPath(outfile_path, makedirs=True)
                gl_outfile_path.upload_to_filestore(file=file)

            # remove temporary files
            shutil.rmtree(os.path.join(os.getenv('VOLUME_DIR'), 'alignments', id), ignore_errors=True)

            asyncio.run(api_update_request(url = API_ENDPOINT + '/alignment/' + str(id), params = {'new_status': 'Success'}))

            return True
             
        else:
            asyncio.run(api_update_request(url = API_ENDPOINT + '/alignment/' + str(id), params = {'new_status': 'Failed'}))
            raise Exception(f"Process failed: {err}. Cline: {muscle_cline}")
        
    except Exception as e:
        asyncio.run(api_update_request(url = API_ENDPOINT + '/alignment/' + str(id), params = {'new_status': 'Failed'}))
        raise Exception(e)
         
        
@celery.task(name="install_ncbi_databases", bind=True, autoretry_for=(Exception,), retry_kwargs={'max_retries': 2, 'countdown': 5})
def install_ncbi_databases(self, databases: List[str]):

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
    

# This job encompases any dimensionality reduction alg from vectorized sequence data, not just PCA
@celery.task(name="dim_reduction")
def dim_reduction(alg, file, kmers, batch_size, task_id):

    try:

        if not os.path.exists(file):
            gl_infile = GLPath(path=file, makedirs=True)
            gl_infile.download_from_filestore()

        files = []
        output_files = []
        labels = []

        with open(file, 'r') as f:
            for record in SeqIO.parse(f, "fasta"):
                output = os.path.join(os.path.dirname(file), f"{record.id}.fasta")
                labels.append(record.id)
                with open(output, 'w') as new_f:
                    new_f.write(f">{record.description}\n")
                    new_f.write(str(record.seq))
                    files.append(output)


        for file in files:

            output = ('.').join(file.split('.')[:-1])

            status_code_simlord = subprocess.call(shlex.split(f'simlord --no-sam -rr {file} -n 100 -mr 1500 {output}_output'))

            if status_code_simlord == 0:
                threads = 3
                outfile = f'{output}_output.txt'
                output_files.append(outfile)
                with open(outfile, 'w') as output_f:
                    status_code_vectorize = subprocess.run(
                        shlex.split(f'vectorize {output}_output.fastq {kmers} {threads} {batch_size}'),
                        stdout=output_f,
                        check=True
                    )
                
            else:
                asyncio.run(delete_record(url = API_ENDPOINT + '/pca/' + task_id))

        
        # Compute PCA from vectorized DNA or amino acid sequences
        do_reduction(files=output_files, label_names=labels, batches=batch_size, n_components=2) #2D
        do_reduction(files=output_files, label_names=labels, batches=batch_size, n_components=3) #3D

        asyncio.run(api_update_request(url= API_ENDPOINT + '/pca/' + task_id, params={'new_status': 'Completed'}))
        return True

    except Exception as e:
        asyncio.run(delete_record(url = API_ENDPOINT + '/pca/' + task_id))
        raise Exception(e)

    
@celery.task(name="mrbayes")
def mr_bayes(file, task_id):

    pass

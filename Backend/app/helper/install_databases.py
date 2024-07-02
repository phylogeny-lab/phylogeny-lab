import json
import os
from typing import List
import requests
import urllib.request
import tarfile 
from enum import Enum
from subprocess import Popen, PIPE

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def install_databases(dbs: List[str]):

    print(type(dbs))

    base_url = 'https://ftp.ncbi.nlm.nih.gov/blast/db/'


    BLASTDB = os.getenv('BLASTDB')

    if not os.path.isdir(BLASTDB):
        os.mkdir(BLASTDB) 

    for db in dbs:

        db_path = os.path.join(BLASTDB, db)
        if not os.path.exists(db_path):
            os.mkdir(db_path) 

        print(f"Collecting {db}...")
        metadata_file = f"{db}-nucl-metadata.json"

        print(base_url + metadata_file)

        response = requests.get(base_url + metadata_file)

        response_dict = response.json() 

        for file in response_dict['files']:
            print(f"Downloading {file}")
            filename = file.split('/')[-1]
            
            urllib.request.urlretrieve(file, os.path.join(db_path, filename))

            # I had issues unzipping with tarfile and shutil, so here we extract through the shell
            
            cmd = ["tar", "-xvzf", f"{db_path}/{filename}", "-C", db_path]
            (stdout, stderr) = Popen(cmd, stdout=PIPE, stderr=PIPE).communicate()

            if stdout:
                print(stdout.decode())

            if stderr:
                print(stderr.decode())

            os.remove(os.path.join(db_path, filename))

            print(bcolors.OKGREEN + "DONE" + bcolors.ENDC)
            
            

        
        
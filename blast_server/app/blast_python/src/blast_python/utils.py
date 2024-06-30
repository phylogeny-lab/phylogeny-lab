import json
import os
import subprocess

@staticmethod
def get_db_metadata(db_path: str, verbose=True):
    """Returns metadata for database files."""

    if not db_path:
        raise Exception("No database file found")
            
    cmd = ['blastdbcmd', '-db', f'{db_path}', '-metadata']
            
    (stdout, stderr) = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()

    if stdout:
        output = json.loads(stdout.decode())
        formatted_str = json.dumps(output, indent=2)
        if verbose:
            print(formatted_str)
        return output
        
    if stderr:
        raise Exception(stderr.decode())
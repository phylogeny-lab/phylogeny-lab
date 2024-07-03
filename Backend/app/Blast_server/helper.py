import os
import aiofiles
from fastapi import UploadFile

def create_job_files(job_id, save_dir, subjectFile: UploadFile, queryFile: UploadFile):
    
    if not os.path.isdir(save_dir):
        os.mkdir(save_dir)

    # #create sub directories
    os.mkdir(os.path.join(save_dir, job_id))
    os.mkdir(os.path.join(save_dir, job_id, "results"))
    os.mkdir(os.path.join(save_dir, job_id, "subject"))
    os.mkdir(os.path.join(save_dir, job_id, "query"))
        
    # results_file_xml = os.path.join(save_dir, job_id, "results", "results.xml")
    # results_file_json = os.path.join(save_dir, job_id, "results", "results.json")

    # await save_file(file=subjectFile, out_file_path=os.path.join(save_dir, job_id, "subject", subjectFilename))
    # await save_file(file=queryFile, out_file_path=os.path.join(save_dir, job_id, "query", queryFilename))

    # return (results_file_json, results_file_xml)


async def save_file(file, out_file_path: str | os.PathLike):
    async with aiofiles.open(out_file_path, 'wb') as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content) 
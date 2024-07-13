import os
import aiofiles
from fastapi import UploadFile
import requests

async def save_file(file, out_file_path: str | os.PathLike):
    async with aiofiles.open(out_file_path, 'wb') as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content) 

def api_update_request(url, params = {}):

    try:
        response = requests.put(url, params=params)
        return response
    except requests.exceptions.RequestException as e:
        raise Exception(e)
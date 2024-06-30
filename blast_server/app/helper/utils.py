import os
from fastapi import UploadFile
import aiofiles

async def save_file(file: UploadFile, out_file_path: str | os.PathLike):
    async with aiofiles.open(out_file_path, 'wb') as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content) 
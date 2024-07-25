import os
from fastapi import UploadFile
import aiofiles
import json

async def save_file(file: UploadFile, out_file_path: str | os.PathLike):
    async with aiofiles.open(out_file_path, 'wb') as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content) 



def create_folder_structure_json(path): 
    # Initialize the result dictionary with folder 
    # name, type, and an empty list for children 
    result = {'name': os.path.basename(path), 'children': [], 'size': os.path.getsize(path)} 
  
    # Check if the path is a directory 
    if not os.path.isdir(path): 
        return result 
  
    # Iterate over the entries in the directory 
    for entry in os.listdir(path): 
       # Create the full path for the current entry 
        entry_path = os.path.join(path, entry) 
  
        # If the entry is a directory, recursively call the function 
        if os.path.isdir(entry_path): 
            result['children'].append(create_folder_structure_json(entry_path)) 
        # If the entry is a file, create a dictionary with name and type 
        else: 
            result['children'].append({'name': entry, 'size': os.path.getsize(os.path.join(path, entry))}) 
  
    return result 
  
  


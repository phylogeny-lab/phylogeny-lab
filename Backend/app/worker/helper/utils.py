import datetime
import io
import os
from typing import Iterator, List
import zipfile
from fastapi import UploadFile
import aiofiles
import json
import csv
from minio.datatypes import Object
from aiohttp import ClientSession
import requests
import aiohttp
import asyncio

from fastapi.responses import StreamingResponse

async def save_file(file, out_file_path: str | os.PathLike):
    async with aiofiles.open(out_file_path, 'wb') as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content) 

async def delete_record(url, params = {}):

    async def delete_data(session: ClientSession, url):
        # Use 'session.get()' to make an asynchronous HTTP GET request
        async with session.delete(url, params=params) as response:
            # Return the JSON content of the response using 'response.json()'
            return await response.json()
        
    async with aiohttp.ClientSession() as session:
        # Create a list of tasks, where each task is a call to 'fetch_data' with a specific URL
        tasks = [delete_data(session, url)]
        
        # Use 'asyncio.gather()' to run the tasks concurrently and gather their results
        results = await asyncio.gather(*tasks)

        return results


async def api_update_request(url, params = {}):

    async def put_data(session: ClientSession, url):
        # Use 'session.get()' to make an asynchronous HTTP GET request
        async with session.put(url, params=params) as response:
            # Return the JSON content of the response using 'response.json()'
            return await response.json()
        
    async with aiohttp.ClientSession() as session:
        # Create a list of tasks, where each task is a call to 'fetch_data' with a specific URL
        tasks = [put_data(session, url)]
        
        # Use 'asyncio.gather()' to run the tasks concurrently and gather their results
        results = await asyncio.gather(*tasks)

        return results



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

def build_nested_helper(path: Object, text: Object, container):
    segs = path.object_name.split('/')
    head = segs[0]
    tail = segs[1:]
    # set children
    # tips
    if not tail:
        container[head] = {'size': path.size, 'name': head, 'children': {}, 'type': 'file' }
    # branches
    else:
        if head not in container:
            container[head] = {'name': head , 'type': 'dir' }
        if 'children' not in container[head]:
            container[head]['children'] = {}
        # Create new object with desired attributes, change name to child
        new_obj = Object(bucket_name=path.bucket_name, object_name='/'.join(tail), last_modified=path.last_modified, 
            etag=path.etag, metadata=path.metadata, size=path.size, version_id=path.version_id)
        build_nested_helper(new_obj, text, container[head]['children'])

def build_nested(paths: List[Object]):
    container = {}
    for path in paths:
        build_nested_helper(path, path, container)
    return container


def sendzipfile(filepath):
    zip_io = io.BytesIO()
    with zipfile.ZipFile(zip_io, mode='w', compression=zipfile.ZIP_DEFLATED) as temp_zip:
        for fpath in os.listdir(filepath):
            # Calculate path for file in zip
            fdir, fname = os.path.split(fpath)
            # Add file, at correct path
            temp_zip.write(os.path.join(filepath, fpath), fname)
    return StreamingResponse(
        iter([zip_io.getvalue()]), 
        media_type="application/x-zip-compressed", 
        headers = { "Content-Disposition": f"attachment; filename=images.zip"}
    )


def csv_to_json(csv_filepath, json_filepath, fieldnames):

    csvfile = open(csv_filepath, 'r')
    jsonfile = open(json_filepath, 'w')

    reader = csv.DictReader( csvfile, fieldnames)
    jsonfile.write('[\n')
    for idx, row in enumerate(reader):
        if idx != 0: # don't add comma on first line
            jsonfile.write(',\n')
        jsonfile.write('\t')
        json.dump(row, jsonfile)
    jsonfile.write('\n]\n')

    csvfile.close()
    jsonfile.close()

from fastapi import APIRouter
import os

from fastapi.responses import JSONResponse
from ..helper.utils import create_folder_structure_json
import json

router = APIRouter(
    prefix="/api/volume",
    tags=['Volume']
)
            

@router.get('/')
def volume() -> JSONResponse:
    # Specify the path to the folder you want to create the JSON for 
    folder_path = os.getenv('SHARED_VOLUME')
    
    # Call the function to create the JSON representation 
    folder_json = create_folder_structure_json(folder_path) 
    
    return JSONResponse(content=folder_json, status_code=200)
